/* Shield Safety rebuild: header, mobile nav, sector hero, role tabs, reveals, count-up, demo form. No dependencies. */
(function () {
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Header shadow on scroll
  var header = document.querySelector('.header');
  function onScroll() { header.classList.toggle('is-scrolled', window.scrollY > 8); }
  window.addEventListener('scroll', onScroll, { passive: true }); onScroll();

  // Mobile nav
  var burger = document.querySelector('.burger');
  var nav = document.querySelector('.nav');
  if (burger && nav) {
    burger.addEventListener('click', function () {
      var open = nav.classList.toggle('is-open');
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }

  // Sector-switching hero (index)
  var hero = document.querySelector('[data-sector-hero]');
  if (hero) {
    var tabs = hero.querySelectorAll('.sector-tabs button');
    var title = hero.querySelector('.hero__title');
    var sub = hero.querySelector('.hero__sub');
    var proofNum = hero.querySelector('.hero__proof .num');
    var proofLbl = hero.querySelector('.hero__proof .lbl');
    var proofSrc = hero.querySelector('.hero__proof .src');
    var logos = hero.querySelector('.hero__logos ul');
    var imgs = hero.querySelectorAll('.hero__media img');
    var data = JSON.parse(hero.getAttribute('data-sector-hero'));
    var swapEls = [title, sub, proofNum, proofLbl, proofSrc, logos];
    var timer;

    function render(key) {
      var d = data[key];
      title.innerHTML = '<span class="accent">' + d.line1 + '</span>' + d.line2;
      sub.textContent = d.sub;
      proofNum.textContent = d.num;
      proofLbl.textContent = d.lbl;
      proofSrc.textContent = d.src;
      logos.innerHTML = d.logos.map(function (l) {
        return '<li><img src="' + l.src + '" alt="' + l.alt + '"' + (l.tall ? ' class="tall"' : '') + '></li>';
      }).join('');
      imgs.forEach(function (im) { im.classList.toggle('is-active', im.getAttribute('data-key') === key); });
    }
    function select(key, fromUser) {
      tabs.forEach(function (t) { t.setAttribute('aria-selected', t.getAttribute('data-key') === key ? 'true' : 'false'); });
      if (reduce) { render(key); return; }
      swapEls.forEach(function (el) { el.classList.add('is-out'); });
      setTimeout(function () {
        render(key);
        swapEls.forEach(function (el) { el.classList.remove('is-out'); });
      }, 220);
      if (fromUser) { clearInterval(timer); }
    }
    tabs.forEach(function (t) {
      t.addEventListener('click', function () { select(t.getAttribute('data-key'), true); });
    });
    // Gentle auto-rotate until the visitor picks a sector
    var keys = Array.prototype.map.call(tabs, function (t) { return t.getAttribute('data-key'); });
    var i = 0;
    render(keys[0]);
    if (!reduce) {
      timer = setInterval(function () { i = (i + 1) % keys.length; select(keys[i], false); }, 5200);
    }
  }

  // Role tabs (sector pages)
  document.querySelectorAll('[data-roles]').forEach(function (root) {
    var btns = root.querySelectorAll('.roles__list button');
    var panels = root.querySelectorAll('.roles__panel');
    btns.forEach(function (b) {
      b.addEventListener('click', function () {
        var key = b.getAttribute('data-role');
        btns.forEach(function (x) { x.setAttribute('aria-selected', x === b ? 'true' : 'false'); });
        panels.forEach(function (p) { p.hidden = p.getAttribute('data-role') !== key; });
      });
    });
  });

  // Scroll reveals
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  document.querySelectorAll('.reveal, .reveal-stagger').forEach(function (el) { io.observe(el); });

  // Count-up on outcome numbers
  if (!reduce) {
    var cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        var el = e.target; cio.unobserve(el);
        var end = parseFloat(el.getAttribute('data-count'));
        var suffix = el.getAttribute('data-suffix') || '';
        var dur = 1100, start = performance.now();
        (function tick(now) {
          var p = Math.min(1, (now - start) / dur);
          var eased = 1 - Math.pow(1 - p, 3);
          el.textContent = Math.round(end * eased).toLocaleString('en-GB') + suffix;
          if (p < 1) requestAnimationFrame(tick);
        })(start);
      });
    }, { threshold: 0.5 });
    document.querySelectorAll('[data-count]').forEach(function (el) { cio.observe(el); });
  }

  // Demo form (static demo, no backend)
  document.querySelectorAll('form[data-demo]').forEach(function (f) {
    f.addEventListener('submit', function (ev) {
      ev.preventDefault();
      var name = (f.querySelector('[name="first"]') || {}).value || '';
      f.innerHTML = '<h3>Thanks' + (name ? ', ' + name : '') + '.</h3><p class="hint">A member of the team will be in touch within one working day to arrange your demo.</p>';
    });
  });
})();
