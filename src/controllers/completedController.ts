import { Request, Response } from "express";
import { connect } from "../repository/database";
import { CompletedActModel } from "../models/completedActModel";

/**
 * Retrieves completed acts for the given user
 * @param req – userId
 * @param res – list of completed acts or error
 * @returns void
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
