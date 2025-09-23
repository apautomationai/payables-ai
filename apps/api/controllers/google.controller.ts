import { Request, Response, NextFunction } from "express";
import * as googleService from "../services/google.services";
import { BadRequestError } from "@/helpers/errors";
import { userServices } from "@/services/users.service";
import { google } from "googleapis";

const oAuth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID!,
  process.env.GOOGLE_CLIENT_SECRET!,
  process.env.GOOGLE_REDIRECT_URI!
);

//@ts-ignore
export const authRedirect = async (req: Request, res: Response) => {
  const url = googleService.generateAuthUrl();
  // res.redirect(url);
  res.json({ url });
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
    console.log(typeof tokens.expiry_date);

    oAuth2Client.setCredentials(tokens);

    const oauth2 = google.oauth2({ version: "v2", auth: oAuth2Client });

    const { data: googleUser } = await oauth2.userinfo.get();

    const updatedUser = await userServices.updateTokens(
      googleUser.email ?? "",
      tokens.refresh_token ?? "",
      tokens.access_token ?? "",
      BigInt(tokens.expiry_date ?? Date.now())
    );

    res.json({
      message: "OAuth successful",
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
      expiry_date: tokens.expiry_date,
      updatedUser,
    });
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
