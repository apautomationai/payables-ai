import "dotenv/config";
import express from "express";

import { errorHandler } from "@/helpers/error-handler";
import { notFoundHandler } from "@/helpers/not-found-handler";
import helloRouter from "@/routes/hello.route";
import userRoutes from "@/routes/users.route";

const app = express();

// Apply middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Apply routes
app.use("/hello", helloRouter);
app.use("/auth", userRoutes);

// Apply error handlers
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
