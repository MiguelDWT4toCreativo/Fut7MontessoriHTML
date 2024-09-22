document.addEventListener('DOMContentLoaded', function () {
    const correoInput = document.getElementById('correo');
    const passwordInput = document.getElementById('contrasenia');
    const signinForm = document.getElementById('signinForm');

    let correo = '';
    let password = '';
    let wrongBadges = false;

    // Event listeners to capture input values
    correoInput.addEventListener('input', (event) => {
      correo = event.target.value;
    });

    passwordInput.addEventListener('input', (event) => {
      password = event.target.value;
    });

    // Handle form submission
    signinForm.addEventListener('submit', (event) => {
      event.preventDefault(); // Prevent default form submission

      const data = {
        correo: correo,
        password: password,
      };

      fetch('https://fut7montessori.com.mx/model/signin.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams(data),
      })
        .then((response) => response.json())
        .then((result) => {
          if (result.status === 'Correo o contraseña incorrectos') {
            wrongBadges = true;
            alert('Correo o contraseña incorrectos');
            return;
          }
          if (!result.userStatus) return;

          // Save user data in a cookie (example with a 7-day duration)
          document.cookie = `user=${encodeURIComponent(JSON.stringify(result))}; max-age=${7 * 24 * 60 * 60}; path=/`;

          // Redirect based on the email entered
          if (correo === 'admin@admin.com') {
            window.location.href = '../dashboard/helpdesk.html'; // Redirection for admin
          } else {
            window.location.href = '../apps/calendar.html'; // Redirection for other users
          }
        })
        .catch((error) => {
          console.error('Error:', error);
        });
    });
  });