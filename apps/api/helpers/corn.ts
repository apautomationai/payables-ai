import { config } from "@/lib/config";
import axios from "axios";
import nodeCron from "node-cron";

export const startFetchEmails = () => {
  if (config.env !== 'production') {
    console.log('Email cronjob disabled in development mode');
    return;
  }
  console.log('Email cronjob enabled in production mode');
  nodeCron.schedule("*/2 * * * *", async () => {
    console.log(`Email sync triggered at: ${new Date().toISOString()}`);
    await axios.get(`${process.env.BACKEND_URL}/api/v1/google/emails`);
  });
};
