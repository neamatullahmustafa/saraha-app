import mongoose from "mongoose";

const dbConnection = async () => {
  const connectionString = "mongodb://localhost:27017/sarahaApp";

  try {
    const connection = await mongoose.connect(connectionString, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(
      `Connected to database successfully: ${connection.connection.host}`
    );
  } catch (error) {
    console.error(`Error while connecting to database: ${error.message}`);
    process.exit(1); // Exit process with failure
  }

  // Handle MongoDB connection events
  mongoose.connection.on("disconnected", () => {
    console.warn("MongoDB disconnected!");
  });

  mongoose.connection.on("error", (err) => {
    console.error(`MongoDB connection error: ${err}`);
  });
};

// Graceful shutdown for the database connection
process.on("SIGINT", async () => {
  await mongoose.connection.close();
  console.log("MongoDB connection closed due to app termination");
  process.exit(0);
});

export default dbConnection;
