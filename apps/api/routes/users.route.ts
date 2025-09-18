
import { userController } from "@/controllers/users.controller";
import { loginUserValidator, registerUserValidator, validate } from "@/middlewares/validate";
import { Router } from "express";

const router = Router();

router.post('/register', validate(registerUserValidator), userController.registerUser);
router.post('/login', validate(loginUserValidator), userController.loginUser);
router.get('/', userController.getUsers);
router.patch('/updateProfile/', userController.updateUser);
router.patch('/resetPassword',userController.resetPassword)


export default router;