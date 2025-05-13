import { Router, Request, Response } from "express";
import {
  registerUser,
  loginUser,
  verifyToken,
  verifyAdmin,
} from "./controllers/authController";
import {
  createKindnessAct,
  getAllSuggestedActs,
  getApprovedKindnessActs,
  getKindnessActById,
  getAllKindnessActs,
  updateKindnessActById,
  deleteKindnessActById,
} from "./controllers/actController";
import {
  createCompletedAct,
  getCompletedActsByUser,
} from "./controllers/completedController";
import {
  saveActForUser,
  getUserSavedActs,
  completeActForUser,
  unsaveAct,
} from "./controllers/savedController";

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
router.get("/acts/user", verifyToken, getAllSuggestedActs);
router.get("/acts/all", verifyToken, verifyAdmin, getAllKindnessActs);
router.get("/acts", getApprovedKindnessActs);
router.get("/acts/:id", verifyToken, getKindnessActById);
router.put("/acts/:id", verifyToken, updateKindnessActById);
router.delete("/acts/:id", verifyToken, deleteKindnessActById);

// Routes for acts completed by users
router.post("/completed", verifyToken, createCompletedAct);
router.get("/completed/:userId", verifyToken, getCompletedActsByUser);

// Routes for acts saved by users
router.post("/saved", verifyToken, saveActForUser);
router.get("/saved", verifyToken, getUserSavedActs);
router.delete("/saved/:id", verifyToken, unsaveAct);
router.put("/saved/:id/complete", verifyToken, completeActForUser);

export default router;
