import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { BadRequestError } from "./errors";
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

export const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export const uploadBufferToS3 = async (
  buffer: Buffer,
  key: string,
  mimeType: string
) => {
  const command = new PutObjectCommand({
    Bucket: process.env.S3_BUCKET_NAME!,
    Key: key,
    Body: buffer,
    ContentType: mimeType,
  });

  await s3Client.send(command);
  return `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
};

export const generateSignUrl = async (filename: string, mimetype: string) => {
  try {
    const key = `attachments/${Date.now()}-${filename}`;
    const command = new PutObjectCommand({
      Bucket: process.env.S3_BUCKET_NAME,
      Key: key,
      ContentType: mimetype,
    });

    const url = await getSignedUrl(s3Client, command, {
      expiresIn: process.env.UPLOAD_EXPIRY,
    });
    return {
      url,
      key,
      publicUrl: `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION || "us-east-2"}.amazonaws.com/${key}`,
    };
  } catch (error) {
    throw new BadRequestError("failed to generate url");
  }
};
