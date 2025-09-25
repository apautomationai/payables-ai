import { userController } from "@/controllers/users.controller";
import { authenticate } from "@/middlewares/auth.middleware";
import {
  loginUserValidator,
  registerUserValidator,
  validate,
} from "@/middlewares/validate";
import { Router } from "express";

const router = Router();

router.post(
  "/register",
  validate(registerUserValidator),
  userController.registerUser
);
router.post("/login", validate(loginUserValidator), userController.loginUser);
router.get("/", userController.getUsers);
router.patch("/updateProfile/", authenticate, userController.updateUser);
router.patch("/resetPassword", authenticate, userController.resetPassword);
router.patch("/changePassword", authenticate, userController.changePassword);

export default router;
