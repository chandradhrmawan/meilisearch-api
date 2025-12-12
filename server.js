
import dotenv from 'dotenv';
// const app = require("./app");
import app from "./app.js";

// Load environment variables
dotenv.config();


const PORT = process.env.PORT || 3000;

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});