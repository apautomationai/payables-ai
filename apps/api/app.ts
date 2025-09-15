import "dotenv/config";
import express from "express";

// import middlewares
import passport from "@/lib/passport";

// import error handlers
import { errorHandler } from "@/helpers/error-handler";
import { notFoundHandler } from "@/helpers/not-found-handler";

// Route import
import helloRouter from "@/routes/hello.route";
import usersRoutes from "@/routes/users.route";

const app = express();

// Apply middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());

// Apply routes
app.use("/hello", helloRouter);
app.use("/api/v1/users", usersRoutes);


// Apply error handlers
app.use(notFoundHandler);
app.use(errorHandler);


export default app;
