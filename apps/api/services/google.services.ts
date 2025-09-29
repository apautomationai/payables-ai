import { google } from "googleapis";
import { Credentials, OAuth2Client } from "google-auth-library";
import { extractEmail, getHeader } from "@/helpers/email-helpers";
import crypto from "crypto";
import { uploadBufferToS3 } from "@/helpers/s3upload";
import db from "@/lib/db";
import { emailAttachmentsModel } from "@/models/emails.model";
import { eq } from "drizzle-orm";
import { BadRequestError } from "@/helpers/errors";
import { integrationsService } from "./integrations.service";

const oAuth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

export class GoogleServices {
  generateAuthUrl = (): string => {
    return oAuth2Client.generateAuthUrl({
      access_type: "offline",
      prompt: "consent",
      scope: [
        "https://www.googleapis.com/auth/gmail.readonly",
        "https://www.googleapis.com/auth/gmail.modify",
        "https://www.googleapis.com/auth/userinfo.email",
      ],
    });
  };

  getTokensFromCode = async (code: string): Promise<Credentials> => {
    const { tokens } = await oAuth2Client.getToken(code);
    return tokens;
  };

  setCredentials = (refreshToken: string): OAuth2Client => {
    oAuth2Client.setCredentials({ refresh_token: refreshToken });

    //@ts-ignore
    return oAuth2Client;
  };

  getOAuthClient = (tokens: any) => {
    const oAuth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI
    );
    oAuth2Client.setCredentials(tokens);
    return oAuth2Client;
  };

  getEmailsWithAttachments = async (tokens: any, userId: number) => {
    try {
      const auth = this.getOAuthClient(tokens);
      const gmail = google.gmail({ version: "v1", auth });

      const res = await gmail.users.messages.list({
        userId: "me",
        q: "has:attachment",
      });

      const messages = res.data.messages || [];
      const results: any[] = [];
      for (const msg of messages) {
        const message = await gmail.users.messages.get({
          userId: "me",
          id: msg.id!,
          format: "full",
        });

        const headers = message.data.payload?.headers || [];
        const sender = extractEmail(getHeader(headers, "from"));
        const receiver = extractEmail(getHeader(headers, "to"));

        const parts = message.data.payload?.parts || [];

        for (const part of parts) {
          if (part.filename && part.body?.attachmentId) {
            const attachment = await gmail.users.messages.attachments.get({
              userId: "me",
              messageId: msg.id!,
              id: part.body.attachmentId,
            });
            const data = attachment.data.data;
            //hash id
            const id = crypto
              .createHash("sha256")
              .update(`${msg.id}-${part.body.attachmentId}`)
              .digest("hex");

            // upload to S3
            const buffer = Buffer.from(data!, "base64url");
            const s3Url = await uploadBufferToS3(
              buffer,
              `attachments/${id}-${part.filename}`,
              part.mimeType || "application/pdf"
            );

            // insert meta data to database
            //@ts-ignore
            await db.insert(emailAttachmentsModel).values({
              id,
              userId,
              emailId: msg.id!,
              filename: part.filename,
              mimeType: part.mimeType || "application/octet-stream",
              sender,
              receiver,
              s3Url,
            });
            await integrationsService.updateIntegration(userId, {
              lastRead: new Date(),
            });

            results.push({
              id,
              emailId: msg.id,
              filename: part.filename,
              mimeType: part.mimeType,
              sender: sender,
              receiver: receiver,
              s3Url: s3Url,
            });
          }
        }
      }
      return results;
    } catch (error) {
      throw error;
    }
  };

  getAttachments = async (userId: number) => {
    try {
      const attachment = await db
        .select()
        .from(emailAttachmentsModel)
        .where(eq(emailAttachmentsModel.userId, userId));

      return attachment;
    } catch (error: any) {
      const result = {
        success: false,
        data: error.message,
      };
      return result;
    }
  };

  getAttachmentWithId = async (id: string) => {
    try {
      const response = await db
        .select()
        .from(emailAttachmentsModel)
        .where(eq(emailAttachmentsModel.id, id));
      return response;
    } catch (error: any) {
      throw new BadRequestError(error.message || "No attachment found");
    }
  };
}
export const googleServices = new GoogleServices();
