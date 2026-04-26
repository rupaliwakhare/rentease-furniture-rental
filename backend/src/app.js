import express from "express";

const app = express();

// middleware
app.use(express.json());

// test route
app.get("/", (req, res) => {
  res.send("Welcome to RentEase API 🚀");
});

export default app;
