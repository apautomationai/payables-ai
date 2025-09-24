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
  console.log("From request", req.token);

  if (req.token) {
    res.cookie("token", req.token, { httpOnly: true });
  }

  res.json({ url });
  // res.redirect(url);
};

export const oauthCallback = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const code = req.query.code as string;

    console.log(req.user);

    if (!code)
      return res
        .status(400)
        .json({ message: "Authorization code is required" });

    const tokens = await googleService.getTokensFromCode(code);

    oAuth2Client.setCredentials(tokens);

    let integration;

    //@ts-ignore
    const userId = 1;

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
    // const id = 1;

    // const refreshToken = await integrationsService.getRefreshToken(id);
    // const accessToken = await integrationsService.getAccessToken(id);
    // const timeStampDate = await integrationsService.getExpiryDate(id);
    // const date = new Date(timeStampDate);
    // const expiryDate = date.getTime();
    // console.log(expiryDate)

    // const tokens = {
    //   access_token: refreshToken,
    //   refresh_token: accessToken,
    //   expiry_date: expiryDate,
    // };
    const tokens = req.body;

    if (!tokens) {
      throw new BadRequestError("Need valid tokens");
    }
    const attachments = await googleService.getEmailsWithAttachments(tokens);
    const result = {
      status: "success",
      data: attachments,
    };
    return result;
  } catch (error: any) {
    throw new BadRequestError(error.message || "Unable to get the attachments");
  }
};

// export const getAttachments = async (req: Request, res: Response) => {
//   const { id } = req.body;
//   if (!id) {
//     throw new BadRequestError("Need a valid email");
//   }
//   try {
//     const attachments = await googleService.getAttachments(id);
//     res.status(200).send(attachments);
//   } catch (error: any) {
//     if (error.message) {
//       throw new BadRequestError(error.message);
//     }
//     throw new BadRequestError("`");
//   }
// };
