// src/services/google.service.ts
import { google } from "googleapis";
import { OAuth2Client, Credentials } from "google-auth-library";

const oAuth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

export const generateAuthUrl = (): string => {
  return oAuth2Client.generateAuthUrl({
    access_type: "offline",
    prompt: "consent",
    scope: [
      "https://www.googleapis.com/auth/gmail.readonly",
      "https://www.googleapis.com/auth/gmail.modify",
    ],
  });
};


export const getTokensFromCode = async (code: string): Promise<Credentials> => {
  const { tokens } = await oAuth2Client.getToken(code);
  return tokens;
};

export const setCredentials = (refreshToken: string): OAuth2Client => {
  oAuth2Client.setCredentials({ refresh_token: refreshToken });
  return oAuth2Client;
};
