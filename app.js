import express from "express";
import dbConnection from "./database/connection.js";
import messageRoutes from "./features/message/message.routes.js";
import { errorHandler } from "./middlewares/errorMiddleware.js";
import authorRoutes from "./features/auth/auth.routes.js";

const app = express();

dbConnection();
app.use(express.json());

app.use("/auth", authorRoutes);
app.use("/messages", messageRoutes);

app.use(errorHandler);

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
