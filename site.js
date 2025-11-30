// Shared UI hooks for navigation state and timestamps
const currentPage = (location.pathname.split('/').pop() || 'index.html').toLowerCase();

document.querySelectorAll('nav a').forEach(link => {
  const href = link.getAttribute('href');
  if (!href) return;
  const normalizedHref = href.toLowerCase();
  if (normalizedHref === currentPage || (currentPage === '' && normalizedHref === 'index.html')) {
    link.classList.add('active');
  }
});

const year = new Date().getFullYear();
document.querySelectorAll('[data-year]').forEach(el => {
  el.textContent = year;
});

// Contact form submission to email endpoint
const contactForm = document.getElementById('contact-form');
if (contactForm) {
  if (contactForm.dataset.bound === 'true') {
    // Avoid duplicate bindings when script is loaded twice on the page
    return;
  }
  contactForm.dataset.bound = 'true';

  const submitButton = contactForm.querySelector('button[type="submit"]');
  const sendLabel = contactForm.querySelector('.send-label');
  const sendingLabel = contactForm.querySelector('.sending-label');
  const successMessage = document.getElementById('contact-success');
  const errorMessage = document.getElementById('contact-error');
  const errorText = errorMessage?.querySelector('[data-error-text]');

  const setSendingState = (isSending) => {
    if (submitButton) submitButton.disabled = isSending;
    sendLabel?.classList.toggle('hidden', isSending);
    sendingLabel?.classList.toggle('hidden', !isSending);
  };

  contactForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    successMessage?.classList.add('hidden');
    errorMessage?.classList.add('hidden');
    if (errorText) errorText.textContent = 'Something went wrong.';

    const formData = Object.fromEntries(new FormData(contactForm).entries());
    const requiredFieldsFilled = formData.name && formData.email && formData.message;
    if (!requiredFieldsFilled) {
      if (errorText) errorText.textContent = 'Please complete the required fields.';
      errorMessage?.classList.remove('hidden');
      return;
    }

    try {
      setSendingState(true);
      const response = await fetch('https://formsubmit.co/ajax/aikyanova@gmail.com', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Failed to send message');
      contactForm.reset();
      successMessage?.classList.remove('hidden');
    } catch (error) {
      console.error(error);
      errorMessage?.classList.remove('hidden');
    } finally {
      setSendingState(false);
    }
  });
}
