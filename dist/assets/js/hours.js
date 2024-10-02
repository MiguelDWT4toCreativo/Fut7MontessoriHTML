const fechaInput = document.getElementById('fecha');
const horaInicioSelect = document.getElementById('horaInicio');
const horaFinSelect = document.getElementById('horaFin');
const totalInput = document.getElementById('total');
const hours = ['08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00', '21:30', '22:00', '22:30', '23:00'];
let freeStartHours = [];

// Cargar las horas disponibles
fechaInput.addEventListener('change', (e) => {        
    e.preventDefault();
    const reservationDate = e.target.value;
    freeStartHours = getFreeStartHours(reservationDate);

    while(horaInicioSelect.firstChild) {
        horaInicioSelect.removeChild(horaInicioSelect.firstChild);
    };

    freeStartHours.forEach(freeStartHour => {
        const option = document.createElement('option');
        option.value = freeStartHour;
        option.textContent = freeStartHour;
        horaInicioSelect.append(option);
    });
});

// Manejar el cambio de hora de inicio
horaInicioSelect.addEventListener('change', function (e) {    
    let horaFinOptions = [];
    // let horaFinDisabled = true;
    const value = e.target.value;
    let [hour, minutes] = value.split(':');
    const [decimalHour, decimalMinutes] = [+hour, +minutes/60];
    const decimalTime = decimalHour + decimalMinutes;
    for (let i = decimalTime + 1; i <= decimalTime + 2; i+=.5) {
      const floor = Math.floor(i);
      minutes = ((i-floor)*60) === 0 ? '00' : '30';
      hour = floor < 10 ? `0${floor}` : `${floor}`;
      const strTime = `${hour}:${minutes}`; 
      // if (changingHourOptions.includes(strTime)) {horaFinOptions.push({ value: strTime, label: convertirHora(strTime) }); break;}
      if (!freeStartHours.includes(strTime) && i === decimalTime + 1 ) {horaFinOptions.push({ value: strTime, label: strTime }); break;}
      if (!freeStartHours.includes(strTime)) continue;
      if (decimalTime === 23) {horaFinOptions.push('00:00'); break;}
      horaFinOptions.push({ value: strTime, label: strTime });
      if (i === 24) break;
    }
    while(horaFinSelect.firstChild) {
        horaFinSelect.removeChild(horaFinSelect.firstChild);
    }
    horaFinOptions.forEach(endHour => {
        const option = document.createElement('option');
        option.value = endHour.value;
        option.textContent = endHour.value;
        horaFinSelect.append(option);
    }) 
});

// Manejar el cambio de hora de finalización y actualizar el total
horaFinSelect.addEventListener('change', function () {
    const selectedIndex = horaFinSelect.selectedIndex;
    updateTotal(selectedIndex);
});

// Actualiza el valor del total basado en la selección del índice de la hora de finalización
function updateTotal(index) {
    let totalValue;
    switch (index) {
        case 1:
        totalValue = 500; // 1 hora
        break;
        case 2:
        totalValue = 650; // 1.5 horas
        break;
        case 3:
        totalValue = 800; // 2 horas
        break;
        default:
        totalValue = 0;
        break;
    }
    totalInput.value = totalValue;
}

function getFreeStartHours(date) {
    [selectYear, selectMonth, selectDay] = date.split('-');
    const yearCalendar = window.hourlyCalendar.find(item => item.year === selectYear);
    const monthCalendar = yearCalendar.months.find(item => item.month === selectMonth);
    const dayCalendar = monthCalendar.days.find(item => item.day === selectDay);
    const dayHours = dayCalendar.hours
    const freeHours = hours.filter(hour => !dayHours.includes(hour));
    return freeHours;
}

function getFreeEndHours(date) {
    [selectYear, selectMonth, selectDay] = date.split('-');
    const yearCalendar = window.hourlyCalendar.find(item => item.year === selectYear);
    const monthCalendar = yearCalendar.months.find(item => item.month === selectMonth);
    const dayCalendar = monthCalendar.days.find(item => item.day === selectDay);
    const dayHours = dayCalendar.hours
    const freeHours = hours.filter(hour => !dayHours.includes(hour));
    return freeHours;
}
