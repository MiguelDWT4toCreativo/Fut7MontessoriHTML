const fechaInput = document.getElementById('fecha');
const horaInicioSelect = document.getElementById('horaInicio');
const horaFinSelect = document.getElementById('horaFin');
const totalInput = document.getElementById('total');
const hours = ['08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00', '21:30', '22:00', '22:30', '23:00'];

// Cargar las horas disponibles
fechaInput.addEventListener('change', (e) => {        
    e.preventDefault();
    getFreeHoursByDate(e.target.value);
});

// Manejar el cambio de hora de inicio
horaInicioSelect.addEventListener('change', function () {
    const startHour = this.value;
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

function getFreeHoursByDate(date) {
    [selectYear, selectMonth, selectDay] = date.split('-');
    const yearCalendar = window.hourlyCalendar.find(item => item.year === selectYear);
    const monthCalendar = yearCalendar.months.find(item => item.month === selectMonth);
    const dayCalendar = monthCalendar.days.find(item => item.day === selectDay);
    const dayHours = dayCalendar.hours
    const freeHours = hours.filter(hour => !dayHours.includes(hour));

    // while(horaInicioSelect.firstChild) {
    //     horaInicioSelect.remove(horaInicioSelect.firstChild);
    // };

    freeHours.forEach(freeHour => {
        const option = document.createElement('option');
        option.value = freeHour;
        option.textContent = freeHour;
        horaInicioSelect.append(option);
    });
}
