/**
 * Unit tests for PhoneNumberInput component.
 * Detected Test Framework: Vitest + React Testing Library.
 *
 * Focus: Validate behavior introduced/modified in the diff:
 *  - Proper forwarding of inputComponent as a forwardRef (CustomPhoneInput) with displayName.
 *  - onChange typing/value passthrough (Value | undefined).
 *  - className merging onto PhoneNumber wrapper ("w-full" + custom).
 *  - countrySelectProps passed with proper className for styling.
 *  - ref forwarding to underlying PhoneNumber element.
 *  - Prop passthrough for additional props.
 */
import * as React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

// Mock CSS import to avoid JSDOM issues if the component pulls it in transitively
vi.mock("react-phone-number-input/style.css", () => ({}));

// We will mock react-phone-number-input default export to capture props and simulate rendering
// This mock renders a simple input and exposes received props via data attributes for assertions.

vi.mock("react-phone-number-input", async () => {
  const React = await import("react");
  // We expose captured props on the DOM via data-* attributes
  const PhoneNumber = React.forwardRef<HTMLDivElement, any>((props, ref) => {

    // Expose a global function to simulate library calling onChange
    (window as any).__rpn_change__ = (val: any) => props.onChange && props.onChange(val);
    const displayName =
      props.inputComponent?.displayName || props.inputComponent?.name || "Unknown";
    return React.createElement(
      "div",
      {
        ref: ref,
        "data-testid": "rpn-stub",
        "data-has-inputcomponent": String(!!props.inputComponent),
        "data-inputcomponent-displayname": displayName,
        "data-classname": props.className || "",
        "data-countryselect-classname": props.countrySelectProps?.className || "",
        "data-defaultcountry": props.defaultCountry || "",
        "data-placeholder": props.placeholder || ""
      },
      null
    );
  });
  PhoneNumber.displayName = "PhoneNumberMock";
  return { __esModule: true, default: PhoneNumber };
});

// Import the component under test
import { PhoneNumberInput } from "./phone-input";
import type { Value } from "react-phone-number-input";

describe("PhoneNumberInput", () => {
  it("renders PhoneNumber with inputComponent = CustomPhoneInput and default className merged", () => {
    const handleChange = vi.fn();
    render(<PhoneNumberInput onChange={handleChange} className="custom-class" />);

    const stub = screen.getByTestId("rpn-stub");
    expect(stub).toBeInTheDocument();

    // inputComponent should be a function with displayName 'CustomPhoneInput'
    expect(stub.getAttribute("data-has-inputcomponent")).toBe("true");
    expect(stub.getAttribute("data-inputcomponent-displayname")).toBe("CustomPhoneInput");

    // className should include "w-full" and the custom class
    const cls = stub.getAttribute("data-classname") || "";
    expect(cls).toContain("w-full");
    expect(cls).toContain("custom-class");
  });

  it("passes onChange through and handles Value and undefined", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(<PhoneNumberInput onChange={handleChange} />);

    const stub = screen.getByTestId("rpn-stub");

    // Simulate library calling onChange with a valid E.164 value
    await user.click(stub); // no-op click just to mirror interaction
    const callChange = (window as any).__rpn_change__;
    callChange("+14155552671" as Value);

    expect(handleChange).toHaveBeenCalledWith("+14155552671");
    // Simulate undefined
    callChange(undefined);
    expect(handleChange).toHaveBeenCalledWith(undefined);
  });

  it("forwards refs to underlying PhoneNumber element", () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<PhoneNumberInput onChange={vi.fn()} ref={ref as any} />);
    expect(ref.current).toBeTruthy();
    expect(ref.current?.getAttribute("data-testid")).toBe("rpn-stub");
  });

  it("merges countrySelectProps className for the selector styling", () => {
    render(<PhoneNumberInput onChange={vi.fn()} />);
    const stub = screen.getByTestId("rpn-stub");
    const countryCls = stub.getAttribute("data-countryselect-classname") || "";
    expect(countryCls).toContain("rounded-l-md");
    expect(countryCls).toContain("border-input");
    expect(countryCls).toContain("ring-offset-background");
  });

  it("spreads additional props to PhoneNumber (e.g., defaultCountry, placeholder)", () => {
    render(
      <PhoneNumberInput
        onChange={vi.fn()}
        defaultCountry="US"
        placeholder="Enter phone"
      />
    );
    const stub = screen.getByTestId("rpn-stub");
    expect(stub.getAttribute("data-defaultcountry")).toBe("US");
    expect(stub.getAttribute("data-placeholder")).toBe("Enter phone");
  });
});