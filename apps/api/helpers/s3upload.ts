import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { BadRequestError } from "./errors";
import { config } from "@/lib/config";
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

export const s3Client = new S3Client({
  region: config.s3.region,
  credentials: config.aws.accessKeyId && config.aws.secretAccessKey
    ? {
        accessKeyId: config.aws.accessKeyId,
        secretAccessKey: config.aws.secretAccessKey,
      }
    : undefined, // If not provided, SDK will try to load from default credential chain
});

export const uploadBufferToS3 = async (
  buffer: Buffer,
  key: string,
  mimeType: string
) => {
  const command = new PutObjectCommand({
    Bucket: config.s3.bucketName,
    Key: key,
    Body: buffer,
    ContentType: mimeType,
  });

  await s3Client.send(command);
  if (config.s3.publicUrl) {
    return `${config.s3.publicUrl}/${key}`;
  }
  return `https://${config.s3.bucketName}.s3.${config.s3.region}.amazonaws.com/${key}`;
};

export const generateSignUrl = async (filename: string, mimetype: string) => {
  try {
    const key = `attachments/${Date.now()}-${filename}`;
    const command = new PutObjectCommand({
      Bucket: config.s3.bucketName,
      Key: key,
      ContentType: mimetype,
    });

    const url = await getSignedUrl(s3Client, command, {
      expiresIn: process.env.UPLOAD_EXPIRY,
    });
    let publicUrl = "";
    if (config.s3.publicUrl) {
      publicUrl = `${config.s3.publicUrl}/${key}`;
    } else {
      publicUrl = `https://${config.s3.bucketName}.s3.${config.s3.region}.amazonaws.com/${key}`;
    }
    return {
      url,
      key,
      publicUrl,
    };
  } catch (error) {
    throw new BadRequestError("failed to generate url");
  }
};
