import express from "express";
import passport from "passport";
import session from "express-session";
import { create } from "express-handlebars";
import { Strategy } from "passport-local";
import mongo from "connect-mongo";
import User from "./models/mongo/users.model.js";
import { verified } from "./utils/bcryptHandler.js";
const app = express();
import "dotenv/config";

import * as url from "url";
const __filename = url.fileURLToPath(import.meta.url);
const __dirname = url.fileURLToPath(new URL(".", import.meta.url));

//~~~~~~~~~IMPORT ROUTES~~~~~~~~~~~~~~~~~~~~~~~~
import productRoutes from "./routes/productos.routes.js";
import carritoRoutes from "./routes/carrito.routes.js";
import userRouter from "./routes/user.routes.js";
import indexRouter from "./routes/index.routes.js";
//configuracion mongo:
import dbConnect from "./utils/connectMongo.js";
import path from "path";

//para mongo-atlas-session:
const advancedOptions = { useNewUrlParser: true, useUnifiedTopology: true };
const mongoStore = mongo.create({
  mongoUrl: process.env.URI_MONGO,
  mongoOptions: advancedOptions,
  ttl: 600,
});

const LocalStrategy = Strategy;
/*----------- Session -----------*/
app.use(
  session({
    store: mongoStore,
    secret: process.env.SECRET_SESSION,
    resave: true,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 24, // 24 hours
    },
  })
);
app.use(passport.initialize());
app.use(passport.session());

passport.use(
  new LocalStrategy(async function (username, password, done) {
    //Chequear usuario:
    User.findOne({ email: username }, async (err, user) => {
      if (err) throw err;
      if (!user) return done(null, false);
      const checkPass = await verified(password, user.password);
      if (!checkPass) {
        return done(null, false);
      }
      return done(null, user);
    });
  })
);

//Serialize :
passport.serializeUser((user, done) => {
  done(null, { id: user._id });
});

passport.deserializeUser(async (data, done) => {
  const user = await User.findOne({ _id: data.id }).lean();
  if (!user) done(null, false);
  return done(null, user);
});

//Si el storage está configurado para mongo conectamos la db:
if (process.env.STORAGE === "mongo") {
  dbConnect().then(() => console.log("Conectado a la db."));
}

app.use(express.json());
app.use(express.static("public"));

//Motor de plantillas:
const hbs = create({
  extname: ".hbs",
  partialsDir: path.join(__dirname, "views/components"),
});
app.engine(".hbs", hbs.engine);
app.set("view engine", ".hbs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));

//~~~~~~~~~~~~~~~ROUTES~~~~~~~~~~~~~~~~~~~~~~~~
app.use("/productos", productRoutes);
app.use("/carrito", carritoRoutes);
app.use("/user", userRouter);
app.use("/", indexRouter);

export default app;
