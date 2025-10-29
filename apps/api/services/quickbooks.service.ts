import axios from "axios";
import { eq, and } from "drizzle-orm";
import db from "@/lib/db";
import {
  quickbooksIntegrationsModel,
  QuickBooksIntegration,
  NewQuickBooksIntegration,
} from "@/models/quickbooks.model";
import { BadRequestError, InternalServerError } from "@/helpers/errors";
import { integrationsService } from "./integrations.service";

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

      const integrationData: NewQuickBooksIntegration = {
        userId,
        companyId: tokenData.realmId,
        accessToken: tokenData.accessToken,
        refreshToken: tokenData.refreshToken,
        tokenExpiresAt: expiresAt,
        realmId: tokenData.realmId,
        companyName: companyInfo?.name || "Unknown Company",
        isActive: true,
        lastSyncAt: null,
      };

      // Check if integration already exists
      const existingIntegration = await db
        .select()
        .from(quickbooksIntegrationsModel)
        .where(
          and(
            eq(quickbooksIntegrationsModel.userId, userId),
            eq(quickbooksIntegrationsModel.realmId, tokenData.realmId),
          ),
        )
        .limit(1);

      if (existingIntegration.length > 0) {
        // Update existing integration in quickbooks_integrations table
        const [updated] = await db
          .update(quickbooksIntegrationsModel)
          .set({
            accessToken: tokenData.accessToken,
            refreshToken: tokenData.refreshToken,
            tokenExpiresAt: expiresAt,
            isActive: true,
            updatedAt: new Date(),
          })
          .where(eq(quickbooksIntegrationsModel.id, existingIntegration[0].id))
          .returning();

        // Also update integrations table
        const existingIntegrationsRecord = await integrationsService.checkIntegration(
          userId,
          "quickbooks"
        );

        const metadata = {
          realmId: tokenData.realmId,
          companyId: tokenData.realmId,
          companyName: companyInfo?.name || "Unknown Company",
          isActive: true,
          lastSyncAt: null,
        };

        if (existingIntegrationsRecord) {
          await integrationsService.updateIntegration(existingIntegrationsRecord.id, {
            accessToken: tokenData.accessToken,
            refreshToken: tokenData.refreshToken,
            expiryDate: expiresAt,
            status: "success",
            metadata,
          });
        } else {
          await integrationsService.insertIntegration({
            userId,
            name: "quickbooks",
            status: "success",
            accessToken: tokenData.accessToken,
            refreshToken: tokenData.refreshToken,
            expiryDate: expiresAt,
            metadata,
          });
        }

        return updated;
      } else {
        // Create new integration in quickbooks_integrations table
        const [created] = await db
          .insert(quickbooksIntegrationsModel)
          .values(integrationData)
          .returning();

        // Also create in integrations table
        const metadata = {
          realmId: tokenData.realmId,
          companyId: tokenData.realmId,
          companyName: companyInfo?.name || "Unknown Company",
          isActive: true,
          lastSyncAt: null,
        };

        await integrationsService.insertIntegration({
          userId,
          name: "quickbooks",
          status: "success",
          accessToken: tokenData.accessToken,
          refreshToken: tokenData.refreshToken,
          expiryDate: expiresAt,
          metadata,
        });

        return created;
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
        .from(quickbooksIntegrationsModel)
        .where(
          and(
            eq(quickbooksIntegrationsModel.userId, userId),
            eq(quickbooksIntegrationsModel.isActive, true),
          ),
        )
        .limit(1);

      return integration || null;
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
      if (new Date() >= integration.tokenExpiresAt) {
        try {
          const refreshedTokens = await this.refreshAccessToken(
            integration.refreshToken,
          );

          const newExpiresAt = new Date(
            Date.now() + refreshedTokens.expiresIn * 1000,
          );

          // Update integration with new tokens in quickbooks_integrations table
          await db
            .update(quickbooksIntegrationsModel)
            .set({
              accessToken: refreshedTokens.accessToken,
              refreshToken: refreshedTokens.refreshToken,
              tokenExpiresAt: newExpiresAt,
              updatedAt: new Date(),
            })
            .where(eq(quickbooksIntegrationsModel.id, integration.id));

          // Also update integrations table
          const existingIntegrationsRecord = await integrationsService.checkIntegration(
            integration.userId,
            "quickbooks"
          );

          if (existingIntegrationsRecord) {
            const metadata = existingIntegrationsRecord.metadata || {};
            await integrationsService.updateIntegration(existingIntegrationsRecord.id, {
              accessToken: refreshedTokens.accessToken,
              refreshToken: refreshedTokens.refreshToken,
              expiryDate: newExpiresAt,
              metadata: {
                ...metadata,
                lastSyncAt: new Date(),
              },
            });
          }

          integration.accessToken = refreshedTokens.accessToken;
        } catch (refreshError: any) {
          // If refresh fails, the refresh token might be expired
          console.error("Token refresh failed:", refreshError);

          // Mark integration as inactive in quickbooks_integrations table
          await db
            .update(quickbooksIntegrationsModel)
            .set({
              isActive: false,
              updatedAt: new Date(),
            })
            .where(eq(quickbooksIntegrationsModel.id, integration.id));

          // Also update integrations table
          const existingIntegrationsRecord = await integrationsService.checkIntegration(
            integration.userId,
            "quickbooks"
          );

          if (existingIntegrationsRecord) {
            const metadata = existingIntegrationsRecord.metadata || {};
            await integrationsService.updateIntegration(existingIntegrationsRecord.id, {
              status: "disconnected",
              metadata: {
                ...metadata,
                isActive: false,
              },
            });
          }

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



      const response = await axios({
        method,
        url: `${this.baseUrl}/v3/company/${integration.realmId}/${endpoint}`,
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
  async getAccounts(integration: QuickBooksIntegration) {
    return this.makeApiCall(integration, "query?query=SELECT * FROM Account WHERE AccountType = 'Income'");
  }

  // Get expense accounts for bill creation
  async getExpenseAccounts(integration: QuickBooksIntegration) {
    return this.makeApiCall(integration, "query?query=SELECT * FROM Account WHERE AccountType = 'Expense'");
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
      const accountsResponse = await this.getAccounts(integration);
      const accounts = accountsResponse?.QueryResponse?.Account || [];

      let incomeAccount = accounts.find((acc: any) =>
        acc.Name?.toLowerCase().includes('sales') ||
        acc.Name?.toLowerCase().includes('income') ||
        acc.Name?.toLowerCase().includes('service')
      );

      if (!incomeAccount && accounts.length > 0) {
        incomeAccount = accounts[0];
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

      // QuickBooks Vendor API format - DisplayName only
      const payload = {
        DisplayName: sanitizedName
      };

      console.log("Creating QuickBooks vendor with sanitized name:", sanitizedName);
      console.log("Full payload:", JSON.stringify(payload, null, 2));
      return this.makeApiCall(integration, "vendor", "POST", payload);
    } catch (error) {
      console.error("Error creating QuickBooks vendor:", error);
      throw error;
    }
  }

  // Disconnect integration
  async disconnectIntegration(userId: number): Promise<void> {
    try {
      // Update quickbooks_integrations table
      await db
        .update(quickbooksIntegrationsModel)
        .set({
          isActive: false,
          updatedAt: new Date(),
        })
        .where(eq(quickbooksIntegrationsModel.userId, userId));

      // Also update integrations table
      const existingIntegrationsRecord = await integrationsService.checkIntegration(
        userId,
        "quickbooks"
      );

      if (existingIntegrationsRecord) {
        const metadata = existingIntegrationsRecord.metadata || {};
        await integrationsService.updateIntegration(existingIntegrationsRecord.id, {
          status: "disconnected",
          metadata: {
            ...metadata,
            isActive: false,
          },
        });
      }
    } catch (error: any) {
      console.error("Error disconnecting QuickBooks integration:", error);
      throw new InternalServerError(
        "Failed to disconnect QuickBooks integration",
      );
    }
  }
}

export const quickbooksService = new QuickBooksService();
