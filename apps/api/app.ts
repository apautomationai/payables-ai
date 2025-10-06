import "dotenv/config";
import express from "express";
import cors from "cors";
//@ts-ignore
import cookieParser from "cookie-parser";

// import middlewares
import passport from "@/lib/passport";

// import error handlers
import { errorHandler } from "@/helpers/error-handler";
import { notFoundHandler } from "@/helpers/not-found-handler";

// Route import
import helloRouter from "@/routes/hello.route";
import usersRoutes from "@/routes/users.route";
import googleRoutes from "@/routes/google.routes";
import settingsRoutes from "@/routes/settings.route";
import uploadRoutes from "@/routes/upload.routes";
import invoiceRoutes from "@/routes/invoice.routes";

const app = express();

// Apply middleware
app.use(express.json());
app.use(cors());

app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());

// Apply routes
app.use("/hello", helloRouter);
app.use("/api/v1/users", usersRoutes);
app.use("/api/v1/google", googleRoutes);
app.use("/api/v1/settings", settingsRoutes);
app.use("/api/v1/upload", uploadRoutes);
app.use("/api/v1/invoice", invoiceRoutes);

// Apply error handlers
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
