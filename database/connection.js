import { connect } from "mongoose";

const dbConnection = async () => {
  try {
    const connection = await connect("mongodb://localhost:27017/sarahaApp");
    console.log(
      `Connected to database successfully: ${connection.connection.host}`
    );
  } catch (error) {
    console.error(`Error while connecting to database: ${error.message}`);
    process.exit(1);
  }
};
export default dbConnection;
