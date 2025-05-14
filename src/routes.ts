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
import { getCompletedActsByUser } from "./controllers/completedController";
import {
  saveActForUser,
  getUserSavedActs,
  completeActForUser,
  unsaveAct,
} from "./controllers/savedController";

const router: Router = Router();

/**
 * @swagger
 * /:
 *   get:
 *     tags:
 *       - Welcome
 *     summary: Health check
 *     description: Confirms that server is live and responding .
 *     responses:
 *       200:
 *         description: Server is up and running.
 */
router.get("/", (req: Request, res: Response) => {
  res.status(200).send("Welcome to the Random Acts of Kindness API! :)");
});

/**
 * @swagger
 * /user/register:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Register a new user
 *     description: Creates a new account with username, email, and password.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - email
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: Regisration successful.
 *       400:
 *         description: Invalid input or email already in use.
 *       500:
 *         description: Internal server error.
 */
router.post("/user/register", registerUser);
/**
 * @swagger
 * /user/login:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Log in to account
 *     description: Authenticates credentials and returns a JWT along with user info.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful – returns token and user info.
 *       400:
 *         description: Invalid login credentials or missing fields.
 *       500:
 *         description: Internal server error.
 */
router.post("/user/login", loginUser);

/**
 * @swagger
 * /acts:
 *   get:
 *     tags:
 *       - Kindness Acts
 *     summary: Get approved kindness acts
 *     description: Returns kindness acts that were approved by admins.
 *     responses:
 *       200:
 *         description: List of approved acts returned.
 */
router.get("/acts", getApprovedKindnessActs);

/**
 * @swagger
 * /acts/user:
 *   get:
 *     tags:
 *       - Kindness Acts
 *     summary: Get user's suggested acts
 *     description: Returns all kindness acts created by the logged-in user.
 *     security:
 *       - ApiKeyAuth: []
 *     responses:
 *       200:
 *         description: List of user’s acts returned.
 */
router.get("/acts/user", verifyToken, getAllSuggestedActs);

/**
 * @swagger
 * /acts/all:
 *   get:
 *     tags:
 *       - Kindness Acts
 *     summary: Get all kindness acts for admins
 *     description: Returns every act in the database for admin moderation, allowing to review and manage.
 *     security:
 *       - ApiKeyAuth: []
 *     responses:
 *       200:
 *         description: All acts returned for moderation.
 */
router.get("/acts/all", verifyToken, verifyAdmin, getAllKindnessActs);

/**
 * @swagger
 * /acts/{id}:
 *   get:
 *     tags:
 *       - Kindness Acts
 *     summary: Get act by ID
 *     description: Returns a single act by its ID.
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the act to retrieve.
 *     responses:
 *       200:
 *         description: Kindness act retrieved.
 */
router.get("/acts/:id", verifyToken, getKindnessActById);

/**
 * @swagger
 * /acts:
 *   post:
 *     tags:
 *       - Kindness Acts
 *     summary: Create a kindness act
 *     description: Adds a new act — approved by default if created by an admin, otherwise marked as pending.
 *     security:
 *       - ApiKeyAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - difficulty
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               difficaulty:
 *                 type: string
 *                 enum: [easy, medium, hard]
 *     responses:
 *       201:
 *         description: Act of kindness created successfully.
 */
router.post("/acts", verifyToken, createKindnessAct);

/**
 * @swagger
 * /acts/{id}:
 *   put:
 *     tags:
 *       - Kindness Acts
 *     summary: Update kindness act by ID
 *     description: Changes the content of an existing act – status can only be changed by admins.
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the act to update.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               difficulty:
 *                 type: string
 *                 enum: [easy, medium, hard]
 *               status:
 *                 type: string
 *                 enum: [pending, approved, rejected]
 *     responses:
 *       200:
 *         description: Kindness act updated successfully.
 */
router.put("/acts/:id", verifyToken, updateKindnessActById);

/**
 * @swagger
 * /acts/{id}:
 *   delete:
 *     tags:
 *       - Kindness Acts
 *     summary: Delete act by ID
 *     description: Removes a specified act permanently.
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the act to delete.
 *     responses:
 *       200:
 *         description: Act of kindness deleted successfully.
 */
router.delete("/acts/:id", verifyToken, deleteKindnessActById);

/**
 * @swagger
 * /saved:
 *   get:
 *     tags:
 *       - Saved Acts
 *     summary: Get a list of saved acts by user
 *     description: Returns the list of acts saved by a user.
 *     security:
 *       - ApiKeyAuth: []
 *     responses:
 *       200:
 *         description: List of the user's saved acts returned.
 */
router.get("/saved", verifyToken, getUserSavedActs);

/**
 * @swagger
 * /saved:
 *   post:
 *     tags:
 *       - Saved Acts
 *     summary: Save act for user
 *     description: Saves a kindness act to the user's saved list.
 *     security:
 *       - ApiKeyAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - act
 *             properties:
 *               act:
 *                 type: string
 *                 description: ID of the act to save.
 *     responses:
 *       201:
 *         description: Act added to saved list.
 *       400:
 *         description: Act already saved or invalid.
 *       403:
 *         description: Admins cannot save acts.
 *       404:
 *         description: Act of kindness not found.
 *       500:
 *         description: Error occurred while saving.
 */
router.post("/saved", verifyToken, saveActForUser);

/**
 * @swagger
 * /saved/{id}/complete:
 *   put:
 *     tags:
 *       - Saved Acts
 *     summary: Complete saved act by ID
 *     description: Marks a saved kindness act as completed, then removes it from the saved list.
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the saved act to mark as completed.
 *     responses:
 *       200:
 *         description: Saved act marked as completed and removed from saved list.
 *       403:
 *         description: Admins cannot complete acts.
 *       404:
 *         description: Act of kindness not found.
 *       500:
 *         description: Error occurred while marking act as completed.
 */
router.put("/saved/:id/complete", verifyToken, completeActForUser);

/**
 * @swagger
 * /saved/{id}:
 *   delete:
 *     tags:
 *       - Saved Acts
 *     summary: Unsave act
 *     description: Removes a saved act from the user's saved list.
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the saved act to remove.
 *     responses:
 *       200:
 *         description: Kindness act unsaved successfully.
 *       403:
 *         description: Admins cannot unsave kindness acts.
 *       404:
 *         description: Saved act not found for this user.
 *       500:
 *         description: Error occurred while unsaving.
 */
router.delete("/saved/:id", verifyToken, unsaveAct);

/**
 * @swagger
 * /completed/{userId}:
 *   get:
 *     tags:
 *       - Completed Acts
 *     summary: Get a list of completed acts by user
 *     description: Returns completed kindness records for a specific user.
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: The user ID to fetch completed acts for.
 *     responses:
 *       200:
 *         description: List of completed acts returned.
 *       500:
 *         description: Error occurred while fetching.
 */
router.get("/completed/:userId", verifyToken, getCompletedActsByUser);

export default router;
