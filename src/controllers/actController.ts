import { Request, Response } from "express";
import { KindnessActModel } from "../models/kindnessActModel";
// import { CategoryModel } from "../models/categoryModel"; // TODO: Add category handling later on
import { connect } from "../repository/database";
import mongoose from "mongoose";

/**
 * Create a new kindness act
 * Regular users can create acts, but only admins can set status
 */
export async function createKindnessAct(
  req: Request,
  res: Response
): Promise<void> {
  const { title, description, category, difficulty, status } = req.body;
  const createdBy = (req as any).user.userId;
  const userRole = (req as any).user.role;

  // TODO: Uncomment category validation when it's ready
  // if (!mongoose.Types.ObjectId.isValid(category)) {
  //   res.status(400).json({ error: "Invalid format of category ID." });
  //   return;
  // }

  // TODO: Check if category exists when category management is added
  // const existingCategory = await CategoryModel.findById(category);
  // if (!existingCategory) {
  //   res
  //     .status(400)
  //     .json({ error: "The provided category ID does not exist." });
  //   return;
  // }

  const kindnessActData: any = {
    title,
    description,
    difficulty,
    createdBy,
  };

  // if (userRole === "admin" && status) {
  //   kindnessActData.status = status;
  // }

  try {
    const kindnessAct = new KindnessActModel(kindnessActData);
    const result = await kindnessAct.save();

    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ error: "Error creating kindness act: " + error });
  }
}

/**
 * Retrieve all kindness acts
 * Accessible by each authenticated user
 */
export async function getAllKindnessActs(
  req: Request,
  res: Response
): Promise<void> {
  try {
    await connect();

    const kindnessActs = await KindnessActModel.find({})
      // TODO: Include category population later on
      // .populate("category", "name description")
      .populate("createdBy", "username email");

    res.status(200).json(kindnessActs);
  } catch (error) {
    res.status(500).json({ error: "Error retrieving kindness acts: " + error });
  }
}

/**
 * Retrieve a kindness act by its ID
 * Accessible by each authenticated user
 */
export async function getKindnessActById(
  req: Request,
  res: Response
): Promise<void> {
  try {
    await connect();

    const id = req.params.id;
    const kindnessAct = await KindnessActModel.findById(id)
      // TODO: Include category population later on
      // .populate("category", "name description")
      .populate("createdBy", "username email");

    if (!kindnessAct) {
      res.status(404).json({ error: "Kindness act not found." });
      return;
    }

    res.status(200).json(kindnessAct);
  } catch (error) {
    res.status(500).json({ error: "Error retrieving kindness act: " + error });
  }
}

/**
 * Update a kindness act by its ID
 * Only admins can change the status, users can update the acts they created
 */
export async function updateKindnessActById(
  req: Request,
  res: Response
): Promise<void> {
  const id = req.params.id;
  const updateData = req.body;
  const user = (req as any).user;

  try {
    await connect();

    const kindnessAct = await KindnessActModel.findById(id);

    if (!kindnessAct) {
      res
        .status(404)
        .json({ error: `Cannot find kindness act with ID ${id}.` });
      return;
    }

    const isUser = kindnessAct.createdBy.toString() === user.userId;
    const isAdmin = user.role === "admin";

    if (!isUser && !isAdmin) {
      res.status(403).json({
        error: "You do not have permission to update this kindness act.",
      });
      return;
    }

    if (!isAdmin) {
      updateData.status = "pending";
    }

    const updatedAct = await KindnessActModel.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    )
      // TODO: Include category population later on
      // .populate("category", "name description")
      .populate("createdBy", "username email");

    res.status(200).json({
      message: "Kindness act successfully updated.",
      updatedAct,
    });
  } catch (error) {
    res.status(500).json({ error: "Error updating kindness act: " + error });
  }
}

/**
 * Delete a kindness act by its ID
 * Admins can delete any act, while users can delete only the acts they created
 */
export async function deleteKindnessActById(
  req: Request,
  res: Response
): Promise<void> {
  const id = req.params.id;
  const user = (req as any).user;

  try {
    await connect();

    const kindnessAct = await KindnessActModel.findById(id);

    if (!kindnessAct) {
      res.status(404).json({
        error: `Kindness act with ID ${id} not found.`,
      });
      return;
    }

    const isUser = kindnessAct.createdBy.toString() === user.userId;
    const isAdmin = user.role === "admin";

    if (!isUser && !isAdmin) {
      res.status(403).json({
        error: "You do not have permission to delete this kindness act.",
      });
      return;
    }

    await kindnessAct.deleteOne();

    res.status(200).json({
      message: "Kindness act successfully deleted.",
    });
  } catch (error) {
    res.status(500).json({ error: "Error deleting kindness act: " + error });
  }
}
