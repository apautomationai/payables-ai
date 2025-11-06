import axios from "axios";
import { eq, and } from "drizzle-orm";
import db from "@/lib/db";
import { integrationsModel } from "@/models/integrations.model";
import { BadRequestError, InternalServerError } from "@/helpers/errors";
import { integrationsService } from "./integrations.service";

// QuickBooks integration type based on generic integrations model
interface QuickBooksIntegration {
  id: number;
  userId: number;
  name: string;
  status: string;
  accessToken: string | null;
  refreshToken: string | null;
  expiryDate: Date | null;
  metadata: any;
  createdAt: Date | null;
  updatedAt: Date | null;
}

export class QuickBooksService {
  private clientId: string;
  private clientSecret: string;
  private redirectUri: string;
  private scope: string;
  private baseUrl: string;

  constructor() {
    this.clientId = process.env.QUICKBOOKS_CLIENT_ID!;
    this.clientSecret = process.env.QUICKBOOKS_CLIENT_SECRET!;
    this.redirectUri = process.env.QUICKBOOKS_REDIRECT_URI!;
    this.scope = process.env.QUICKBOOKS_SCOPE!;
    this.baseUrl = process.env.QUICKBOOKS_BASE_URL!;

    if (!this.clientId || !this.clientSecret) {
      throw new Error("QuickBooks credentials not configured");
    }
  }

  // Generate OAuth URL for QuickBooks authorization
  generateAuthUrl(state?: string): string {
    const params = new URLSearchParams({
      client_id: this.clientId,
      scope: this.scope,
      redirect_uri: this.redirectUri,
      response_type: "code",
      access_type: "offline",
      ...(state && { state }),
    });

    return `https://appcenter.intuit.com/connect/oauth2?${params.toString()}`;
  }

  // Exchange authorization code for access token
  async exchangeCodeForTokens(code: string, realmId: string) {
    try {
      const response = await axios.post(
        "https://oauth.platform.intuit.com/oauth2/v1/tokens/bearer",
        new URLSearchParams({
          grant_type: "authorization_code",
          code,
          redirect_uri: this.redirectUri,
        }),
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization: `Basic ${Buffer.from(`${this.clientId}:${this.clientSecret}`).toString("base64")}`,
          },
        },
      );

      return {
        accessToken: response.data.access_token,
        refreshToken: response.data.refresh_token,
        expiresIn: response.data.expires_in,
        realmId,
      };
    } catch (error: any) {
      console.error(
        "QuickBooks token exchange error:",
        error.response?.data || error.message,
      );
      throw new BadRequestError(
        "Failed to exchange authorization code for tokens",
      );
    }
  }

  // Refresh access token
  async refreshAccessToken(refreshToken: string) {
    try {
      const response = await axios.post(
        "https://oauth.platform.intuit.com/oauth2/v1/tokens/bearer",
        new URLSearchParams({
          grant_type: "refresh_token",
          refresh_token: refreshToken,
        }),
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization: `Basic ${Buffer.from(`${this.clientId}:${this.clientSecret}`).toString("base64")}`,
          },
        },
      );

      return {
        accessToken: response.data.access_token,
        refreshToken: response.data.refresh_token || refreshToken,
        expiresIn: response.data.expires_in,
      };
    } catch (error: any) {
      console.error(
        "QuickBooks token refresh error:",
        error.response?.data || error.message,
      );
      throw new BadRequestError("Failed to refresh access token");
    }
  }

  // Save QuickBooks integration to database
  async saveIntegration(
    userId: number,
    tokenData: any,
    companyInfo?: any,
  ): Promise<QuickBooksIntegration> {
    try {
      const expiresAt = new Date(Date.now() + tokenData.expiresIn * 1000);

      const metadata = {
        realmId: tokenData.realmId,
        companyId: tokenData.realmId,
        companyName: companyInfo?.name || "Unknown Company",
        isActive: true,
        lastSyncAt: null,
      };

      // Check if integration already exists
      const existingIntegration = await integrationsService.checkIntegration(
        userId,
        "quickbooks"
      );

      if (existingIntegration) {
        // Update existing integration
        await integrationsService.updateIntegration(existingIntegration.id, {
          accessToken: tokenData.accessToken,
          refreshToken: tokenData.refreshToken,
          expiryDate: expiresAt,
          status: "success",
          metadata,
        });

        // Return updated integration
        const [updated] = await db
          .select()
          .from(integrationsModel)
          .where(eq(integrationsModel.id, existingIntegration.id))
          .limit(1);

        return updated as QuickBooksIntegration;
      } else {
        // Create new integration
        const [created] = await db
          .insert(integrationsModel)
          .values({
            userId,
            name: "quickbooks",
            status: "success",
            accessToken: tokenData.accessToken,
            refreshToken: tokenData.refreshToken,
            expiryDate: expiresAt,
            metadata,
          })
          .returning();

        return created as QuickBooksIntegration;
      }
    } catch (error: any) {
      console.error("Error saving QuickBooks integration:", error);
      throw new InternalServerError("Failed to save QuickBooks integration");
    }
  }

  // Get user's QuickBooks integration
  async getUserIntegration(
    userId: number,
  ): Promise<QuickBooksIntegration | null> {
    try {
      const [integration] = await db
        .select()
        .from(integrationsModel)
        .where(
          and(
            eq(integrationsModel.userId, userId),
            eq(integrationsModel.name, "quickbooks"),
            eq(integrationsModel.status, "success")
          ),
        )
        .limit(1);

      return integration as QuickBooksIntegration || null;
    } catch (error: any) {
      console.error("Error fetching QuickBooks integration:", error);
      throw new InternalServerError("Failed to fetch QuickBooks integration");
    }
  }

  // Make authenticated API call to QuickBooks
  async makeApiCall(
    integration: QuickBooksIntegration,
    endpoint: string,
    method: "GET" | "POST" = "GET",
    data?: any,
  ) {
    try {
      // Check if token needs refresh
      if (integration.expiryDate && new Date() >= integration.expiryDate) {
        try {
          const refreshedTokens = await this.refreshAccessToken(
            integration.refreshToken!,
          );

          const newExpiresAt = new Date(
            Date.now() + refreshedTokens.expiresIn * 1000,
          );

          // Update integration with new tokens
          await db
            .update(integrationsModel)
            .set({
              accessToken: refreshedTokens.accessToken,
              refreshToken: refreshedTokens.refreshToken,
              expiryDate: newExpiresAt,
              updatedAt: new Date(),
            })
            .where(eq(integrationsModel.id, integration.id));

          integration.accessToken = refreshedTokens.accessToken;
        } catch (refreshError: any) {
          // If refresh fails, the refresh token might be expired
          console.error("Token refresh failed:", refreshError);

          // Mark integration as disconnected
          await db
            .update(integrationsModel)
            .set({
              status: "disconnected",
              updatedAt: new Date(),
            })
            .where(eq(integrationsModel.id, integration.id));

          throw new BadRequestError(
            "QuickBooks connection expired. Please reconnect your QuickBooks account in Settings.",
          );
        }
      }

      const headers: any = {
        Authorization: `Bearer ${integration.accessToken}`,
        Accept: "application/json",
      };

      if (method === "POST") {
        headers["Content-Type"] = "application/json";
      }

      // Get realmId from metadata
      const realmId = integration.metadata?.realmId;
      if (!realmId) {
        throw new BadRequestError("QuickBooks realm ID not found in integration metadata");
      }

      const response = await axios({
        method,
        url: `${this.baseUrl}/v3/company/${realmId}/${endpoint}`,
        headers,
        ...(data && { data }),
      });

      return response.data;
    } catch (error: any) {
      // If it's already our custom error, re-throw it
      if (error instanceof BadRequestError) {
        throw error;
      }

      console.error("QuickBooks API call error:", {
        message: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        url: error.config?.url,
        method: error.config?.method,
        requestData: error.config?.data
      });
      throw new InternalServerError(`Failed to make QuickBooks API call: ${error.response?.data?.Fault?.Error?.[0]?.Detail || error.message}`);
    }
  }

  // Get company information
  async getCompanyInfo(integration: QuickBooksIntegration) {
    return this.makeApiCall(integration, "companyinfo/1");
  }

  // Get customers
  async getCustomers(integration: QuickBooksIntegration) {
    return this.makeApiCall(integration, "query?query=SELECT * FROM Customer");
  }

  // Get vendors
  async getVendors(integration: QuickBooksIntegration) {
    return this.makeApiCall(integration, "query?query=SELECT * FROM Vendor");
  }

  // Get items
  async getItems(integration: QuickBooksIntegration) {
    return this.makeApiCall(integration, "query?query=SELECT * FROM Item");
  }

  // Get invoices
  async getInvoices(integration: QuickBooksIntegration) {
    return this.makeApiCall(integration, "query?query=SELECT * FROM Invoice");
  }

  // Get line items (Items that can be used in invoices/bills)
  async getLineItems(integration: QuickBooksIntegration) {
    return this.makeApiCall(integration, "query?query=SELECT * FROM Item WHERE Active = true");
  }

  // Get specific invoice line items by invoice ID
  async getInvoiceLineItems(integration: QuickBooksIntegration, invoiceId: string) {
    return this.makeApiCall(integration, `invoices/${invoiceId}`);
  }

  // Get accounts from QuickBooks
  async getIncomeAccounts(integration: QuickBooksIntegration) {
    return this.makeApiCall(integration, "query?query=SELECT * FROM Account WHERE AccountType = 'Income'");
  }

  // Get expense accounts for bill creation
  async getExpenseAccounts(integration: QuickBooksIntegration) {
    return this.makeApiCall(integration, "query?query=SELECT * FROM Account WHERE AccountType = 'Expense'");
  }

  // Get tax accounts for bill creation
  async getTaxAccounts(integration: QuickBooksIntegration) {
    return this.makeApiCall(integration, "query?query=SELECT * FROM Account WHERE AccountType = 'Other Current Liability' OR AccountType = 'Expense'");
  }

  // Get accounts from QuickBooks
  async getAccounts(integration: QuickBooksIntegration) {
    return this.makeApiCall(integration, "query?query=SELECT * FROM Account");
  }

  // Create a bill in QuickBooks
  async createBill(integration: QuickBooksIntegration, billData: {
    vendorId: string;
    lineItems: Array<{
      amount: number;
      description?: string;
      itemId?: string;
    }>;
    totalAmount: number;
    totalTax?: number;
    dueDate?: string;
    invoiceDate?: string;
    discountAmount?: number;
    discountDescription?: string;
  }) {
    try {
      // Get expense accounts
      const accountsResponse = await this.getExpenseAccounts(integration);
      const accounts = accountsResponse?.QueryResponse?.Account || [];

      let expenseAccount = accounts.find((acc: any) =>
        acc.Name?.toLowerCase().includes('expense') ||
        acc.Name?.toLowerCase().includes('cost')
      );

      if (!expenseAccount && accounts.length > 0) {
        expenseAccount = accounts[0];
      }

      if (!expenseAccount) {
        throw new Error("No expense account found in QuickBooks");
      }

      // Get tax accounts if tax amount is provided
      let taxAccount = null;
      if (billData.totalTax && billData.totalTax > 0) {
        const taxAccountsResponse = await this.getTaxAccounts(integration);
        const taxAccounts = taxAccountsResponse?.QueryResponse?.Account || [];

        // Look for tax-related accounts
        taxAccount = taxAccounts.find((acc: any) =>
          acc.Name?.toLowerCase().includes('tax') ||
          acc.Name?.toLowerCase().includes('sales tax') ||
          acc.Name?.toLowerCase().includes('vat') ||
          acc.AccountType === 'Other Current Liability'
        );

        // If no specific tax account found, use expense account
        if (!taxAccount) {
          taxAccount = expenseAccount;
        }
      }

      // Create line items array
      const lineItems = billData.lineItems.map((item, index) => ({
        DetailType: "AccountBasedExpenseLineDetail",
        Amount: item.amount,
        Id: (index + 1).toString(), // Sequential ID for bill line items
        AccountBasedExpenseLineDetail: {
          AccountRef: {
            value: expenseAccount.Id
          }
        },
        ...(item.description && { Description: item.description })
      }));

      // Add tax line item if tax amount is provided
      if (billData.totalTax && billData.totalTax > 0 && taxAccount) {
        lineItems.push({
          DetailType: "AccountBasedExpenseLineDetail",
          Amount: billData.totalTax,
          Id: (lineItems.length + 1).toString(),
          AccountBasedExpenseLineDetail: {
            AccountRef: {
              value: taxAccount.Id
            }
          },
          Description: "Tax"
        });
      }

      // Add discount line item if discount is provided
      if (billData.discountAmount && billData.discountAmount > 0) {
        lineItems.push({
          DetailType: "AccountBasedExpenseLineDetail",
          Amount: -Math.abs(billData.discountAmount), // Negative amount for discount
          Id: (lineItems.length + 1).toString(),
          AccountBasedExpenseLineDetail: {
            AccountRef: {
              value: expenseAccount.Id
            }
          },
          Description: billData.discountDescription || "Discount"
        });
      }

      // Create bill payload
      const payload = {
        Line: lineItems,
        VendorRef: {
          value: billData.vendorId
        },
        ...(billData.dueDate && { DueDate: billData.dueDate }),
        ...(billData.invoiceDate && { TxnDate: billData.invoiceDate })
      };

      return this.makeApiCall(integration, "bill", "POST", payload);
    } catch (error) {
      console.error("Error creating QuickBooks bill:", error);
      throw error;
    }
  }

  // Create a new item in QuickBooks
  async createItem(integration: QuickBooksIntegration, itemData: {
    name: string;
    description?: string;
    unitPrice?: number;
    type?: string;
    customerId?: string;
  }, lineItemData?: any) {
    try {
      const incomeAccountsResponse = await this.getIncomeAccounts(integration);
      const incomeAccounts = incomeAccountsResponse?.QueryResponse?.Account || [];

      let incomeAccount = incomeAccounts.find((acc: any) =>
        acc.Name?.toLowerCase().includes('sales') ||
        acc.Name?.toLowerCase().includes('income') ||
        acc.Name?.toLowerCase().includes('service')
      );

      if (!incomeAccount && incomeAccounts.length > 0) {
        incomeAccount = incomeAccounts[0];
      }

      if (!incomeAccount) {
        throw new Error("No income account found in QuickBooks");
      }

      const payload = {
        Name: itemData.name,
        Type: "Service",
        IncomeAccountRef: {
          name: incomeAccount.Name,
          value: incomeAccount.Id
        },
        ...(itemData.description && { Description: itemData.description }),
        ...(lineItemData?.rate && { UnitPrice: parseFloat(lineItemData.rate) }),
      };

      return this.makeApiCall(integration, "item", "POST", payload);
    } catch (error) {
      console.error("Error creating QuickBooks item:", error);
      throw error;
    }
  }

  // Strict vector search for items (95% match required, same as vendors)
  vectorSearchItems(searchTerm: string, items: any[]): any[] {
    if (!items || items.length === 0) return [];

    // Normalize function to remove special characters and extra spaces
    const normalize = (str: string) => {
      return str.toLowerCase()
        .replace(/[^\w\s]/g, '') // Remove special characters
        .replace(/\s+/g, ' ')    // Replace multiple spaces with single space
        .trim();
    };

    const normalizedSearch = normalize(searchTerm);

    const scoredItems = items.map(item => {
      const itemName = item.Name || '';
      const normalizedItem = normalize(itemName);

      let score = 0;

      // Exact match after normalization
      if (normalizedItem === normalizedSearch) {
        score = 100;
      } else {
        // Calculate character-level similarity for strict matching
        const searchChars = normalizedSearch.split('');
        const itemChars = normalizedItem.split('');

        // Use Levenshtein distance for similarity
        const maxLength = Math.max(searchChars.length, itemChars.length);
        const distance = this.levenshteinDistance(normalizedSearch, normalizedItem);
        const similarity = ((maxLength - distance) / maxLength) * 100;

        score = similarity;
      }

      return { ...item, similarityScore: score };
    });

    // Only return items with 95% or higher similarity
    return scoredItems
      .filter(item => item.similarityScore >= 95)
      .sort((a, b) => b.similarityScore - a.similarityScore);
  }

  // Hierarchical vendor search: email → phone → address → name
  hierarchicalVendorSearch(vendorData: {
    email?: string | null;
    phone?: string | null;
    address?: string | null;
    name?: string | null;
  }, vendors: any[]): { vendor: any | null; matchType: string } {
    if (!vendors || vendors.length === 0) {
      return { vendor: null, matchType: 'none' };
    }

    // Helper function to normalize strings for comparison
    const normalize = (str: string) => {
      return str.toLowerCase()
        .replace(/[^\w\s]/g, '')
        .replace(/\s+/g, ' ')
        .trim();
    };

    // Helper function to check exact match
    const isExactMatch = (searchValue: string, vendorValue: string) => {
      if (!searchValue || !vendorValue) return false;
      return normalize(searchValue) === normalize(vendorValue);
    };

    // 1. Search by email (highest priority)
    if (vendorData.email) {
      const emailMatch = vendors.find(vendor => {
        const vendorEmail = vendor.PrimaryEmailAddr?.Address || vendor.Email || '';
        return isExactMatch(vendorData.email!, vendorEmail);
      });
      if (emailMatch) {
        return { vendor: emailMatch, matchType: 'email' };
      }
    }

    // 2. Search by phone (second priority)
    if (vendorData.phone) {
      const phoneMatch = vendors.find(vendor => {
        const vendorPhone = vendor.PrimaryPhone?.FreeFormNumber || vendor.Phone || '';
        return isExactMatch(vendorData.phone!, vendorPhone);
      });
      if (phoneMatch) {
        return { vendor: phoneMatch, matchType: 'phone' };
      }
    }

    // 3. Search by address (third priority)
    if (vendorData.address) {
      const addressMatch = vendors.find(vendor => {
        const vendorAddress = vendor.BillAddr?.Line1 || vendor.Address || '';
        return isExactMatch(vendorData.address!, vendorAddress);
      });
      if (addressMatch) {
        return { vendor: addressMatch, matchType: 'address' };
      }
    }

    // 4. Search by name (lowest priority - existing logic)
    if (vendorData.name) {
      const nameMatches = this.vectorSearchVendors(vendorData.name, vendors);
      if (nameMatches.length > 0) {
        return { vendor: nameMatches[0], matchType: 'name' };
      }
    }

    return { vendor: null, matchType: 'none' };
  }

  // Strict vector search for vendors (95% match required)
  vectorSearchVendors(searchTerm: string, vendors: any[]): any[] {
    if (!vendors || vendors.length === 0) return [];

    // Normalize function to remove special characters and extra spaces
    const normalize = (str: string) => {
      return str.toLowerCase()
        .replace(/[^\w\s]/g, '') // Remove special characters
        .replace(/\s+/g, ' ')    // Replace multiple spaces with single space
        .trim();
    };

    const normalizedSearch = normalize(searchTerm);

    const scoredVendors = vendors.map(vendor => {
      const vendorName = vendor.DisplayName || vendor.Name || '';
      const normalizedVendor = normalize(vendorName);

      let score = 0;

      // Exact match after normalization
      if (normalizedVendor === normalizedSearch) {
        score = 100;
      } else {
        // Calculate character-level similarity for strict matching
        const searchChars = normalizedSearch.split('');
        const vendorChars = normalizedVendor.split('');

        // Use Levenshtein distance for similarity
        const maxLength = Math.max(searchChars.length, vendorChars.length);
        const distance = this.levenshteinDistance(normalizedSearch, normalizedVendor);
        const similarity = ((maxLength - distance) / maxLength) * 100;

        score = similarity;
      }

      return { ...vendor, similarityScore: score };
    });

    // Only return vendors with 95% or higher similarity
    return scoredVendors
      .filter(vendor => vendor.similarityScore >= 95)
      .sort((a, b) => b.similarityScore - a.similarityScore);
  }

  // Levenshtein distance algorithm for string similarity
  private levenshteinDistance(str1: string, str2: string): number {
    const matrix = [];

    for (let i = 0; i <= str2.length; i++) {
      matrix[i] = [i];
    }

    for (let j = 0; j <= str1.length; j++) {
      matrix[0][j] = j;
    }

    for (let i = 1; i <= str2.length; i++) {
      for (let j = 1; j <= str1.length; j++) {
        if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1
          );
        }
      }
    }

    return matrix[str2.length][str1.length];
  }

  // Vector search for customers (95% match required, same as vendors)
  vectorSearchCustomers(searchTerm: string, customers: any[]): any[] {
    if (!customers || customers.length === 0) return [];

    const normalize = (str: string) => {
      return str.toLowerCase()
        .replace(/[^\w\s]/g, '')
        .replace(/\s+/g, ' ')
        .trim();
    };

    const normalizedSearch = normalize(searchTerm);

    const scoredCustomers = customers.map(customer => {
      const customerName = customer.DisplayName || customer.Name || '';
      const normalizedCustomer = normalize(customerName);

      let score = 0;

      if (normalizedCustomer === normalizedSearch) {
        score = 100;
      } else {
        const maxLength = Math.max(normalizedSearch.length, normalizedCustomer.length);
        const distance = this.levenshteinDistance(normalizedSearch, normalizedCustomer);
        const similarity = ((maxLength - distance) / maxLength) * 100;
        score = similarity;
      }

      return { ...customer, similarityScore: score };
    });

    return scoredCustomers
      .filter(customer => customer.similarityScore >= 95)
      .sort((a, b) => b.similarityScore - a.similarityScore);
  }

  // Create a new customer in QuickBooks
  async createCustomer(integration: QuickBooksIntegration, customerData: {
    name: string;
  }) {
    try {
      const sanitizedName = customerData.name
        .replace(/[<>&"']/g, '')
        .replace(/,\s*Inc\./gi, ' Inc')
        .replace(/,\s*LLC/gi, ' LLC')
        .replace(/,\s*Corp\./gi, ' Corp')
        .replace(/\s+/g, ' ')
        .trim()
        .substring(0, 100);

      if (!sanitizedName) {
        throw new Error("Invalid customer name after sanitization");
      }

      const payload = {
        DisplayName: sanitizedName
      };

      console.log("Creating QuickBooks customer with sanitized name:", sanitizedName);
      console.log("Full payload:", JSON.stringify(payload, null, 2));
      return this.makeApiCall(integration, "customer", "POST", payload);
    } catch (error) {
      console.error("Error creating QuickBooks customer:", error);
      throw error;
    }
  }

  // Create a new vendor in QuickBooks
  async createVendor(integration: QuickBooksIntegration, vendorData: {
    name: string;
    email?: string;
    phone?: string;
    address?: string;
  }) {
    try {
      // Sanitize vendor name for QuickBooks (more aggressive sanitization)
      const sanitizedName = vendorData.name
        .replace(/[<>&"']/g, '') // Remove problematic characters
        .replace(/,\s*Inc\./gi, ' Inc') // Simplify Inc. format
        .replace(/,\s*LLC/gi, ' LLC') // Simplify LLC format
        .replace(/,\s*Corp\./gi, ' Corp') // Simplify Corp. format
        .replace(/\s+/g, ' ') // Replace multiple spaces with single space
        .trim()
        .substring(0, 100); // Limit to 100 characters

      if (!sanitizedName) {
        throw new Error("Invalid vendor name after sanitization");
      }

      // Build QuickBooks Vendor payload with additional information
      const payload: any = {
        DisplayName: sanitizedName
      };

      // Add email if provided
      if (vendorData.email) {
        payload.PrimaryEmailAddr = {
          Address: vendorData.email
        };
      }

      // Add phone if provided
      if (vendorData.phone) {
        payload.PrimaryPhone = {
          FreeFormNumber: vendorData.phone
        };
      }

      // Add address if provided
      if (vendorData.address) {
        payload.BillAddr = {
          Line1: vendorData.address
        };
      }

      console.log("Creating QuickBooks vendor with data:", payload);
      return this.makeApiCall(integration, "vendor", "POST", payload);
    } catch (error) {
      console.error("Error creating QuickBooks vendor:", error);
      throw error;
    }
  }

  // Disconnect integration
  async disconnectIntegration(userId: number): Promise<void> {
    try {
      // Update integrations table
      await db
        .update(integrationsModel)
        .set({
          status: "disconnected",
          updatedAt: new Date(),
        })
        .where(
          and(
            eq(integrationsModel.userId, userId),
            eq(integrationsModel.name, "quickbooks")
          )
        );
    } catch (error: any) {
      console.error("Error disconnecting QuickBooks integration:", error);
      throw new InternalServerError(
        "Failed to disconnect QuickBooks integration",
      );
    }
  }
}

export const quickbooksService = new QuickBooksService();
