import { Request, Response } from 'express';
import { settingsService } from "@/services/settings.service";

class SettingsController {

    async getIntegrations(req: Request, res: Response) {
        const userId = 3;
        const result = await settingsService.getIntegrations(userId);

       try {
         if (result.success) {
             res.json(result);
         }
 
         res.status(result.statusCode).json(result);
       } catch (error) {
        throw error;
       }
    }
}

export const settingsController = new SettingsController();
