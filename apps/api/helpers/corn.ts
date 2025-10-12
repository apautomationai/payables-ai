import axios from "axios";
import nodeCron from "node-cron";

export const startFetchEmails = () => {
  nodeCron.schedule("*/5 * * * *", async () => {
    // console.log(new Date().toISOString(), "Running fetchEmailsCron");

    await axios.get(`${process.env.BACKEND_URL}/api/v1/google/emails`);
  });
};
