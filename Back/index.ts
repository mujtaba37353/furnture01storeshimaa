import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
dotenv.config({ path: "./config/config.env" });

import db_connection from "./config/db_connection";
import morgan from "morgan";
import router from "./mount";

import "colors";
import { globalErrorMiddleware } from "./middlewares/globalError.middleware";
import expressAsyncHandler from "express-async-handler";
import ApiError from "./utils/ApiError";
import { StatusCodes } from "http-status-codes";
import { closeAllCouponsThatEnded, RemoveAllGuestUsers, closeAllOffersThatEnded ,updateExchangeRates  } from "./utils/cronSchedule";
// Socketio
import { initSocket } from "./config/io_connection"; // Import the socket initialization function
import path from "path";
import https from "https";
import fs from "fs";
import http from "http";

export const app = express();
// Middleware to parse JSON in the request body
app.use(bodyParser.json());
const server = http.createServer(app);
// const ser=https.createServer({
//   key:fs.readFileSync(path.join(__dirname,'../../../../../etc/letsencrypt/live/saritestsecond.online/privkey.pem')),
//   cert:fs.readFileSync(path.join(__dirname,'../../../../../etc/letsencrypt/live/saritestsecond.online/cert.pem')),
// },app)
// app.use(
// 	cookieSession({
// 		name: "session",
// 		keys: ["cyberwolve"],
// 		maxAge: 24 * 60 * 60 * 100,
// 	})
// );
const NODE_ENV = process.env.NODE_ENV || "dev";

if (NODE_ENV === "dev") {
  app.use(morgan("dev"));
}

db_connection();
closeAllCouponsThatEnded.start();
RemoveAllGuestUsers.start();
closeAllOffersThatEnded.start();
updateExchangeRates.start();

const PORT = process.env.PORT || 3000;
//middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static("./uploads"));

// routes
app.use("/api/v1", router);

// app.use(
// 	cors({
// 		origin: "http://localhost:3000",
// 		methods: "GET,POST,PUT,DELETE",
// 		credentials: true,
// 	})
// );

// un handled routes (not found)
app.use(
  "*",
  expressAsyncHandler(async (req, res, next) => {
    next(
      new ApiError(
        {
          en: `this path ${req.originalUrl} not found`,
          ar: `هذا المسار ${req.originalUrl} غير موجود`,
        },
        StatusCodes.NOT_FOUND
      )
    );
  })
);
app.use(globalErrorMiddleware);

// Socket.io
// Create a new HTTP server
// const server = http.createServer(app);
export const io = initSocket(server); // Initialize Socket.io and pass the server instance

// Start the HTTP server
server.listen(PORT, () => {
  console.log(`Server running:  ${process.env.APP_URL}`.green.bold);
});
//.....