// Importar módulos
const crypto = require("crypto");
const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");
require("dotenv").config();
const {
  CambiarCodigo,
  ConsultaToken,
  CambiarPassword,
  UserPassword,
  insertarUsuario,
} = require("./database");

// Inicializar la app
const app = express();
const port = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(cors());

// Configurar el transporte de correo electrónico
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Generar token
let token = crypto.randomBytes(32).toString("hex");

// Enviar correo electrónico con token
app.post("/enviar-correo", async (req, res) => {
  const { email } = req.body;
  const respuestaCorrecta = await CambiarCodigo(email, token);
  if (respuestaCorrecta) {
    try {
      const info = await transporter.sendMail({
        from: `"Noe Rios Martinez" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: "Recuperación de contraseña",
        text: "Atencion",
        html: `
          <h1>Restablecer tu contraseña</h1>
          <p>Si no has solicitado restablecer tu contraseña, ignora este correo electrónico.</p>
          <p>Haz clic en el enlace para restablecer tu contraseña: 
          <a href="http://localhost:5500/public/pages/cambiarpassword.html?${token}">Restablecer contraseña</a></p>
        `,
      });
      res
        .status(200)
        .json({
          status: "OK",
          message:
            "Revise su correo electrónico para obtener instrucciones sobre cómo restablecer su contraseña.",
        });
    } catch (error) {
      res
        .status(500)
        .json({ status: "Error", message: "Error al enviar el correo." });
    }
  } else {
    res
      .status(400)
      .json({
        status: "Error",
        message:
          "Correo no encontrado. Por favor, verifica la dirección ingresada o regístrate si eres nuevo.",
      });
  }
});

// Restablecer contraseña
app.post("/reset-password", async (req, res) => {
  const { token, password } = req.body;
  try {
    const results = await ConsultaToken(token);
    if (!results || results.length === 0) {
      return res.status(400).send("No ha sido posible cambiar su contraseña.");
    }
    const user = results[0].id_usuario;
    await CambiarPassword(password, user);
    res
      .status(200)
      .json({ status: "OK", message: "Contraseña cambiada exitosamente." });
  } catch (error) {
    console.error("Error al procesar la solicitud:", error);
    res
      .status(500)
      .json({
        status: "Error",
        message: "No ha sido posible cambiar su contraseña.",
      });
  }
});

// Login
app.post("/login", async (req, res) => {
  const { user, pass } = req.body;
  try {
    const datos = await UserPassword(user);
    if (pass !== datos[0].password_hash) {
      res
        .status(500)
        .json({
          status: "Error",
          message:
            "Usuario o contraseña incorrectos. Por favor, verifica tus datos e inténtalo de nuevo.",
        });
    } else {
      res.status(200).json({ status: "OK", message: "Bienvenido" });
      //Editar para iniciar
      window.location.href = "login.html";
    }
  } catch (error) {
    res
      .status(500)
      .json({
        status: "Error",
        message:
          "Usuario o contraseña incorrectos. Por favor, verifica tus datos e inténtalo de nuevo.",
      });
  }
});

// Nuevo usuario
app.post("/new-user", async (req, res) => {
  const { usuario, correo, nombre, apellido, password } = req.body;
  insertarUsuario(usuario, correo, nombre, apellido, password);
  try {
    return res.json({ status: "OK", message: "Usuario creado correctamente." });
  } catch (error) {
    res
      .status(500)
      .json({
        status: "OK",
        message:
          "Por favor verifica tu información o intenta nuevamente más tarde.",
      });
  }
});

// Iniciar servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
