// Server initialization
import Server from "./server/server";
// Database connection
import { connect } from "./database/db";
// Middlewares
import bodyParser from "body-parser";
import fileUpload from "express-fileupload";
// Cors config
import cors from "cors";
// Routes
import userRoutes from "./routes/user";
import postRoutes from "./routes/post";

const server = new Server();

// Middlewares
server.app.use(bodyParser.urlencoded({ extended: true }));
server.app.use(bodyParser.json());
server.app.use(fileUpload());

// Cors config
server.app.use(cors({origin: true, credentials: true}));

// Routes
server.app.use("/user", userRoutes);
server.app.use("/posts", postRoutes);

// Connect to DB
connect();

server.start(() => {
  console.log(`Server running on port ${server.port}`);
});
