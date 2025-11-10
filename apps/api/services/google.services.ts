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
      return {
        success: false,
        message: "No last read date",
        data: null,
      };
    }
    const startDate = new Date(lastRead);
    if (isNaN(startDate.getTime())) {
      return {
        success: false,
        message: "Invalid start date",
        data: null,
      };
    }
    const metadata = {
      lastReadUsed: startDate.toISOString(),
      totalMessages: 0,
      processedMessages: 0,
      totalAttachments: 0,
      storedAttachments: 0,
      duplicatesSkipped: 0,
      failures: 0,
      lastProcessedMessageId: null as string | null,
      errors: [] as {
        stage: string;
        messageId?: string;
        filename?: string | null;
        error: string;
        stack?: string;
      }[],
    };
    const results: any[] = [];
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
      metadata.totalMessages = messages.length;

      for (const msg of messages) {
        metadata.processedMessages++;
        metadata.lastProcessedMessageId = msg.id || null;
        try {
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
            if (!part.filename || !part.body?.attachmentId) {
              continue;
            }
            metadata.totalAttachments++;
            try {
              const emailAttachment = await gmail.users.messages.attachments.get({
                userId: "me",
                messageId: msg.id!,
                id: part.body.attachmentId,
              });
              const data = emailAttachment.data.data;
              if (!data) {
                throw new Error("Attachment payload missing");
              }
              const partInfo = `${msg.id}-${part.filename}-${part.mimeType}-${part.body?.size}`;
              const hashId = crypto
                .createHash("sha256")
                .update(partInfo)
                .digest("hex");

              const isExists = await googleServices.getAttachmentWithId(hashId);
              if (isExists.length > 0) {
                metadata.duplicatesSkipped++;
                continue;
              }

              const buffer = Buffer.from(data, "base64url");
              const key = `attachments/${hashId}-${part.filename}`;
              const s3Url = await uploadBufferToS3(
                buffer,
                key,
                part.mimeType || "application/pdf"
              );
              const s3Key = s3Url!.split(".amazonaws.com/")[1];
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
                sender,
                receiver,
                fileUrl: s3Url,
                fileKey: s3Key,
                provider: "gmail",
              });
              metadata.storedAttachments++;
            } catch (partError: any) {
              metadata.failures++;
              metadata.errors.push({
                stage: "attachment",
                messageId: msg.id || undefined,
                filename: part.filename || null,
                error:
                  partError?.message || "Failed to process attachment",
                stack:
                  process.env.NODE_ENV === "development"
                    ? partError?.stack
                    : undefined,
              });
            }
          }

          try {
            await integrationsService.updateIntegration(integrationId, {
              lastRead: new Date(),
            });
          } catch (integrationError: any) {
            metadata.errors.push({
              stage: "updateIntegration",
              messageId: msg.id || undefined,
              error:
                integrationError?.message ||
                "Failed to update integration lastRead",
              stack:
                process.env.NODE_ENV === "development"
                  ? integrationError?.stack
                  : undefined,
            });
          }
        } catch (messageError: any) {
          metadata.failures++;
          metadata.errors.push({
            stage: "message",
            messageId: msg.id || undefined,
            error: messageError?.message || "Failed to fetch message",
            stack:
              process.env.NODE_ENV === "development"
                ? messageError?.stack
                : undefined,
          });
          continue;
        }
      }

      const hasErrors = metadata.errors.length > 0;
      const hasSuccess = metadata.storedAttachments > 0;
      const message =
        hasSuccess && hasErrors
          ? "Attachments synced with partial errors"
          : hasSuccess
          ? "Emails synced successfully"
          : hasErrors
          ? "Unable to sync emails"
          : "No new emails found";

      return {
        success: hasSuccess || (!hasSuccess && !hasErrors && metadata.duplicatesSkipped > 0),
        message,
        data: results,
        metadata,
      };
    } catch (error: any) {
      metadata.failures++;
      metadata.errors.push({
        stage: "listMessages",
        error: error?.message || "Failed to list messages",
        stack:
          process.env.NODE_ENV === "development" ? error?.stack : undefined,
      });
      return {
        success: false,
        message: error instanceof Error ? error.message : "An unknown error occurred",
        data: [],
        metadata,
      };
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
      return { attachments, totalAttachments };
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
