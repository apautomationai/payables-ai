import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

// import middlewares
import passport from "@/lib/passport";

// import error handlers
import { errorHandler } from "@/helpers/error-handler";
import { notFoundHandler } from "@/helpers/not-found-handler";

// Route import
import healthRouter from "@/routes/health.route";
import usersRoutes from "@/routes/users.route";
import googleRoutes from "@/routes/google.routes";
import settingsRoutes from "@/routes/settings.route";
import uploadRoutes from "@/routes/upload.routes";
import invoiceRoutes from "@/routes/invoice.routes";
import quickbooksRoutes from "@/routes/quickbooks.routes";
import processorRoutes from "@/routes/processor.routes";

const app = express();

// Apply middleware
app.use(cors());
app.use(express.json());

app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());

// Apply routes
app.get("/", (_req, res) => {
  res.json({ message: "Api is running", version: "0.1.0" });
});
app.use("/api/v1/health", healthRouter);
app.use("/api/v1/users", usersRoutes);
app.use("/api/v1/google", googleRoutes);
app.use("/api/v1/settings", settingsRoutes);
app.use("/api/v1/upload", uploadRoutes);
app.use("/api/v1/invoice", invoiceRoutes);
app.use("/api/v1/quickbooks", quickbooksRoutes);
app.use("/api/v1/processor", processorRoutes);

// Apply error handlers
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
