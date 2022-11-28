import { Router } from "express";

const routerCart = Router();

//~~~~~~~~~~~~~~~~CONTROLLER~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
import {
  createCart,
  deleteCart,
  getProductCart,
  addProductCart,
  deleteProductCart,
  getAllCarritos,
  buyProduct,
} from "../controllers/carrito.controller.js";

//~~~~~~~~~~~~~~~~~ROUTES~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
routerCart.post("/:uid", createCart);
routerCart.get("/lista", getAllCarritos);
routerCart.delete("/:id", deleteCart);
routerCart.put("/agregar/:uid/:product", addProductCart);
routerCart.get("/", getProductCart);
routerCart.delete("/eliminar/:uid/:product", deleteProductCart);
routerCart.get("/comprar/:uid", buyProduct);
export default routerCart;
