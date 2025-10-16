export const generateS3PublicUrl = (key: string) => {
    let url = "";
    const baseUrl = process.env.S3_PUBLIC_URL;
    if (baseUrl) {
        url = `${baseUrl}/${key}`;
    } else {
        url = `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
    }
    return url;
}