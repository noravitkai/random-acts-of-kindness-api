import { Request, Response } from "express";
import { KindnessActModel } from "../models/kindnessActModel";
// import { CategoryModel } from "../models/categoryModel"; // TODO: Add category handling later on
import { connect } from "../repository/database";

/**
 * Creates a new act
 * @param req – act and user info
 * @param res – created act of kindness or error
 * @returns void
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
    await connect();

    const kindnessAct = new KindnessActModel(kindnessActData);
    const result = await kindnessAct.save();

    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ error: "Error creating kindness act: " + error });
  }
}

/**
 * Retrieves all kindness acts suggested by the logged-in user
 * @param req – user info
 * @param res – user's acts or error
 * @returns void
 */
export async function getAllSuggestedActs(
  req: Request,
  res: Response
): Promise<void> {
  try {
    await connect();

    const userId = (req as any).user?.userId;
    if (!userId) {
      res.status(403).json({
        error: "Login needed to access your suggested acts.",
      });
      return;
    }

    const userActs = await KindnessActModel.find({
      createdBy: userId,
    }).populate("createdBy", "_id username email");

    res.status(200).json(userActs);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error retrieving user kindness acts: " + error });
  }
}

/**
 * Retrieves all the approved kindness acts
 * @param res – approved acts or error
 * @returns void
 */
export async function getApprovedKindnessActs(
  req: Request,
  res: Response
): Promise<void> {
  try {
    await connect();

    const approvedActs = await KindnessActModel.find({
      status: "approved",
    }).populate("createdBy", "_id username email");

    res.status(200).json(approvedActs);
  } catch (error) {
    res.status(500).json({ error: "Failed to load approved acts: " + error });
  }
}

/**
 * Retrieves a kindness act by its ID
 * @param req – act ID
 * @param res – an act or error
 * @returns void
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
      res.status(404).json({ error: "Kindness act doesn't exist." });
      return;
    }

    res.status(200).json(kindnessAct);
  } catch (error) {
    res.status(500).json({ error: "Error retrieving kindness act: " + error });
  }
}

/**
 * Retrieves all kindness acts (only admin operations)
 * @param req – admin info
 * @param res – all acts or error
 * @returns void
 */
export async function getAllKindnessActs(
  req: Request,
  res: Response
): Promise<void> {
  try {
    await connect();
    const allActs = await KindnessActModel.find({}).populate(
      "createdBy",
      "_id username email"
    );
    res.status(200).json(allActs);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error retrieving all kindness acts: " + error });
  }
}

/**
 * Updates kindness act by its ID
 * @param req – act ID, update and user info
 * @param res – updated act or error
 * @returns void
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
    res.status(500).json({ error: "Error while updating the act: " + error });
  }
}

/**
 * Deletes a kindness act by its ID
 * @param req – act ID and user info
 * @param res – success or error message
 * @returns void
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
        error: "You are not allowed to delete this kindness act.",
      });
      return;
    }

    await kindnessAct.deleteOne();

    res.status(200).json({
      message: "The kindness act has been removed.",
    });
  } catch (error) {
    res.status(500).json({ error: "Error deleting kindness act: " + error });
  }
}
