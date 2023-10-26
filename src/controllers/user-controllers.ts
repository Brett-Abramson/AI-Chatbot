import { NextFunction, Request, Response } from "express";
import User from "../models/User.js";
import { hash, compare } from "bcrypt";

// gets all users form the database
export const getAllUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const users = await User.find();

    return res.status(200).json({ message: "OK", users });
  } catch (error) {
    console.log(error);
    return res.status(200).json({ message: "ERROR", cause: error.message });
  }
};

export const userSignup = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(401).send("User Already Registered");

    const hashedPassword = await hash(password, 10);
    const user = new User({ name, email, password: hashedPassword }); // encrypt the password before storing in the database
    await user.save();

    return res
      .status(201)
      .json({ message: "USER CREATED", id: user._id.toString() });
  } catch (error) {
    console.log(error);
    return res.status(200).json({ message: "ERROR", cause: error.message });
  }
};

export const userLogin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) res.status(401).send("User not registered");
    const isPasswordCorrect = await compare(password, user.password);
    if (!isPasswordCorrect) res.status(403).send("Incorrect Password");
    return res
      .status(200)
      .json({ message: "User Logged In", id: user._id.toString() });
  } catch (error) {
    console.log(error);
    return res.status(200).json({ message: "ERROR", cause: error.message });
  }
};
