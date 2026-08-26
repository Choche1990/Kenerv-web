// URL del webhook de n8n (test) que recibe las suscripciones del newsletter.
// Solo responde mientras el workflow está en modo "Listen for test event" dentro del editor de n8n.
const WEBHOOK_URL = "https://n8n-1sjl.srv1612224.hstgr.cloud/webhook/666f9da9-7a1a-4525-86da-64bbfd84579c";

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('newsletterForm');
  const message = document.getElementById('formMessage');
  if (!form || !message) return;

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const formData = new FormData(form);
    const payload = {
      name: (formData.get('name') || '').toString().trim(),
      email: (formData.get('email') || '').toString().trim(),
      company: (formData.get('company') || '').toString().trim(),
    };

    const submitButton = form.querySelector('button[type="submit"]');
    if (submitButton) submitButton.disabled = true;
    message.style.color = '';
    message.textContent = 'Enviando...';

    try {
      const response = await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error(`Respuesta inesperada del servidor (${response.status})`);

      let data = null;
      try { data = await response.json(); } catch (_) { data = null; }

      if (data && data.status === 'already_registered') {
        message.style.color = 'var(--danger)';
        message.textContent = data.message || 'Este correo ya se encuentra suscrito al KENERV Intelligence Brief.';
      } else {
        message.textContent = (data && data.message) || `Gracias. Registramos ${payload.email} para el KENERV Intelligence Brief.`;
        form.reset();
      }
    } catch (error) {
      console.error('Error al enviar el formulario del newsletter:', error);
      message.style.color = 'var(--danger)';
      message.textContent = 'No pudimos registrar tu suscripción. Intenta de nuevo en unos minutos.';
    } finally {
      if (submitButton) submitButton.disabled = false;
    }
  });
});
