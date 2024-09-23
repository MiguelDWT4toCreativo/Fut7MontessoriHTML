// Espera a que el DOM esté completamente cargado antes de ejecutar el script
document.addEventListener('DOMContentLoaded', function () {
  // Inicializa Stripe con tu clave pública
  const stripe = Stripe('pk_live_51PyhP5KJQTnSHL1ZgCd4aiOMCm8i7w6EKzBzf2XsYUvAoSiUdHGbGrJT9myaYySsj2hNtSvNGyZZsJMGp941azbt003Rs2iw1X');
  const elements = stripe.elements();
  const paymentElement = elements.create('payment', { layout: 'tabs' });

  // Crear la estructura HTML del formulario y mensajes
  const formContainer = document.createElement('div');
  formContainer.id = 'checkout-form-container';
  formContainer.innerHTML = `
      <form id="payment-form">
          <div id="payment-element"></div>
          <button id="submit" disabled>
              <span id="button-text">Pay now</span>
          </button>
          <div id="payment-message" style="display: none;"></div>
      </form>
      <div id="dpm-annotation">
          <p>
              Payment methods are dynamically displayed based on customer location, order amount, and currency.&nbsp;
              <a href="https://example.com" id="dpm-integration-checker" target="_blank" rel="noopener noreferrer">Preview payment methods by transaction</a>
          </p>
      </div>
  `;

  // Agregar el formulario al body del documento
  document.body.appendChild(formContainer);

  const form = document.getElementById('payment-form');
  const submitButton = document.getElementById('submit');
  const paymentMessage = document.getElementById('payment-message');
  const dpmIntegrationChecker = document.getElementById('dpm-integration-checker');
  dpmIntegrationChecker.href = 'https://example.com'; // Coloca aquí el enlace correcto desde tu código original

  // Montar el PaymentElement dentro del div específico
  paymentElement.mount('#payment-element');

  // Habilita el botón de enviar cuando el PaymentElement esté listo
  paymentElement.on('ready', () => {
      submitButton.disabled = false;
  });

  // Manejo de la acción de envío del formulario
  form.addEventListener('submit', async function (e) {
      e.preventDefault();

      if (!stripe || !elements) {
          return;
      }

      setLoading(true);

      try {
          const result = await stripe.confirmPayment({
              elements,
              confirmParams: {
                  return_url: 'https://fut7montessori.com.mx/apps/calendar', // URL de retorno específica
              },
              redirect: 'if_required'
          });

          if (result.error) {
              setMessage(result.error.message);
          } else {
              setMessage("Gracias por tu pago, te hemos enviado un correo con los datos de la reservación.");
              onPay(); // Llama la función de pago completado
          }
      } catch (error) {
          console.error('Error al confirmar el pago:', error);
          setMessage('An unexpected error occurred.');
      } finally {
          setLoading(false);
      }
  });

  // Función para mostrar un spinner de carga
  function setLoading(isLoading) {
      submitButton.disabled = isLoading;
      const buttonText = submitButton.querySelector('#button-text');
      buttonText.innerHTML = isLoading ? '<div class="spinner" id="spinner"></div>' : 'Pay now';
  }

  // Función para mostrar mensajes de éxito o error
  function setMessage(message) {
      paymentMessage.style.display = 'block';
      paymentMessage.textContent = message;
  }

  // Función simulada de pago exitoso
  function onPay() {
      console.log('Pago completado con éxito.');
  }
});
