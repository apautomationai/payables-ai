import { Request, Response, NextFunction } from "express";
import * as googleService from "../services/google.services";
import { BadRequestError } from "@/helpers/errors";

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

    res.json({
      message: "OAuth successful",
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
      expiry_date: tokens.expiry_date,
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
