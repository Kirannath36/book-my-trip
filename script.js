// Mobile menu
const menuToggle = document.getElementById('menuToggle');
const navigation = document.getElementById('navigation');
menuToggle.addEventListener('click', () => {
  const isOpen = navigation.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(isOpen));
  menuToggle.textContent = isOpen ? '✕' : '☰';
});
navigation.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  navigation.classList.remove('open');
  menuToggle.setAttribute('aria-expanded', 'false');
  menuToggle.textContent = '☰';
}));

// Demo booking enquiry (no backend or actual payment)
const dialog = document.getElementById('bookingDialog');
const form = document.getElementById('bookingForm');
const nights = document.getElementById('nights');
const checkin = document.getElementById('checkin');
const totalPrice = document.getElementById('totalPrice');
const currency = amount => new Intl.NumberFormat('en-IN', {style:'currency', currency:'INR', maximumFractionDigits:0}).format(amount);
let selectedName = '';
let selectedPrice = 0;
function updateTotal() {
  totalPrice.textContent = currency(selectedPrice * Math.max(1, Number(nights.value) || 1));
}
const today = new Date();
const localToday = new Date(today.getTime() - today.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
checkin.min = localToday;
document.querySelectorAll('[data-book]').forEach(button => {
  button.addEventListener('click', () => {
    selectedName = button.dataset.book;
    selectedPrice = Number(button.dataset.price);
    form.reset();
    checkin.min = localToday;
    document.getElementById('selectedStay').textContent = selectedName + ' — ' + currency(selectedPrice) + ' per unit';
    document.getElementById('formMessage').textContent = '';
    updateTotal();
    dialog.showModal();
  });
});
nights.addEventListener('input', updateTotal);
document.getElementById('closeDialog').addEventListener('click', () => dialog.close());
form.addEventListener('submit', event => {
  event.preventDefault();
  if (!form.reportValidity()) return;
  if (checkin.value < localToday) { document.getElementById('formMessage').textContent = 'Choose today or a future date.'; return; }
  const enquiry = {
    stay: selectedName,
    name: document.getElementById('guestName').value.trim(),
    email: document.getElementById('guestEmail').value.trim(),
    checkin: checkin.value,
    units: Number(nights.value),
    estimatedTotalINR: selectedPrice * Number(nights.value)
  };
  try {
    const saved = JSON.parse(localStorage.getItem('bookmytrip-enquiries') || '[]');
    saved.push(enquiry);
    localStorage.setItem('bookmytrip-enquiries', JSON.stringify(saved));
    document.getElementById('formMessage').textContent = 'Enquiry saved in this browser! This is not a confirmed booking.';
  } catch {
    document.getElementById('formMessage').textContent = 'Could not save. Please enable browser storage.';
  }
});
document.querySelectorAll('[data-info]').forEach(link => link.addEventListener('click', event => {
  event.preventDefault();
  alert(link.dataset.info + ': Demo project page. Add your actual policy before publishing a real booking service.');
}));
document.getElementById('year').textContent = new Date().getFullYear();
