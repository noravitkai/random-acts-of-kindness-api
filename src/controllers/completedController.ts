import { Request, Response } from "express";
import { connect } from "../repository/database";
import { CompletedActModel } from "../models/completedActModel";
import { KindnessActModel } from "../models/kindnessActModel";

/**
 * POST /completed
 * Body: { act: "<kindnessActId>" }
 * Requires auth-token header
 */
export async function createCompletedAct(
  req: Request,
  res: Response
): Promise<void> {
  try {
    await connect();
    const userId = (req as any).user.userId;
    const { act } = req.body;
    // Fetch act snapshot
    const actDoc = await KindnessActModel.findById(act).select(
      "title description category difficulty"
    );
    if (!actDoc) {
      res.status(404).json({ error: "Act of kindness not found." });
      return;
    }
    const entry = new CompletedActModel({
      user: userId,
      act,
      title: actDoc.title,
      description: actDoc.description,
      category: actDoc.category || "",
      difficulty: actDoc.difficulty,
    });
    const saved = await entry.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({
      error: `Error creating completed act: ${(err as Error).message}`,
    });
  }
}

/**
 * GET /completed/:userId
 * Requires auth-token header
 */
export async function getCompletedActsByUser(
  req: Request,
  res: Response
): Promise<void> {
  try {
    await connect();
    const userId = req.params.userId;
    const list = await CompletedActModel.find({ user: userId }).select(
      "_id act title description category difficulty completedAt"
    );
    res.status(200).json(list);
  } catch (err) {
    res.status(500).json({
      error: `Error fetching completed acts: ${(err as Error).message}`,
    });
  }
}
