import db from "@/lib/db";
import { integrationsModel } from "@/models/integrations.model";
import { eq } from "drizzle-orm";

class SettingsService {
  async getIntegrations(userId: number) {
    try {
      // Get all integrations from the generic integrations table
      const integrations = await db
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

      // Ensure QuickBooks is included even if not connected
      const hasQuickBooks = integrations.some(integration => integration.name === "quickbooks");

      if (!hasQuickBooks) {
        integrations.push({
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
        data: integrations,
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
