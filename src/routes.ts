import { Router, Request, Response } from "express";
import {
  registerUser,
  loginUser,
  verifyToken,
  verifyAdmin,
} from "./controllers/authController";
import {
  createKindnessAct,
  getAllKindnessActs,
  getKindnessActById,
  updateKindnessActById,
  deleteKindnessActById,
} from "./controllers/actController";

const router: Router = Router();

// Route for welcome message
router.get("/", (req: Request, res: Response) => {
  res.status(200).send("Welcome to the Random Acts of Kindness API! :)");
});

// Routes for user authentication
router.post("/user/register", registerUser);
router.post("/user/login", loginUser);

// Routes for acts of kindness
router.post("/acts", verifyToken, createKindnessAct);
router.get("/acts", getAllKindnessActs);
router.get("/acts/:id", getKindnessActById);
router.put("/acts/:id", verifyToken, updateKindnessActById);
router.delete("/acts/:id", verifyToken, deleteKindnessActById);

export default router;
