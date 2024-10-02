document.addEventListener('DOMContentLoaded', function () {
  const contactListBody = document.getElementById('contactListBody');

  // Realizamos la petición fetch al archivo PHP para obtener los contactos
  fetch('https://fut7montessori.com.mx/model/contacts.php', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    }
  })
    .then((response) => response.json())
    .then((data) => {
      // Vacía la lista de contactos antes de agregar nuevos
      contactListBody.innerHTML = '';

      // Variable para rastrear la primera letra del nombre
      let currentLetter = '';

      // Recorre los clientes y los agrega a la lista
      data.forEach(function (cliente) {
        // Obtén la primera letra del nombre
        const firstLetter = cliente.nombre.charAt(0).toUpperCase();

        // Si la primera letra es diferente a la actual, agrega una nueva etiqueta
        if (firstLetter !== currentLetter) {
          currentLetter = firstLetter;
          const label = document.createElement('label');
          label.classList.add('sidebar-label', 'mb-2');
          label.textContent = currentLetter;
          contactListBody.appendChild(label);
        }

        // Crear el contacto
        const contactGroup = document.createElement('div');
        contactGroup.classList.add('contact-group', 'mb-3');

        const contactItem = document.createElement('div');
        contactItem.classList.add('contact-item');

        contactItem.innerHTML = `
                  <div class="avatar offline">
                      <img src="../assets/img/img11.jpg" alt="">
                  </div>
                  <div class="contact-item-body">
                      <div class="d-flex align-items-center mb-1">
                          <h6 class="mb-0">${cliente.nombre}</h6>
                      </div>
                      <span>${cliente.telefono}</span>
                  </div>
              `;

        // Añadir el evento de clic
        contactItem.addEventListener('click', function (event) {
          event.preventDefault();  // Prevenir acciones predeterminadas
          // console.log('Contacto clicado:', cliente); // Verificar el cliente
          showContactDetails(cliente); // Llama a la función con el cliente
        });

        contactGroup.appendChild(contactItem);
        contactListBody.appendChild(contactGroup);
      });
    })
    .catch((error) => {
      console.error('Error al obtener los datos:', error);
    });
});

// Función para mostrar los detalles del contacto
function showContactDetails(cliente) {
  // console.log('Mostrando detalles del contacto:', cliente); // Verificar que se llame la función

  // Actualizar los detalles del contacto en el HTML
  document.getElementById('cName').textContent = cliente.nombre || 'Sin nombre';
  document.getElementById('cEmail').textContent = cliente.correo || 'Sin correo'; // Asegúrate de que esto exista en los datos de cliente
  document.getElementById('cPhone').textContent = cliente.telefono || 'Sin teléfono';

  // Si tienes una URL o ruta para la imagen del cliente, úsala aquí
  // document.getElementById('cAvatarImg').src = cliente.avatar || '../assets/img/img11.jpg'; // Usar avatar o imagen predeterminada

  // Mostrar el contenido del contacto
  document.getElementById('contactContent').style.display = 'block'; // Asegúrate de que este estilo esté en tu CSS
}
