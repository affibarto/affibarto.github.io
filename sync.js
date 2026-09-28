/* WeAte house sync — huissleutel + Firestore.
   Conflict rule: last-write-wins on the whole house doc via updatedAt (serverTimestamp).
   Offline: local changes queue and flush when the browser is online again.
   Werkt zonder firebase-config.js (alles blijft lokaal). */
(function () {
  "use strict";

  var SYNC_KEYS = [
    "plan", "people", "always", "extras", "omit", "ingAdd", "checked",
    "brand", "itemBrand", "stores", "budget", "house", "apartPick", "eaten"
  ];
  var DEBOUNCE_MS = 400;
  var CODE_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  var TIP_KEY = "weate.syncTipSeen";
  var LAST_SYNC_KEY = "weate.lastSyncAt";

  var _db = null;
  var _unsub = null;
  var _pushTimer = null;
  var _applying = false;
  var _lastLocalWrite = 0;
  var _lastRemoteMs = 0;
  var _lastSyncAt = 0;
  var _syncStatus = "lokaal"; /* lokaal | online | syncing | error | offline */
  var _deviceId = null;
  var _pendingFlush = false;
  var _onlineBound = false;

  function cfgOk() {
    var c = window.WEATE_FIREBASE;
    return !!(c && c.apiKey && c.projectId && c.apiKey !== "YOUR_API_KEY");
  }

  function isOnline() {
    try {
      if (typeof navigator !== "undefined" && "onLine" in navigator) {
        return !!navigator.onLine;
      }
    } catch (e) {}
    return true;
  }

  function ensureDeviceId() {
    if (_deviceId) return _deviceId;
    try {
      _deviceId = localStorage.getItem("weate.deviceId");
      if (!_deviceId) {
        _deviceId = "d" + Math.random().toString(36).slice(2, 10);
        localStorage.setItem("weate.deviceId", _deviceId);
      }
    } catch (e) {
      _deviceId = "d" + Math.random().toString(36).slice(2, 10);
    }
    return _deviceId;
  }

  function loadLastSync() {
    try {
      var n = +localStorage.getItem(LAST_SYNC_KEY);
      if (n && isFinite(n)) _lastSyncAt = n;
    } catch (e) {}
  }

  function rememberLastSync(ms) {
    _lastSyncAt = ms || Date.now();
    try {
      localStorage.setItem(LAST_SYNC_KEY, String(_lastSyncAt));
    } catch (e) {}
  }

  function makeHouseCode() {
    var len = 6 + Math.floor(Math.random() * 3);
    var out = "";
    for (var i = 0; i < len; i++) {
      out += CODE_ALPHABET.charAt(Math.floor(Math.random() * CODE_ALPHABET.length));
    }
    return out;
  }

  function normalizeCode(raw) {
    return String(raw || "")
      .toUpperCase()
      .replace(/[^A-Z0-9]/g, "")
      .slice(0, 8);
  }

  function initFirebase() {
    if (_db) return _db;
    if (!cfgOk()) return null;
    if (typeof firebase === "undefined" || !firebase.initializeApp) {
      console.warn("WeAte sync: Firebase SDK ontbreekt");
      return null;
    }
    try {
      if (!firebase.apps || !firebase.apps.length) {
        firebase.initializeApp(window.WEATE_FIREBASE);
      }
      _db = firebase.firestore();
      try {
        _db.enablePersistence({ synchronizeTabs: true }).catch(function () {});
      } catch (e) {}
      return _db;
    } catch (e) {
      console.warn("WeAte sync: init mislukt", e);
      return null;
    }
  }

  function packState() {
    var o = {};
    SYNC_KEYS.forEach(function (k) {
      if (typeof S !== "undefined" && S[k] !== undefined) o[k] = S[k];
    });
    return o;
  }

  function stateRichness(obj) {
    if (!obj) return 0;
    var n = 0;
    var plan = obj.plan || {};
    var days = typeof DAYS !== "undefined" ? DAYS : ["Ma", "Di", "Wo", "Do", "Vr", "Za", "Zo"];
    days.forEach(function (d) {
      if (plan[d] && plan[d].id) n += 3;
    });
    n += (obj.always || []).length;
    n += (obj.extras || []).length;
    n += Object.keys(obj.checked || {}).length;
    n += Object.keys(obj.omit || {}).length;
    n += Object.keys(obj.ingAdd || {}).length;
    n += Object.keys(obj.eaten || {}).length;
    n += Object.keys(obj.apartPick || {}).length;
    if ((obj.people || []).length > 6) n += 1;
    return n;
  }

  function isEmptyRemote(data) {
    if (!data) return true;
    return stateRichness(data) === 0 && !data.house;
  }

  function isLocalDefaultish() {
    return stateRichness(S) < 2;
  }

  function saveLocalOnly() {
    _applying = true;
    try {
      if (typeof save === "function") save();
      else if (typeof KEY !== "undefined") {
        localStorage.setItem(KEY, JSON.stringify(S));
      }
    } finally {
      _applying = false;
    }
  }

  function applyRemote(data, opts) {
    opts = opts || {};
    if (!data || typeof S === "undefined") return;
    /* Last-write-wins: replace all synced fields from the winning doc. */
    SYNC_KEYS.forEach(function (k) {
      if (data[k] !== undefined) S[k] = data[k];
    });
    S.houseCode = S.houseCode || normalizeCode(opts.code);
    S.syncOn = true;
    saveLocalOnly();
    try {
      if (typeof drawBord === "function") drawBord();
      if (typeof drawList === "function") drawList();
      if (typeof drawHuis === "function") drawHuis();
      if (typeof paintBrand === "function") paintBrand();
      if (typeof paintStores === "function") paintStores();
    } catch (e) {
      console.warn("WeAte sync: redraw", e);
    }
    if (opts.toast && typeof toast === "function") toast(opts.toast);
  }

  function remoteMs(data) {
    if (!data || !data.updatedAt) return 0;
    if (typeof data.updatedAt.toMillis === "function") return data.updatedAt.toMillis();
    if (typeof data.updatedAt === "number") return data.updatedAt;
    return 0;
  }

  function formatLastSync(ms) {
    if (!ms) return "";
    var d = new Date(ms);
    if (!isFinite(d.getTime())) return "";
    var now = new Date();
    var pad = function (n) { return n < 10 ? "0" + n : String(n); };
    var hm = pad(d.getHours()) + ":" + pad(d.getMinutes());
    var sameDay =
      d.getFullYear() === now.getFullYear() &&
      d.getMonth() === now.getMonth() &&
      d.getDate() === now.getDate();
    if (sameDay) return "vandaag " + hm;
    var yest = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
    var isYest =
      d.getFullYear() === yest.getFullYear() &&
      d.getMonth() === yest.getMonth() &&
      d.getDate() === yest.getDate();
    if (isYest) return "gisteren " + hm;
    return pad(d.getDate()) + "-" + pad(d.getMonth() + 1) + " " + hm;
  }

  function markPending() {
    _pendingFlush = true;
    try {
      if (typeof S !== "undefined") S._syncPending = true;
    } catch (e) {}
  }

  function clearPending() {
    _pendingFlush = false;
    try {
      if (typeof S !== "undefined") delete S._syncPending;
    } catch (e) {}
  }

  function doPush() {
    var db = initFirebase();
    if (!db || !S.syncOn || !S.houseCode || _applying) return Promise.resolve();
    var code = normalizeCode(S.houseCode);
    if (code.length < 6) return Promise.resolve();

    if (!isOnline()) {
      markPending();
      _syncStatus = "offline";
      paintSyncUi();
      return Promise.resolve();
    }

    _lastLocalWrite = Date.now();
    _syncStatus = "syncing";
    paintSyncUi();
    var payload = packState();
    /* LWW marker — server clock. Newer updatedAt wins on every phone. */
    payload.updatedAt = firebase.firestore.FieldValue.serverTimestamp();
    payload.updatedBy = ensureDeviceId();
    return db
      .collection("houses")
      .doc(code)
      .set(payload, { merge: true })
      .then(function () {
        clearPending();
        rememberLastSync(Date.now());
        _syncStatus = "online";
        paintSyncUi();
      })
      .catch(function (err) {
        console.warn("WeAte sync push", err);
        markPending();
        var net =
          !isOnline() ||
          (err && (err.code === "unavailable" || /network|offline|Failed to fetch/i.test(String(err.message || err))));
        _syncStatus = net ? "offline" : "error";
        paintSyncUi();
        if (typeof toast === "function") {
          toast(net ? "Offline — wijzigingen wachten op sync" : "Sync lukte niet — blijf lokaal bezig");
        }
      });
  }

  function syncPush() {
    if (_applying || !S || !S.syncOn || !S.houseCode || !cfgOk()) return;
    clearTimeout(_pushTimer);
    _pushTimer = setTimeout(function () {
      doPush();
    }, DEBOUNCE_MS);
  }

  function flushQueue() {
    if (!S || !S.syncOn || !S.houseCode || !cfgOk()) return;
    if (!_pendingFlush && _syncStatus !== "offline" && _syncStatus !== "error") return;
    if (!isOnline()) {
      _syncStatus = "offline";
      paintSyncUi();
      return;
    }
    doPush();
  }

  function handleSnapshot(snap) {
    if (!snap || !snap.exists) {
      if (stateRichness(S) > 0) doPush();
      return;
    }
    var data = snap.data() || {};
    var rms = remoteMs(data);
    /* Echo of our own write — skip apply, just confirm. */
    if (data.updatedBy && data.updatedBy === ensureDeviceId() && rms && rms <= _lastLocalWrite + 2000) {
      _lastRemoteMs = Math.max(_lastRemoteMs, rms);
      rememberLastSync(rms || Date.now());
      clearPending();
      _syncStatus = isOnline() ? "online" : "offline";
      paintSyncUi();
      return;
    }
    if (rms && rms <= _lastRemoteMs) return;
    /* Remote older than our pending local write → push ours (LWW). */
    if (rms && _lastLocalWrite && rms < _lastLocalWrite - 100) {
      doPush();
      return;
    }
    _lastRemoteMs = rms || Date.now();
    rememberLastSync(rms || Date.now());
    clearPending();
    _syncStatus = isOnline() ? "online" : "offline";
    applyRemote(data, {});
    paintSyncUi();
  }

  function syncStop() {
    if (_unsub) {
      try {
        _unsub();
      } catch (e) {}
      _unsub = null;
    }
    clearTimeout(_pushTimer);
  }

  function syncStart() {
    syncStop();
    if (!S || !S.syncOn || !S.houseCode) {
      _syncStatus = "lokaal";
      paintSyncUi();
      return;
    }
    if (!cfgOk()) {
      _syncStatus = "lokaal";
      paintSyncUi();
      return;
    }
    var db = initFirebase();
    if (!db) {
      _syncStatus = "lokaal";
      paintSyncUi();
      return;
    }
    var code = normalizeCode(S.houseCode);
    _syncStatus = isOnline() ? "syncing" : "offline";
    paintSyncUi();
    _unsub = db.collection("houses").doc(code).onSnapshot(
      function (snap) {
        handleSnapshot(snap);
      },
      function (err) {
        console.warn("WeAte sync listen", err);
        markPending();
        _syncStatus = isOnline() ? "error" : "offline";
        paintSyncUi();
      }
    );
  }

  function tipSeen() {
    try {
      return localStorage.getItem(TIP_KEY) === "1";
    } catch (e) {
      return false;
    }
  }

  function markTipSeen() {
    try {
      localStorage.setItem(TIP_KEY, "1");
    } catch (e) {}
  }

  function paintSyncUi() {
    var status = document.getElementById("syncstatus");
    var help = document.getElementById("synchelp");
    var codeEl = document.getElementById("synccode");
    var codeWrap = document.getElementById("synccodewrap");
    var btnCreate = document.getElementById("synccreate");
    var btnJoin = document.getElementById("syncjoin");
    var joinForm = document.getElementById("syncjoinform");
    var btnOff = document.getElementById("syncoff");
    var lastEl = document.getElementById("synclast");
    var tip = document.getElementById("synctip");
    var pill = document.getElementById("syncpill");
    var configured = cfgOk();

    if (help) {
      if (!configured) {
        help.style.display = "block";
        help.innerHTML =
          'Sync staat klaar, maar Firebase is nog niet geconfigureerd. Voeg <code>firebase-config.js</code> toe (zie <a href="SYNC.md" target="_blank" rel="noopener">SYNC.md</a>). Tot die tijd werkt alles offline op deze telefoon.';
      } else {
        help.style.display = "none";
      }
    }

    var joined = !!(S && S.syncOn && S.houseCode);
    var label = "Lokaal — alleen op deze telefoon";
    var pillText = "lokaal";
    var pillCls = "syncpill";

    if (!configured) {
      label = "Lokaal — Firebase nog niet gezet";
      pillText = "lokaal";
    } else if (joined && _syncStatus === "syncing") {
      label = "Bezig met sync… — huissleutel " + S.houseCode;
      pillText = "sync…";
      pillCls += " syncing";
    } else if (joined && _syncStatus === "offline") {
      label = "Offline — wijzigingen wachten (huissleutel " + S.houseCode + ")";
      pillText = "offline";
      pillCls += " offline";
    } else if (joined && _syncStatus === "error") {
      label = "Sync-fout — huissleutel " + S.houseCode + " (lokaal blijft werken)";
      pillText = "fout";
      pillCls += " error";
    } else if (joined) {
      label = "Online — huissleutel " + S.houseCode;
      pillText = "online";
      pillCls += " online";
    } else if (configured) {
      label = "Lokaal — maak of koppel een huissleutel";
      pillText = "lokaal";
    }

    if (status) status.textContent = label;

    if (lastEl) {
      var ls = formatLastSync(_lastSyncAt);
      if (joined && ls) {
        lastEl.style.display = "block";
        lastEl.textContent = "Laatste sync: " + ls;
      } else if (joined && _pendingFlush) {
        lastEl.style.display = "block";
        lastEl.textContent = "Wacht op verbinding…";
      } else {
        lastEl.style.display = "none";
        lastEl.textContent = "";
      }
    }

    if (pill) {
      if (joined) {
        pill.style.display = "inline-flex";
        pill.className = pillCls;
        pill.textContent = pillText;
      } else {
        pill.style.display = "none";
      }
    }

    /* Thin onboarding: tip when sync available but not linked yet. */
    if (tip) {
      var showTip = configured && !joined && !tipSeen();
      tip.style.display = showTip ? "block" : "none";
    }

    if (codeWrap && codeEl) {
      if (joined) {
        codeWrap.style.display = "block";
        codeEl.textContent = S.houseCode;
      } else {
        codeWrap.style.display = "none";
      }
    }

    if (btnCreate) btnCreate.style.display = joined ? "none" : "block";
    if (btnJoin) btnJoin.style.display = joined ? "none" : "block";
    if (btnOff) btnOff.style.display = joined ? "block" : "none";
    if (joinForm && joined) joinForm.style.display = "none";

    if (btnCreate) btnCreate.disabled = !configured;
    if (btnJoin) btnJoin.disabled = !configured;
  }

  function createHouse() {
    if (!cfgOk()) {
      if (typeof toast === "function") toast("Eerst firebase-config.js zetten — zie SYNC.md");
      paintSyncUi();
      return;
    }
    if (!initFirebase()) {
      if (typeof toast === "function") toast("Firebase start niet");
      return;
    }
    var code = makeHouseCode();
    S.houseCode = code;
    S.syncOn = true;
    saveLocalOnly();
    markTipSeen();
    _syncStatus = "syncing";
    paintSyncUi();
    doPush().then(function () {
      if (typeof toast === "function") toast("Huissleutel: " + code + " — deel met de andere telefoon");
      syncStart();
    });
  }

  function joinHouse(raw) {
    if (!cfgOk()) {
      if (typeof toast === "function") toast("Eerst firebase-config.js zetten — zie SYNC.md");
      return;
    }
    var code = normalizeCode(raw);
    if (code.length < 6 || code.length > 8) {
      if (typeof toast === "function") toast("Code van 6–8 tekens A–Z / 0–9");
      return;
    }
    var db = initFirebase();
    if (!db) {
      if (typeof toast === "function") toast("Firebase start niet");
      return;
    }
    markTipSeen();
    _syncStatus = "syncing";
    paintSyncUi();
    db.collection("houses")
      .doc(code)
      .get()
      .then(function (snap) {
        var remote = snap.exists ? snap.data() : null;
        var remoteEmpty = !snap.exists || isEmptyRemote(remote);
        S.houseCode = code;
        S.syncOn = true;

        if (remoteEmpty) {
          saveLocalOnly();
          return doPush().then(function () {
            if (typeof toast === "function") toast("Gekoppeld — jouw gegevens geüpload");
            syncStart();
          });
        }

        /* Cloud wins on first join when both have data (documented LWW join rule). */
        applyRemote(remote, {
          code: code,
          toast: "Gegevens van de andere telefoon geladen"
        });
        _lastRemoteMs = remoteMs(remote) || Date.now();
        rememberLastSync(_lastRemoteMs);
        syncStart();
      })
      .catch(function (err) {
        console.warn("WeAte sync join", err);
        _syncStatus = isOnline() ? "error" : "offline";
        paintSyncUi();
        if (typeof toast === "function") toast("Koppelen lukte niet");
      });
  }

  function disconnect() {
    syncStop();
    S.syncOn = false;
    S.houseCode = "";
    clearPending();
    saveLocalOnly();
    _syncStatus = "lokaal";
    _lastRemoteMs = 0;
    paintSyncUi();
    if (typeof toast === "function") toast("Ontkoppeld — alles blijft lokaal");
  }

  function wrapSave() {
    if (typeof save !== "function" || save._weateSync) return;
    var orig = save;
    function wrapped() {
      orig.apply(this, arguments);
      if (!_applying) syncPush();
    }
    wrapped._weateSync = true;
    save = wrapped;
    try {
      window.save = wrapped;
    } catch (e) {}
  }

  function wrapDrawHuis() {
    if (typeof drawHuis !== "function" || drawHuis._weateSync) return;
    var orig = drawHuis;
    drawHuis = function () {
      orig.apply(this, arguments);
      paintSyncUi();
    };
    drawHuis._weateSync = true;
  }

  function bindOnline() {
    if (_onlineBound) return;
    _onlineBound = true;
    function onOnline() {
      if (S && S.syncOn && S.houseCode) {
        if (typeof toast === "function" && _pendingFlush) toast("Weer online — syncen…");
        flushQueue();
        if (!_unsub) syncStart();
        else paintSyncUi();
      } else {
        paintSyncUi();
      }
    }
    function onOffline() {
      if (S && S.syncOn && S.houseCode) {
        markPending();
        _syncStatus = "offline";
        paintSyncUi();
      }
    }
    try {
      window.addEventListener("online", onOnline);
      window.addEventListener("offline", onOffline);
    } catch (e) {}
  }

  function bindUi() {
    var btnCreate = document.getElementById("synccreate");
    var btnJoin = document.getElementById("syncjoin");
    var btnGo = document.getElementById("syncjoingo");
    var btnOff = document.getElementById("syncoff");
    var joinForm = document.getElementById("syncjoinform");
    var inp = document.getElementById("syncjoininput");
    var tipDismiss = document.getElementById("synctipok");

    if (btnCreate && !btnCreate._bound) {
      btnCreate._bound = 1;
      btnCreate.addEventListener("click", function (e) {
        e.preventDefault();
        createHouse();
      });
    }
    if (btnJoin && !btnJoin._bound) {
      btnJoin._bound = 1;
      btnJoin.addEventListener("click", function (e) {
        e.preventDefault();
        markTipSeen();
        if (joinForm) {
          joinForm.style.display = joinForm.style.display === "none" || !joinForm.style.display ? "block" : "none";
        }
        if (inp) inp.focus();
        paintSyncUi();
      });
    }
    if (btnGo && !btnGo._bound) {
      btnGo._bound = 1;
      btnGo.addEventListener("click", function (e) {
        e.preventDefault();
        joinHouse(inp && inp.value);
      });
    }
    if (inp && !inp._bound) {
      inp._bound = 1;
      inp.addEventListener("keydown", function (ev) {
        if (ev.key === "Enter") {
          ev.preventDefault();
          joinHouse(inp.value);
        }
      });
    }
    if (btnOff && !btnOff._bound) {
      btnOff._bound = 1;
      btnOff.addEventListener("click", function (e) {
        e.preventDefault();
        disconnect();
      });
    }
    if (tipDismiss && !tipDismiss._bound) {
      tipDismiss._bound = 1;
      tipDismiss.addEventListener("click", function (e) {
        e.preventDefault();
        markTipSeen();
        paintSyncUi();
      });
    }
  }

  function boot() {
    loadLastSync();
    if (typeof S !== "undefined") {
      if (S.houseCode) S.houseCode = normalizeCode(S.houseCode);
      else S.houseCode = S.houseCode || "";
      S.syncOn = !!S.syncOn && !!S.houseCode;
      if (S._syncPending) _pendingFlush = true;
    }
    wrapSave();
    wrapDrawHuis();
    bindUi();
    bindOnline();
    paintSyncUi();
    if (S && S.syncOn && S.houseCode && cfgOk()) {
      syncStart();
      if (_pendingFlush || !isOnline()) {
        /* flush when/if online */
        flushQueue();
      }
    }
  }

  window.WeAteSync = {
    start: syncStart,
    push: syncPush,
    flush: flushQueue,
    paint: paintSyncUi,
    create: createHouse,
    join: joinHouse,
    disconnect: disconnect,
    configured: cfgOk,
    status: function () {
      return _syncStatus;
    },
    lastSync: function () {
      return _lastSyncAt;
    }
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
