const cart = new Map();
const products = [...document.querySelectorAll('.product')];
const countEl = document.getElementById('cartCount');
const itemsEl = document.getElementById('cartItems');
const totalEl = document.getElementById('cartTotal');
const drawer = document.getElementById('cartDrawer');
const overlay = document.getElementById('overlay');
const toastEl = document.getElementById('toast');
const money = n => new Intl.NumberFormat('ru-RU').format(n) + ' ₸';

function toast(message) {
  toastEl.textContent = message;
  toastEl.classList.add('show');
  clearTimeout(toast.timer);
  toast.timer = setTimeout(() => toastEl.classList.remove('show'), 2200);
}
function updateCart() {
  let count = 0, total = 0;
  cart.forEach(item => { count += item.qty; total += item.price * item.qty; });
  countEl.textContent = count;
  totalEl.textContent = money(total);
  if (!cart.size) {
    itemsEl.innerHTML = '<p class="empty">Пока здесь пусто ☕</p>';
    return;
  }
  itemsEl.innerHTML = [...cart.values()].map(item => `
    <div class="cart-row">
      <div><strong>${item.name}</strong><small>${money(item.price)} × ${item.qty}</small></div>
      <div class="qty">
        <button data-action="minus" data-id="${item.id}" aria-label="Уменьшить">−</button>
        <b>${item.qty}</b>
        <button data-action="plus" data-id="${item.id}" aria-label="Добавить">+</button>
      </div>
    </div>`).join('');
}
products.forEach(card => card.querySelector('.add-btn').addEventListener('click', () => {
  const id = card.dataset.id;
  const old = cart.get(id);
  cart.set(id, {id, name: card.dataset.name, price: Number(card.dataset.price), qty: old ? old.qty + 1 : 1});
  updateCart(); toast('Добавлено в корзину');
}));
itemsEl.addEventListener('click', e => {
  const btn = e.target.closest('button[data-action]');
  if (!btn) return;
  const item = cart.get(btn.dataset.id);
  if (!item) return;
  item.qty += btn.dataset.action === 'plus' ? 1 : -1;
  if (item.qty <= 0) cart.delete(item.id);
  updateCart();
});
function openCart(){drawer.classList.add('open');overlay.classList.add('show')}
function closeCart(){drawer.classList.remove('open');overlay.classList.remove('show')}
document.getElementById('openCart').addEventListener('click', openCart);
document.getElementById('closeCart').addEventListener('click', closeCart);
overlay.addEventListener('click', closeCart);
document.getElementById('checkout').addEventListener('click', () => {
  if (!cart.size) return toast('Сначала добавь что-нибудь в корзину');
  toast('Это демонстрация — подключи обработчик заказа');
});
document.getElementById('filters').addEventListener('click', e => {
  const btn = e.target.closest('.filter');
  if (!btn) return;
  document.querySelectorAll('.filter').forEach(x => x.classList.toggle('active', x === btn));
  products.forEach(card => card.hidden = btn.dataset.filter !== 'all' && card.dataset.category !== btn.dataset.filter);
});
document.getElementById('bookingForm').addEventListener('submit', e => {
  e.preventDefault();
  const data = new FormData(e.currentTarget);
  document.getElementById('formMessage').textContent = `Спасибо, ${data.get('name')}! Заявка показана в демо-режиме.`;
  e.currentTarget.reset();
});
document.querySelector('.menu-toggle').addEventListener('click', () => document.querySelector('.nav').classList.toggle('show'));
document.querySelectorAll('.nav a').forEach(a => a.addEventListener('click', () => document.querySelector('.nav').classList.remove('show')));
updateCart();