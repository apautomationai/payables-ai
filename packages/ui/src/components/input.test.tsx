/**
 * Tests for Input component.
 *
 * Testing stack:
 * - React Testing Library for rendering and events
 * - Jest/Vitest-style globals (describe/it/expect). If using Vitest, enable globals and jsdom.
 *
 * Scope:
 * - Focuses on Input component's public interface and behaviors: rendering, props, classes, and refs.
 * - Covers happy paths, edge cases, and failure/invalid states where meaningful.
 */

import * as React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { Input } from "./input";

describe("Input", () => {
  it("renders an input element with default type 'text' when no type is provided", () => {
    const { container } = render(<Input />);
    const input = container.querySelector("input") as HTMLInputElement | null;

    expect(input).not.toBeNull();
    if (input) {
      // Property reflects default even if attribute is absent
      expect(input.type).toBe("text");
    }
  });

  it("applies provided type attribute", () => {
    render(<Input type="password" aria-label="pwd" />);
    const input = screen.getByLabelText("pwd") as HTMLInputElement;
    expect(input.type).toBe("password");
  });

  it("passes through common attributes and aria-* props", () => {
    render(
      <Input
        id="email-input"
        name="email"
        placeholder="Email"
        aria-label="email"
        aria-invalid="true"
        data-foo="bar"
      />
    );
    const input = screen.getByLabelText("email") as HTMLInputElement;
    expect(input.getAttribute("id")).toBe("email-input");
    expect(input.getAttribute("name")).toBe("email");
    expect(input.getAttribute("placeholder")).toBe("Email");
    expect(input.getAttribute("aria-invalid")).toBe("true");
    expect(input.getAttribute("data-foo")).toBe("bar");
  });

  it("merges className with default classes (does not overwrite)", () => {
    render(<Input className="custom-class another" aria-label="styled" />);
    const input = screen.getByLabelText("styled") as HTMLInputElement;
    const cls = input.getAttribute("class") || "";
    // Check for key default tokens and the custom token
    expect(cls.includes("block")).toBe(true);
    expect(cls.includes("rounded-md")).toBe(true);
    expect(cls.includes("focus:ring-indigo-500")).toBe(true);
    expect(cls.includes("custom-class")).toBe(true);
    expect(cls.includes("another")).toBe(true);
  });

  it("forwards a React ref to the underlying input element", () => {
    const ref = React.createRef<HTMLInputElement>();
    render(<Input ref={ref} aria-label="ref" />);
    expect(ref.current instanceof HTMLInputElement).toBe(true);
  });

  it("supports function refs (callback refs)", () => {
    const calls: (HTMLInputElement | null)[] = [];
    render(<Input ref={(el) => calls.push(el)} aria-label="cb-ref" />);
    expect(calls.length > 0).toBe(true);
    expect(calls[0]).not.toBeNull();
  });

  it("triggers onChange and updates value in uncontrolled mode", () => {
    const values: string[] = [];
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      values.push(e.target.value);
    };
    render(<Input defaultValue="" onChange={handleChange} aria-label="uncontrolled" />);
    const input = screen.getByLabelText("uncontrolled") as HTMLInputElement;

    fireEvent.change(input, { target: { value: "hello" } });
    expect(input.value).toBe("hello");
    expect(values).toEqual(["hello"]);
  });

  it("works as a controlled component when value/onChange are provided", () => {
    function Controlled() {
      const [val, setVal] = React.useState("x");
      return <Input aria-label="controlled" value={val} onChange={(e) => setVal(e.target.value)} />;
    }
    render(<Controlled />);
    const input = screen.getByLabelText("controlled") as HTMLInputElement;

    expect(input.value).toBe("x");
    fireEvent.change(input, { target: { value: "y" } });
    expect(input.value).toBe("y");
  });

  it("respects disabled state", () => {
    render(<Input disabled aria-label="disabled" />);
    const input = screen.getByLabelText("disabled") as HTMLInputElement;
    expect(input.disabled).toBe(true);
  });

  it("exposes a stable displayName for debugging/devtools", () => {
    // Non-DOM assertion: verify public static metadata
    expect((Input as any).displayName).toBe("Input");
  });
});