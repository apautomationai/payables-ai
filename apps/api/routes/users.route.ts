
import { userController } from "@/controllers/users.controller";
import { loginUserValidator, registerUserValidator, validate } from "@/middlewares/validate";
import { Router } from "express";

const router = Router();
router.post('/auth/register', validate(registerUserValidator), userController.registerUser);
router.post('/auth/login', validate(loginUserValidator), userController.loginUser);
export default router;