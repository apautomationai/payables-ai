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
          email: integrationsModel.email,
          providerId: integrationsModel.providerId,
          metadata: integrationsModel.metadata,
        })
        .from(integrationsModel)
        .where(eq(integrationsModel.userId, userId));

      // Transform integrations to extract startReading/lastRead from metadata
      const transformedIntegrations = integrations.map((integration) => {
        const metadata = (integration.metadata as any) || {};
        return {
          ...integration,
          startReading: metadata.startReading || null,
          lastRead: metadata.lastRead || null,
        };
      });

      // Ensure QuickBooks is included even if not connected
      const hasQuickBooks = transformedIntegrations.some(integration => integration.name === "quickbooks");

      if (!hasQuickBooks) {
        transformedIntegrations.push({
          name: "quickbooks",
          status: "not_connected",
          updatedAt: null,
          createdAt: null,
          email: null,
          providerId: null,
          metadata: {},
          startReading: null,
          lastRead: null,
        });
      }

      const result = {
        success: true,
        data: transformedIntegrations,
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
