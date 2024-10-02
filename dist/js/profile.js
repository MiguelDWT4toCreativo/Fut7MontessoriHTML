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
                document.querySelector('.media-name').textContent = data.nombre; // Ajusta aquí el nombre de la propiedad
                document.querySelector('.usuarioBarra').textContent = data.nombre;
                document.querySelector('.telefono').textContent = data.telefono; // Ajusta aquí el nombre de la propiedad
                document.querySelector('.emails').textContent = data.correo; // Ajusta aquí el nombre de la propiedad

                // Prefill form for editing
                document.querySelector('input[placeholder="Ingrese su nombre completo"]').value = data.nombre; // Ajusta aquí el nombre de la propiedad
                document.querySelector('input[placeholder="Ingrese su número de teléfono"]').value = data.telefono; // Ajusta aquí el nombre de la propiedad
            }
        })
        .catch(error => console.error('Error fetching user data:', error));
}

// Función para actualizar los datos del usuario
function updateUserData() {
    const newName = document.querySelector('input[placeholder="Ingrese su nombre completo"]').value;
    const newPhone = document.querySelector('input[placeholder="Ingrese su número de teléfono"]').value;

    fetch('https://fut7montessori.com.mx/model/profile.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
            action: 'updateUserData',
            name: newName,
            phone: newPhone,
        })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        if (data.success) {
            // Actualiza el HTML con los nuevos valores
            document.querySelector('.media-name').textContent = newName;
            document.querySelector('.usuarioBarra').textContent = newName;
            document.querySelector('.telefono').textContent = newPhone;
            alert('Datos actualizados correctamente.');
        } else {
            alert('Error al actualizar los datos: ' + data.message);
        }
    })
    .catch(error => console.error('Error updating user data:', error));
}

// Llamar a la función al cargar la página para obtener los datos del usuario
document.addEventListener('DOMContentLoaded', function () {
    getUserData();
});

// Asignar la función de actualización al botón de "Actualizar"
document.querySelector('.btn-success').addEventListener('click', function() {
    updateUserData();
});
