// Assuming this is within a browser environment with access to Stripe.js
document.addEventListener("DOMContentLoaded", function () {
    const stripe = Stripe('your-publishable-key'); // Add your Stripe public key
    const elements = stripe.elements();
  
    const form = document.getElementById("payment-form");
    const paymentElement = elements.create("payment", {
      layout: "tabs",
    });
  
    paymentElement.mount("#payment-element");
  
    let isLoading = false;
    let message = null;
  
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
  
      if (!stripe || !elements) {
        // Stripe.js hasn't yet loaded.
        return;
      }
  
      setIsLoading(true);
  
      try {
        const result = await stripe.confirmPayment({
          elements,
          confirmParams: {
            return_url: "https://fut7montessori.com.mx/apps/calendar", // Replace with your actual URL
          },
          redirect: "if_required",
        });
  
        if (result.error) {
          // Inform the customer that there was an error.
          message = result.error.message;
          displayMessage(message);
        } else {
          // Payment was successful.
          message = "Gracias por tu pago, te hemos enviado un correo con los datos de la reservación.";
          displayMessage(message);
          onPay();
        }
      } catch (error) {
        message = "An unexpected error occurred.";
        displayMessage(message);
      }
  
      setIsLoading(false);
    });
  
    function setIsLoading(loading) {
      isLoading = loading;
      document.getElementById("submit").disabled = loading || !stripe || !elements;
      document.getElementById("button-text").textContent = loading
        ? "Processing..."
        : "Pay now";
    }
  
    function displayMessage(message) {
      const messageContainer = document.getElementById("payment-message");
      if (messageContainer) {
        messageContainer.textContent = message;
        messageContainer.style.display = 'block';
      }
    }
  });
  
  // HTML Structure
  document.body.innerHTML = `
    <form id="payment-form" onSubmit="handleSubmit()">
      <div id="payment-element"></div>
      <button id="submit" disabled>
        <span id="button-text">Pay now</span>
      </button>
      <div id="payment-message" style="display: none;"></div>
    </form>
    <div id="dpm-annotation">
      <p>
        Payment methods are dynamically displayed based on customer location, order amount, and currency.&nbsp;
        <a href="${dpmCheckerLink}" target="_blank" rel="noopener noreferrer" id="dpm-integration-checker">
          Preview payment methods by transaction
        </a>
      </p>
    </div>
  `;
  
  function onPay() {
    // Function to handle post-payment success actions
    console.log('Payment successful. Executing onPay function.');
  }
  