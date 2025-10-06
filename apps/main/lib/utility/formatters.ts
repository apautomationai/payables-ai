// A collection of helper functions for formatting data for display.

export const formatLabel = (key: string): string => {
    if (!key) return "";
    return key
      .replace(/([A-Z])/g, " $1") // Add space before capital letters
      .replace(/^./, (str) => str.toUpperCase()); // Capitalize the first letter
  };
  
  export const renderValue = (value: string | number | any[] | null | undefined): string => {
    if (value === null || value === undefined) {
      return "N/A";
    }
    if (Array.isArray(value)) {
      return value.length === 0 ? "No items" : `${value.length} item(s)`;
    }
    return String(value);
  };