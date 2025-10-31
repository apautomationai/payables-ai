import { google } from "googleapis";
import { Credentials, OAuth2Client } from "google-auth-library";
import { extractEmail, getHeader } from "@/helpers/email-helpers";
import crypto from "crypto";
import { uploadBufferToS3 } from "@/helpers/s3upload";
import db from "@/lib/db";
import { attachmentsModel } from "@/models/attachments.model";
import { count, desc, eq } from "drizzle-orm";
import { BadRequestError } from "@/helpers/errors";
import { integrationsService } from "./integrations.service";
import { sendAttachmentMessage } from "@/helpers/sqs";

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

  getEmailsWithAttachments = async (
    tokens: any,
    userId: number,
    integrationId: number,
    lastRead?: string | null | undefined
  ) => {
    if (!lastRead) {
      return
    }
    const startDate = new Date(lastRead);
    if (isNaN(startDate.getTime())) {
      return
    }
    try {
      const auth = this.getOAuthClient(tokens);
      const gmail = google.gmail({ version: "v1", auth });
      const afterTimestamp = Math.floor(startDate.getTime() / 1000);
      
      const query = `invoice has:attachment label:INBOX after:${afterTimestamp}`;
      const res = await gmail.users.messages.list({
        userId: "me",
        q: query,
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
            const emailAttachment = await gmail.users.messages.attachments.get({
              userId: "me",
              messageId: msg.id!,
              id: part.body.attachmentId,
            });
            const data = emailAttachment.data.data;
            //hash id
            const partInfo = `${msg.id}-${part.filename}-${part.mimeType}-${part.body?.size}`;
            const hashId = crypto
              .createHash("sha256")
              .update(partInfo)
              .digest("hex");

            const isExists = await googleServices.getAttachmentWithId(hashId);
            if (isExists.length > 0) {
              console.info('Email invoiceattachment already exists');
              continue;
            }
            // upload to S3
            const buffer = Buffer.from(data!, "base64url");
            const key = `attachments/${hashId}-${part.filename}`;
            const s3Url = await uploadBufferToS3(
              buffer,
              key,
              part.mimeType || "application/pdf"
            );
            const s3Key = s3Url!.split(".amazonaws.com/")[1];
            // insert meta data to database
            //@ts-ignore
            const [attachmentInfo] = await db.insert(attachmentsModel).values({
              hashId,
              userId,
              emailId: msg.id!,
              filename: part.filename,
              mimeType: part.mimeType || "application/octet-stream",
              sender,
              receiver,
              provider: "gmail",
              fileUrl: s3Url,
              fileKey: s3Key,
            }).returning();

            if (attachmentInfo.id) {
              await sendAttachmentMessage(attachmentInfo.id);
            }

            results.push({
              hashId,
              emailId: msg.id,
              filename: part.filename,
              mimeType: part.mimeType,
              sender: sender,
              receiver: receiver,
              fileUrl: s3Url,
              fileKey: s3Key,
              provider: "gmail",
            });
          }
        }

        // update last read
        // await integrationsService.updateIntegration(integrationId, {
        //   lastRead: new Date(),
        // });
      }
      return results;
    } catch (error) {
      throw error;
    }
  };

  getAttachments = async (userId: number, page: number, limit: number) => {
    const offset = (page - 1) * limit;
    try {
      const attachments = await db
        .select()
        .from(attachmentsModel)
        .where(eq(attachmentsModel.userId, userId))
        .orderBy(desc(attachmentsModel.created_at))
        .limit(limit)
        .offset(offset);
      const [attachmentCount] = await db
        .select({ count: count() })
        .from(attachmentsModel)
        .where(eq(attachmentsModel.userId, userId));
      const totalAttachments = attachmentCount.count;
      return {attachments, totalAttachments};
    } catch (error: any) {
      const result = {
        success: false,
        data: error.message,
      };
      return result;
    }
  };
  getAttachmentWithId = async (hashId: string) => {
    try {
      const response = await db
        .select()
        .from(attachmentsModel)
        .where(eq(attachmentsModel.hashId, hashId));
      return response;
    } catch (error: any) {
      throw new BadRequestError(error.message || "No attachment found");
    }
  };
}
export const googleServices = new GoogleServices();
