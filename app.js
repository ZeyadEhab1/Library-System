import express from "express";
import dotenv from "dotenv";
import bookRoutes from "./Routes/book.js";
import checkoutRoutes from "./Routes/checkout.js";


dotenv.config();

const app = express();

app.use(express.json()); 

app.use("/api/books", bookRoutes);
app.use("/api/checkouts", authenticateToken, checkoutRoutes);

app.use((req, res, next) => {
  res.status(404).json({ message: "Route not found" });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ message: err.message || "Internal Server Error" });
});

export default app;
