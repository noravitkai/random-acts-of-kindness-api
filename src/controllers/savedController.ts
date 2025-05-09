import { Request, Response } from "express";
import { connect } from "../repository/database";
import { CompletedActModel } from "../models/completedActModel";
import { SavedActModel } from "../models/savedActModel";

/**
 * POST /api/saved
 * Save act for user
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

    const savedAct = new SavedActModel({ user: userId, act });
    const result = await savedAct.save();
    res.status(201).json(result);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error saving act: " + (error as Error).message });
  }
}

/**
 * GET /api/saved
 * Get saved acts of user
 */
export async function getUserSavedActs(
  req: Request,
  res: Response
): Promise<void> {
  try {
    await connect();
    const userId = (req as any).user.userId;

    const savedActs = await SavedActModel.find({ user: userId }).populate(
      "act",
      "title description"
    );

    res.status(200).json(savedActs);
  } catch (error) {
    res.status(500).json({
      error: "Error fetching saved acts: " + (error as Error).message,
    });
  }
}

/**
 * PUT /api/saved/:id/complete
 * Mark a saved act as completed and delete from saved acts
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
      res.status(404).json({ error: "Saved act not found." });
      return;
    }

    const completedAct = new CompletedActModel({
      user: savedAct.user,
      act: savedAct.act,
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
 * DELETE /api/saved/:id
 * Unsave act without marking it as completed
 */
export async function unsaveAct(req: Request, res: Response): Promise<void> {
  try {
    await connect();
    const userId = (req as any).user.userId;
    const userRole = (req as any).user.role;

    if (userRole === "admin") {
      res.status(403).json({ error: "Admins cannot unsave acts." });
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
