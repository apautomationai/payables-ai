import { Request, Response, NextFunction } from "express";
import { quickbooksService } from "@/services/quickbooks.service";
import { BadRequestError, NotFoundError } from "@/helpers/errors";

export class QuickBooksController {
  // Initiate QuickBooks OAuth flow
  auth = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      // @ts-ignore - user is added by auth middleware
      const userId = req.user?.id;

      if (!userId) {
        throw new BadRequestError("User not authenticated");
      }

      // Generate state parameter for security
      const state = Buffer.from(JSON.stringify({ userId })).toString("base64");

      const authUrl = quickbooksService.generateAuthUrl(state);

      // Redirect to QuickBooks authorization page
      res.json({ url: authUrl });
      // res.redirect(authUrl);
    } catch (error) {
      next(error);
    }
  };

  // Handle OAuth callback from QuickBooks
  callback = async (
    req: Request,
    res: Response,
    _next: NextFunction,
  ): Promise<void> => {
    try {
      const { code, realmId, state, error } = req.query;

      if (error) {
        throw new BadRequestError(`QuickBooks authorization error: ${error}`);
      }

      if (!code || !realmId) {
        throw new BadRequestError("Missing authorization code or realm ID");
      }

      // Verify state parameter
      let userId: number;
      try {
        const stateData = JSON.parse(
          Buffer.from(state as string, "base64").toString(),
        );
        userId = stateData.userId;
      } catch {
        throw new BadRequestError("Invalid state parameter");
      }

      // Exchange code for tokens
      const tokenData = await quickbooksService.exchangeCodeForTokens(
        code as string,
        realmId as string,
      );

      // Save integration to database
      const integration = await quickbooksService.saveIntegration(
        userId,
        tokenData,
      );

      // Get company info for display
      try {
        const companyInfo = await quickbooksService.getCompanyInfo(integration);
        console.log("Connected to QuickBooks company:", companyInfo);
      } catch (error) {
        console.warn("Could not fetch company info:", error);
      }

      // Redirect to frontend integrations page with success
      const frontendUrl = process.env.FRONTEND_URL || process.env.OAUTH_REDIRECT_URI || 'http://localhost:3000';
      const redirectUrl = `${frontendUrl}/integrations?message=QuickBooks connected successfully&type=success`;
      res.redirect(redirectUrl);
    } catch (error: any) {
      // Redirect to frontend integrations page with error
      const frontendUrl = process.env.FRONTEND_URL || process.env.OAUTH_REDIRECT_URI || 'http://localhost:3000';
      const errorMessage = error.message || "Failed to connect QuickBooks";
      const redirectUrl = `${frontendUrl}/integrations?message=${encodeURIComponent(errorMessage)}&type=error`;
      res.redirect(redirectUrl);
    }
  };

  // Get integration status
  // @ts-ignore
  getStatus = async (req: Request, res: Response, next: NextFunction) => {
    try {
      // @ts-ignore - user is added by auth middleware
      const userId = req.user?.id;

      if (!userId) {
        throw new BadRequestError("User not authenticated");
      }

      const integration = await quickbooksService.getUserIntegration(userId);

      if (!integration) {
        res.json({
          success: true,
          data: {
            connected: false,
            status: "not_connected",
          },
        });
        return;
      }

      res.json({
        success: true,
        data: {
          connected: true,
          status: "success",
          companyName: integration.metadata?.companyName || "Unknown Company",
          connectedAt: integration.createdAt,
          lastSync: integration.metadata?.lastSyncAt,
        },
      });
    } catch (error) {
      next(error);
    }
  };

  // Get company information
  // @ts-ignore
  getCompanyInfo = async (req: Request, res: Response, next: NextFunction) => {
    try {
      // @ts-ignore - user is added by auth middleware
      const userId = req.user?.id;

      if (!userId) {
        throw new BadRequestError("User not authenticated");
      }

      const integration = await quickbooksService.getUserIntegration(userId);

      if (!integration) {
        throw new NotFoundError("QuickBooks integration not found");
      }

      const companyInfo = await quickbooksService.getCompanyInfo(integration);

      res.json({
        success: true,
        data: companyInfo,
      });
    } catch (error) {
      next(error);
    }
  };

  // Get customers
  // @ts-ignore
  getCustomers = async (req: Request, res: Response, next: NextFunction) => {
    try {
      // @ts-ignore - user is added by auth middleware
      const userId = req.user?.id;

      if (!userId) {
        throw new BadRequestError("User not authenticated");
      }

      const integration = await quickbooksService.getUserIntegration(userId);

      if (!integration) {
        throw new NotFoundError("QuickBooks integration not found");
      }

      const customers = await quickbooksService.getCustomers(integration);

      res.json({
        success: true,
        data: customers,
      });
    } catch (error) {
      next(error);
    }
  };

  // Get vendors
  // @ts-ignore
  getVendors = async (req: Request, res: Response, next: NextFunction) => {
    try {
      // @ts-ignore - user is added by auth middleware
      const userId = req.user?.id;

      if (!userId) {
        throw new BadRequestError("User not authenticated");
      }

      const integration = await quickbooksService.getUserIntegration(userId);

      if (!integration) {
        throw new NotFoundError("QuickBooks integration not found");
      }

      const vendors = await quickbooksService.getVendors(integration);

      res.json({
        success: true,
        data: vendors,
      });
    } catch (error) {
      next(error);
    }
  };

  // Get vendors
  getAccounts = async (req: Request, res: Response, next: NextFunction) => {
    try {
      // @ts-ignore - user is added by auth middleware
      const userId = req.user?.id;

      if (!userId) {
        throw new BadRequestError("User not authenticated");
      }

      const integration = await quickbooksService.getUserIntegration(userId);

      if (!integration) {
        throw new NotFoundError("QuickBooks integration not found");
      }

      const accounts = await quickbooksService.getAccounts(integration);

      res.json({
        success: true,
        data: accounts,
      });
    } catch (error) {
      next(error);
    }
  };

  // Get invoices
  // @ts-ignore
  getInvoices = async (req: Request, res: Response, next: NextFunction) => {
    try {
      // @ts-ignore - user is added by auth middleware
      const userId = req.user?.id;

      if (!userId) {
        throw new BadRequestError("User not authenticated");
      }

      const integration = await quickbooksService.getUserIntegration(userId);

      if (!integration) {
        throw new NotFoundError("QuickBooks integration not found");
      }

      const invoices = await quickbooksService.getInvoices(integration);

      res.json({
        success: true,
        data: invoices,
      });
    } catch (error) {
      next(error);
    }
  };

  // Get line items
  getLineItems = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // @ts-ignore - user is added by auth middleware
      const userId = req.user?.id;

      if (!userId) {
        throw new BadRequestError("User not authenticated");
      }

      const integration = await quickbooksService.getUserIntegration(userId);

      if (!integration) {
        throw new NotFoundError("QuickBooks integration not found");
      }

      const lineItems = await quickbooksService.getLineItems(integration);

      res.json({
        success: true,
        data: lineItems,
      });
    } catch (error) {
      next(error);
    }
  };

  // Get specific invoice line items
  getInvoiceLineItems = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // @ts-ignore - user is added by auth middleware
      const userId = req.user?.id;
      const { invoiceId } = req.params;

      if (!userId) {
        throw new BadRequestError("User not authenticated");
      }

      if (!invoiceId) {
        throw new BadRequestError("Invoice ID is required");
      }

      const integration = await quickbooksService.getUserIntegration(userId);

      if (!integration) {
        throw new NotFoundError("QuickBooks integration not found");
      }

      const invoiceLineItems = await quickbooksService.getInvoiceLineItems(integration, invoiceId);

      res.json({
        success: true,
        data: invoiceLineItems,
      });
    } catch (error) {
      next(error);
    }
  };

  // Vector search for items
  searchItems = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // @ts-ignore - user is added by auth middleware
      const userId = req.user?.id;
      const { searchTerm } = req.query;

      if (!userId) {
        throw new BadRequestError("User not authenticated");
      }

      if (!searchTerm) {
        throw new BadRequestError("Search term is required");
      }

      const integration = await quickbooksService.getUserIntegration(userId);

      if (!integration) {
        throw new NotFoundError("QuickBooks integration not found");
      }

      // Get all items first
      const allItemsResponse = await quickbooksService.getLineItems(integration);
      const items = allItemsResponse?.QueryResponse?.Item || [];

      // Perform vector search
      const searchResults = quickbooksService.vectorSearchItems(searchTerm as string, items);

      res.json({
        success: true,
        data: {
          searchTerm,
          totalResults: searchResults.length,
          results: searchResults,
        },
      });
    } catch (error) {
      next(error);
    }
  };

  // Hierarchical vendor search: email → phone → address → name
  hierarchicalVendorSearch = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // @ts-ignore - user is added by auth middleware
      const userId = req.user?.id;
      const { email, phone, address, name } = req.query;

      if (!userId) {
        throw new BadRequestError("User not authenticated");
      }

      if (!email && !phone && !address && !name) {
        throw new BadRequestError("At least one search parameter (email, phone, address, or name) is required");
      }

      const integration = await quickbooksService.getUserIntegration(userId);

      if (!integration) {
        throw new NotFoundError("QuickBooks integration not found");
      }

      // Get all vendors first
      const allVendorsResponse = await quickbooksService.getVendors(integration);
      const vendors = allVendorsResponse?.QueryResponse?.Vendor || [];

      // Perform hierarchical search
      const searchResult = quickbooksService.hierarchicalVendorSearch({
        email: email as string,
        phone: phone as string,
        address: address as string,
        name: name as string,
      }, vendors);

      res.json({
        success: true,
        data: {
          vendor: searchResult.vendor,
          matchType: searchResult.matchType,
          found: searchResult.vendor !== null,
        },
      });
    } catch (error) {
      next(error);
    }
  };

  // Vector search for vendors
  searchVendors = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // @ts-ignore - user is added by auth middleware
      const userId = req.user?.id;
      const { searchTerm } = req.query;

      if (!userId) {
        throw new BadRequestError("User not authenticated");
      }

      if (!searchTerm) {
        throw new BadRequestError("Search term is required");
      }

      const integration = await quickbooksService.getUserIntegration(userId);

      if (!integration) {
        throw new NotFoundError("QuickBooks integration not found");
      }

      // Get all vendors first
      const allVendorsResponse = await quickbooksService.getVendors(integration);
      const vendors = allVendorsResponse?.QueryResponse?.Vendor || [];

      // Perform vector search
      const searchResults = quickbooksService.vectorSearchVendors(searchTerm as string, vendors);

      res.json({
        success: true,
        data: {
          searchTerm,
          totalResults: searchResults.length,
          results: searchResults,
        },
      });
    } catch (error) {
      next(error);
    }
  };

  // Vector search for customers
  searchCustomers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // @ts-ignore - user is added by auth middleware
      const userId = req.user?.id;
      const { searchTerm } = req.query;

      if (!userId) {
        throw new BadRequestError("User not authenticated");
      }

      if (!searchTerm) {
        throw new BadRequestError("Search term is required");
      }

      const integration = await quickbooksService.getUserIntegration(userId);

      if (!integration) {
        throw new NotFoundError("QuickBooks integration not found");
      }

      // Get all customers first
      const allCustomersResponse = await quickbooksService.getCustomers(integration);
      const customers = allCustomersResponse?.QueryResponse?.Customer || [];

      // Perform vector search
      const searchResults = quickbooksService.vectorSearchCustomers(searchTerm as string, customers);

      res.json({
        success: true,
        data: {
          searchTerm,
          totalResults: searchResults.length,
          results: searchResults,
        },
      });
    } catch (error) {
      next(error);
    }
  };

  // Create customer in QuickBooks
  createCustomer = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // @ts-ignore - user is added by auth middleware
      const userId = req.user?.id;
      const { name } = req.body;

      if (!userId) {
        throw new BadRequestError("User not authenticated");
      }

      if (!name) {
        throw new BadRequestError("Customer name is required");
      }

      const integration = await quickbooksService.getUserIntegration(userId);

      if (!integration) {
        throw new NotFoundError("QuickBooks integration not found");
      }

      const newCustomer = await quickbooksService.createCustomer(integration, {
        name,
      });

      res.json({
        success: true,
        data: newCustomer,
      });
    } catch (error) {
      next(error);
    }
  };

  // Create new item in QuickBooks
  createItem = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // @ts-ignore - user is added by auth middleware
      const userId = req.user?.id;
      const { name, description, unitPrice, type, lineItemData } = req.body;

      if (!userId) {
        throw new BadRequestError("User not authenticated");
      }

      if (!name) {
        throw new BadRequestError("Item name is required");
      }

      const integration = await quickbooksService.getUserIntegration(userId);

      if (!integration) {
        throw new NotFoundError("QuickBooks integration not found");
      }

      const newItem = await quickbooksService.createItem(integration, {
        name,
        description,
        unitPrice,
        type,
      }, lineItemData);

      res.json({
        success: true,
        data: newItem,
      });
    } catch (error) {
      next(error);
    }
  };

  // Create vendor in QuickBooks
  createVendor = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // @ts-ignore - user is added by auth middleware
      const userId = req.user?.id;
      const { name, email, phone, address } = req.body;

      if (!userId) {
        throw new BadRequestError("User not authenticated");
      }

      if (!name) {
        throw new BadRequestError("Vendor name is required");
      }

      const integration = await quickbooksService.getUserIntegration(userId);

      if (!integration) {
        throw new NotFoundError("QuickBooks integration not found");
      }

      const newVendor = await quickbooksService.createVendor(integration, {
        name,
        email,
        phone,
        address,
      });

      res.json({
        success: true,
        data: newVendor,
      });
    } catch (error) {
      next(error);
    }
  };

  // Create bill in QuickBooks
  createBill = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // @ts-ignore - user is added by auth middleware
      const userId = req.user?.id;
      const { vendorId, lineItems, totalAmount, totalTax, dueDate, invoiceDate, discountAmount, discountDescription } = req.body;

      if (!userId) {
        throw new BadRequestError("User not authenticated");
      }

      if (!vendorId || !lineItems) {
        throw new BadRequestError("Vendor ID and line items are required");
      }

      const integration = await quickbooksService.getUserIntegration(userId);

      if (!integration) {
        throw new NotFoundError("QuickBooks integration not found");
      }

      const newBill = await quickbooksService.createBill(integration, {
        vendorId,
        lineItems,
        totalAmount,
        totalTax,
        dueDate,
        invoiceDate,
        discountAmount,
        discountDescription,
      });

      res.json({
        success: true,
        data: newBill,
      });
    } catch (error) {
      next(error);
    }
  };

  // Disconnect QuickBooks integration
  disconnect = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      // @ts-ignore - user is added by auth middleware
      const userId = req.user?.id;

      if (!userId) {
        throw new BadRequestError("User not authenticated");
      }

      await quickbooksService.disconnectIntegration(userId);

      res.json({
        success: true,
        message: "QuickBooks integration disconnected successfully",
      });
    } catch (error) {
      next(error);
    }
  };
}

export const quickbooksController = new QuickBooksController();
