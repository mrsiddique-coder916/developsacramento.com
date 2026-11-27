// developsacramento.com: the interactive listing-fee saver on the home page.
// Listing-side fees only; the copy around it says so. Nothing is sent anywhere.
document.addEventListener('DOMContentLoaded', function () {
  var price = document.getElementById('sv-price');
  var rate = document.getElementById('sv-rate');
  if (!price || !rate) return;
  var el = function (id) { return document.getElementById(id); };
  var out = {
    price: el('sv-price-out'), rate: el('sv-rate-out'), keep: el('sv-keep'), sub: el('sv-keep-sub'),
    other: el('sv-other'), otherLabel: el('sv-other-label'), one: el('sv-one'),
    otherFill: el('sv-other-fill'), oneFill: el('sv-one-fill')
  };
  var presets = Array.prototype.slice.call(document.querySelectorAll('.saver-presets button'));
  var money = function (n) { return '$' + Math.round(n).toLocaleString('en-US'); };
  var pct = function (r) { return (Math.round(r * 100) / 100).toString().replace(/\.0+$/, '') + '%'; };
  var shown = { keep: 0 };
  var raf = null;

  function paint(input) {
    var min = Number(input.min), max = Number(input.max), v = Number(input.value);
    input.style.setProperty('--pct', ((v - min) / (max - min) * 100) + '%');
  }

  // The big number counts to its new value so a slider drag reads as motion, not a flicker.
  function tween(to) {
    if (raf) cancelAnimationFrame(raf);
    var from = shown.keep, start = performance.now(), ms = 260;
    function step(now) {
      var t = Math.min(1, (now - start) / ms), e = 1 - Math.pow(1 - t, 3);
      shown.keep = from + (to - from) * e;
      out.keep.textContent = money(shown.keep);
      if (t < 1) raf = requestAnimationFrame(step); else shown.keep = to;
    }
    raf = requestAnimationFrame(step);
  }

  function update(animate) {
    var p = Number(price.value), r = Number(rate.value);
    var one = p * 0.01, other = p * r / 100, keep = Math.max(0, other - one);
    paint(price); paint(rate);
    out.price.textContent = money(p);
    price.setAttribute('aria-valuetext', money(p));
    out.rate.textContent = pct(r);
    rate.setAttribute('aria-valuetext', pct(r) + ' listing fee');
    out.one.textContent = money(one);
    out.other.textContent = money(other);
    out.otherLabel.textContent = pct(r) + ' listing fee';
    var top = Math.max(one, other) || 1;
    out.otherFill.style.width = (other / top * 100) + '%';
    out.oneFill.style.width = (one / top * 100) + '%';
    out.sub.textContent = r <= 1
      ? 'A ' + pct(r) + ' fee is already at or below 1%; the comparison is on fees above it.'
      : 'on a ' + money(p) + ' sale, compared with a ' + pct(r) + ' listing fee';
    if (animate) tween(keep); else { shown.keep = keep; out.keep.textContent = money(keep); }
    presets.forEach(function (b) { b.setAttribute('aria-pressed', Number(b.getAttribute('data-price')) === p ? 'true' : 'false'); });
  }

  price.addEventListener('input', function () { update(true); });
  rate.addEventListener('input', function () { update(true); });
  presets.forEach(function (b) {
    b.addEventListener('click', function () { price.value = b.getAttribute('data-price'); update(true); });
  });
  update(false);
});
