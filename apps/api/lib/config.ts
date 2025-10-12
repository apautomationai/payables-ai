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
}

export const config: Config = {
    env: process.env.NODE_ENV || 'development',
    port: Number(process.env.PORT) || 5000,
    logLevel: LogLevels.info,
    database: {
        url: process.env.DATABASE_URL!,
    },
}
