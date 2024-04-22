// Crear mensaje emergente
function mensajeEmergente() {
  const mensajeDiv = document.createElement("div");
  mensajeDiv.id = "mensaje";
  mensajeDiv.className = "containermensaje";

  const messDiv = document.createElement("div");
  messDiv.id = "mess";
  messDiv.className = "mensaje";

  const cerrarBtn = document.createElement("button");
  cerrarBtn.className = "cerrar";
  cerrarBtn.textContent = "X";
  cerrarBtn.onclick = cerrarMensaje;

  mensajeDiv.appendChild(messDiv);
  mensajeDiv.appendChild(cerrarBtn);
  document.body.appendChild(mensajeDiv);
}

// Enviar formulario y manejo de errores
function enviarFormulario(direccion) {
  mensajeEmergente();
  const mensajeDiv = document.getElementById("mensaje");
  const mensaje = document.getElementById("mess");
  const boton = document.getElementById("button");
  boton.disabled = true;
  boton.style.backgroundColor = "#8fc5ff";

  const formData = $("form").serialize();

  $.ajax({
    type: "POST",
    url: `http://localhost:3000${direccion}`,
    data: formData,
    success: function (response) {
      mensaje.textContent = response.message;
      mensajeDiv.style.display = "flex";
      boton.disabled = false;
      boton.style.backgroundColor = "#007bff";

      setTimeout(function () {
        mensajeDiv.style.display = "none";
        window.location.href = "login.html";
      }, 10000);
    },
    error: function (xhr, status, error) {
      mensaje.textContent = xhr.responseJSON.message;
      mensajeDiv.style.display = "flex";
      boton.disabled = false;
      boton.style.backgroundColor = "#007bff";
    },
  });
}

// Cerrar mensaje emergente
function cerrarMensaje() {
  const mensajeDiv = document.getElementById("mensaje");
  mensajeDiv.style.display = "none";
}
