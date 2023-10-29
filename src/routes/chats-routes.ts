import { Router } from "express";
import { verifyToken } from "../utils/token-manager.js";

// Protected API (only authenticated and authorize dusers can access)
const chatRoutes = Router();
chatRoutes.post("/new", verifyToken, )

export default chatRoutes;