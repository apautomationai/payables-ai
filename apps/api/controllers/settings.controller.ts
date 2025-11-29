import { Request, Response } from "express";
import { settingsService } from "@/services/settings.service";
import { BadRequestError, NotFoundError } from "@/helpers/errors";
import { integrationsService } from "@/services/integrations.service";
import { quickbooksService } from "@/services/quickbooks.service";

class SettingsController {
  async getIntegrations(req: Request, res: Response) {
    //@ts-ignore
    const userId = req.user.id;
    const result = await settingsService.getIntegrations(userId);

    try {
      if (result.success) {
        return res.json(result);
      }

      return res.status(result.statusCode).json(result);
    } catch (error) {
      throw error;
    }
  }
  updateStatus = async (req: Request, res: Response) => {
    try {
      //@ts-ignore
      const userId = req.user.id;
      // const userId = 24;
      const { name, status } = req.body;
      if (!userId) {
        throw new NotFoundError("Need a valid userId");
      }
      const response = await integrationsService.updateStatus(userId, {
        name,
        status,
      });
      const result = {
        status: "success",
        data: response,
      };
      return res.status(200).send(result);
    } catch (error: any) {
      const result = {
        status: false,
        data: error.message,
      };
      return result;
    }
  };
  getStartedReadingAt = async (req: Request, res: Response) => {
    try {
      //@ts-ignore
      const userId = req.user.id;
      const name = (req.query.name as string) || "gmail"; // Default to gmail for backward compatibility

      if (!userId) {
        throw new BadRequestError("Need a valid userId");
      }

      // Validate integration name
      const validNames = ["gmail", "outlook", "quickbooks"];
      if (!validNames.includes(name.toLowerCase())) {
        return res.status(400).send({
          status: false,
          data: `Invalid integration name. Must be one of: ${validNames.join(", ")}`,
        });
      }

      const integrations = await integrationsService.getStartedReadingAt(
        userId,
        name.toLowerCase()
      );
      //@ts-ignore
      const readingStartedAt = integrations[0]?.startReading;
      //@ts-ignore
      const lastReadAt = integrations[0]?.lastRead;

      const readings = {
        readingStartedAt,
        lastReadAt,
      };
      const result = {
        status: "success",
        //@ts-ignore
        data: readings,
      };
      return res.status(200).send(result);
    } catch (error: any) {
      return res.status(500).send({
        status: false,
        data: error.message || "Failed to get started reading date",
      });
    }
  };

  async deleteIntegration(req: Request, res: Response) {
    try {
      //@ts-ignore
      const userId = req.user.id;
      const name = req.query.name as string;

      if (!name) {
        return res.status(400).send({
          success: false,
          error: "Integration name is required",
        });
      }

      // Validate integration name
      const validNames = ["gmail", "outlook", "quickbooks"];
      if (!validNames.includes(name.toLowerCase())) {
        return res.status(400).send({
          success: false,
          error: `Invalid integration name. Must be one of: ${validNames.join(", ")}`,
        });
      }

      // Handle QuickBooks-specific disconnect logic if needed
      if (name.toLowerCase() === "quickbooks") {
        await quickbooksService.disconnectIntegration(userId);
        return res.send({
          success: true,
          data: { message: `Successfully disconnected ${name} integration` },
        });
      }

      // For other integrations, use the generic delete method
      const deleted = await integrationsService.deleteIntegration(
        userId,
        name.toLowerCase()
      );
      
      if (!deleted.success) {
        return res.status(404).send({
          success: false,
          //@ts-ignore
          error: deleted.message,
        });
      }

      return res.send({
        success: true,
        //@ts-ignore
        data: deleted.data,
      });
    } catch (error: any) {
      return res.status(500).send({
        success: false,
        message: error.message || "Failed to disconnect integration",
      });
    }
  }
  async updateStartReading(req: Request, res: Response) {
    try {
      //@ts-ignore
      const userId = req.user.id;
      const { name, startReading } = req.body;

      if (!userId) {
        throw new BadRequestError("Need valid userId");
      }

      if (!name) {
        return res.status(400).send({
          success: false,
          message: "Integration name is required",
        });
      }

      // Validate integration name
      const validNames = ["gmail", "outlook", "quickbooks"];
      if (!validNames.includes(name.toLowerCase())) {
        return res.status(400).send({
          success: false,
          message: `Invalid integration name. Must be one of: ${validNames.join(", ")}`,
        });
      }

      if (!startReading) {
        return res.status(400).send({
          success: false,
          message: "Start reading date is required",
        });
      }

      const updateStartReading = await integrationsService.updateStartReading(
        userId,
        name.toLowerCase(),
        startReading
      );
      
      const result = {
        success: true,
        //@ts-ignore
        data: updateStartReading.data,
      };
      return res.send(result);
    } catch (error: any) {
      return res.status(500).send({
        success: false,
        message: error.message || "Failed to update start reading date",
      });
    }
  }


}

export const settingsController = new SettingsController();
