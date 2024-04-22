const mysql = require("mysql2");

//Configuración de la conexión a la base de datos
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "skrillex123",
  database: "ProyectoPET",
});

// Función para establecer la conexión
function conectarDB() {
  return new Promise((resolve, reject) => {
    connection.connect((err) => {
      if (err) {
        console.error("Error connecting to the database:", err);
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

//Cambiar el código
async function CambiarCodigo(Correo, token) {
  try {
    await conectarDB();
    const [rows] = await connection
      .promise()
      .query("SELECT id_usuario FROM Usuarios WHERE correo = ?", [Correo]);
    if (rows.length > 0) {
      const id_usuario = rows[0].id_usuario;
      const newInsert = {
        id_usuario: id_usuario,
        token: token,
      };
      await connection.promise().query("INSERT INTO Tokens SET ?", newInsert);
      return "Token insertado correctamente";
    } else {
      res
        .status(500)
        .json({ status: "Error", message: "Usuario no encontrado" });
    }
  } catch (error) {
    console.error("Error al insertar el token:", error);
  }
}

//Consultar un token
async function ConsultaToken(token) {
  try {
    await conectarDB();
    const [results] = await connection
      .promise()
      .query("SELECT * FROM tokens WHERE token = ?", [token]);
    return results;
  } catch (error) {
    console.error("Error querying data:", error);
    return null;
  }
}

//Cambiar la contraseña
async function CambiarPassword(password, user) {
  try {
    await conectarDB();
    const newValues = [password, user];
    await connection
      .promise()
      .query(
        "UPDATE usuarios SET password_hash = ? WHERE id_usuario = ?",
        newValues
      );
  } catch (error) {
    console.error("Error updating data:", error);
  }
}

// Consultar Usuario Y contraseña
async function UserPassword(user) {
  try {
    await conectarDB();
    const [results] = await connection
      .promise()
      .query("SELECT * FROM usuarios WHERE  usuario = ?", [user]);
    return results;
  } catch (error) {
    console.error("Error querying data:", error);
    return null;
  }
}

//Nuevo usuario
async function insertarUsuario(user, email, nombre, apellido, contraseña) {
  try {
    await conectarDB();
    await connection
      .promise()
      .query(
        "INSERT INTO  usuarios (usuario, correo, nombre, apellido, password_hash) VALUES (?, ?, ?, ?, ?)",
        [user, email, nombre, apellido, contraseña]
      );
  } catch (error) {}
}

module.exports = {
  CambiarCodigo,
  ConsultaToken,
  CambiarPassword,
  UserPassword,
  insertarUsuario,
};
