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
  res.redirect(url);
  // res.json({ url });
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

    // const oauth2 = google.oauth2({ version: "v2", auth: oAuth2Client });

    // const { data } = await oauth2.userinfo.get();

    // console.log('google user', data);
    // console.log('tokens', tokens);

    let integration;
    const userId = 3
    try {
      const existingIntegration = await integrationsService.checkIntegration(userId, 'gmail')

      if(!existingIntegration){
        integration = await integrationsService.insertIntegration({
            userId: userId,
            name: "gmail",
            status: "success",
            accessToken: tokens.access_token,
            refreshToken: tokens.refresh_token,
            tokenType: tokens.token_type,
            expiryDate: tokens.expiry_date ? new Date(tokens.expiry_date) : null,
        });

        if(!integration.success){
          // @ts-ignore
          throw new Error(integration?.message);
        }
      } else{
        integration = await integrationsService.updateIntegration(existingIntegration.id, {
            accessToken: tokens.access_token,
            refreshToken: tokens.refresh_token,
            tokenType: tokens.token_type,
            expiryDate: tokens.expiry_date ? new Date(tokens.expiry_date) : null,
        });
      }
    } catch (error:any) {
      throw new Error(error.message);
    }

    const REDIRECT_URI = new URL(process.env.OAUTH_REDIRECT_URI!)
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
    const tokens = req.body.tokens;

    if (!tokens) {
      throw new BadRequestError("Need valid tokens");
    }
    const attachments = await googleService.getEmailsWithAttachments(tokens);
    res.status(200).send(attachments);
  } catch (error: any) {
    throw new BadRequestError(error.message || "Unable to get the attachments");
  }
};

export const getAttachments = async (req: Request, res: Response) => {
  const { email } = req.body;
  if (!email) {
    throw new BadRequestError("Need a valid email");
  }
  try {
    const attachments = await googleService.getAttachments(email);
    res.status(200).send(attachments);
  } catch (error: any) {
    if (error.message) {
      throw new BadRequestError(error.message);
    }
    throw new BadRequestError("`");
  }
};
