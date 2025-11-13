import axios from "axios";
import { eq, and } from "drizzle-orm";
import db from "@/lib/db";
import { integrationsModel } from "@/models/integrations.model";
import { quickbooksProductsModel } from "@/models/quickbooks-products.model";
import { quickbooksAccountsModel } from "@/models/quickbooks-accounts.model";
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
  // Note: Including all types (Service, Non-Inventory, Inventory) to avoid date restrictions
  // Inventory items have date restrictions that can cause bill creation to fail
  async getLineItems(integration: QuickBooksIntegration) {
    return this.makeApiCall(integration, "query?query=SELECT * FROM Item WHERE Active = true AND Type = 'Inventory'");
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
    return this.makeApiCall(integration, "query?query=SELECT * FROM Account WHERE AccountType IN ('Other Current Liability', 'Expense')");
  }

  // Get accounts from QuickBooks (excluding Accounts Payable and other invalid types for bills)
  async getAccounts(integration: QuickBooksIntegration) {
    try {
      const response = await this.makeApiCall(integration, "query?query=SELECT * FROM Account");

      // Filter out account types that cannot be used in bill line items
      if (response?.QueryResponse?.Account) {
        const validAccounts = response.QueryResponse.Account.filter((account: any) => {
          // Exclude Accounts Payable and other liability accounts that can't be used in bills
          const invalidAccountTypes = [
            'Accounts Payable',
            'AccountsPayable',
            'Accounts Receivable',
            'AccountsReceivable'
          ];

          const invalidSubTypes = [
            'AccountsPayable',
            'AccountsReceivable'
          ];

          // Check AccountType and AccountSubType
          const isInvalidType = invalidAccountTypes.includes(account.AccountType);
          const isInvalidSubType = invalidSubTypes.includes(account.AccountSubType);

          // Also check account name for common payable account names
          const accountName = (account.Name || '').toLowerCase();
          const isPayableByName = accountName.includes('accounts payable') ||
            accountName.includes('payable') ||
            accountName.includes('accounts receivable') ||
            accountName.includes('receivable');

          console.log(`🏦 Account "${account.Name}":`, {
            AccountType: account.AccountType,
            AccountSubType: account.AccountSubType,
            isInvalidType,
            isInvalidSubType,
            isPayableByName,
            excluded: isInvalidType || isInvalidSubType || isPayableByName
          });

          return !isInvalidType && !isInvalidSubType && !isPayableByName;
        });

        console.log(`🏦 Filtered accounts: ${response.QueryResponse.Account.length} -> ${validAccounts.length}`);

        return {
          ...response,
          QueryResponse: {
            ...response.QueryResponse,
            Account: validAccounts
          }
        };
      }

      return response;
    } catch (error) {
      console.error("Error getting accounts:", error);
      throw error;
    }
  }

  // Create a bill in QuickBooks
  async createBill(integration: QuickBooksIntegration, billData: {
    vendorId: string;
    lineItems: Array<{
      id: number;
      item_name: string;
      description?: string;
      quantity: number;
      rate: number;
      amount: number;
      itemType: 'account' | 'product';
      resourceId: string;
    }>;
    totalAmount: number;
    totalTax?: number;
    dueDate?: string;
    invoiceDate?: string;
    discountAmount?: number;
    discountDescription?: string;
  }) {
    try {
      // Get a default expense account for fallback scenarios
      const accountsResponse = await this.getExpenseAccounts(integration);
      const accounts = accountsResponse?.QueryResponse?.Account || [];

      let defaultExpenseAccount = accounts.find((acc: any) =>
        acc.Name?.toLowerCase().includes('expense') ||
        acc.Name?.toLowerCase().includes('cost')
      );

      if (!defaultExpenseAccount && accounts.length > 0) {
        defaultExpenseAccount = accounts[0];
      }

      if (!defaultExpenseAccount) {
        throw new Error("No expense account found in QuickBooks for fallback");
      }

      console.log(`🏦 Using default expense account for fallback: ${defaultExpenseAccount.Name} (${defaultExpenseAccount.Id})`);

      // Create line items array based on itemType and resourceId from database
      const lineItems = billData.lineItems.map((item, index) => {
        console.log(`🧾 Processing line item "${item.item_name}":`, {
          itemType: item.itemType,
          resourceId: item.resourceId,
          amount: item.amount,
          quantity: item.quantity
        });

        const baseItem = {
          Amount: parseFloat(item.amount.toString()),
          Id: (index + 1).toString(),
        };

        if (item.itemType === 'account') {
          // Validate that this is not an Accounts Payable account
          // Note: This is a basic check - the main filtering should happen in getAccounts
          if (item.resourceId && (item.resourceId.includes('payable') || item.resourceId.includes('receivable'))) {
            throw new Error(`Cannot use Accounts Payable or Accounts Receivable account for line item "${item.item_name}". Please select an expense account instead.`);
          }

          // Account-based expense line
          const accountLine = {
            ...baseItem,
            DetailType: "AccountBasedExpenseLineDetail",
            AccountBasedExpenseLineDetail: {
              AccountRef: {
                value: item.resourceId
              }
            },
            ...(item.description && { Description: item.description })
          };
          console.log(`💰 Created account-based line:`, accountLine);
          return accountLine;
        } else if (item.itemType === 'product') {
          // Item-based expense line
          const productLine = {
            ...baseItem,
            DetailType: "ItemBasedExpenseLineDetail",
            ItemBasedExpenseLineDetail: {
              ItemRef: {
                value: item.resourceId
              },
              Qty: parseFloat(item.quantity.toString()) || 1
            },
            ...(item.description && { Description: item.description })
          };
          console.log(`🛍️ Created item-based line:`, productLine);
          return productLine;
        } else {
          throw new Error(`Invalid itemType: ${item.itemType} for line item ${item.item_name}`);
        }
      });

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

        // If no specific tax account found, use default expense account
        if (!taxAccount) {
          taxAccount = defaultExpenseAccount;
        }
      }

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
              value: defaultExpenseAccount.Id
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

      // Try to create the bill with item-based lines first
      try {
        console.log(`📋 Attempting to create bill with ${lineItems.length} line items`);
        return await this.makeApiCall(integration, "bill", "POST", payload);
      } catch (apiError: any) {
        // Check if the error is related to items not having purchase accounts
        const errorMessage = apiError?.message || '';
        const isItemAccountError = errorMessage.includes('no account associated with the item') ||
          errorMessage.includes('marked for purchase') ||
          errorMessage.includes('has an account associated with it');

        if (isItemAccountError) {
          console.log(`⚠️ Item-based bill creation failed, falling back to account-based lines`);

          // Rebuild line items using account-based approach for products
          const fallbackLineItems = billData.lineItems.map((item, index) => {
            const baseItem = {
              Amount: parseFloat(item.amount.toString()),
              Id: (index + 1).toString(),
            };

            if (item.itemType === 'account') {
              // Keep account-based lines as they are
              return {
                ...baseItem,
                DetailType: "AccountBasedExpenseLineDetail",
                AccountBasedExpenseLineDetail: {
                  AccountRef: {
                    value: item.resourceId
                  }
                },
                ...(item.description && { Description: item.description })
              };
            } else if (item.itemType === 'product') {
              // Convert product lines to account-based using default expense account
              console.log(`🔄 Converting product "${item.item_name}" to account-based line using default expense account`);
              return {
                ...baseItem,
                DetailType: "AccountBasedExpenseLineDetail",
                AccountBasedExpenseLineDetail: {
                  AccountRef: {
                    value: defaultExpenseAccount.Id
                  }
                },
                Description: `${item.item_name}${item.description ? ` - ${item.description}` : ''}`
              };
            } else {
              throw new Error(`Invalid itemType: ${item.itemType} for line item ${item.item_name}`);
            }
          });

          // Add tax and discount items to fallback lines
          if (billData.totalTax && billData.totalTax > 0 && taxAccount) {
            fallbackLineItems.push({
              DetailType: "AccountBasedExpenseLineDetail",
              Amount: billData.totalTax,
              Id: (fallbackLineItems.length + 1).toString(),
              AccountBasedExpenseLineDetail: {
                AccountRef: {
                  value: taxAccount.Id
                }
              },
              Description: "Tax"
            });
          }

          if (billData.discountAmount && billData.discountAmount > 0) {
            fallbackLineItems.push({
              DetailType: "AccountBasedExpenseLineDetail",
              Amount: -Math.abs(billData.discountAmount),
              Id: (fallbackLineItems.length + 1).toString(),
              AccountBasedExpenseLineDetail: {
                AccountRef: {
                  value: defaultExpenseAccount.Id
                }
              },
              Description: billData.discountDescription || "Discount"
            });
          }

          // Create fallback payload
          const fallbackPayload = {
            Line: fallbackLineItems,
            VendorRef: {
              value: billData.vendorId
            },
            ...(billData.dueDate && { DueDate: billData.dueDate }),
            ...(billData.invoiceDate && { TxnDate: billData.invoiceDate })
          };

          console.log(`🔄 Retrying bill creation with account-based fallback`);
          return await this.makeApiCall(integration, "bill", "POST", fallbackPayload);
        } else {
          // Re-throw other errors
          throw apiError;
        }
      }
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
      // await db
      //   .update(integrationsModel)
      //   .set({
      //     status: "disconnected",
      //     updatedAt: new Date(),
      //   })
      //   .where(
      //     and(
      //       eq(integrationsModel.userId, userId),
      //       eq(integrationsModel.name, "quickbooks")
      //     )
      //   );

      await db.delete(integrationsModel).where(
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

  // Sync products to database
  async syncProductsToDatabase(
    userId: number,
    products: any[],
  ): Promise<{ inserted: number; updated: number; skipped: number }> {
    let inserted = 0;
    let updated = 0;
    let skipped = 0;

    for (const product of products) {
      try {
        const quickbooksId = product.Id?.toString() || "";
        if (!quickbooksId) {
          continue;
        }

        // Parse timestamps from QuickBooks MetaData
        const metaDataCreateTime = product.MetaData?.CreateTime
          ? new Date(product.MetaData.CreateTime)
          : null;
        const metaDataLastUpdatedTime = product.MetaData?.LastUpdatedTime
          ? new Date(product.MetaData.LastUpdatedTime)
          : null;

        // Transform product to flat structure
        const productData = {
          userId,
          quickbooksId,
          name: product.Name || null,
          description: product.Description || null,
          active: product.Active ?? null,
          fullyQualifiedName: product.FullyQualifiedName || null,
          taxable: product.Taxable ?? null,
          unitPrice: product.UnitPrice ? product.UnitPrice.toString() : null,
          type: product.Type || null,
          incomeAccountValue: product.IncomeAccountRef?.value || null,
          incomeAccountName: product.IncomeAccountRef?.name || null,
          purchaseDesc: product.PurchaseDesc || null,
          purchaseCost: product.PurchaseCost ? product.PurchaseCost.toString() : null,
          expenseAccountValue: product.ExpenseAccountRef?.value || null,
          expenseAccountName: product.ExpenseAccountRef?.name || null,
          assetAccountValue: product.AssetAccountRef?.value || null,
          assetAccountName: product.AssetAccountRef?.name || null,
          trackQtyOnHand: product.TrackQtyOnHand ?? null,
          qtyOnHand: product.QtyOnHand ? product.QtyOnHand.toString() : null,
          invStartDate: product.InvStartDate ? new Date(product.InvStartDate) : null,
          domain: product.domain || null,
          sparse: product.sparse ?? null,
          syncToken: product.SyncToken || null,
          metaDataCreateTime,
          metaDataLastUpdatedTime,
        };

        // Check if record exists
        const [existing] = await db
          .select()
          .from(quickbooksProductsModel)
          .where(
            and(
              eq(quickbooksProductsModel.userId, userId),
              eq(quickbooksProductsModel.quickbooksId, quickbooksId),
            ),
          )
          .limit(1);

        if (existing) {
          // Compare updated_at timestamps
          const dbUpdatedAt = existing.metaDataLastUpdatedTime
            ? new Date(existing.metaDataLastUpdatedTime).getTime()
            : 0;
          const qbUpdatedAt = metaDataLastUpdatedTime
            ? metaDataLastUpdatedTime.getTime()
            : 0;

          if (dbUpdatedAt !== qbUpdatedAt) {
            // Update record
            await db
              .update(quickbooksProductsModel)
              .set({
                ...productData,
                updatedAt: new Date(),
              })
              .where(eq(quickbooksProductsModel.id, existing.id));
            updated++;
          } else {
            // Skip - no changes
            skipped++;
          }
        } else {
          // Insert new record
          await db.insert(quickbooksProductsModel).values({
            ...productData,
            createdAt: metaDataCreateTime || new Date(),
            updatedAt: metaDataLastUpdatedTime || new Date(),
          });
          inserted++;
        }
      } catch (error) {
        console.error(`Error syncing product ${product.Id}:`, error);
        // Continue with next product
      }
    }

    return { inserted, updated, skipped };
  }

  // Sync accounts to database
  async syncAccountsToDatabase(
    userId: number,
    accounts: any[],
  ): Promise<{ inserted: number; updated: number; skipped: number }> {
    let inserted = 0;
    let updated = 0;
    let skipped = 0;

    for (const account of accounts) {
      try {
        const quickbooksId = account.Id?.toString() || "";
        if (!quickbooksId) {
          continue;
        }

        // Parse timestamps from QuickBooks MetaData
        const metaDataCreateTime = account.MetaData?.CreateTime
          ? new Date(account.MetaData.CreateTime)
          : null;
        const metaDataLastUpdatedTime = account.MetaData?.LastUpdatedTime
          ? new Date(account.MetaData.LastUpdatedTime)
          : null;

        // Transform account to flat structure
        const accountData = {
          userId,
          quickbooksId,
          name: account.Name || null,
          subAccount: account.SubAccount ?? null,
          parentRefValue: account.ParentRef?.value || null,
          fullyQualifiedName: account.FullyQualifiedName || null,
          active: account.Active ?? null,
          classification: account.Classification || null,
          accountType: account.AccountType || null,
          accountSubType: account.AccountSubType || null,
          currentBalance: account.CurrentBalance
            ? account.CurrentBalance.toString()
            : null,
          currentBalanceWithSubAccounts: account.CurrentBalanceWithSubAccounts
            ? account.CurrentBalanceWithSubAccounts.toString()
            : null,
          currencyRefValue: account.CurrencyRef?.value || null,
          currencyRefName: account.CurrencyRef?.name || null,
          domain: account.domain || null,
          sparse: account.sparse ?? null,
          syncToken: account.SyncToken || null,
          metaDataCreateTime,
          metaDataLastUpdatedTime,
        };

        // Check if record exists
        const [existing] = await db
          .select()
          .from(quickbooksAccountsModel)
          .where(
            and(
              eq(quickbooksAccountsModel.userId, userId),
              eq(quickbooksAccountsModel.quickbooksId, quickbooksId),
            ),
          )
          .limit(1);

        if (existing) {
          // Compare updated_at timestamps
          const dbUpdatedAt = existing.metaDataLastUpdatedTime
            ? new Date(existing.metaDataLastUpdatedTime).getTime()
            : 0;
          const qbUpdatedAt = metaDataLastUpdatedTime
            ? metaDataLastUpdatedTime.getTime()
            : 0;

          if (dbUpdatedAt !== qbUpdatedAt) {
            // Update record
            await db
              .update(quickbooksAccountsModel)
              .set({
                ...accountData,
                updatedAt: new Date(),
              })
              .where(eq(quickbooksAccountsModel.id, existing.id));
            updated++;
          } else {
            // Skip - no changes
            skipped++;
          }
        } else {
          // Insert new record
          await db.insert(quickbooksAccountsModel).values({
            ...accountData,
            createdAt: metaDataCreateTime || new Date(),
            updatedAt: metaDataLastUpdatedTime || new Date(),
          });
          inserted++;
        }
      } catch (error) {
        console.error(`Error syncing account ${account.Id}:`, error);
        // Continue with next account
      }
    }

    return { inserted, updated, skipped };
  }
}

export const quickbooksService = new QuickBooksService();
