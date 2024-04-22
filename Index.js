require("dotenv").config();
const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET;

const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const app = express();
const errorHandler = require("../src/server/middleware/errorHandler");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(process.cwd(), "public")));

const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_DB_URI;

const cors = require("cors");
const axios = require("axios");

app.use(
  cors({
    origin: ["http://localhost:5173", "https://place.map.kakao.com"],
    credentials: true,
  })
);

app.get("/api/kakao-maps/:id", async (req, res) => {
  const id = req.params.id;
  try {
    console.log("Kakao Maps API 요청 전송");
    const response = await axios.get(
      `https://place.map.kakao.com/main/v/${id}`
    );
    console.log("Kakao Maps API 응답 받음:", response.data);
    res.json(response.data);
  } catch (error) {
    console.error("Kakao Maps API 요청 실패:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/", (req, res) => {
  res.send("hello express");
});

app.get("/api", (req, res) => {
  res.send("backend server");
});

mongoose.connect(MONGO_URI);
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log(" Connected to MongoDB");
});
const magazineRouter = require("../src/server/routes/magazinePostRoutes");
const breadRouter = require("../src/server/routes/breadRoutes");
const commentRouter = require("../src/server/routes/commentRoutes");
const postRouter = require("../src/server/routes/postRoutes");
const recipeRouter = require("../src/server/routes/recipeRoutes");
const reviewRouter = require("../src/server/routes/reviewRoutes");
const userRouter = require("../src/server/routes/userRoutes");
const likeRouter = require("../src/server/routes/likeRoutes");
const bookmarkRouter = require("../src/server/routes/bookmarkRoutes");

app.use("/api/magazines", magazineRouter);
app.use("/api/breads", breadRouter);
app.use("/api/comments", commentRouter);
app.use("/api/posts", postRouter);
app.use("/api/recipes", recipeRouter);
app.use("/api/reviews", reviewRouter);
app.use("/api/users", userRouter);
app.use("/api/likes", likeRouter);
app.use("/api/bookmarks", bookmarkRouter);
app.use(errorHandler);

// app.listen(port, () => console.log(`Server listening on port ${port}`));
app.listen(PORT, () => {
  console.log(`server listen ${PORT}`);
});

module.exports = app;
