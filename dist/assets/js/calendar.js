'use strict'

// Inicialización del PerfectScrollbar en el sidebar
new PerfectScrollbar('#calSidebar', {
  suppressScrollX: true
});

// Inicialización del datepicker
$('#datepicker1').datepicker({
  showOtherMonths: true,
  selectOtherMonths: true
});

// Seleccionar el elemento del calendario
var calendarEl = document.getElementById('calendar');

// Verificar que el elemento del calendario existe
if (!calendarEl) {
  console.error('El contenedor del calendario no se encontró.');
}

// Asegurarse de que los eventos estén listos antes de inicializar el calendario
async function initCalendar() {
  try {
    // Esperar a que los eventos sean cargados
    await fetchEvents(); 

    // Inicialización de FullCalendar
    var calendar = new FullCalendar.Calendar(calendarEl, {
      initialView: 'timeGridWeek',
      headerToolbar: {
        left: 'custom1 prev,next today',
        center: 'title',
        right: 'dayGridMonth,timeGridWeek,timeGridDay'
      },
      eventSources: [window.calendarEvents, window.birthdayEvents, window.holidayEvents], // Accede a los eventos globales
      selectable: true,
      select: function (info) {
        const [date, time] = moment(info.start).format('YYYY-MM-DD HH:mm').split(' ');
        document.getElementById('fecha').value = date;
        document.getElementById('horaInicio').value = time;
        // document.getElementById('horaInicio').change();


        const [endDate, endTime] = moment(info.end).format('YYYY-MM-DD HH:mm').split(' ');
        let [endHour, endMinutes] = endTime.split(':');
        endHour = parseInt(endHour);
        endMinutes = parseInt(endMinutes);

        const horaFinSelect = document.getElementById('horaFin');
        
        const startHour = time;
        horaFinSelect.innerHTML = '<option>Hora</option>';
        let [hour, minutes] = startHour.split(':');
        hour = parseInt(hour);
        minutes = parseInt(minutes);

        // Generar opciones de fin: 1 hora, 1.5 horas y 2 horas
        for (let i = 1; i <= 2; i += 0.5) {
          let totalMinutes = minutes + (i * 60); // Convertir i horas en minutos y sumarlo a los minutos iniciales
          let endHour = hour + Math.floor(totalMinutes / 60); // Añadir horas completas
          let endMinutes = totalMinutes % 60; // Obtener los minutos restantes después de convertir a horas

          // Ajustar si la hora sobrepasa 24 horas (formato de 24 horas)
          endHour = endHour >= 24 ? endHour - 24 : endHour;

          const formattedMinutes = endMinutes === 0 ? '00' : endMinutes.toString().padStart(2, '0');
          const formattedHour = endHour < 10 ? `0${endHour}` : endHour;

          const option = document.createElement('option');
          option.value = `${formattedHour}:${formattedMinutes}`;
          option.textContent = `${formattedHour}:${formattedMinutes}`;
          horaFinSelect.appendChild(option);
        }


        const timeLapse = (endHour + (endMinutes/60)) - (hour + (minutes/60));
        let total;
        switch(timeLapse) {
          case 0.5:
            endHour = endHour + (endMinutes/60) + .5;
            endMinutes = endHour - Math.floor(endHour);
            endHour = endHour - endMinutes;
            endMinutes *= 60;
            total = 500;
            break;
          case 1: total = 500; break;
          case 1.5: total = 650; break;
          case 2: total = 800; break;
          default: break;
        }

        horaFinSelect.value = `${endHour < 10 ? '0'+endHour : endHour}:${endMinutes === 0 ? '00' : endMinutes.toString().padStart(2, '0')}`;
        document.getElementById('total').value = total;


        $('#modalCreateEvent').modal('show');
      },
      eventClick: function (info) {
        console.log('Evento seleccionado:', info.event.start);
        $('#modalLabelEventView').text(info.event.title);
        $('#modalEventView').modal('show');
      },
      customButtons: {
        custom1: {
          icon: 'chevron-left',
          click: function () {
            $('.main-calendar').toggleClass('show');
          }
        }
      }
    });

    // Renderizar el calendario
    calendar.render();
    console.log('El calendario se ha renderizado correctamente con eventos:', window.calendarEvents.events);

  } catch (error) {
    console.error('Error al inicializar el calendario:', error);
  }
}

// Ejecuta la inicialización del calendario
initCalendar();

// Manejar el botón de creación de eventos
$('#btnCreateEvent').on('click', function (e) {
  e.preventDefault();

  var startDate = moment().format('LL');
  $('#startDate').val(startDate);

  var endDate = moment().add(1, 'days');
  $('#endDate').val(endDate.format('LL'));

  $('#modalCreateEvent').modal('show');
});
