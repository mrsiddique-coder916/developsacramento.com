// developsacramento.com: the 1% listing-fee calculator on the home page.
// Listing-side fees only; the copy around it says so. Nothing is sent anywhere.
document.addEventListener('DOMContentLoaded', function () {
  var input = document.getElementById('fee-price');
  if (!input) return;
  var out = {
    one: document.getElementById('fee-one'),
    two: document.getElementById('fee-two'),
    three: document.getElementById('fee-three'),
    save: document.getElementById('fee-save')
  };
  var money = function (n) { return '$' + Math.round(n).toLocaleString('en-US'); };
  function update() {
    var price = parseInt(String(input.value).replace(/[^\d]/g, ''), 10);
    if (!price || price < 1000) {
      out.one.textContent = out.two.textContent = out.three.textContent = out.save.textContent = '—';
      return;
    }
    out.one.textContent = money(price * 0.01);
    out.two.textContent = money(price * 0.025);
    out.three.textContent = money(price * 0.03);
    out.save.textContent = money(price * 0.015) + ' to ' + money(price * 0.02);
  }
  input.addEventListener('input', update);
  input.addEventListener('blur', function () {
    var price = parseInt(String(input.value).replace(/[^\d]/g, ''), 10);
    if (price) input.value = price.toLocaleString('en-US');
  });
  var form = input.form;
  if (form) form.addEventListener('submit', function (e) { e.preventDefault(); update(); });
  update();
});
