import db from "@/lib/db";
import { integrationsModel } from "@/models/integrations.model";
import { quickbooksIntegrationsModel } from "@/models/quickbooks.model";
import { eq } from "drizzle-orm";

class SettingsService {
  async getIntegrations(userId: number) {
    try {
      // Get regular integrations (Gmail, Outlook)
      const regularIntegrations = await db
        .select({
          name: integrationsModel.name,
          status: integrationsModel.status,
          updatedAt: integrationsModel.updatedAt,
          createdAt: integrationsModel.createdAt,
          startReading: integrationsModel.startReading,
          lastRead: integrationsModel.lastRead,
        })
        .from(integrationsModel)
        .where(eq(integrationsModel.userId, userId));

      // Get QuickBooks integration
      const quickbooksIntegration = await db
        .select({
          name: quickbooksIntegrationsModel.companyName,
          status: quickbooksIntegrationsModel.isActive,
          updatedAt: quickbooksIntegrationsModel.updatedAt,
          createdAt: quickbooksIntegrationsModel.createdAt,
          startReading: quickbooksIntegrationsModel.lastSyncAt,
          lastRead: quickbooksIntegrationsModel.lastSyncAt,
        })
        .from(quickbooksIntegrationsModel)
        .where(eq(quickbooksIntegrationsModel.userId, userId))
        .limit(1);

      // Format QuickBooks integration to match the expected structure
      const formattedIntegrations = [...regularIntegrations];

      if (quickbooksIntegration.length > 0) {
        const qb = quickbooksIntegration[0];
        formattedIntegrations.push({
          name: "quickbooks",
          status: qb.status ? "success" : "not_connected",
          updatedAt: qb.updatedAt,
          createdAt: qb.createdAt,
          startReading: qb.startReading,
          lastRead: qb.lastRead,
        });
      } else {
        // Add QuickBooks as not connected if no integration exists
        formattedIntegrations.push({
          name: "quickbooks",
          status: "not_connected",
          updatedAt: null,
          createdAt: null,
          startReading: null,
          lastRead: null,
        });
      }

      const result = {
        success: true,
        data: formattedIntegrations,
        timestamp: new Date().toISOString(),
        statusCode: 200,
      };
      return result;
    } catch (error) {
      const result = {
        success: false,
        error: error,
        timestamp: new Date().toISOString(),
        statusCode: 500,
      };
      return result;
    }
  }
}

export const settingsService = new SettingsService();
