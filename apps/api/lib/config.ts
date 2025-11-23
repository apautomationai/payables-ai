import dotenv from "dotenv";
dotenv.config();


enum LogLevels {
    info = 'info',
    debug = 'debug',
    warn = 'warn',
    error = 'error',
    trace = 'trace',
    fatal = 'fatal',
}

interface Config {
    env: string;
    port: number;
    logLevel: LogLevels;
    database: {
        url: string;
    };
    aws: {
        accessKeyId?: string;
        secretAccessKey?: string;
    };
    sqs: {
        queueUrl: string;
        region: string;
    };
    s3: {
        accessKeyId?: string;
        secretAccessKey?: string;
        bucketName: string;
        publicUrl: string;
        region: string;
    };
}

export const config: Config = {
    env: process.env.NODE_ENV || 'development',
    port: Number(process.env.PORT) || 5000,
    logLevel: LogLevels.info,
    database: {
        url: process.env.DATABASE_URL!,
    },
    aws: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || process.env.AWS_ACCESS_KEY,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
    s3: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || process.env.AWS_ACCESS_KEY,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        bucketName: process.env.S3_BUCKET_NAME!,
        publicUrl: process.env.S3_PUBLIC_URL!,
        region: process.env.AWS_REGION || "us-west-2",
    },
    sqs: {
        queueUrl: process.env.SQS_QUEUE_URL!,
        region: process.env.AWS_REGION || "us-west-2",
    },
}
