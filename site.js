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

// Mobile navigation toggle (per header)
document.querySelectorAll('[data-nav-toggle]').forEach(button => {
  const header = button.closest('header');
  if (!header) return;
  const menu = header.querySelector('[data-nav-menu]');
  if (!menu) return;

  const setOpen = (isOpen) => {
    menu.classList.toggle('hidden', !isOpen);
    button.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  };

  setOpen(false);
  button.addEventListener('click', () => {
    const isOpen = menu.classList.contains('hidden');
    setOpen(isOpen);
  });
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
  const errorText = errorMessage ? errorMessage.querySelector('[data-error-text]') : null;

  const setSendingState = (isSending) => {
    if (submitButton) submitButton.disabled = isSending;
    if (sendLabel) sendLabel.classList.toggle('hidden', isSending);
    if (sendingLabel) sendingLabel.classList.toggle('hidden', !isSending);
  };

  contactForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (successMessage) successMessage.classList.add('hidden');
    if (errorMessage) errorMessage.classList.add('hidden');
    if (errorText) errorText.textContent = 'Something went wrong.';

    const formData = Object.fromEntries(new FormData(contactForm).entries());
    const requiredFieldsFilled = formData.name && formData.email && formData.message;
    if (!requiredFieldsFilled) {
      if (errorText) errorText.textContent = 'Please complete the required fields.';
      if (errorMessage) errorMessage.classList.remove('hidden');
      return;
    }

    try {
      setSendingState(true);
      const response = await fetch('https://formsubmit.co/ajax/contact@aikyanova.com', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Failed to send message');
      contactForm.reset();
      if (successMessage) successMessage.classList.remove('hidden');
    } catch (error) {
      console.error(error);
      if (errorMessage) errorMessage.classList.remove('hidden');
    } finally {
      setSendingState(false);
    }
  });
}

// Studio community form submission to email endpoint
const studioForm = document.getElementById('studio-community-form');
if (studioForm) {
  if (studioForm.dataset.bound === 'true') {
    // Avoid duplicate bindings when script is loaded twice on the page
    return;
  }
  studioForm.dataset.bound = 'true';

  const submitButton = studioForm.querySelector('button[type="submit"]');
  const sendLabel = studioForm.querySelector('.send-label');
  const sendingLabel = studioForm.querySelector('.sending-label');
  const successMessage = document.getElementById('studio-success');
  const errorMessage = document.getElementById('studio-error');
  const errorText = errorMessage ? errorMessage.querySelector('[data-error-text]') : null;

  const setSendingState = (isSending) => {
    if (submitButton) submitButton.disabled = isSending;
    if (sendLabel) sendLabel.classList.toggle('hidden', isSending);
    if (sendingLabel) sendingLabel.classList.toggle('hidden', !isSending);
  };

  studioForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (successMessage) successMessage.classList.add('hidden');
    if (errorMessage) errorMessage.classList.add('hidden');
    if (errorText) errorText.textContent = 'Something went wrong.';

    const formData = Object.fromEntries(new FormData(studioForm).entries());
    const requiredFieldsFilled = formData.name && formData.email && formData.interests;
    if (!requiredFieldsFilled) {
      if (errorText) errorText.textContent = 'Please complete the required fields.';
      if (errorMessage) errorMessage.classList.remove('hidden');
      return;
    }

    try {
      setSendingState(true);
      const response = await fetch('https://formsubmit.co/ajax/contact@aikyanova.com', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          interests: formData.interests,
          notes: formData.notes || '',
          source: 'Studio community',
        }),
      });

      if (!response.ok) throw new Error('Failed to send message');
      studioForm.reset();
      if (successMessage) successMessage.classList.remove('hidden');
    } catch (error) {
      console.error(error);
      if (errorMessage) errorMessage.classList.remove('hidden');
    } finally {
      setSendingState(false);
    }
  });
}
