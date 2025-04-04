import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import Joi, { ValidationResult } from "joi";

import { UserModel } from "../models/userModel";
import { User } from "../interfaces/userInterface";
import { connect, disconnect } from "../repository/database";

/**
 * Register a new user
 */
export async function registerUser(req: Request, res: Response): Promise<void> {
  try {
    const { error } = validateUserRegistrationInfo(req.body);
    if (error) {
      res.status(400).json({ error: error.details[0].message });
      return;
    }

    await connect();

    const emailExists = await UserModel.findOne({
      email: req.body.email.toLowerCase(),
    });
    if (emailExists) {
      res.status(400).json({ error: "Email already exists." });
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHashed = await bcrypt.hash(req.body.password, salt);

    const userObject = new UserModel({
      username: req.body.username,
      email: req.body.email.toLowerCase(),
      password: passwordHashed,
      role: "user",
    });

    const newUser = await userObject.save();

    res.status(201).json({
      message: "Registered successfully.",
      data: {
        id: newUser._id,
        username: newUser.username,
        role: newUser.role,
        email: newUser.email,
      },
    });
  } catch (error) {
    res.status(500).send("Error registering user. Error: " + error);
  } finally {
    await disconnect();
  }
}

/**
 * Log in an existing user
 */
export async function loginUser(req: Request, res: Response): Promise<void> {
  try {
    const { error } = validateUserLoginInfo(req.body);
    if (error) {
      res.status(400).json({ error: error.details[0].message });
      return;
    }

    await connect();

    const user = await UserModel.findOne({
      email: req.body.email.toLowerCase(),
    });
    if (!user) {
      res.status(400).json({ error: "Invalid email or password provided." });
      return;
    }

    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!validPassword) {
      res.status(400).json({ error: "Invalid email or password provided." });
      return;
    }

    if (!process.env.TOKEN_SECRET) {
      res.status(500).json({
        error: "Environment variable TOKEN_SECRET is not set.",
      });
      return;
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.TOKEN_SECRET,
      { expiresIn: "2h" }
    );

    res
      .status(200)
      .header("auth-token", token)
      .json({
        message: "Login successful.",
        token,
        user: {
          id: user._id,
          role: user.role,
          username: user.username,
          email: user.email,
        },
      });
  } catch (error) {
    res.status(500).send("Error logging in the user. Error: " + error);
  } finally {
    await disconnect();
  }
}

/**
 * Verify the client's JWT token
 * @param req
 * @param res
 * @param next
 */
export function verifyToken(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const token = req.header("auth-token");
  if (!token) {
    res.status(400).json({ error: "Access denied as no token provided." });
    return;
  }

  if (!process.env.TOKEN_SECRET) {
    res.status(500).json({
      error: "Environment variable TOKEN_SECRET is not set.",
    });
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
    (req as any).user = decoded;
    next();
  } catch (error) {
    res
      .status(401)
      .json({ error: "Verification failed due to invalid or expired token." });
  }
}

/**
 * Validate user registration info
 */
function validateUserRegistrationInfo(data: User): ValidationResult {
  const schema = Joi.object({
    username: Joi.string().min(2).max(255).required().messages({
      "string.empty": "Username cannot be empty.",
      "string.min": "Username must be at least 2 characters long.",
      "string.max": "Username cannot exceed 255 characters.",
    }),
    email: Joi.string().email().min(6).max(255).required().messages({
      "string.empty": "Email cannot be empty.",
      "string.email": "Email must be a valid email address.",
      "string.min": "Email must be at least 6 characters long.",
      "string.max": "Email cannot exceed 255 characters.",
    }),
    password: Joi.string().min(6).max(20).required().messages({
      "string.empty": "Password is required.",
      "string.min": "Password must be at least 6 characters long.",
      "string.max": "Password cannot exceed 20 characters.",
    }),
  });

  return schema.validate(data);
}

/**
 * Validate user login info
 */
function validateUserLoginInfo(data: User): ValidationResult {
  const schema = Joi.object({
    email: Joi.string().email().min(6).max(255).required().messages({
      "string.empty": "Email cannot be empty.",
      "string.email": "Email must be a valid email address.",
      "string.min": "Email must be at least 6 characters long.",
      "string.max": "Email cannot exceed 255 characters.",
    }),
    password: Joi.string().min(6).max(20).required().messages({
      "string.empty": "Password is required.",
      "string.min": "Password must be at least 6 characters long.",
      "string.max": "Password cannot exceed 20 characters.",
    }),
  });
  return schema.validate(data);
}
