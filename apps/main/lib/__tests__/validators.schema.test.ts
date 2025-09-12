/**
 * Validator schema tests
 * Testing framework: Vitest (or Jest-compatible API: describe/it/expect).
 * These tests validate the Zod schemas for sign up, sign in, and forgot password flows.
 */
import { describe, it, expect } from "vitest";

// Try to import from the canonical validators module; if project structure differs,
// adjust this path to the correct source file location.
let schemas: any = {};
try {
  // Typical path if source is apps/main/lib/validators.ts
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const mod = require("../validators");
  schemas = mod;
} catch {
  try {
    // Fallback: if the file in PR was mistakenly named validators.test.ts but contains the schemas
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const mod = require("../validators.test");
    schemas = mod;
  } catch {
    // Final fallback: attempt current directory require resolution variations
    try {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const mod = require("../../lib/validators");
      schemas = mod;
    } catch {
      // Leave schemas empty; tests will fail with a helpful error below.
    }
  }
}

const { signUpSchema, SignInSchema, ForgotPasswordSchema } = schemas;

describe("Validator Schemas", () => {
  it("should export all expected schemas", () => {
    expect(signUpSchema).toBeDefined();
    expect(SignInSchema).toBeDefined();
    expect(ForgotPasswordSchema).toBeDefined();
  });

  describe("signUpSchema", () => {
    it("accepts a valid sign-up payload (happy path)", () => {
      const input = {
        firstName: "Alice",
        lastName: "Wonderland",
        email: "alice@example.com",
        password: "supersecret", // >= 8 chars
      };
      const res = signUpSchema.safeParse(input);
      expect(res.success).toBe(true);
      if (res.success) {
        expect(res.data).toEqual(input);
      }
    });

    it("rejects too-short firstName and lastName with clear messages", () => {
      const input = {
        firstName: "A", // too short
        lastName: "B", // too short
        email: "bob@example.com",
        password: "longenough",
      };
      const res = signUpSchema.safeParse(input);
      expect(res.success).toBe(false);
      if (!res.success) {
        const messages = res.error.errors.map((e) => e.message);
        expect(messages).toContain("First name is required.");
        expect(messages).toContain("Last name is required.");
      }
    });

    it("rejects invalid email format", () => {
      const input = {
        firstName: "Charlie",
        lastName: "Chocolate",
        email: "not-an-email",
        password: "longenough",
      };
      const res = signUpSchema.safeParse(input);
      expect(res.success).toBe(false);
      if (!res.success) {
        const messages = res.error.errors.map((e) => e.message);
        // Matches message used in signUpSchema for email
        expect(messages).toContain("Please enter a valid email.");
      }
    });

    it("rejects password shorter than 8 characters", () => {
      const input = {
        firstName: "Diana",
        lastName: "Prince",
        email: "diana@themyscira.org",
        password: "short", // < 8
      };
      const res = signUpSchema.safeParse(input);
      expect(res.success).toBe(false);
      if (!res.success) {
        const messages = res.error.errors.map((e) => e.message);
        expect(messages).toContain("Password must be at least 8 characters.");
      }
    });

    it("accumulates multiple errors when several fields are invalid", () => {
      const input = {
        firstName: "E", // too short
        lastName: "", // too short (length 0)
        email: "invalid@", // invalid
        password: "123", // too short
      } as any;
      const res = signUpSchema.safeParse(input);
      expect(res.success).toBe(false);
      if (!res.success) {
        const fields = res.error.errors.map((e) => e.path.join("."));
        expect(fields).toEqual(
          expect.arrayContaining(["firstName", "lastName", "email", "password"]),
        );
      }
    });

    it("trims are not auto-applied by default (should fail if raw string too short even if whitespace would make it longer)", () => {
      // Ensures we're testing exact z.string().min behavior without preprocessors
      const input = {
        firstName: " A", // length 2 -> valid; change to assertion that boundary is respected
        lastName: " B", // length 2 -> valid
        email: "valid@example.com",
        password: "12345678",
      };
      const res = signUpSchema.safeParse(input);
      expect(res.success).toBe(true);
    });
  });

  describe("SignInSchema", () => {
    it("accepts valid email and non-empty password", () => {
      const input = {
        email: "user@example.com",
        password: "x", // min(1)
      };
      const res = SignInSchema.safeParse(input);
      expect(res.success).toBe(true);
    });

    it("rejects invalid email format with correct message", () => {
      const res = SignInSchema.safeParse({ email: "bad", password: "x" });
      expect(res.success).toBe(false);
      if (!res.success) {
        const messages = res.error.errors.map((e) => e.message);
        expect(messages).toContain("Please enter a valid email address.");
      }
    });

    it("rejects empty password with correct message", () => {
      const res = SignInSchema.safeParse({ email: "user@example.com", password: "" });
      expect(res.success).toBe(false);
      if (!res.success) {
        const messages = res.error.errors.map((e) => e.message);
        expect(messages).toContain("Password is required.");
      }
    });

    it("rejects missing fields", () => {
      const res = SignInSchema.safeParse({});
      expect(res.success).toBe(false);
      if (!res.success) {
        const fields = res.error.errors.map((e) => e.path.join("."));
        expect(fields).toEqual(expect.arrayContaining(["email", "password"]));
      }
    });
  });

  describe("ForgotPasswordSchema", () => {
    it("accepts valid email", () => {
      const res = ForgotPasswordSchema.safeParse({ email: "reset@example.com" });
      expect(res.success).toBe(true);
    });

    it("rejects invalid email with correct message", () => {
      const res = ForgotPasswordSchema.safeParse({ email: "nope" });
      expect(res.success).toBe(false);
      if (!res.success) {
        const messages = res.error.errors.map((e) => e.message);
        expect(messages).toContain("Please enter a valid email address.");
      }
    });

    it("rejects missing email", () => {
      const res = ForgotPasswordSchema.safeParse({});
      expect(res.success).toBe(false);
      if (!res.success) {
        // path should include 'email'
        const fields = res.error.errors.map((e) => e.path.join("."));
        expect(fields).toContain("email");
      }
    });
  });

  it("provides helpful failure if schemas failed to import", () => {
    // This ensures developers see a clear message if imports break due to path differences.
    expect(signUpSchema && SignInSchema && ForgotPasswordSchema).toBeTruthy();
  });
});