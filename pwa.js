/* WeAte PWA — SW register + subtiele installeer-tip */
(function () {
  'use strict';

  var DISMISS_KEY = 'weate-install-dismiss';

  function canRegisterSW() {
    if (!('serviceWorker' in navigator)) return false;
    var h = location.hostname;
    var secure = location.protocol === 'https:' || h === 'localhost' || h === '127.0.0.1';
    return secure;
  }

  function registerSW() {
    if (!canRegisterSW()) return;
    navigator.serviceWorker.register('./sw.js', { scope: './' }).catch(function (err) {
      console.warn('[WeAte] SW register mislukt', err);
    });
  }

  function hideTip(el) {
    if (!el) return;
    el.classList.remove('on');
    setTimeout(function () {
      if (el.parentNode) el.parentNode.removeChild(el);
    }, 220);
  }

  function showInstallTip(deferred) {
    try {
      if (sessionStorage.getItem(DISMISS_KEY) === '1') return;
      if (localStorage.getItem(DISMISS_KEY) === '1') return;
    } catch (e) {}

    if (document.getElementById('pwa-install')) return;

    var tip = document.createElement('div');
    tip.id = 'pwa-install';
    tip.className = 'pwainstall';
    tip.setAttribute('role', 'status');
    tip.innerHTML =
      '<div class="pwainstall-txt">' +
      '<b>Installeer WeAte</b>' +
      '<span>Op je startscherm — handig naast de boodschappen.</span>' +
      '</div>' +
      '<button type="button" class="btn s" id="pwa-install-go">Installeer</button>' +
      '<button type="button" class="pwainstall-x" id="pwa-install-x" aria-label="Sluiten">×</button>';

    var host = document.querySelector('.phone') || document.body;
    host.appendChild(tip);
    requestAnimationFrame(function () { tip.classList.add('on'); });

    tip.querySelector('#pwa-install-x').addEventListener('click', function () {
      try { sessionStorage.setItem(DISMISS_KEY, '1'); } catch (e) {}
      hideTip(tip);
    });

    tip.querySelector('#pwa-install-go').addEventListener('click', function () {
      hideTip(tip);
      if (!deferred || !deferred.prompt) return;
      deferred.prompt();
      deferred.userChoice.then(function (choice) {
        if (choice && choice.outcome === 'accepted') {
          try { localStorage.setItem(DISMISS_KEY, '1'); } catch (e) {}
        } else {
          try { sessionStorage.setItem(DISMISS_KEY, '1'); } catch (e) {}
        }
      }).catch(function () {});
    });
  }

  var deferredPrompt = null;

  window.addEventListener('beforeinstallprompt', function (e) {
    e.preventDefault();
    deferredPrompt = e;
    // Subtiel: even wachten tot na splash
    setTimeout(function () { showInstallTip(deferredPrompt); }, 2800);
  });

  window.addEventListener('appinstalled', function () {
    deferredPrompt = null;
    try { localStorage.setItem(DISMISS_KEY, '1'); } catch (e) {}
    hideTip(document.getElementById('pwa-install'));
  });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', registerSW);
  } else {
    registerSW();
  }
})();
