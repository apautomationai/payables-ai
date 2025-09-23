import db from "@/lib/db";
import { integrationsModel } from "@/models/integrations.model";
import { eq } from "drizzle-orm";


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
            }

            return result;
        } catch (error: any) {
            console.log('baler error')
            console.log(error.message)
            const result = {
                success: false,
                message: error.message,
            }
            return result;
        }   
    }

    async updateIntegration(id:number, data:any){
        try{
            data.updatedAt = new Date();
            const updatesData = await db
            .update(integrationsModel)
            .set(data)
            // @ts-ignore
            .where(eq(integrationsModel.id, id))
            .returning();

            console.log('updatesData', updatesData)

            const result = {
                success: true,
                data: updatesData,
            }

            return result;

        }catch(error:any){
            const result = {
                success: false,
                message: error.message,
            }
            return result;
        }
    }

    async getIntegrations(useId:number){
        try {
            // @ts-ignore
            const integrations = await db.select().from(integrationsModel).where(eq(integrationsModel.userId, useId));
            const result = {
                success: true,
                data: integrations,
            }
            return result;
        } catch (error:any) {
            const result = {
                success: false,
                message: error.message,
            }
            return result;
        }
    }

    async checkIntegration(userId:number, name:string){
        // check if this integration exists for the user

        try {
            const [integration] = await db.select().from(integrationsModel).where(eq(integrationsModel.userId, userId), eq(integrationsModel.name, name));
            return integration
        } catch (error:any) {
            return false
        }
    }
    

}

export const integrationsService = new IntegrationsService();