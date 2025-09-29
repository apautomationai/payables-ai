import { BadRequestError, NotFoundError } from "@/helpers/errors";
import db from "@/lib/db";
import { integrationsModel } from "@/models/integrations.model";
import { and, eq } from "drizzle-orm";
interface UpdatedData {
  name: "google";
  status: "success" | "disconnected" | "failed" | "not_connected" | "paused";
}

class IntegrationsService {
  async insertIntegration(data: any) {
    try {
      const [response] = await db
        .insert(integrationsModel)
        .values(data)
        .returning();

      const result = {
        success: true,
        data: response,
      };

      return result;
    } catch (error: any) {
      const result = {
        success: false,
        message: error.message,
      };
      return result;
    }
  }

  async updateIntegration(userId: number, data: any) {
    try {
      data.updatedAt = new Date();
      const updatesData = await db
        .update(integrationsModel)
        .set(data)
        .where(
          // eq(integrationsModel.id, id),
          //@ts-ignore
          eq(integrationsModel.userId, userId)
        )
        .returning();

      const result = {
        success: true,
        data: updatesData,
      };

      return result;
    } catch (error: any) {
      const result = {
        success: false,
        message: error.message,
      };
      return result;
    }
  }

  async getIntegrations(useId: number) {
    try {
      // @ts-ignore
      const integrations = await db
        .select()
        .from(integrationsModel)
        .where(eq(integrationsModel.userId, useId));
      const result = {
        success: true,
        data: integrations,
      };
      return result;
    } catch (error: any) {
      const result = {
        success: false,
        message: error.message,
      };
      return result;
    }
  }

  async checkIntegration(userId: number, name: string) {
    // check if this integration exists for the user

    try {
      const [integration] = await db.select().from(integrationsModel).where(
        eq(integrationsModel.userId, userId),
        //@ts-ignore
        eq(integrationsModel.name, name)
      );
      return integration;
    } catch (error: any) {
      return false;
    }
  }
  updateStatus = async (userId: number, updatedData: UpdatedData) => {
    try {
      const [integration] = await db
        .select()
        .from(integrationsModel)
        .where(
          and(
            eq(integrationsModel.userId, userId),
            eq(integrationsModel.name, updatedData.name)
          )
        );
      if (!integration) {
        throw new NotFoundError("No integration found");
      }
      const response = await db
        .update(integrationsModel)
        .set({ status: updatedData.status, updatedAt: new Date() })
        .where(
          and(
            eq(integrationsModel.userId, userId),
            eq(integrationsModel.name, updatedData.name)
          )
        )
        .returning();
      if (response.length === 0) {
        throw new BadRequestError("Unable to update status");
      }
      return response;
    } catch (error: any) {
      throw new NotFoundError(error.message || "Unable to update status");
    }
  };
}

export const integrationsService = new IntegrationsService();
