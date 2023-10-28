import { NextFunction, Request, Response } from "express";
import User from "../models/User.js";
import { hash, compare } from "bcrypt";
import { createToken } from "../utils/token-manager.js";
import { COOKIE_NAME } from "../utils/constants.js";

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

    //  CREATE TOKEN AND STORE COOKIE
    res.clearCookie(COOKIE_NAME, {
      httpOnly: true,
      domain: "localhost",
      signed: true,
      path: "/",
    });

    const token = createToken(user._id.toString(), user.email, "7d");
    const expires = new Date();
    expires.setDate(expires.getDate() + 7);
    res.cookie(COOKIE_NAME, token, {
      path: "/",
      domain: "localhost", // change to domain when deployed
      expires: expires,
      httpOnly: true,
      signed: true,
    });

    return res
      .status(201)
      .json({ message: "USER CREATED", name: user.name, email: user.email });
  } catch (error) {
    console.error(error);
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

    if (!email || !password) {
      return res.status(400).send("Email and password are required.");
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).send("Invalid email or password.");
    }

    const isPasswordCorrect = await compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(403).send("Invalid email or password.");
    }

    res.clearCookie(COOKIE_NAME, {
      httpOnly: true,
      domain: "localhost",
      signed: true,
      path: "/",
    });

    const token = createToken(user._id.toString(), user.email, "7d");
    const expires = new Date();
    expires.setDate(expires.getDate() + 7);
    res.cookie(COOKIE_NAME, token, {
      path: "/",
      domain: "localhost", // change to domain when deployed
      expires: expires,
      httpOnly: true,
      signed: true,
    });

    return res
      .status(200)
      .json({ message: "User Logged In", name: user.name, email: user.email });
  } catch (error) {
    console.error(error);
    return res
      .status(200)
      .json({ message: "An error occurred.", cause: error.message });
  }
};

export const verifyUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // User token check
    const user = await User.findById({ email: res.locals.jwtData.id });
    if (!user) {
      return res.status(401).send("User not registered OR Token malfuctioned");
    }
    console.log(user._id.toString(), res.locals.jwtData.id())
    if (user._id.toString() !== res.locals.jwtData.id) {
      return res.status(401).send("Permissions didn't match")
    }

    return res
      .status(200)
      .json({ message: "User Verified", name: user.name, email: user.email });
  } catch (error) {
    console.error(error);
    return res
      .status(200)
      .json({ message: "An error occurred.", cause: error.message });
  }
};
