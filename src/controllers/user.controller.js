import { daoUser } from "../dao/daoIndex.js";
import User from "../models/mongo/users.model.js";
import { encrypt } from "../utils/bcryptHandler.js";
import { transporter } from "../helpers/transport.js";
import { logger } from "../utils/logger.js";
/**======================================================================================**/
/** ========================= REGISTER =========================**/

const registerUser = async (req, res) => {
  try {
    const {
      nombre,
      apellido,
      email,
      edad,
      password,
      telefono,
      direccion,
      avatar,
    } = req.body;
    const checkUser = await User.findOne({ email });
    if (checkUser)
      return res.render("register", { registermsg: "Usuario ya existe" });
    const hashpass = await encrypt(password);
    const body = {
      nombre,
      apellido,
      email,
      edad,
      password: hashpass,
      telefono,
      direccion,
      avatar,
    };
    const user = await daoUser.save(body);

    if (!user)
      return res.render("register", { registermsg: "Error registrando" });
    //MAIL AL ADMINISTRADOR:
    const mailOptions = {
      from: "Server <noreply@node.com>",
      to: `${process.env.EMAIL}`,
      subject: "Nuevo registro",
      text: `NUEVO USUARIO: ${user.email} - ${user.nombre} ${user.apellido} | Direccion: ${user.direccion} | Teléfono: ${user.telefono}`,
    };
    transporter.sendMail(mailOptions);
    return res.redirect("/user/login");
  } catch (e) {
    logger.warn(e.message);
  }
};

/**======================================================================================**/
const logoutUser = (req, res) => {
  try {
    req.session.destroy((err) => {
      if (err) {
        throw err;
      } else {
        return res.redirect("/");
      }
    });
  } catch (e) {
    logger.warn(e.message);
  }
};

export { registerUser, logoutUser };
