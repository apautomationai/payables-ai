import { Request, Response } from "express";
import { settingsService } from "@/services/settings.service";
import { NotFoundError } from "@/helpers/errors";
import { integrationsService } from "@/services/integrations.service";

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
}

export const settingsController = new SettingsController();
