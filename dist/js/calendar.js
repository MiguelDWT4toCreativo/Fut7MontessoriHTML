document.addEventListener('DOMContentLoaded', () => {
    // Variables del DOM
    const asistentesInput = document.getElementById('asistentes');
    const fechaInput = document.getElementById('fecha');
    const horaInicioSelect = document.getElementById('horaInicio');
    const horaFinSelect = document.getElementById('horaFin');
    const totalInput = document.getElementById('total');
    const btnGuardar = document.getElementById('btnGuardar');
  
    // Stripe setup
    const stripe = Stripe('pk_live_51PyhP5KJQTnSHL1ZgCd4aiOMCm8i7w6EKzBzf2XsYUvAoSiUdHGbGrJT9myaYySsj2hNtSvNGyZZsJMGp941azbt003Rs2iw1X');
    let elements;
    let clientSecret = "";
  
    // Lista de horas disponibles para inicio
    let hourOptions = ['08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00', '21:30', '22:00', '22:30', '23:00'];
  
    // Cargar opciones de hora de inicio
    hourOptions.forEach(hour => {
      const option = document.createElement('option');
      option.value = hour;
      option.textContent = hour;
      horaInicioSelect.appendChild(option);
    });
  
    // Manejar el cambio de hora de inicio
    horaInicioSelect.addEventListener('change', (event) => {
      const value = event.target.value;
      horaFinSelect.innerHTML = '<option value="">Hora</option>'; // Resetea las opciones de hora de fin
  
      // Generar las tres opciones de duración basadas en la hora de inicio seleccionada
      const [startHour, startMinutes] = value.split(':').map(Number);
      const startTimeInMinutes = startHour * 60 + startMinutes; // Convierte la hora de inicio a minutos
  
      // Calcular las opciones de fin: +1 hora, +1.5 horas, +2 horas
      const durations = [60, 90, 120]; // Duraciones en minutos
  
      durations.forEach(duration => {
        const endTimeInMinutes = startTimeInMinutes + duration;
        const endHour = Math.floor(endTimeInMinutes / 60);
        const endMinutes = endTimeInMinutes % 60;
        const formattedEndHour = endHour < 10 ? `0${endHour}` : endHour;
        const formattedEndMinutes = endMinutes === 0 ? '00' : endMinutes;
        const formattedEndTime = `${formattedEndHour}:${formattedEndMinutes}`;
  
        if (hourOptions.includes(formattedEndTime)) {
          const option = document.createElement('option');
          option.value = formattedEndTime;
          option.textContent = formattedEndTime;
          horaFinSelect.appendChild(option);
        }
      });
  
      actualizarTotal(); // Actualiza el total al cambiar la hora de inicio
    });
  
    // Manejar el cambio de hora de fin
    horaFinSelect.addEventListener('change', actualizarTotal);
  
    // Función para actualizar el total basado en la selección de hora de fin
    function actualizarTotal() {
      const horaInicio = horaInicioSelect.value;
      const horaFin = horaFinSelect.value;
      if (horaInicio && horaFin) {
        const total = calcularTotal(horaInicio, horaFin);
        totalInput.value = `$${total}`; // Mostrar el total calculado
      }
    }
  
    // Manejar el envío del formulario
    btnGuardar.addEventListener('click', async () => {
      const asistentes = asistentesInput.value;
      const fecha = fechaInput.value;
      const horaInicio = horaInicioSelect.value;
      const horaFin = horaFinSelect.value;
      const total = calcularTotal(horaInicio, horaFin);
  
      if (!fecha || !horaInicio || !horaFin) {
        alert('Por favor, complete todos los campos.');
        return;
      }
  
      // Crear el objeto de reserva
      const reserva = {
        asistentes,
        fecha,
        horaInicio,
        horaFin,
        total
      };
  
      // Guardar la reserva como pendiente y obtener el client secret para Stripe
      try {
        const response = await fetch('https://fut7montessori.com.mx/model/reserva.php', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          body: new URLSearchParams(reserva)
        });
  
        const result = await response.json();
  
        if (result.status === "Horario no disponible") {
          alert('Horario no disponible');
          return;
        }
  
        clientSecret = result.status; // Asigna el clientSecret recibido
        agregarReservaAlCalendario(reserva); // Agregar la reserva como pendiente al calendario
        mostrarFormularioStripe(); // Muestra el formulario de Stripe para proceder al pago
  
      } catch (error) {
        console.error('Error al guardar la reserva:', error);
      }
    });
  
    // Función para agregar la reserva al calendario como pendiente
    function agregarReservaAlCalendario(reserva) {
      const calendarEvent = {
        title: `Reserva: ${reserva.asistentes} asistentes`,
        start: `${reserva.fecha}T${reserva.horaInicio}`,
        end: `${reserva.fecha}T${reserva.horaFin}`,
        status: 'pendiente'
      };
      console.log('Reserva agregada al calendario:', calendarEvent);
      alert('Reserva añadida al calendario como pendiente.');
    }
  
    // Función para mostrar el formulario de Stripe
    function mostrarFormularioStripe() {
      // Crea el contenedor de Stripe si no existe
      let stripeContainer = document.getElementById('stripe-container');
      if (!stripeContainer) {
        stripeContainer = document.createElement('div');
        stripeContainer.id = 'stripe-container';
        document.body.appendChild(stripeContainer); // Agrega el contenedor de Stripe al DOM
      }
  
      elements = stripe.elements({ clientSecret }); // Inicializa Elements con el clientSecret
      const paymentElement = elements.create('payment'); // Crea el elemento de pago de Stripe
  
      // Vaciar el contenedor y montar el elemento de pago
      stripeContainer.innerHTML = '';
      const paymentForm = document.createElement('form');
      paymentForm.id = 'payment-form';
      paymentForm.addEventListener('submit', handleSubmit);
  
      // Contenedor del elemento de pago
      const paymentDiv = document.createElement('div');
      paymentDiv.id = 'payment-element';
      stripeContainer.appendChild(paymentDiv);
      paymentElement.mount('#payment-element'); // Monta el elemento de pago
  
      const submitButton = document.createElement('button');
      submitButton.id = 'submit';
      submitButton.type = 'submit';
      submitButton.innerHTML = `Pay now`;
      paymentForm.appendChild(submitButton);
  
      const messageDiv = document.createElement('div');
      messageDiv.id = 'payment-message';
      paymentForm.appendChild(messageDiv);
  
      stripeContainer.appendChild(paymentForm);
    }
  
    // Manejar el envío del formulario de Stripe
    async function handleSubmit(e) {
      e.preventDefault();
  
      if (!stripe || !elements) {
        return; // Stripe.js aún no ha cargado.
      }
  
      setLoading(true);
  
      try {
        const { error } = await stripe.confirmPayment({
          elements,
          confirmParams: {
            return_url: "https://fut7montessori.com.mx/apps/calendar", // Cambia esto a tu página de confirmación de pago
          },
          redirect: 'if_required'
        });
  
        if (error) {
          setMessage(error.message);
        } else {
          setMessage("Gracias por tu pago, te hemos enviado un correo con los datos de la reservación.");
          alert('Pago completado y reserva confirmada.');
          retrievePaymentIntent(); // Mostrar la página de estado de pago
        }
      } catch (error) {
        setMessage("An unexpected error occurred.");
      }
  
      setLoading(false);
    }
  
    // Función para establecer el mensaje
    function setMessage(msg) {
      const messageElement = document.getElementById('payment-message');
      if (messageElement) {
        messageElement.textContent = msg;
      }
    }
  
    // Función para manejar el estado de carga
    function setLoading(state) {
      const submitButton = document.getElementById('submit');
      if (submitButton) {
        submitButton.disabled = state || !stripe || !elements;
      }
    }
  
    // Función para calcular el total basado en la duración de la reserva
    function calcularTotal(horaInicio, horaFin) {
      const [startHour, startMinutes] = horaInicio.split(':').map(Number);
      const [endHour, endMinutes] = horaFin.split(':').map(Number);
  
      const startTimeInMinutes = startHour * 60 + startMinutes;
      const endTimeInMinutes = endHour * 60 + endMinutes;
      const durationInHours = (endTimeInMinutes - startTimeInMinutes) / 60;
  
      // Calcular el costo basado en la duración en horas
      if (durationInHours === 1) {
        return 500;
      } else if (durationInHours === 1.5) {
        return 650;
      } else if (durationInHours === 2) {
        return 800;
      } else {
        return 0;
      }
    }
  
    // Función para obtener el estado del PaymentIntent
    async function retrievePaymentIntent() {
      const clientSecret = new URLSearchParams(window.location.search).get("payment_intent_client_secret");
  
      if (!clientSecret) return;
  
      try {
        const { paymentIntent } = await stripe.retrievePaymentIntent(clientSecret);
        if (!paymentIntent) return;
  
        status = paymentIntent.status;
        intentId = paymentIntent.id;
        createPaymentStatusPage(); // Crear la página de estado del pago
      } catch (error) {
        console.error("Error retrieving payment intent:", error);
        status = "default";
        createPaymentStatusPage();
      }
    }
  
    // Función para crear el contenido de la página según el estado del pago
    function createPaymentStatusPage() {
      const paymentStatusDiv = document.createElement('div');
      paymentStatusDiv.id = 'payment-status';
  
      const statusIconDiv = document.createElement('div');
      statusIconDiv.id = 'status-icon';
      statusIconDiv.style.backgroundColor = STATUS_CONTENT_MAP[status].iconColor;
      statusIconDiv.appendChild(STATUS_CONTENT_MAP[status].icon);
  
      const statusText = document.createElement('h2');
      statusText.id = 'status-text';
      statusText.textContent = STATUS_CONTENT_MAP[status].text;
  
      paymentStatusDiv.appendChild(statusIconDiv);
      paymentStatusDiv.appendChild(statusText);
  
      if (intentId) {
        const detailsTable = document.createElement('div');
        detailsTable.id = 'details-table';
        detailsTable.innerHTML = `
          <table>
            <tbody>
              <tr>
                <td class="TableLabel">id</td>
                <td id="intent-id" class="TableContent">${intentId}</td>
              </tr>
              <tr>
                <td class="TableLabel">status</td>
                <td id="intent-status" class="TableContent">${status}</td>
              </tr>
            </tbody>
          </table>
        `;
        paymentStatusDiv.appendChild(detailsTable);
  
        const viewDetailsLink = document.createElement('a');
        viewDetailsLink.href = `https://dashboard.stripe.com/payments/${intentId}`;
        viewDetailsLink.id = 'view-details';
        viewDetailsLink.target = '_blank';
        viewDetailsLink.rel = 'noopener noreferrer';
        viewDetailsLink.innerHTML = `View details`;
        paymentStatusDiv.appendChild(viewDetailsLink);
      }
  
      const retryButton = document.createElement('a');
      retryButton.id = 'retry-button';
      retryButton.href = "/checkout";
      retryButton.textContent = "Test another";
      paymentStatusDiv.appendChild(retryButton);
  
      document.body.appendChild(paymentStatusDiv);
    }
  
    // Mapa de estado y contenido del estado del pago
    const STATUS_CONTENT_MAP = {
      succeeded: {
        text: "Payment succeeded",
        iconColor: "#30B130",
        icon: createSuccessIcon(),
      },
      processing: {
        text: "Your payment is processing.",
        iconColor: "#6D6E78",
        icon: createInfoIcon(),
      },
      requires_payment_method: {
        text: "Your payment was not successful, please try again.",
        iconColor: "#DF1B41",
        icon: createErrorIcon(),
      },
      default: {
        text: "Something went wrong, please try again.",
        iconColor: "#DF1B41",
        icon: createErrorIcon(),
      }
    };
  
    // Funciones para crear íconos SVG
    function createSuccessIcon() {
      const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      svg.setAttribute("width", "16");
      svg.setAttribute("height", "14");
      svg.setAttribute("viewBox", "0 0 16 14");
      svg.innerHTML = `<path fill-rule="evenodd" clip-rule="evenodd" d="M15.4695 0.232963C15.8241 0.561287 15.8454 1.1149 15.5171 1.46949L6.14206 11.5945C5.97228 11.7778 5.73221 11.8799 5.48237 11.8748C5.23253 11.8698 4.99677 11.7582 4.83452 11.5681L0.459523 6.44311C0.145767 6.07557 0.18937 5.52327 0.556912 5.20951C0.924454 4.89575 1.47676 4.93936 1.79051 5.3069L5.52658 9.68343L14.233 0.280522C14.5613 -0.0740672 15.1149 -0.0953599 15.4695 0.232963Z" fill="white"/>`;
      return svg;
    }
  
    function createErrorIcon() {
      const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      svg.setAttribute("width", "16");
      svg.setAttribute("height", "16");
      svg.setAttribute("viewBox", "0 0 16 16");
      svg.innerHTML = `<path fill-rule="evenodd" clip-rule="evenodd" d="M1.25628 1.25628C1.59799 0.914573 2.15201 0.914573 2.49372 1.25628L8 6.76256L13.5063 1.25628C13.848 0.914573 14.402 0.914573 14.7437 1.25628C15.0854 1.59799 15.0854 2.15201 14.7437 2.49372L9.23744 8L14.7437 13.5063C15.0854 13.848 15.0854 14.402 14.7437 14.7437C14.402 15.0854 13.848 15.0854 13.5063 14.7437L8 9.23744L2.49372 14.7437C2.15201 15.0854 1.59799 15.0854 1.25628 14.7437C0.914573 14.402 0.914573 13.848 1.25628 13.5063L6.76256 8L1.25628 2.49372C0.914573 2.15201 0.914573 1.59799 1.25628 1.25628Z" fill="white"/>`;
      return svg;
    }
  
    function createInfoIcon() {
      const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      svg.setAttribute("width", "14");
      svg.setAttribute("height", "14");
      svg.setAttribute("viewBox", "0 0 14 14");
      svg.innerHTML = `<path fill-rule="evenodd" clip-rule="evenodd" d="M10 1.5H4C2.61929 1.5 1.5 2.61929 1.5 4V10C1.5 11.3807 2.61929 12.5 4 12.5H10C11.3807 12.5 12.5 11.3807 12.5 10V4C12.5 2.61929 11.3807 1.5 10 1.5ZM4 0C1.79086 0 0 1.79086 0 4V10C0 12.2091 1.79086 14 4 14H10C12.2091 14 14 12.2091 14 10V4C14 1.79086 12.2091 0 10 0H4Z" fill="white"/><path fill-rule="evenodd" clip-rule="evenodd" d="M5.25 7C5.25 6.58579 5.58579 6.25 6 6.25H7.25C7.66421 6.25 8 6.58579 8 7V10.5C8 10.9142 7.66421 11.25 7.25 11.25C6.83579 11.25 6.5 10.9142 6.5 10.5V7.75H6C5.58579 7.75 5.25 7.41421 5.25 7Z" fill="white"/><path d="M5.75 4C5.75 3.31075 6.31075 2.75 7 2.75C7.68925 2.75 8.25 3.31075 8.25 4C8.25 4.68925 7.68925 5.25 7 5.25C6.31075 5.25 5.75 4.68925 5.75 4Z" fill="white"/>`;
      return svg;
    }
  
    // Llama a la función para recuperar el estado del PaymentIntent y mostrar la página
    retrievePaymentIntent();
  });
  