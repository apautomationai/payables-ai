import { Request, Response, NextFunction } from "express";
import * as googleService from "../services/google.services";
import { BadRequestError } from "@/helpers/errors";
import { google } from "googleapis";
import { integrationsService } from "@/services/integrations.service";

const oAuth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID!,
  process.env.GOOGLE_CLIENT_SECRET!,
  process.env.GOOGLE_REDIRECT_URI!
);

//@ts-ignore
export const authRedirect = async (req: Request, res: Response) => {
  const url = googleService.generateAuthUrl();
  const token = req.headers.authorization;

  //@ts-ignore
  if (req.token) {
    //@ts-ignore
    res.cookie("token", req.token, { httpOnly: true });
  }

  // res.json({ url });
  res.redirect(url);
};

export const oauthCallback = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const code = req.query.code as string;

    if (!code)
      return res
        .status(400)
        .json({ message: "Authorization code is required" });

    const tokens = await googleService.getTokensFromCode(code);

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
          expiryDate: tokens.expiry_date ? new Date(tokens.expiry_date) : null,
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

export const readEmails = async (req: Request, res: Response) => {
  try {
    //@ts-ignore
    // const id = req.user.id;
    const id = 19;

    const integration = await integrationsService.getIntegrations(id);
    //@ts-ignore
    const integrationInfo = integration.data[0];

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
    const attachments = await googleService.getEmailsWithAttachments(
      tokens,
      id
    );
    const result = {
      status: "success",
      data: attachments,
    };
    return res.send(result);
  } catch (error: any) {
    throw new BadRequestError(error.message || "Unable to get the attachments");
  }
};

// export const getAttachments = async (req: Request, res: Response) => {
//   const userId = 19;
//   if (!userId) {
//     throw new BadRequestError("Need a valid userId");
//   }
//   try {
//     const attachments = await googleService.getAttachments(userId);
//     const result = {
//       status: "success",
//       data: attachments,
//     };
//     res.send(result);
//   } catch (error: any) {
//     throw new BadRequestError(error.message || "Failed to get attachments");
//   }
// };
