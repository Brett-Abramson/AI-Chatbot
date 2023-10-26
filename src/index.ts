import app from "./app.js";
import { connectToDatabase } from "./db/connection.js";

const PORT = process.env.PORT || 3000;
// GET
// PUT
// POST
// DELETE

connectToDatabase()
  .then(() => {
    app.listen(PORT, () => console.log(`Listening on port ${PORT} and connected to Database`));
  })
  .catch((err) => console.log(err));

