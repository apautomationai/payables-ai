// Helper to extract headers
export const getHeader = (headers: any[], key: string): string => {
  return (
    headers.find((h) => h.name && h.name.toLowerCase() === key.toLowerCase())
      ?.value || ""
  );
};

// Helper to normalize email addresses
export const extractEmail = (input: string): string => {
  const match = input.match(/<(.+?)>/);
  if (match) return match[1]; 
  return input.replace(/"/g, "").trim(); 
};
