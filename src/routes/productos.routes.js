import { Router } from "express";
const router = Router();
//~~~~~~~~~~~~~~~CONTROLLERS~~~~~~~~~~~~~~~~~~~~~~~~~
import {
  getAllProducts,
  getOneProduct,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/productos.controller.js";

//~~~~~~~~~~~~~~~~~~~ROUTES~~~~~~~~~~~~~~~~~~~~~~~~
router.get("/", getAllProducts);
router.get("/:id", getOneProduct);
router.post("/create", createProduct);
router.put("/:id", updateProduct);
router.delete("/:id", deleteProduct);

export default router;
