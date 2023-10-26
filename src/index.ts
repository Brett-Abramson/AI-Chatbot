import  express from "express";
import { config } from "dotenv";

config();
const app = express();

const PORT = 3000

// MIDDLEWARE
app.use(express.json());


// GET
// PUT
// POST
// DELETE


app.listen(PORT, ()=>console.log(`listening on port ${PORT}`))