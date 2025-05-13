import { Request, Response } from "express";
import { connect } from "../repository/database";
import { CompletedActModel } from "../models/completedActModel";
import { SavedActModel } from "../models/savedActModel";
import { KindnessActModel } from "../models/kindnessActModel";

/**
 * Saves kindness act for the given user
 * @param req – auth-token and act ID
 * @param res – saved record or error
 * @returns void
 */
export async function saveActForUser(
  req: Request,
  res: Response
): Promise<void> {
  try {
    await connect();
    const userId = (req as any).user.userId;
    const userRole = (req as any).user.role;

    if (userRole === "admin") {
      res.status(403).json({ error: "Admins cannot save acts." });
      return;
    }

    const { act } = req.body;

    const existing = await SavedActModel.findOne({ user: userId, act });
    if (existing) {
      res.status(400).json({ error: "Act saved already." });
      return;
    }

    // Load original act details
    const actDoc = await KindnessActModel.findById(act).select(
      "title description category difficulty"
    );
    if (!actDoc) {
      res.status(404).json({ error: "Act of kindness not found." });
      return;
    }
    const savedAct = new SavedActModel({
      user: userId,
      act,
      title: actDoc.title,
      description: actDoc.description,
      category: actDoc.category || "",
      difficulty: actDoc.difficulty,
    });
    const result = await savedAct.save();
    res.status(201).json(result);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error saving act: " + (error as Error).message });
  }
}

/**
 * Retrieves saved acts for the given user
 * @param req – auth-token
 * @param res – list of saved acts or error
 * @returns void
 */
export async function getUserSavedActs(
  req: Request,
  res: Response
): Promise<void> {
  try {
    await connect();
    const userId = (req as any).user.userId;

    const savedActs = await SavedActModel.find({ user: userId }).select(
      "_id act title description category difficulty savedAt"
    );
    res.status(200).json(savedActs);
  } catch (error) {
    res.status(500).json({
      error: "Error fetching saved acts: " + (error as Error).message,
    });
  }
}

/**
 * Marks a saved act as completed, removing from the saved list
 * @param req – auth-token and saved act ID
 * @param res – confirmation message or error
 * @returns void
 */
export async function completeActForUser(
  req: Request,
  res: Response
): Promise<void> {
  try {
    await connect();
    const userRole = (req as any).user.role;

    if (userRole === "admin") {
      res.status(403).json({ error: "Admins cannot complete acts." });
      return;
    }

    const savedActId = req.params.id;

    const savedAct = await SavedActModel.findById(savedActId);
    if (!savedAct) {
      res.status(404).json({ error: "Act of kindness not found." });
      return;
    }

    // Reload act details, fallback to saved data
    let { title, description, category, difficulty } = savedAct;
    const actDoc = await KindnessActModel.findById(savedAct.act).select(
      "title description category difficulty"
    );
    if (actDoc) {
      title = actDoc.title;
      description = actDoc.description;
      category = actDoc.category?.toString() || "";
      difficulty = actDoc.difficulty;
    }
    const completedAct = new CompletedActModel({
      user: savedAct.user,
      act: savedAct.act,
      title,
      description,
      category,
      difficulty,
      completedAt: new Date(),
    });
    await completedAct.save();

    await SavedActModel.findByIdAndDelete(savedActId);

    res.status(200).json({ message: "Act marked as completed." });
  } catch (error) {
    res.status(500).json({
      error: "Error marking act as completed: " + (error as Error).message,
    });
  }
}

/**
 * Removes a kindness act from the saved list of a user
 * @param req – auth-token and saved act ID
 * @param res – confirmation message or error
 * @returns void
 */
export async function unsaveAct(req: Request, res: Response): Promise<void> {
  try {
    await connect();
    const userId = (req as any).user.userId;
    const userRole = (req as any).user.role;

    if (userRole === "admin") {
      res.status(403).json({ error: "Admins cannot unsave kindness acts." });
      return;
    }

    const savedActId = req.params.id;

    const savedAct = await SavedActModel.findOne({
      user: userId,
      _id: savedActId,
    });
    if (!savedAct) {
      res.status(404).json({ error: "Saved act not found for this user." });
      return;
    }

    await SavedActModel.findByIdAndDelete(savedAct._id);
    res.status(200).json({ message: "Act successfully unsaved." });
  } catch (error) {
    res.status(500).json({
      error: "Error unsaving act: " + (error as Error).message,
    });
  }
}
