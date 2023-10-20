import mongoose from "mongoose";

export const connect = () => {
  mongoose.connect(`mongodb://mongo:R5C9hcksw3L4AwVbArxa@containers-us-west-154.railway.app:6686`);
  mongoose.connection.once("open", () => {
    console.log("Connected to MongoDB");
  });
  mongoose.connection.on("error", (err) => {
    console.log(err);
    process.exit(0);
  });
};