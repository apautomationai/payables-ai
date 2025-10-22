import axios from "axios";
import { eq, and } from "drizzle-orm";
import db from "@/lib/db";
import {
  quickbooksIntegrationsModel,
  QuickBooksIntegration,
  NewQuickBooksIntegration,
} from "@/models/quickbooks.model";
import { BadRequestError, InternalServerError } from "@/helpers/errors";

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
        // Update existing integration
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

        return updated;
      } else {
        // Create new integration
        const [created] = await db
          .insert(quickbooksIntegrationsModel)
          .values(integrationData)
          .returning();

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

          // Update integration with new tokens
          await db
            .update(quickbooksIntegrationsModel)
            .set({
              accessToken: refreshedTokens.accessToken,
              refreshToken: refreshedTokens.refreshToken,
              tokenExpiresAt: new Date(
                Date.now() + refreshedTokens.expiresIn * 1000,
              ),
              updatedAt: new Date(),
            })
            .where(eq(quickbooksIntegrationsModel.id, integration.id));

          integration.accessToken = refreshedTokens.accessToken;
        } catch (refreshError: any) {
          // If refresh fails, the refresh token might be expired
          console.error("Token refresh failed:", refreshError);

          // Mark integration as inactive so user knows to reconnect
          await db
            .update(quickbooksIntegrationsModel)
            .set({
              isActive: false,
              updatedAt: new Date(),
            })
            .where(eq(quickbooksIntegrationsModel.id, integration.id));

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

      // Create bill payload
      const payload = {
        Line: billData.lineItems.map((item, index) => ({
          DetailType: "AccountBasedExpenseLineDetail",
          Amount: item.amount,
          Id: (index + 1).toString(),
          AccountBasedExpenseLineDetail: {
            AccountRef: {
              value: expenseAccount.Id
            }
          },
          ...(item.description && { Description: item.description })
        })),
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

  // Vector search function to find similar items
  vectorSearchItems(searchTerm: string, items: any[]): any[] {
    if (!items || items.length === 0) return [];

    // Simple similarity scoring based on string matching
    const scoredItems = items.map(item => {
      const itemName = item.Name?.toLowerCase() || '';
      const searchLower = searchTerm.toLowerCase();

      let score = 0;

      // Exact match gets highest score
      if (itemName === searchLower) {
        score = 100;
      }
      // Contains search term
      else if (itemName.includes(searchLower)) {
        score = 80;
      }
      // Partial word matches
      else {
        const searchWords = searchLower.split(/\s+/);
        const itemWords = itemName.split(/\s+/);

        let matchedWords = 0;
        searchWords.forEach((searchWord: string) => {
          itemWords.forEach((itemWord: string) => {
            if (itemWord.includes(searchWord) || searchWord.includes(itemWord)) {
              matchedWords++;
            }
          });
        });

        score = (matchedWords / searchWords.length) * 60;
      }

      return { ...item, similarityScore: score };
    });

    // Return items sorted by similarity score (highest first)
    return scoredItems
      .filter(item => item.similarityScore > 30) // Only return items with reasonable similarity
      .sort((a, b) => b.similarityScore - a.similarityScore);
  }

  // Vector search for vendors
  vectorSearchVendors(searchTerm: string, vendors: any[]): any[] {
    if (!vendors || vendors.length === 0) return [];

    const scoredVendors = vendors.map(vendor => {
      const vendorName = vendor.Name?.toLowerCase() || '';
      const searchLower = searchTerm.toLowerCase();

      let score = 0;

      if (vendorName === searchLower) {
        score = 100;
      } else if (vendorName.includes(searchLower)) {
        score = 80;
      } else {
        const searchWords = searchLower.split(/\s+/);
        const vendorWords = vendorName.split(/\s+/);

        let matchedWords = 0;
        searchWords.forEach((searchWord: string) => {
          vendorWords.forEach((vendorWord: string) => {
            if (vendorWord.includes(searchWord) || searchWord.includes(vendorWord)) {
              matchedWords++;
            }
          });
        });

        score = (matchedWords / searchWords.length) * 60;
      }

      return { ...vendor, similarityScore: score };
    });

    return scoredVendors
      .filter(vendor => vendor.similarityScore > 30)
      .sort((a, b) => b.similarityScore - a.similarityScore);
  }

  // Disconnect integration
  async disconnectIntegration(userId: number): Promise<void> {
    try {
      await db
        .update(quickbooksIntegrationsModel)
        .set({
          isActive: false,
          updatedAt: new Date(),
        })
        .where(eq(quickbooksIntegrationsModel.userId, userId));
    } catch (error: any) {
      console.error("Error disconnecting QuickBooks integration:", error);
      throw new InternalServerError(
        "Failed to disconnect QuickBooks integration",
      );
    }
  }
}

export const quickbooksService = new QuickBooksService();
