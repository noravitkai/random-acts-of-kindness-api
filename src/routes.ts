import { Router, Request, Response } from "express";
import {
  registerUser,
  loginUser,
  verifyToken,
} from "./controllers/authController";

const router: Router = Router();

// Route for welcome message
router.get("/", (req: Request, res: Response) => {
  res.status(200).send("Welcome to the Random Acts of Kindness API! :)");
});

// Routes for user authentication
router.post("/user/register", registerUser);
router.post("/user/login", loginUser);

export default router;
