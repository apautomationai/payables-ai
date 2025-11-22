import { Request, Response } from "express";
import { settingsService } from "@/services/settings.service";
import { BadRequestError, NotFoundError } from "@/helpers/errors";
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
  getStartedReadingAt = async (req: Request, res: Response) => {
    try {
      //@ts-ignore
      const userId = req.user.id;
      // const userId = 24;
      const name = "gmail";

      if (!userId) {
        throw new BadRequestError("Need a valid userId");
      }

      const integrations = await integrationsService.getStartedReadingAt(
        userId,
        name
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
      const result = {
        status: false,
        data: error.message,
      };
      return result;
    }
  };

  async deleteIntegration(req: Request, res: Response) {
    try {
      //@ts-ignore
      const userId = req.user.id;
      // const userId = 33;
      const deleted = await integrationsService.deleteIntegration(
        userId,
        "gmail"
      );
      if (!deleted.success) {
        return res.send({
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
      const result = {
        success: false,
        message: error.message,
      };
      return result;
    }
  }
  async updateStartReading(req: Request, res: Response) {
    try {
      //@ts-ignore
      const userId = req.user.id;
      const { startReading } = req.body;
      // const userId = 33;
      if (!userId) {
        throw new BadRequestError("Need valid userId");
      }
      console.log("startReading from controller", startReading);
      const updateStartReading = await integrationsService.updateStartReading(
        userId,
        "gmail",
        startReading
      );
      const result = {
        success: true,
        //@ts-ignore
        data: updateStartReading.data,
      };
      return res.send(result);
    } catch (error: any) {
      const result = {
        success: false,
        message: error.message,
      };
      return res.send(result);
    }
  }


}

export const settingsController = new SettingsController();
