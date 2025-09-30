import { Request, Response, NextFunction } from "express";
import { BadRequestError, NotFoundError } from "@/helpers/errors";
import { google } from "googleapis";
import { integrationsService } from "@/services/integrations.service";
import { googleServices } from "@/services/google.services";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { s3Client } from "@/helpers/s3upload";
import { streamToBuffer } from "@/lib/utils/steamToBuffer";

const oAuth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID!,
  process.env.GOOGLE_CLIENT_SECRET!,
  process.env.GOOGLE_REDIRECT_URI!
);

export class GoogleController {
  //@ts-ignore
  authRedirect = async (req: Request, res: Response) => {
    const url = googleServices.generateAuthUrl();
    // const token = req.headers.authorization;

    //@ts-ignore
    if (req.token) {
      //@ts-ignore
      res.cookie("token", req.token, { httpOnly: true });
    }

    // res.json({ url });
    res.redirect(url);
  };

  oauthCallback = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const code = req.query.code as string;

      if (!code)
        return res
          .status(400)
          .json({ message: "Authorization code is required" });

      const tokens = await googleServices.getTokensFromCode(code);

      oAuth2Client.setCredentials(tokens);

      let integration;

      //@ts-ignore
      const userId = req.user.id;

      try {
        const existingIntegration = await integrationsService.checkIntegration(
          userId,
          "gmail"
        );

        if (!existingIntegration) {
          integration = await integrationsService.insertIntegration({
            userId: userId,
            name: "gmail",
            status: "success",
            accessToken: tokens.access_token,
            refreshToken: tokens.refresh_token,
            tokenType: tokens.token_type,
            expiryDate: tokens.expiry_date
              ? new Date(tokens.expiry_date)
              : null,
          });

          if (!integration.success) {
            // @ts-ignore
            throw new Error(integration?.message);
          }
        } else {
          integration = await integrationsService.updateIntegration(
            existingIntegration.id,
            {
              accessToken: tokens.access_token,
              refreshToken: tokens.refresh_token,
              tokenType: tokens.token_type,
              expiryDate: tokens.expiry_date
                ? new Date(tokens.expiry_date)
                : null,
            }
          );
        }
      } catch (error: any) {
        throw new Error(error.message);
      }

      const REDIRECT_URI = new URL(process.env.OAUTH_REDIRECT_URI!);
      REDIRECT_URI.searchParams.set("type", "integration.gmail");
      REDIRECT_URI.searchParams.set("message", "Gmail successfully integrated");
      res.redirect(REDIRECT_URI.toString());
      // res.json({
      //   message: "OAuth successful",
      //   access_token: tokens.access_token,
      //   refresh_token: tokens.refresh_token,
      //   expiry_date: tokens.expiry_date,
      // });
    } catch (error) {
      return next(error);
    }
  };

  readEmails = async (req: Request, res: Response) => {
    try {
      //@ts-ignore
      const userId = req.user.id;
      // const userId = 24;

      if (!userId) {
        throw new BadRequestError("Need a valid userId");
      }

      const integration = await integrationsService.getIntegrations(userId);

      if (
        //@ts-ignore
        !integration?.data ||
        //@ts-ignore
        integration.data.length === 0
      ) {
        throw new NotFoundError("No integrations found for this user");
      }
      //@ts-ignore
      const integrationInfo = integration?.data[0];
      if (
        integrationInfo.name !== "gmail" ||
        integrationInfo.status !== "success"
      ) {
        throw new NotFoundError("Gmail isn't connected");
      }

      const timeStampDate = integrationInfo.expiryDate;
      if (!timeStampDate) {
        throw new Error("No expiry date found in database");
      }
      const date = new Date(timeStampDate);
      const expiryDate = date.getTime();

      const tokens = {
        access_token: integrationInfo.accessToken,
        refresh_token: integrationInfo.refreshToken,
        token_type: integrationInfo.tokenType,
        expiry_date: expiryDate,
      };

      if (!tokens) {
        throw new BadRequestError("Need valid tokens");
      }
      const attachments = await googleServices.getEmailsWithAttachments(
        tokens,
        userId
      );
      const result = {
        status: "success",
        data: attachments,
      };
      return res.status(200).send(result);
    } catch (error: any) {
      throw new BadRequestError(
        error.message || "Unable to get the attachments"
      );
    }
  };

  getAttachments = async (req: Request, res: Response) => {
    //@ts-ignore
    const userId = req.user.id;
    // const userId = 24;
    if (!userId) {
      throw new BadRequestError("Need a valid userId");
    }
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    try {
      const integration = await integrationsService.getIntegrations(userId);

      //@ts-ignore
      if (!integration?.data || integration.data.length === 0) {
        throw new NotFoundError("No integrations found for this user");
      }
      const attachmentsData = await googleServices.getAttachments(
        userId,
        page,
        limit
      );
      const result = {
        status: "success",
        data: {
          //@ts-ignore
          attachments: attachmentsData[0],
          pagination: {
            //@ts-ignore
            totalAttachments: attachmentsData[1] || 0,
            page,
            limit,
            //@ts-ignore
            totalPages: Math.ceil((attachmentsData[1] || 0) / limit),
          },
        },
      };
      res.status(200).send(result);
    } catch (error: any) {
      throw new BadRequestError(error.message || "Failed to get attachments");
    }
  };

  getAttachmentWithId = async (req: Request, res: Response) => {
    try {
      const id = req.params.id;
      if (!id) {
        throw new BadRequestError("No id found");
      }
      const response = await googleServices.getAttachmentWithId(id);
      const att = response[0];
      //convert s3Url to attachment
      const s3Key = att.s3Url!.split(".amazonaws.com/")[1];
      const command = new GetObjectCommand({
        Bucket: process.env.S3_BUCKET_NAME!,
        Key: s3Key,
      });
      const s3Object = await s3Client.send(command);
      //@ts-ignore
      const buffer = s3Object.Body ? await streamToBuffer(s3Object.Body) : null;
      const fileData = buffer?.toString("base64") || null;
      const result = {
        status: "success",
        data: {
          ...att,
          fileData,
        },
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

export const googleController = new GoogleController();
