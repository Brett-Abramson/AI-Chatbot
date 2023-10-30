import express from "express";
import { config } from "dotenv";
import morgan from "morgan";
import appRouter from "./routes/index.js";
import cookieParser from "cookie-parser";
import cors from "cors";

config(); // This line loads environment variables from a .env file into process.env.

const app = express();
// MIDDLEWARES
app.use(cors({ origin: "http://localhost:5173", credentials: true })); //This sets up the CORS middleware. It specifies that the server can only be accessed by a client from "http://localhost:5173" and allows for cookies or authentication tokens to be sent and received between the client and server.
app.use(express.json()); // This is a built-in middleware in Express that parses incoming requests with JSON payloads.
app.use(cookieParser(process.env.COOKIE_SECRET)); //Sets up cookie parsing with a secret for signing cookies. The secret is fetched from the environment variables (process.env.COOKIE_SECRET).
app.use(morgan("dev")); // This line sets up request logging in the 'dev' format. It's often used in development to see incoming requests. The comment suggests it should be removed in a production environment.

app.use("/api/v1", appRouter); // This line tells the Express application to use the routes defined in appRouter (from routes/index.js) and prefix them with "/api/v1". For instance, if there's a "/users" route in appRouter, the full endpoint in the app would be "/api/v1/users".

export default app;
