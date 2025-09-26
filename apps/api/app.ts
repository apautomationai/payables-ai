import "dotenv/config";
import express from "express";
import cors from 'cors';
//@ts-ignore
import cookieParser from "cookie-parser"

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

const app = express();

// Apply middleware
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:3001',
  credentials: true, 
}));

app.use(cookieParser())
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());


// Apply routes
app.use("/hello", helloRouter);
app.use("/api/v1/users", usersRoutes);
app.use("/api/v1/google", googleRoutes);
app.use("/api/v1/settings", settingsRoutes);





// Apply error handlers
app.use(notFoundHandler);
app.use(errorHandler);


export default app;
