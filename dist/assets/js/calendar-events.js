// En calendar-events.js
'use strict';

var curYear = moment().format('YYYY');
var curMonth = moment().format('MM');

window.calendarEvents = {
  id: 1,
  backgroundColor: '#c3edd5',
  borderColor: '#10b759',
  events: [] // Se inicializa vacío
};

// Otros eventos como cumpleaños y vacaciones
window.birthdayEvents = { /* tu configuración de cumpleaños */ };
window.holidayEvents = { /* tu configuración de vacaciones */ };

async function fetchEvents() {
  try {
    const response = await fetch('https://fut7montessori.com.mx/model/fetchReservas.php', {
      method: 'GET', // Asegúrate de que el método es correcto
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });

    const result = await response.json();
    console.log('Eventos obtenidos:', result); // Muestra los eventos obtenidos del servidor

    // Verifica si result es un arreglo y asigna eventos
    if (Array.isArray(result)) {
      var events = result.map(function (reservation) {
        return {
          id: reservation.id,
          start: reservation.inicio,
          end: reservation.finalizacion,
          title: 'Cliente ' + reservation.clienteId
        };
      });

      // Asigna los eventos al objeto calendarEvents
      window.calendarEvents.events = events;
      console.log('Eventos asignados a calendarEvents:', window.calendarEvents.events);

    } else {
      console.error('Error: El resultado no es un arreglo:', result);
    }

  } catch (error) {
    console.error('Error al obtener los eventos:', error);
  }
}

// Llama a fetchEvents para cargar los eventos
fetchEvents();
