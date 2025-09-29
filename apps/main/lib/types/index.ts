/**
 * A generic shape for standardized API responses from your backend.
 * This helps in consistently handling data and errors.
 */
export interface ApiResponse<T> {
  status: string;
  data: T;
}

/**
 * Defines the structure for a single user object.
 * This is used for displaying user information like name and avatar.
 */
export interface User {
  id: number;
  firstName: string | null;
  lastName: string | null;
  email: string;
  phone: string | null;
  businessName: string | null;
  avatarUrl: string | null;
  // Add any other fields that might be in the response
}

/**
 * Defines the structure for a single invoice attachment object.
 */
export interface Attachment {
  id: string; // This serves as the unique Invoice Number
  userId: number;
  emailId: string;
  filename: string;
  mimeType: string;
  sender: string;
  receiver: string;
  s3Url: string;    // The URL to the PDF file for viewing
  created_at: string;
  updated_at: string;
}