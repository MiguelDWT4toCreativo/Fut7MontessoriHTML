
// 'use strict'

// new PerfectScrollbar('#calSidebar', {
//   suppressScrollX: true
// });

// $('#datepicker1').datepicker({
//   showOtherMonths: true,
//   selectOtherMonths: true
// });

// var calendarEl = document.getElementById('calendar');
// var calendar = new FullCalendar.Calendar(calendarEl, {
//   initialView: 'timeGridWeek',
//   headerToolbar: {
//     left: 'custom1 prev,next today',
//     center: 'title',
//     right: 'dayGridMonth,timeGridWeek,timeGridDay'
//   },
//   eventSources: [calendarEvents, birthdayEvents, holidayEvents],
//   selectable: true,
//   select: function(info) {
//     var startDate = moment(info.start).format('LL');
//     $('#startDate').val(startDate);

//     var endDate = moment(info.startStr).add(1, 'days');
//     $('#endDate').val(endDate.format('LL'));

//     $('#modalCreateEvent').modal('show');
//   },
//   eventClick: function(info) {
//     console.log(info.event.start);

//     // Set title
//     $('#modalLabelEventView').text(info.event.title);

//     $('#modalEventView').modal('show');
//   },
//   customButtons: {
//     custom1: {
//       icon: 'chevron-left',
//       click: function() {
//         $('.main-calendar').toggleClass('show');
//       }
//     }
//   }
// });

// calendar.render();

// $('#btnCreateEvent').on('click', function(e){
//   e.preventDefault();

//   var startDate = moment().format('LL');
//   $('#startDate').val(startDate);

//   var endDate = moment().add(1, 'days');
//   $('#endDate').val(endDate.format('LL'));

//   $('#modalCreateEvent').modal('show');
// });

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
        var startDate = moment(info.start).format('LL');
        $('#startDate').val(startDate);

        var endDate = moment(info.startStr).add(1, 'days');
        $('#endDate').val(endDate.format('LL'));

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
