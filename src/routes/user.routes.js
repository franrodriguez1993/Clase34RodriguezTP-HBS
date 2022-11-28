import { Router } from "express";
import passport from "passport";
const userRouter = Router();
import { registerUser, logoutUser } from "../controllers/user.controller.js";

userRouter.get("/register", (req, res) => {
  res.render("register");
});
userRouter.get("/login", (req, res) => {
  res.render("login");
});
userRouter.post("/register", registerUser);
userRouter.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/productos",
    failureRedirect: "/errorlogin",
  })
);
userRouter.get("/logout", logoutUser);

export default userRouter;
