// Función para obtener los datos del usuario
function getUserData() {
    fetch('https://fut7montessori.com.mx/model/profile.php?action=getUserData')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            if (data.status && data.status === 'Error') {
                console.error(data.message);
                alert(data.message); // Muestra el mensaje de error al usuario
            } else {
                // Actualizar los campos con la información del usuario
                document.querySelector('.usuarioBarra').textContent = data.nombre;
                document.getElementById('usuarioBarra').textContent = data.nombre;
            }
        })
        .catch(error => console.error('Error fetching user data:', error));
}

// Llamar a la función al cargar la página para obtener los datos del usuario
document.addEventListener('DOMContentLoaded', function () {
    getUserData();
});