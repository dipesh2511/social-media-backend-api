import "./env.js";

import express from "express";
import path from "path";
import swagger from "swagger-ui-express";
import swaggerFile from "./swagger.json" assert { type: 'json' };

//created imports
import { mongodbConnect } from "./src/config/mongodb.config.js";
import GenericErrorResponse from "./src/error.response.handler/custom.application.level.error.js";
import {
  RESPONSE_MESSAGES,
  RESPONSE_CODES,
  ERROR_TYPE,
} from "./src/common/common.variable.js";
import { jwtAuthGuard } from "./src/guard/jwt.auth.guard.js";

// routing imports
import secureUserRouter from "./src/features/users/user.secure.router.js";
import publicUserRouter from "./src/features/users/user.public.router.js";
import postsRouter from "./src/features/posts/posts.router.js";
import commentsRouter from "./src/features/comments/comments.router.js";
import likesRouter from "./src/features/likes/likes.router.js";
import friendsRouter from "./src/features/friendships/friends.router.js";
import otpRouter from "./src/features/otp/otp.router.js";

const server = express();
const port = process.env.PORT || 3000;

// Essential middleware
server.use(express.json());
server.use(express.urlencoded({ extended: true }));

// statically making available to the profile.pictures and post.pictures folder
server.use(express.static(path.join("pictures")));
server.use(express.static(path.join("pictures", "profile.pictures")));
server.use(express.static(path.join("pictures", "post.pictures")));

// swagger route
server.use("/api-docs",swagger.serve,swagger.setup(swaggerFile));

// routes for the api
server.use("/api/users", publicUserRouter);
server.use("/api/users", jwtAuthGuard, secureUserRouter);
server.use("/api/post", postsRouter);
server.use("/api/comments", commentsRouter);
server.use("/api/likes", likesRouter);
server.use("/api/friends", friendsRouter);
server.use("/api/otp", otpRouter);

// here we are handling the Application level errors
server.use((error, req, res, next) => {
  if (error instanceof GenericErrorResponse) {
    let generated_error = new GenericErrorResponse(
      error.message || RESPONSE_MESSAGES.SERVER_ERROR,
      error.status || RESPONSE_CODES.SERVER_ERROR,
      error.error_type || ERROR_TYPE.INTERNAL_ERROR,
      error.validation_error || null
    );
    res.status(error.status || 500).send(generated_error);
  }
});

server.listen(port, async () => {
  console.log(`Server is listening on the port number ${port}`);
  await mongodbConnect();
});
