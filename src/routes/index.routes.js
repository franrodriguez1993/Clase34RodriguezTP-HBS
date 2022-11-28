import { Router } from "express";
const indexRouter = Router();

indexRouter.get("/", (req, res) => {
  const userData = req.user;
  res.render("index", { userData });
});

indexRouter.get("/errorlogin", (req, res) => {
  return res.render("errorLogin");
});
indexRouter.get("/perfil", (req, res) => {
  const user = req.user;
  return res.render("perfil", { user });
});
indexRouter.get("/exito", (req, res) => {
  return res.render("exito");
});
export default indexRouter;
