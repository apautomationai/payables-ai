import db from "@/lib/db";
import { integrationsModel } from "@/models/integrations.model";
import { eq } from "drizzle-orm";

class SettingsService {
  async getIntegrations(userId: number) {
    try {
      const response = await db
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

      const result = {
        success: true,
        data: response,
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
