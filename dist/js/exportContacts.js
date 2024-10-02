// Función para exportar contactos
function exportContacts() {
    window.location.href = 'https://fut7montessori.com.mx/model/exportContacts.php?action=export'; // Redirigir a la exportación
}

// Función para obtener el número total de contactos
function getTotalContacts() {
    fetch('https://fut7montessori.com.mx/model/exportContacts.php?action=count')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            document.getElementById('totalContactos').innerText = `Todos los Contactos ${data.total}`;
        })
        .catch(error => console.error('Error:', error));
}

// Función para obtener todos los contactos
function getAllContacts() {
    fetch('https://fut7montessori.com.mx/model/exportContacts.php?action=get_all')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            // console.log('Todos los contactos:', data); // Puedes usar los datos como desees
        })
        .catch(error => console.error('Error:', error));
}

// Llamar a la función al cargar la página
document.addEventListener('DOMContentLoaded', function () {
    getTotalContacts(); // Obtener el total de contactos al cargar
    getAllContacts(); // Obtener todos los contactos al cargar (opcional)
});
