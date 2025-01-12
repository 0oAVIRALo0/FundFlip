const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();
const connectDB = require("./src/db/index");

const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());

const userRouter = require("./src/routes/user.route");
const accountRoute = require("./src/routes/account.route");

app.use("/api/v1/user", userRouter);
app.use("/api/v1/account", accountRoute);

// Database connection and server start
connectDB()
  .then(() => {
    app.listen(PORT, (req, res) => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.log("Error connecting to the database: ", error);
  });
