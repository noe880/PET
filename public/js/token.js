document.addEventListener('DOMContentLoaded', function() {
    var currentUrl = window.location.href;
    var tokenIndex = currentUrl.indexOf('?');
    var tokenValue = tokenIndex !== -1 ? currentUrl.substring(tokenIndex + 1) : '';
    document.getElementById('token').value = tokenValue;
    document.getElementById('form').addEventListener('submit', function(event) {
    });
  });

  function ConfirmarPasswors(){
    var password = document.getElementById('password');
    var confirmarPassword = document.getElementById('confirmarPassword');

    var valorpassword = password.value;
    var valorconfirmarPassword  = confirmarPassword .value;
    if(valorpassword !== valorconfirmarPassword){
      mensajeEmergente();
      const mensajeDiv = document.getElementById('mensaje');
      const mensaje = document.getElementById('mess');
      mensaje.textContent = "Verifica tu contraseña";
      mensajeDiv.style.display = 'flex';
    }
    else{
    enviarFormulario('/reset-password');
    }
  }