import { client } from "@/lib/axios-client";

// QuickBooks Account type
export interface QuickBooksAccount {
  Id: string;
  Name: string;
  FullyQualifiedName: string;
  Active: boolean;
  Classification?: string;
  AccountType?: string;
  AccountSubType?: string;
  CurrentBalance?: number;
  CurrencyRef?: {
    value: string;
    name: string;
  };
}

// QuickBooks Product/Item type
export interface QuickBooksItem {
  Id: string;
  Name: string;
  Description?: string;
  Active: boolean;
  FullyQualifiedName: string;
  Taxable?: boolean;
  UnitPrice?: number;
  Type?: string;
  IncomeAccountRef?: {
    value: string;
    name: string;
  };
  PurchaseCost?: number;
  TrackQtyOnHand?: boolean;
}

// API Response types
interface QuickBooksAccountsResponse {
  success: boolean;
  data: {
    QueryResponse?: {
      Account?: QuickBooksAccount[];
    };
  };
}

interface QuickBooksItemsResponse {
  success: boolean;
  data: {
    QueryResponse?: {
      Item?: QuickBooksItem[];
    };
  };
}

/**
 * Fetch all accounts from QuickBooks
 */
export async function fetchQuickBooksAccounts(): Promise<QuickBooksAccount[]> {
  try {
    const response = await client.get<QuickBooksAccountsResponse>("/api/v1/quickbooks/accounts");
    
    // Handle nested response structure: { success: true, data: { QueryResponse: { Account: [...] } } }
    if (response?.success && response?.data?.QueryResponse?.Account) {
      return response.data.QueryResponse.Account;
    }
    
    // Handle direct QueryResponse structure: { QueryResponse: { Account: [...] } }
    if (response?.QueryResponse?.Account) {
      return response.QueryResponse.Account;
    }
    
    // Fallback: try direct array access
    if (Array.isArray(response?.data)) {
      return response.data as QuickBooksAccount[];
    }
    
    if (Array.isArray(response)) {
      return response as QuickBooksAccount[];
    }
    
    return [];
  } catch (error) {
    console.error("Error fetching QuickBooks accounts:", error);
    throw error;
  }
}

/**
 * Fetch all items (products/services) from QuickBooks
 */
export async function fetchQuickBooksItems(): Promise<QuickBooksItem[]> {
  try {
    const response = await client.get<QuickBooksItemsResponse>("/api/v1/quickbooks/line-items");
    
    // Handle nested response structure: { success: true, data: { QueryResponse: { Item: [...] } } }
    if (response?.success && response?.data?.QueryResponse?.Item) {
      return response.data.QueryResponse.Item;
    }
    
    // Handle direct QueryResponse structure: { QueryResponse: { Item: [...] } }
    if (response?.QueryResponse?.Item) {
      return response.QueryResponse.Item;
    }
    
    // Fallback: try direct array access
    if (Array.isArray(response?.data)) {
      return response.data as QuickBooksItem[];
    }
    
    if (Array.isArray(response)) {
      return response as QuickBooksItem[];
    }
    
    return [];
  } catch (error) {
    console.error("Error fetching QuickBooks items:", error);
    throw error;
  }
}

/**
 * Update a line item with account or product selection
 */
export async function updateLineItem(
  lineItemId: number,
  updateData: {
    itemType?: 'account' | 'product' | null;
    resourceId?: number | null;
  }
): Promise<any> {
  try {
    const response = await client.patch(
      `/api/v1/invoice/line-items/${lineItemId}`,
      updateData
    );
    return response;
  } catch (error) {
    console.error("Error updating line item:", error);
    throw error;
  }
}

