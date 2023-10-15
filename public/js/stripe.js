const stripe = Stripe(
  'pk_test_51O1MXjA7wsRF7GaCyVtvP04h07EuyfgHFplEnJfEiiFsYHWdGz7k0wxMNNthfHYGP6pvlvZX4PEbJLSj8ikoJGoV00RK14YHWW',
);

const bookTour = async (tourID) => {
  try {
    const session = await axios({
      method: 'GET',
      url: `http://127.0.0.1:1305/api/v1/bookings/checkout-session/${tourID}`,
    });

    await stripe.redirectToCheckout({ sessionId: session.data.session.id });
  } catch (e) {
    showAlert('error', e);
    console.log(e);
  }
};

const bookBtn = document.getElementById('book-tour');
if (bookBtn) {
  bookBtn.addEventListener('click', async (e) => {
    e.target.textContent = 'Processing...';
    const { tourId } = e.target.dataset;
    await bookTour(tourId);
    e.target.textContent = 'Book Now';
  });
}
