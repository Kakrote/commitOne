import {Router} from "express";
import {authenticate, requireSuperAdmin} from "../../middlewares/auth.middleware";
import {createFacultyController, listFacultyController, loginController} from "./auth.controller";

const authRouter = Router();

authRouter.post("/login", loginController);
authRouter.get("/faculty", authenticate, listFacultyController);
authRouter.post("/faculty", authenticate, requireSuperAdmin, createFacultyController);

export default authRouter;

