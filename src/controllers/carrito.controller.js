import { daoCarrito } from "../dao/daoIndex.js";
import User from "../models/mongo/users.model.js";
import { transporter } from "../helpers/transport.js";
import { logger } from "../utils/logger.js";
import { clientTwilio } from "../utils/twilio.js";
const createCart = async (req, res) => {
  try {
    const { uid } = req.params;
    //Chequeamos que el user exista:
    const user = await User.findOne({ _id: uid });
    if (!user) return res.json({ status: 404, msg: "Usuario no existe" });
    //Chequeamos que el usuario no tenga un carrito:
    const carrito = await daoCarrito.getByUser(uid);
    //Si no existe lo creamos y le agregamos el producto:
    if (!carrito) {
      await daoCarrito.save({ user: uid, products: [] });
    } else {
      return res.json({ status: 400, msg: "El usuario ya tiene un carrito" });
    }

    return res.json({ msg: "carrito creado con éxito." });
  } catch (error) {
    logger.warn(e.message);
    return res.json({ status: 500, msg: error.message });
  }
};

const getAllCarritos = async (req, res) => {
  try {
    const cartList = await daoCarrito.getAll();
    return res.json(cartList);
  } catch (e) {
    logger.warn(e.message);
    return res.json({ error: e.message });
  }
};

const deleteCart = async (req, res) => {
  const { id } = req.params;
  try {
    await daoCarrito.deleteById(id);
    return res.json({ msg: "Carrito eliminado con éxito." });
  } catch (error) {
    logger.warn(e.message);
    return res.json({ status: 500, msg: error.message });
  }
};

const addProductCart = async (req, res) => {
  try {
    const { uid, product } = req.params;
    //Chequeamos que el user exista:
    const user = await User.findOne({ _id: uid });
    if (!user) return res.json({ status: 404, msg: "Usuario no existe" });
    //Chequeamos que el usuario no tenga un carrito:
    const carrito = await daoCarrito.getByUser(uid);
    //Si no existe lo creamos y le agregamos el producto:
    if (!carrito) {
      await daoCarrito.save({ user: uid, products: [product] });
    } else {
      //Si ya existe le agregamos solo el producto:
      carrito.products.push(product);
      await carrito.save();
    }

    return res.json({ msg: "Producto agregado con éxito" });
  } catch (e) {
    logger.warn(e.message);
  }
};

const getProductCart = async (req, res) => {
  const uid = req.user._id;
  try {
    const cart = await daoCarrito.getProductCart(uid);
    return res.render("carrito", { carrito: cart.products, uid: uid });
  } catch (e) {
    logger.warn(e.message);
  }
};

const deleteProductCart = async (req, res) => {
  const { uid, product } = req.params;
  try {
    const cart = await daoCarrito.deleteProductCart(uid, product);
    return res.json({ status: 200, msg: "OK", data: cart });
  } catch (e) {
    logger.warn(e.message);
  }
};

const buyProduct = async (req, res) => {
  try {
    const { uid } = req.params;
    const user = await User.findOne({ _id: uid });
    const cart = await daoCarrito.getProductCart(uid);
    if (cart.products.length === 0)
      return res.render("carrito", { msg: "No hay productos en tu carrito" });
    //MAIL AL ADMINISTRADOR:
    const mailOptions = {
      from: "Server <noreply@node.com>",
      to: `${process.env.EMAIL}`,
      subject: `Nueva order de compra de ${user.nombre} ${user.apellido}`,
      text: `${cart.products}`,
    };

    transporter.sendMail(mailOptions);
    clientTwilio.messages.create({
      from: "whatsapp:+14155238886",
      to: `whatsapp:${process.env.TWILIO_CELLPHONE_NUMBER} `,
      body: `${cart.products}`,
    });
    return res.redirect("/exito");
  } catch (e) {
    logger.warn(e.message);
    return res.json({ status: 500, msg: e.message });
  }
};

export {
  createCart,
  deleteCart,
  getProductCart,
  addProductCart,
  deleteProductCart,
  getAllCarritos,
  buyProduct,
};
