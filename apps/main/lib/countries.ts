import { customList } from "country-codes-list";

export type Country = {
  name: string;
  iso2: string;
  phone_code: string;
  flag: string;
};

// Generate a custom list of countries with the exact data we need.
// This is more reliable and type-safe than the previous library.
const countryData = customList(
  "countryNameEn",
  "{countryCode}-{countryCallingCode}-{flag}"
);

// Transform the data into the format your component expects
export const countries: Country[] = Object.entries(countryData)
  .map(([name, data]) => {
    // The data is formatted as "ISO2-PhoneCode-Flag"
    const [iso2, phone_code, flag] = data.split("-");

    // Ensure all parts are present before creating the object
    if (!iso2 || !phone_code || !flag) {
      return null;
    }

    return {
      name,
      iso2,
      phone_code,
      flag,
    };
  })
  // Filter out any entries that were malformed
  .filter((country): country is Country => country !== null)
  // The list from the library should already be sorted, but we can re-sort to be safe
  .sort((a, b) => a.name.localeCompare(b.name));
