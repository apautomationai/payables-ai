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
      res.redirect(authUrl);
    } catch (error) {
      next(error);
    }
  };

  // Handle OAuth callback from QuickBooks
  callback = async (
    req: Request,
    res: Response,
    next: NextFunction,
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

      // Redirect to frontend settings page with success
      const frontendUrl = process.env.OAUTH_REDIRECT_URI;
      res.redirect(`${frontendUrl}?quickbooks=success`);
    } catch (error) {
      next(error);
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
        return res.json({
          success: true,
          data: {
            connected: false,
            status: "not_connected",
          },
        });
      }

      return res.json({
        success: true,
        data: {
          connected: true,
          status: "success",
          companyName: integration.companyName,
          connectedAt: integration.createdAt,
          lastSync: integration.lastSyncAt,
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

      return res.json({
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

      return res.json({
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

      return res.json({
        success: true,
        data: vendors,
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

      return res.json({
        success: true,
        data: invoices,
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
