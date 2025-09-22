"use client";

import * as React from "react";
// Import the component and the `Value` type on separate lines.
// `Value` is an alias for `E164Number` and can resolve type issues.
import PhoneNumber from "react-phone-number-input";
import type { Value } from "react-phone-number-input";
// The base styles are needed for the country selector dropdown to work correctly.
import "react-phone-number-input/style.css";

import { cn } from "@workspace/ui/lib/utils";
import { Input, type InputProps } from "@workspace/ui/components/input";

// The library expects the custom input component to be a forwardRef component.
// This wrapper ensures our custom `Input` is compatible.
const CustomPhoneInput = React.forwardRef<HTMLInputElement, InputProps>(
  (props, ref) => {
    // The className from the library needs to be merged with our custom styles.
    return (
      <Input
        className={cn("rounded-l-none", props.className)}
        ref={ref}
        {...props}
      />
    );
  }
);
CustomPhoneInput.displayName = "CustomPhoneInput";

// The props for our main wrapper component.
// The `onChange` signature now uses the `Value` type to avoid resolution errors.
type PhoneNumberInputProps = Omit<
  React.ComponentPropsWithoutRef<typeof PhoneNumber>,
  "onChange"
> & {
  // `react-phone-number-input`'s onChange returns a `Value` (E164Number) or undefined.
  onChange: (value: Value | undefined) => void;
};

const PhoneNumberInput = React.forwardRef<
  React.ElementRef<typeof PhoneNumber>,
  PhoneNumberInputProps
>(({ className, onChange, ...props }, ref) => {
  return (
    <PhoneNumber
      ref={ref}
      // The `inputComponent` prop expects a component, not a rendered element.
      // We pass our compatible, ref-forwarding wrapper component here.
      inputComponent={CustomPhoneInput}
      // The `onChange` prop now has a matching type signature, resolving the error.
      onChange={onChange}
      className={cn("w-full", className)}
      // Props to style the country selector button to match our UI.
      countrySelectProps={{
        className: cn(
          "flex h-10 items-center justify-center rounded-l-md border border-r-0 border-input bg-background px-3 text-sm ring-offset-background"
        ),
      }}
      {...props}
    />
  );
});
PhoneNumberInput.displayName = "PhoneNumberInput";

export { PhoneNumberInput };
