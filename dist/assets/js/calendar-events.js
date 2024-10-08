// En calendar-events.js
'use strict';

const userCookies = {};
const permissions = checkCookies();

function checkCookies() {
  const rawUserCookies = getCookie('user');
  if (!rawUserCookies) window.location.href = './../pages/sign-in.html';
  Object.assign(userCookies, JSON.parse(decodeURIComponent(rawUserCookies)));
  const adminList = [
    'admin@admin.com',
    'jonguitudarriaga@gmail.com'
  ];
  if (adminList.includes(userCookies.email)) return true;
  return false;
}

// Función para obtener la cookie por nombre
function getCookie(name) {
  const nameEQ = name + "=";
  const ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
}

var curYear = moment().format('YYYY');
var curMonth = moment().format('MM');

window.calendarEvents = {
  id: 1,
  backgroundColor: '#66cb92',
  borderColor: '#007e37',
  events: [] // Se inicializa vacío
};

// Otros eventos como cumpleaños y vacaciones
window.birthdayEvents = {
  id: 2,
  backgroundColor: '#DA9401',
  borderColor: '#c6931f',
  events: [] // Se inicializa vacío
};

window.closedHours = {
  id: 2,
  backgroundColor: '#A9A9A9',
  borderColor: '#808080',
  events: [] // Se inicializa vacío
};

window.holidayEvents = { /* tu configuración de vacaciones */ };

const bussyHours = [];

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

      const hourlyCalendar = []; // Estructura inicial del calendario horario

      result.forEach(reservation => {
        if (reservation.status === 'cancelada') return;

        const [strStartDate, strStartTime] = reservation.inicio.split(' ');
        const strEndTime = reservation.finalizacion.split(' ')[1];
        const [strStartHour, strStartMinutes, strStartSeconds] = strStartTime.split(':');
        const [startHour, startMinutes] = [+strStartHour, +strStartMinutes];
        const [strEndHour, strEndMinutes, strEndSeconds] = strEndTime.split(':');
        const [endHour, endMinutes] = [+strEndHour, +strEndMinutes];
        const [decimalEndTime, decimalStartTime] = [
          ((endHour === 0 ? 24 : endHour) + (endMinutes / 60)),
          (startHour + (startMinutes / 60))
        ];

        const bussyHours = [];
        for (let i = decimalStartTime - 0.5; i < decimalEndTime; i += 0.5) {
          const [hour, minutes] = [Math.floor(i), i - Math.floor(i)];
          let strMinutes = `${minutes * 60}`;
          if (minutes === 0) strMinutes = '00';
          if (hour < 10) {
            bussyHours.push(`0${hour}:${strMinutes}`);
            continue;
          }
          bussyHours.push(`${hour}:${strMinutes}`);
        }

        const [reservationYear, reservationMonth, reservationDay] = strStartDate.split('-');
        
        // Verificar si existe el año
        let yearItem = hourlyCalendar.find(yearItem => yearItem.year === reservationYear);
        
        if (!yearItem) {
          yearItem = { year: reservationYear, months: [] };
          hourlyCalendar.push(yearItem);
        }

        // Encontrar o crear el mes
        let monthItem = yearItem.months.find(monthItem => monthItem.month === reservationMonth);
        
        if (!monthItem) {
          monthItem = { month: reservationMonth, days: [] };
          yearItem.months.push(monthItem);
        }

        // Encontrar o crear el día
        let dayItem = monthItem.days.find(dayItem => dayItem.day === reservationDay);
        
        if (!dayItem) {
          dayItem = { day: reservationDay, hours: [] };
          monthItem.days.push(dayItem);
        }

        // Agregar las horas ocupadas al día existente
        dayItem.hours.push(...bussyHours);
      });

      window.hourlyCalendar = hourlyCalendar;

      // Ahora `hourlyCalendar` tiene los datos actualizados
      console.log('hourlyCalendar');      
      console.log(hourlyCalendar);


      var events = result.map(function (reservation) {
        return {
          id: reservation.id,
          start: reservation.inicio,
          end: reservation.finalizacion,
          title: (reservation.status === 'cerrada' ? 'Cerrada' : permissions ? JSON.parse(reservation.customerData).name : 'Reservada'),
          status: reservation.status
        };
      });

      // Asigna los eventos al objeto calendarEvents
      window.calendarEvents.events = events.filter(event => event.status === 'confirmada');
      window.birthdayEvents.events = events.filter(event => event.status === 'pendiente');
      window.closedHours.events = events.filter(event => event.status === 'cerrada');

    } else {
      console.error('Error: El resultado no es un arreglo:', result);
    }

  } catch (error) {
    console.error('Error al obtener los eventos:', error);
  }
}

// Llama a fetchEvents para cargar los eventos
fetchEvents();
