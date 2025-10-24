// A collection of helper functions for formatting data for display.

export const formatLabel = (key: string): string => {
  if (!key) return "";
  return key
    .replace(/([A-Z])/g, " $1") // Add space before capital letters
    .replace(/^./, (str) => str.toUpperCase()); // Capitalize the first letter
};

export const renderValue = (value: string | number | any[] | null | undefined, key?: string): string => {
  if (value === null || value === undefined) {
    return "N/A";
  }
  if (Array.isArray(value)) {
    return value.length === 0 ? "No items" : `${value.length} item(s)`;
  }

  // Format status to be capitalized
  if (key === 'status' && typeof value === 'string') {
    return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
  }

  // Format dates to US format (MM/DD/YYYY) for invoice and due dates
  if ((key === 'invoiceDate' || key === 'dueDate') && typeof value === 'string') {
    try {
      const date = new Date(value);
      if (!isNaN(date.getTime())) {
        return date.toLocaleDateString('en-US', {
          month: '2-digit',
          day: '2-digit',
          year: 'numeric'
        });
      }
    } catch (error) {
      // If date parsing fails, return original value
    }
  }

  return String(value);
};