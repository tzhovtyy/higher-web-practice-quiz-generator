function getToastContainer() {
  let container = document.querySelector('.toast-container');

  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    container.setAttribute('aria-live', 'assertive');
    document.body.appendChild(container);
  }

  return container;
}

export function showToast(message, timeout = 5000) {
  const template = document.querySelector('#toast-template');
  if (!template) return;

  const toast = template.content.firstElementChild.cloneNode(true);
  const messageField = toast.querySelector('.toast__message');
  const closeButton = toast.querySelector('.toast__close');

  messageField.textContent = message;

  closeButton.addEventListener('click', () => {
    toast.remove();
  });

  const container = getToastContainer();
  container.appendChild(toast);

  if (timeout > 0) {
    setTimeout(() => {
      toast.remove();
    }, timeout);
  }
}
