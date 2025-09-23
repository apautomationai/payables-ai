/**
 * NOTE ON TEST FRAMEWORK:
 * This test suite uses a Jest/Vitest-compatible API (describe/it/expect + module mocking).
 * If the repository uses Vitest, it will work as-is with vi.mock shim below.
 * If the repository uses Jest, the jest.mock branch is used.
 */

import type { Country } from "./countries"; // adjust if module resides elsewhere
import * as moduleUnderTest from "./countries";

// Framework-agnostic mocking helpers (Vitest or Jest)
const isVitest = typeof (globalThis as any).vi !== "undefined";
const isJest = typeof (globalThis as any).jest !== "undefined";

// Provide a minimal shim so tests can run under either framework
const mocker = isVitest ? (globalThis as any).vi : (globalThis as any).jest;

// In both Jest and Vitest, mock before importing re-exported values.
// However, our moduleUnderTest was imported above; to ensure the mock affects the evaluated module,
// we re-require it within tests after setting the mock implementation, using dynamic import.
// To keep tests simple and deterministic, we structure each test to set the mock, then import fresh via require-like.

type CustomList = (keyField: string, template: string) => Record<string, string>;

function setCustomListMock(impl: CustomList) {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const real = require("country-codes-list");
  if (isVitest) {
    (globalThis as any).vi.resetModules?.();
    (globalThis as any).vi.doMock("country-codes-list", () => ({
      __esModule: true,
      customList: impl,
    }));
  } else if (isJest) {
    (globalThis as any).jest.resetModules?.();
    (globalThis as any).jest.doMock("country-codes-list", () => ({
      __esModule: true,
      customList: impl,
    }));
  } else {
    // Fallback: patch at runtime (non-ideal, but offers resilience)
    (real as any).customList = impl;
  }
}

async function importFreshCountries() {
  // Re-import the module fresh so it picks up the mocked dependency
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const fresh = await import("./countries");
  return fresh as typeof moduleUnderTest;
}

describe("countries list generation", () => {
  it("maps valid entries into Country objects (happy path)", async () => {
    setCustomListMock(() => ({
      "Canada": "CA-1-\u{1F1E8}\u{1F1E6}",
      "United States": "US-1-\u{1F1FA}\u{1F1F8}",
      "France": "FR-33-\u{1F1EB}\u{1F1F7}",
    }));

    const fresh = await importFreshCountries();
    const result: Country[] = fresh.countries;

    // Expect all three present
    expect(result).toHaveLength(3);

    // Verify structure of one entry
    const us = result.find(c => c.name === "United States")!;
    expect(us).toEqual({ name: "United States", iso2: "US", phone_code: "1", flag: "\u{1F1FA}\u{1F1F8}" });

    // Ensure types are strings
    for (const c of result) {
      expect(typeof c.name).toBe("string");
      expect(typeof c.iso2).toBe("string");
      expect(typeof c.phone_code).toBe("string");
      expect(typeof c.flag).toBe("string");
    }
  });

  it("filters out malformed entries lacking parts (iso2/phone_code/flag)", async () => {
    setCustomListMock(() => ({
      "Validland": "VL-999-\u{1F3F3}\u{FE0F}",
      "NoISO2": "-123-\u{1F3C1}",
      "NoPhone": "NP--\u{1F3F3}\u{FE0F}\u{200D}\u{1F308}",
      "NoFlag": "NF-321-",
      "OnlyTwoParts": "TP-44",         // will split into 2 parts
      "EmptyString": "",               // splits to ['']
    }));

    const fresh = await importFreshCountries();
    const result: Country[] = fresh.countries;

    // Only "Validland" should remain
    expect(result).toEqual([{ name: "Validland", iso2: "VL", phone_code: "999", flag: "\u{1F3F3}\u{FE0F}" }]);
  });

  it("returns an empty list when source data is empty", async () => {
    setCustomListMock(() => ({}));
    const fresh = await importFreshCountries();
    expect(fresh.countries).toEqual([]);
  });

  it("sorts countries by name ascending using localeCompare", async () => {
    setCustomListMock(() => ({
      "Åland": "AX-358-\u{1F1E6}\u{1F1FD}",
      "Zimbabwe": "ZW-263-\u{1F1FF}\u{1F1FC}",
      "Australia": "AU-61-\u{1F1E6}\u{1F1FA}",
      "Álpha": "AP-111-\u{1F1E6}\u{1F1F1}",
    }));

    const fresh = await importFreshCountries();
    const names = fresh.countries.map(c => c.name);

    // Default localeCompare order; exact order may vary by environment for diacritics,
    // but we can assert relative ordering between ASCII and ensure it's sorted by name.
    const sorted = [...names].sort((a, b) => a.localeCompare(b));
    expect(names).toEqual(sorted);
  });

  it("passes correct arguments to customList (key field and template)", async () => {
    const spy = mocker.fn<Parameters<CustomList>, ReturnType<CustomList>>((keyField, template) => ({
      "X": "XX-999-\u{1F3F4}",
    })) as unknown as CustomList;

    setCustomListMock(spy);

    const fresh = await importFreshCountries();
    expect(fresh.countries).toHaveLength(1);

    // Validate invocation shape
    expect((spy as any).mock.calls?.[0]?.[0] ?? (spy as any).mock?.calls?.[0]?.[0]).toBe("countryNameEn");
    expect((spy as any).mock.calls?.[0]?.[1] ?? (spy as any).mock?.calls?.[0]?.[1]).toBe("{countryCode}-{countryCallingCode}-{flag}");
  });

  it("gracefully handles values containing extra hyphens by excluding malformed entries", async () => {
    // If any segment contains extra hyphens, split will produce >3 parts, but we only take first 3.
    // However, if a required segment ends up empty, it should be filtered out.
    setCustomListMock(() => ({
      "Dashy": "DS-12-\u{1F3F3}\u{FE0F}-EXTRA", // split("-") => ["DS","12","🏳️","EXTRA"] -> first three are fine
      "Broken": "BR--\u{1F1E7}\u{1F1F7}-EXTRA",  // phone_code empty -> should be filtered
    }));

    const fresh = await importFreshCountries();
    const names = fresh.countries.map(c => c.name);

    expect(names).toContain("Dashy");
    expect(names).not.toContain("Broken");

    const dashy = fresh.countries.find(c => c.name === "Dashy")!;
    expect(dashy).toEqual({ name: "Dashy", iso2: "DS", phone_code: "12", flag: "\u{1F3F3}\u{FE0F}" });
  });
});