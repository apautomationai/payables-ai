import { Request, Response } from "express";
import { settingsService } from "@/services/settings.service";

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
}

export const settingsController = new SettingsController();
