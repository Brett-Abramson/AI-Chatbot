import  express from "express";
import { config } from "dotenv";
import morgan from "morgan"

config();
const app = express();
// MIDDLEWARES
app.use(express.json());
app.use(morgan("dev"))

export default app;