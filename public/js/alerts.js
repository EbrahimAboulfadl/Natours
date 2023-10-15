const hideAlert = () => {
  const el = document.querySelector('.alert');
  if (el) el.parentElement.removeChild(el);
};

const showAlert = (type, message) => {
  hideAlert();
  const markup = `<div class="alert alert--${type}>${message}</div>`;
  document.querySelector('body').insertAdjacentHTML('after begin', markup);
  window.setTimeout(hideAlert, 5000);
};
