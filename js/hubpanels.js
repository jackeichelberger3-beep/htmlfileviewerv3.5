/* HTML Studio standalone — the studio's extra panels: Theme Gallery, Console
   History, System Monitor, Asset Manager, User Account and Command Registry.
   One modal shell, opened from the side rail or the Terminal ("commands").
   Everything reads the same local project, settings and key storage as app.js. */
window.HSHub = (function () {
  var HS = window.HS;
  var HISTORY_KEY = 'hs_terminal_history_v1';
  var ASSET_KEY = 'hs_assets_v1';

  /* ---------------- small builders ---------------- */
  function row(label, value, tone) {
    var line = HS.el('div', { class: 'hs-row' });
    line.style.padding = '5px 0';
    line.appendChild(HS.el('span', { class: 'hint', text: label }));
    var v = HS.el('span', { text: String(value) });
    v.style.fontFamily = 'var(--hs-mono)';
    v.style.fontSize = '12.5px';
    v.style.color = tone === 'good' ? 'var(--hs-accent)' : 'var(--hs-text)';
    line.appendChild(v);
    return line;
  }

  function btn(labelText, handler, opts) {
    opts = opts || {};
    var b = HS.el('button', { class: 'hs-btn' + (opts.primary ? ' primary' : ''), text: (opts.icon ? opts.icon + ' ' : '') + labelText });
    if (opts.disabled) { b.disabled = true; b.style.opacity = '.4'; b.style.cursor = 'not-allowed'; }
    else b.addEventListener('click', handler);
    if (opts.danger) b.style.color = 'var(--hs-danger)';
    return b;
  }

  function actions() {
    var box = HS.el('div', {});
    box.style.display = 'flex';
    box.style.flexWrap = 'wrap';
    box.style.gap = '6px';
    box.style.marginTop = '10px';
    return box;
  }

  function card(titleText, icon) {
    var box = HS.el('div', { class: 'hs-card' });
    box.style.padding = '14px';
    var head = HS.el('div', {});
    head.style.cssText = 'display:flex;align-items:center;gap:8px;margin-bottom:6px';
    if (icon) head.appendChild(HS.el('span', { text: icon }));
    var strong = HS.el('strong', { text: titleText });
    strong.style.display = 'inline';
    head.appendChild(strong);
    box.appendChild(head);
    return box;
  }

  function tag(text, color) {
    var chip = HS.el('span', { class: 'hs-tag', text: text });
    if (color) chip.style.color = color;
    return chip;
  }

  function grid(min) {
    var g = HS.el('div', { class: 'hs-cards' });
    g.style.gridTemplateColumns = 'repeat(auto-fill, minmax(' + (min || 220) + 'px, 1fr))';
    g.style.marginTop = '12px';
    return g;
  }

  function copyText(text, say) {
    navigator.clipboard.writeText(text).then(function () { say('Copied to the clipboard.'); }, function () { say('The browser blocked the clipboard.', 'error'); });
  }

  function shell(title, subtitle, onClose) {
    var backdrop = HS.el('div', { class: 'hs-backdrop' });
    var modal = HS.el('div', { class: 'hs-modal' });
    modal.style.maxWidth = '980px';
    var content = HS.el('div', { class: 'content' });
    var header = HS.el('header');
    header.appendChild(HS.el('h2', { text: title }));
    var grow = HS.el('span', { class: 'grow' });
    grow.style.marginLeft = 'auto';
    header.appendChild(grow);
    var closeBtn = HS.el('button', { class: 'winbtn', text: '✕', title: 'Close' });
    header.appendChild(closeBtn);
    var body = HS.el('div', { class: 'body' });
    if (subtitle) body.appendChild(HS.el('p', { text: subtitle }));
    content.appendChild(header);
    content.appendChild(body);
    modal.appendChild(content);
    backdrop.appendChild(modal);
    HS.$('#hs-modals').appendChild(backdrop);
    function close() {
      if (onClose) onClose();
      backdrop.remove();
    }
    closeBtn.addEventListener('click', close);
    backdrop.addEventListener('mousedown', function (e) { if (e.target === backdrop) close(); });
    return { body: body, close: close };
  }

  /* ---------------- Theme Gallery ---------------- */
  function themePanel(body, ctx, api) {
    var wrap = HS.el('div', {});
    body.appendChild(wrap);
    function kindOf(theme) {
      if (HS.THEMES.some(function (t) { return t.id === theme.id; })) return 'built-in';
      if (HS.pluginHost && HS.pluginHost.themes.some(function (t) { return t.id === theme.id; })) return 'plugin';
      return 'personal';
    }
    function paint() {
      wrap.innerHTML = '';
      var settings = ctx.settings();
      var all = HS.allThemes(settings);
      wrap.appendChild(row('Themes', all.length + ' available'));
      wrap.appendChild(row('Active', HS.findTheme(settings.theme, settings).name, 'good'));
      var g = grid(212);
      all.forEach(function (t) {
        var active = settings.theme === t.id;
        var box = HS.el('div', { class: 'hs-theme-card' });
        box.style.background = t.tokens.panel;
        box.style.borderColor = active ? 'var(--hs-accent)' : 'var(--hs-border)';
        var strip = HS.el('div', {});
        strip.style.cssText = 'display:flex;gap:4px;margin-bottom:8px';
        [t.tokens.bg, t.tokens.panel2, t.tokens.accent, t.tokens.text].forEach(function (c) {
          var dot = HS.el('span', {});
          dot.style.cssText = 'flex:1;height:8px;border-radius:99px;border:1px solid rgba(255,255,255,.16);background:' + c;
          strip.appendChild(dot);
        });
        box.appendChild(strip);
        var name = HS.el('strong', { text: t.name });
        name.style.color = t.tokens.text;
        box.appendChild(name);
        var meta = HS.el('span', { class: 'hs-msg', text: t.id + ' · ' + kindOf(t) });
        meta.style.marginTop = '2px';
        box.appendChild(meta);
        var apply = btn(active ? '✓ Applied' : 'Apply', function () {
          settings.theme = t.id;
          ctx.save();
          ctx.applyTheme();
          ctx.renderTop();
          ctx.say('Theme set to ' + t.name + '.');
          paint();
        }, { primary: !active, disabled: active });
        apply.style.marginTop = '8px';
        box.appendChild(apply);
        g.appendChild(box);
      });
      wrap.appendChild(g);
      var foot = actions();
      foot.appendChild(btn('Open theme builder', function () { api.close(); ctx.openSettings(); }, { icon: '⚙' }));
      wrap.appendChild(foot);
      wrap.appendChild(HS.el('p', { class: 'hs-msg', text: 'Personal themes live in this browser; plugin themes come from installed plugins. Build and save your own under Settings → Themes.' }));
    }
    paint();
  }

  /* ---------------- Console History ---------------- */
  function historyPanel(body, ctx, api) {
    var state = { query: '', filter: 'all' };
    var wrap = HS.el('div', {});
    body.appendChild(wrap);

    function entries() { return HS.readLS(HISTORY_KEY, []) || []; }

    function paint() {
      wrap.innerHTML = '';
      var all = entries();
      var bar = HS.el('div', {});
      bar.style.cssText = 'display:flex;gap:6px;flex-wrap:wrap;align-items:center;margin-top:10px';
      var search = HS.el('input', { class: 'hs-input', placeholder: 'Search commands or output…' });
      search.style.flex = '1';
      search.style.minWidth = '200px';
      search.value = state.query;
      search.addEventListener('input', function () { state.query = search.value; paintList(); });
      bar.appendChild(search);
      wrap.appendChild(bar);

      var chips = HS.el('div', {});
      chips.style.cssText = 'display:flex;gap:4px;margin-top:8px;flex-wrap:wrap';
      ['all', 'info', 'warn', 'error'].forEach(function (f) {
        var chip = HS.el('button', { class: 'hs-pill' + (state.filter === f ? ' on' : state.filter === 'all' ? ' ghost' : ''), text: f });
        if (state.filter !== f && state.filter !== 'all') chip.className = 'hs-pill';
        if (state.filter !== f) chip.style.color = 'var(--hs-dim)';
        chip.addEventListener('click', function () { state.filter = f; paint(); });
        chips.appendChild(chip);
      });
      chips.appendChild(btn('Clear history', function () {
        HS.writeLS(HISTORY_KEY, []);
        ctx.say('Terminal history cleared.');
        paint();
      }, { danger: true, icon: '🗑' }));
      wrap.appendChild(chips);

      var list = HS.el('div', {});
      list.style.marginTop = '10px';
      wrap.appendChild(list);

      function paintList() {
        list.innerHTML = '';
        var q = state.query.toLowerCase();
        var shown = all.filter(function (h) {
          if (state.filter !== 'all' && h.level !== state.filter) return false;
          if (!q) return true;
          return String(h.input || '').toLowerCase().indexOf(q) >= 0 || String(h.output || '').toLowerCase().indexOf(q) >= 0;
        }).reverse();
        wrap.querySelectorAll('.hs-pill').forEach(function (c) {
          var on = c.textContent.toLowerCase() === state.filter;
          c.className = 'hs-pill' + (on ? ' on' : '');
          c.style.color = on ? 'var(--hs-accentText)' : 'var(--hs-dim)';
        });
        if (!shown.length) {
          var msg = HS.el('p', { class: 'hs-msg', text: 'No terminal history yet — run a command in the Terminal panel to populate this list.' });
          msg.style.marginTop = '16px';
          list.appendChild(msg);
          return;
        }
        shown.forEach(function (h) {
          var box = HS.el('div', { class: 'hs-card' });
          box.style.marginTop = '6px';
          var head = HS.el('div', {});
          head.style.cssText = 'display:flex;align-items:center;gap:8px';
          var input = HS.el('span', { text: '› ' + h.input });
          input.style.cssText = 'font-family:var(--hs-mono);font-size:12px;color:var(--hs-accent)';
          head.appendChild(input);
          var time = HS.el('span', { text: new Date(h.time).toLocaleString() });
          time.style.cssText = 'margin-left:auto;font-size:11px;color:var(--hs-dim)';
          head.appendChild(time);
          box.appendChild(head);
          if (h.output) {
            var out = HS.el('pre', { text: h.output });
            out.style.cssText = 'margin:6px 0 0;font-family:var(--hs-mono);font-size:11.5px;white-space:pre-wrap;word-break:break-word;color:' +
              (h.level === 'error' ? 'var(--hs-danger)' : h.level === 'warn' ? '#fdd663' : 'var(--hs-text)');
            box.appendChild(out);
          }
          list.appendChild(box);
        });
      }
      paintList();
    }
    paint();
  }

  /* ---------------- System Monitor ---------------- */
  function monitorPanel(body, ctx) {
    var wrap = HS.el('div', {});
    body.appendChild(wrap);
    var fps = 0;
    var frames = 0;
    var last = performance.now();
    var rafId = null;

    function meter(labelText) {
      var box = HS.el('div', { class: 'hs-card' });
      box.style.padding = '12px';
      var top = HS.el('div', {});
      top.style.cssText = 'display:flex;justify-content:space-between;align-items:baseline';
      top.appendChild(HS.el('span', { class: 'hint', text: labelText }));
      var value = HS.el('span', { text: '—' });
      value.style.cssText = 'font-family:var(--hs-mono);font-size:13px;color:var(--hs-text);margin-top:0';
      top.appendChild(value);
      box.appendChild(top);
      var track = HS.el('div', {});
      track.style.cssText = 'height:6px;margin-top:8px;border-radius:99px;background:var(--hs-panel2);overflow:hidden';
      var fill = HS.el('div', {});
      fill.style.cssText = 'height:100%;width:0%;border-radius:99px;background:var(--hs-accent);transition:width .4s';
      track.appendChild(fill);
      box.appendChild(track);
      return {
        box: box,
        set: function (text, pct, color) {
          value.textContent = text;
          fill.style.width = Math.max(0, Math.min(100, pct || 0)) + '%';
          if (color) fill.style.background = color;
        }
      };
    }

    var fpsMeter = meter('Frames per second');
    var heapMeter = meter('JS heap used');
    var storeMeter = meter('Browser storage');
    var meters = HS.el('div', { class: 'hs-cards' });
    meters.style.marginTop = '10px';
    meters.style.gridTemplateColumns = 'repeat(auto-fill, minmax(220px, 1fr))';
    [fpsMeter, heapMeter, storeMeter].forEach(function (m) { meters.appendChild(m.box); });
    wrap.appendChild(meters);

    var boxes = HS.el('div', {});
    boxes.style.cssText = 'display:grid;gap:8px;grid-template-columns:repeat(auto-fill, minmax(260px, 1fr));margin-top:12px';
    wrap.appendChild(boxes);

    var runtimeCard = card('Studio runtime', '🖥');
    var runtimeBody = HS.el('div', {});
    runtimeCard.appendChild(runtimeBody);
    var storageCard = card('Browser storage', '🗄');
    var storageBody = HS.el('div', {});
    storageCard.appendChild(storageBody);
    var keysCard = card('Key storage', '🔑');
    var keysBody = HS.el('div', {});
    keysCard.appendChild(keysBody);
    boxes.appendChild(runtimeCard);
    boxes.appendChild(storageCard);
    boxes.appendChild(keysCard);

    var note = HS.el('p', { class: 'hs-msg', text: 'Metrics update every second while this panel is open. Heap memory is only reported by Chromium-based browsers.' });
    wrap.appendChild(note);

    function localStorageStats() {
      var bytes = 0, count = 0;
      try {
        for (var i = 0; i < localStorage.length; i += 1) {
          var k = localStorage.key(i);
          var v = localStorage.getItem(k) || '';
          bytes += k.length + v.length;
          count += 1;
        }
      } catch (e) { /* ignore */ }
      return { bytes: bytes * 2, count: count };
    }

    function refresh() {
      var state = ctx.state();
      var mem = performance.memory || {};
      var used = mem.usedJSHeapSize ? mem.usedJSHeapSize / 1048576 : 0;
      var limit = mem.jsHeapSizeLimit ? mem.jsHeapSizeLimit / 1048576 : 0;
      var ls = localStorageStats();

      fpsMeter.set(fps + ' fps / 60', (fps / 60) * 100, fps >= 50 ? '#81c995' : fps >= 30 ? '#fdd663' : 'var(--hs-danger)');
      heapMeter.set(limit ? used.toFixed(1) + ' / ' + limit.toFixed(0) + ' MB' : 'n/a', limit ? (used / limit) * 100 : 0, '#81c995');
      storeMeter.set(window.HSKV.fmt(ls.bytes), (ls.bytes / (5 * 1024 * 1024)) * 100, '#fdd663');

      runtimeBody.innerHTML = '';
      runtimeBody.appendChild(row('Frames (fps)', fps));
      runtimeBody.appendChild(row('JS heap', limit ? used.toFixed(1) + ' MB of ' + limit.toFixed(0) + ' MB' : 'n/a'));
      runtimeBody.appendChild(row('Project files', state.project.files.length));
      runtimeBody.appendChild(row('Folders', state.project.folders.length));
      runtimeBody.appendChild(row('Open tabs', state.project.openTabs.length));
      runtimeBody.appendChild(row('Plugins', state.plugins.length + ' · ' + state.plugins.filter(function (p) { return p.enabled; }).length + ' enabled'));
      runtimeBody.appendChild(row('Theme', state.settings.theme));
      runtimeBody.appendChild(row('Console errors', state.console.filter(function (l) { return l.level === 'error'; }).length, state.console.some(function (l) { return l.level === 'error'; }) ? '' : 'good'));

      storageBody.innerHTML = '';
      storageBody.appendChild(row('localStorage entries', ls.count));
      storageBody.appendChild(row('Approximate size', window.HSKV.fmt(ls.bytes)));
      storageBody.appendChild(row('Project saved', window.HSKV.fmt(JSON.stringify(state.project || {}).length * 2)));
      storageBody.appendChild(row('Snippets', state.snippets.length));
      storageBody.appendChild(row('Terminal history', (HS.readLS(HISTORY_KEY, []) || []).length));
      storageBody.appendChild(row('Assets', (HS.readLS(ASSET_KEY, []) || []).length));

      var entries = 0, bytes = 0;
      var keys = window.HSKV.allKeys();
      keys.forEach(function (k) {
        var st = window.HSKV.stats(window.HSKV.read(k));
        entries += st.entries;
        bytes += st.bytes;
      });
      keysBody.innerHTML = '';
      keysBody.appendChild(row('Access keys', keys.length));
      keysBody.appendChild(row('Linked stores', keys.length));
      keysBody.appendChild(row('Entries', entries));
      keysBody.appendChild(row('Size', window.HSKV.fmt(bytes)));
      keysBody.appendChild(row('Active tier', ctx.tier() || 'no key'));
    }

    function tick(t) {
      frames += 1;
      if (t - last >= 1000) {
        fps = Math.round((frames * 1000) / (t - last));
        frames = 0;
        last = t;
        refresh();
      }
      rafId = requestAnimationFrame(tick);
    }
    refresh();
    rafId = requestAnimationFrame(tick);

    return function cleanup() { if (rafId) cancelAnimationFrame(rafId); };
  }

  /* ---------------- Asset Manager ---------------- */
  function assetsPanel(body, ctx, api) {
    var wrap = HS.el('div', {});
    body.appendChild(wrap);
    var LIMIT = 400 * 1024;

    function read() { return HS.readLS(ASSET_KEY, []) || []; }
    function persist(next) { HS.writeLS(ASSET_KEY, next); paint(); }

    function upload(files) {
      var list = Array.prototype.slice.call(files || []);
      if (!list.length) return;
      var next = read();
      var skipped = [];
      var pending = list.length;
      list.forEach(function (file) {
        if (file.size > LIMIT) {
          skipped.push(file.name);
          pending -= 1;
          if (!pending) finish();
          return;
        }
        var reader = new FileReader();
        reader.onload = function () {
          next.push({
            id: HS.uid('asset'),
            name: file.name,
            url: String(reader.result || ''),
            type: /^image\//.test(file.type) ? 'image' : 'file',
            size: file.size,
            added: Date.now()
          });
          pending -= 1;
          if (!pending) finish();
        };
        reader.onerror = function () { pending -= 1; if (!pending) finish(); };
        reader.readAsDataURL(file);
      });
      function finish() {
        HS.writeLS(ASSET_KEY, next);
        var saved = (HS.readLS(ASSET_KEY, []) || []).length;
        ctx.say('Added ' + (list.length - skipped.length) + ' asset(s)' + (skipped.length ? ', skipped ' + skipped.length + ' over 400 KB' : '') + '.');
        if (saved < next.length) ctx.say('Browser storage is full — some assets could not be saved. Remove a few and try again.', 'error');
        paint();
      }
    }

    function paint() {
      wrap.innerHTML = '';
      var assets = read();
      var total = assets.reduce(function (n, a) { return n + (a.size || 0); }, 0);
      wrap.appendChild(row('Assets', assets.length + ' · ' + window.HSKV.fmt(total)));

      var drop = HS.el('label', {});
      drop.style.cssText = 'display:flex;flex-direction:column;align-items:center;gap:6px;padding:22px;margin-top:10px;border:2px dashed var(--hs-border);border-radius:var(--hs-radius);background:var(--hs-panel2);cursor:pointer';
      drop.appendChild(HS.el('span', { text: '⬆', style: { fontSize: '18px' } }));
      drop.appendChild(HS.el('span', { text: 'Drop or click to add images and files' }));
      var hint = HS.el('span', { class: 'hs-msg', text: 'Kept in this browser — each asset up to 400 KB. Copy its URL and use it in your HTML.', style: { marginTop: '0', fontSize: '11px' } });
      drop.appendChild(hint);
      var input = HS.el('input', { type: 'file', multiple: 'multiple' });
      input.style.display = 'none';
      input.addEventListener('change', function () { upload(input.files); input.value = ''; });
      drop.appendChild(input);
      drop.addEventListener('dragover', function (e) { e.preventDefault(); });
      drop.addEventListener('drop', function (e) {
        e.preventDefault();
        upload(e.dataTransfer && e.dataTransfer.files);
      });
      wrap.appendChild(drop);

      if (!assets.length) {
        var empty = HS.el('p', { class: 'hs-msg', text: 'No assets yet. Add images or files to reference them from your pages.' });
        empty.style.marginTop = '18px';
        wrap.appendChild(empty);
        return;
      }

      var images = assets.filter(function (a) { return a.type === 'image'; });
      var others = assets.filter(function (a) { return a.type !== 'image'; });

      if (images.length) {
        wrap.appendChild(HS.el('label', { class: 'hs-label', text: 'Images (' + images.length + ')' }));
        var g = HS.el('div', {});
        g.style.cssText = 'display:grid;gap:8px;grid-template-columns:repeat(auto-fill, minmax(150px, 1fr))';
        images.forEach(function (a) {
          var box = HS.el('div', { class: 'hs-card' });
          box.style.padding = '0';
          box.style.overflow = 'hidden';
          var img = HS.el('img', { src: a.url, alt: a.name });
          img.style.cssText = 'display:block;width:100%;height:96px;object-fit:cover';
          box.appendChild(img);
          var meta = HS.el('div', {});
          meta.style.padding = '6px 8px';
          var name = HS.el('p', { text: a.name });
          name.style.cssText = 'margin:0;font-size:11.5px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap';
          meta.appendChild(name);
          var acts = HS.el('div', {});
          acts.style.cssText = 'display:flex;gap:6px;margin-top:4px';
          acts.appendChild(btn('Copy URL', function () { copyText(a.url, ctx.say); }));
          acts.appendChild(btn('Delete', function () {
            persist(read().filter(function (x) { return x.id !== a.id; }));
            ctx.say('Deleted ' + a.name + '.');
          }, { danger: true }));
          meta.appendChild(acts);
          box.appendChild(meta);
          g.appendChild(box);
        });
        wrap.appendChild(g);
      }

      if (others.length) {
        wrap.appendChild(HS.el('label', { class: 'hs-label', text: 'Files (' + others.length + ')' }));
        others.forEach(function (a) {
          var line = HS.el('div', { class: 'hs-card' });
          line.style.cssText = 'display:flex;align-items:center;gap:8px;margin-top:6px';
          line.appendChild(HS.el('span', { text: '📄' }));
          var name = HS.el('span', { text: a.name });
          name.style.cssText = 'flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:12.5px';
          line.appendChild(name);
          line.appendChild(HS.el('span', { class: 'hs-tag', text: window.HSKV.fmt(a.size || 0) }));
          line.appendChild(btn('Copy URL', function () { copyText(a.url, ctx.say); }));
          line.appendChild(btn('Delete', function () {
            persist(read().filter(function (x) { return x.id !== a.id; }));
          }, { danger: true }));
          wrap.appendChild(line);
        });
      }

      var foot = actions();
      foot.appendChild(btn('Clear all assets', function () {
        persist([]);
        ctx.say('All assets removed.');
      }, { danger: true, icon: '🗑' }));
      wrap.appendChild(foot);
    }
    paint();
  }

  /* ---------------- User Account ---------------- */
  function accountPanel(body, ctx, api) {
    var KV = window.HSKV;
    var wrap = HS.el('div', {});
    body.appendChild(wrap);
    var profileDraft = null;

    function mask(key) { return String(key).slice(0, 2) + '••••' + String(key).slice(-2); }

    function paint() {
      wrap.innerHTML = '';
      var key = ctx.key();
      if (!key) {
        var box = card('No key active', '🔒');
        box.appendChild(HS.el('p', { class: 'hs-msg', text: 'Sign in with an access key to see your account, its storage and the keys linked to this studio.' }));
        var foot = actions();
        foot.appendChild(btn('Enter a key', function () { api.close(); ctx.openKeyGate(); }, { primary: true, icon: '🔑' }));
        box.appendChild(foot);
        wrap.appendChild(box);
        return;
      }

      var store = KV.read(key);
      var st = KV.stats(store);
      var isOwner = window.can(key.tier, 'owner');
      var profile = (store.entries && store.entries.profile) || {};
      if (!profileDraft) profileDraft = { name: profile.name || key.username || '', status: profile.status || 'active' };

      var identity = HS.el('div', { class: 'hs-card' });
      identity.style.cssText = 'display:flex;align-items:center;gap:12px;flex-wrap:wrap;margin-top:10px';
      var avatar = HS.el('div', { text: (key.username || key.label || 'K').slice(0, 1).toUpperCase() });
      avatar.style.cssText = 'display:grid;place-items:center;width:44px;height:44px;border-radius:99px;background:var(--hs-panel2);color:var(--hs-accent);font-size:18px;font-weight:500';
      identity.appendChild(avatar);
      var who = HS.el('div', {});
      var nameEl = HS.el('strong', { text: profileDraft.name || key.username || 'No username' });
      nameEl.style.cssText = 'display:block;font-size:15px';
      who.appendChild(nameEl);
      var labelEl = HS.el('span', { class: 'hs-msg', text: key.label, style: { marginTop: '2px', fontSize: '12px' } });
      who.appendChild(labelEl);
      identity.appendChild(who);
      var tierChip = tag('tier · ' + key.tier, 'var(--hs-accent)');
      tierChip.style.marginLeft = 'auto';
      identity.appendChild(tierChip);
      identity.appendChild(tag('store · ' + KV.id(key)));
      wrap.appendChild(identity);

      var two = HS.el('div', {});
      two.style.cssText = 'display:grid;gap:10px;grid-template-columns:repeat(auto-fit, minmax(280px, 1fr));margin-top:10px';

      /* account status + profile */
      var statusCard = card('Account status', '🛡');
      var perms = Object.keys(window.HS_PERMISSIONS).filter(function (p) { return window.can(key.tier, p); });
      statusCard.appendChild(row('Session', 'Unlocked', 'good'));
      statusCard.appendChild(row('Tier rank', window.tierRank(key.tier) + ' / 4'));
      statusCard.appendChild(row('Permissions', perms.join(', ') || 'none'));
      statusCard.appendChild(row('Username', key.username || '—'));

      var nameInput = HS.el('input', { class: 'hs-input', placeholder: 'Your display name' });
      nameInput.style.marginTop = '10px';
      nameInput.value = profileDraft.name;
      nameInput.addEventListener('input', function () { profileDraft.name = nameInput.value; });
      statusCard.appendChild(nameInput);

      var statusSelect = HS.el('select', { class: 'hs-input' });
      statusSelect.style.marginTop = '6px';
      ['active', 'away', 'busy', 'offline'].forEach(function (s) {
        var opt = HS.el('option', { value: s, text: s.charAt(0).toUpperCase() + s.slice(1) });
        if (profileDraft.status === s) opt.selected = true;
        statusSelect.appendChild(opt);
      });
      statusSelect.addEventListener('change', function () { profileDraft.status = statusSelect.value; });
      statusCard.appendChild(statusSelect);

      var accountFoot = actions();
      accountFoot.appendChild(btn('Save profile', function () {
        var fresh = KV.read(key);
        fresh.entries.profile = { name: profileDraft.name, status: profileDraft.status };
        KV.write(key, fresh.entries);
        nameEl.textContent = profileDraft.name || key.username || 'No username';
        ctx.say('Profile saved to ' + fresh.storeId + '.');
        ctx.renderStatus();
      }, { primary: true }));
      accountFoot.appendChild(btn('Lock session', function () { api.close(); ctx.lock(); }, { icon: '🔒' }));
      statusCard.appendChild(accountFoot);
      var note = HS.el('p', { class: 'hs-msg', text: 'Profile data is saved to this key\'s own storage (' + KV.id(key) + ').' });
      statusCard.appendChild(note);
      two.appendChild(statusCard);

      /* this key's storage */
      var storeCard = card("This key's storage", '🗄');
      storeCard.appendChild(row('Entries', st.entries));
      storeCard.appendChild(row('Size', KV.fmt(st.bytes)));
      storeCard.appendChild(row('Script', 'hs-storage-' + KV.scriptName(key) + '.js'));
      var entryBox = HS.el('div', {});
      entryBox.style.cssText = 'max-height:150px;overflow:auto;margin-top:6px';
      var names = Object.keys(store.entries || {});
      if (!names.length) {
        entryBox.appendChild(HS.el('p', { class: 'hs-msg', text: 'Nothing stored yet — pages write here through window.HSStorage.' }));
      } else {
        names.forEach(function (n) {
          var line = HS.el('div', {});
          line.style.cssText = 'display:flex;gap:8px;padding:4px 8px;border-radius:8px;background:var(--hs-panel2);margin-top:4px;font-size:11.5px;font-family:var(--hs-mono)';
          line.appendChild(HS.el('span', { text: n, style: { color: 'var(--hs-accent)' } }));
          var v = HS.el('span', { text: KV.entryText(store.entries[n]) });
          v.style.cssText = 'margin-left:auto;max-width:60%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:var(--hs-dim)';
          line.appendChild(v);
          entryBox.appendChild(line);
        });
      }
      storeCard.appendChild(entryBox);
      var storeFoot = actions();
      storeFoot.appendChild(btn('Refresh', function () { ctx.say('Storage refreshed.'); paint(); }, { icon: '↻' }));
      storeFoot.appendChild(btn('Storage script', function () {
        HS.downloadText(KV.scriptText(key), 'hs-storage-' + KV.scriptName(key) + '.js', 'application/javascript');
        ctx.say('Storage script downloaded.');
      }, { icon: '⬇' }));
      storeFoot.appendChild(btn('Copy script', function () { copyText(KV.scriptText(key), ctx.say); }, { icon: '⧉' }));
      storeFoot.appendChild(btn('Clear', function () {
        KV.write(key, {});
        ctx.say("Cleared this key's storage.");
        ctx.renderStatus();
        paint();
      }, { danger: true, icon: '🗑' }));
      storeCard.appendChild(storeFoot);

      var renameRow = HS.el('div', {});
      renameRow.style.cssText = 'display:flex;gap:6px;margin-top:8px';
      var renameInput = HS.el('input', { class: 'hs-input', placeholder: 'Script name' });
      renameInput.value = KV.scriptName(key);
      renameInput.style.flex = '1';
      renameRow.appendChild(renameInput);
      renameRow.appendChild(btn('Rename script', function () {
        if (!renameInput.value.trim()) { ctx.say('Type a name for the script first.', 'error'); return; }
        KV.setScriptName(key, renameInput.value.trim());
        ctx.say('Storage script renamed to hs-storage-' + KV.scriptName(key) + '.js.');
        paint();
      }));
      storeCard.appendChild(renameRow);
      two.appendChild(storeCard);
      wrap.appendChild(two);

      /* linked keys */
      var keysCard = card('Linked security keys', '🔑');
      (KV.allKeys() || []).forEach(function (k) {
        var active = k.key === key.key;
        var line = HS.el('div', { class: 'hs-row' });
        line.style.cssText = 'padding:6px 8px;border-radius:8px;gap:8px;flex-wrap:wrap;background:' + (active ? 'var(--hs-panel2)' : 'transparent');
        line.appendChild(tag(k.tier, 'var(--hs-accent)'));
        line.appendChild(HS.el('span', { text: k.label, style: { fontSize: '12.5px' } }));
        if (k.username) line.appendChild(HS.el('span', { class: 'hs-msg', text: '@' + k.username, style: { marginTop: '0', fontSize: '11.5px' } }));
        var raw = HS.el('span', { text: isOwner || active ? k.key : mask(k.key) });
        raw.style.cssText = 'font-family:var(--hs-mono);font-size:11.5px;color:var(--hs-dim)';
        line.appendChild(raw);
        var ks = KV.stats(KV.read(k));
        var meta = HS.el('span', { text: ks.entries + ' entries · ' + KV.fmt(ks.bytes) });
        meta.style.cssText = 'margin-left:auto;font-size:11.5px;color:var(--hs-dim)';
        line.appendChild(meta);
        if (active) line.appendChild(tag('active', 'var(--hs-accent)'));
        if (k.enabled === false) line.appendChild(tag('disabled', 'var(--hs-danger)'));
        keysCard.appendChild(line);
      });
      keysCard.appendChild(HS.el('p', { class: 'hs-msg', text: 'Each key has its own storage. ' + (isOwner ? 'As owner you can see every key.' : 'Only your active key and the owner reveal raw key strings.') }));
      var keysFoot = actions();
      keysFoot.appendChild(btn('Open key storage manager', function () { api.close(); ctx.openStoreManager(); }, { icon: '🗄' }));
      keysCard.appendChild(keysFoot);
      wrap.appendChild(keysCard);

      /* transfer storage */
      var transferCard = card('Transfer key storage', '⬇');
      transferCard.appendChild(HS.el('p', { class: 'hs-msg', text: 'Download every key\'s storage as one file, then restore it on another browser or machine.' }));
      var transferFoot = actions();
      transferFoot.appendChild(btn('Download all storages', function () {
        HS.downloadText(KV.bundleText(), 'hs-key-storages.json', 'application/json');
        ctx.say('Every key storage downloaded as hs-key-storages.json.');
      }, { primary: true, icon: '⬇' }));
      transferFoot.appendChild(btn('Restore storages', function () {
        KV.pickImport(function (count) {
          ctx.say(count ? 'Restored ' + count + ' key storage(s).' : 'No matching keys in that bundle.', count ? 'info' : 'error');
          paint();
        });
      }, { icon: '⬆' }));
      transferCard.appendChild(transferFoot);
      wrap.appendChild(transferCard);

      /* owner abilities */
      var ownerCard = card('Owner-only abilities', '✦');
      var ownerTag = tag(isOwner ? 'unlocked' : 'owner only', isOwner ? '#fdd663' : 'var(--hs-dim)');
      ownerTag.style.marginLeft = '6px';
      ownerCard.querySelector('div').appendChild(ownerTag);
      ownerCard.appendChild(HS.el('p', { class: 'hs-msg', text: isOwner ? 'Available now in the Terminal with your owner key.' : 'Sign in with the owner key to unlock these ten abilities.' }));
      var abilities = HS.el('div', {});
      abilities.style.cssText = 'display:grid;gap:6px;grid-template-columns:repeat(auto-fill, minmax(250px, 1fr));margin-top:6px';
      (window.HS_OWNER_ABILITIES || []).forEach(function (a, i) {
        var item = HS.el('div', {});
        item.style.cssText = 'padding:8px 10px;border:1px solid var(--hs-border);border-radius:var(--hs-radiusSm);background:var(--hs-panel2);opacity:' + (isOwner ? '1' : '.6');
        var head = HS.el('div', {});
        head.style.cssText = 'display:flex;align-items:center;gap:6px';
        head.appendChild(HS.el('span', { text: (i + 1) + '.' }));
        head.appendChild(HS.el('span', { text: a.label, style: { fontSize: '12.5px' } }));
        var cmd = HS.el('span', { text: a.command });
        cmd.style.cssText = 'margin-left:auto;font-family:var(--hs-mono);font-size:11px;color:#fdd663';
        head.appendChild(cmd);
        item.appendChild(head);
        var desc = HS.el('p', { class: 'hs-msg', text: a.description });
        desc.style.cssText = 'margin:4px 0 0 16px;font-size:11px';
        item.appendChild(desc);
        abilities.appendChild(item);
      });
      ownerCard.appendChild(abilities);
      wrap.appendChild(ownerCard);
    }
    paint();
  }

  /* ---------------- Command Registry ---------------- */
  function commandsPanel(body) {
    var wrap = HS.el('div', {});
    body.appendChild(wrap);
    var total = 0;
    (HS.COMMAND_REGISTRY || []).forEach(function (group) { total += group.items.length; });
    wrap.appendChild(row('Commands', total + ' across ' + (HS.COMMAND_REGISTRY || []).length + ' groups'));
    (HS.COMMAND_REGISTRY || []).forEach(function (group) {
      var box = card(group.group, '⌘');
      box.style.marginTop = '10px';
      group.items.forEach(function (item) {
        var line = HS.el('div', { class: 'hs-row' });
        line.style.cssText = 'padding:5px 0;gap:10px;flex-wrap:wrap';
        var usage = HS.el('span', { text: item.usage });
        usage.style.cssText = 'font-family:var(--hs-mono);font-size:12px;color:var(--hs-accent)';
        line.appendChild(usage);
        var desc = HS.el('span', { text: item.desc });
        desc.style.cssText = 'flex:1;min-width:140px;font-size:12px;color:var(--hs-dim)';
        line.appendChild(desc);
        line.appendChild(tag((window.HS.ROLE_LABEL || {})[item.role] || item.role, (window.HS.ROLE_COLOR || {})[item.role]));
        box.appendChild(line);
      });
      wrap.appendChild(box);
    });
    wrap.appendChild(HS.el('p', { class: 'hs-msg', text: 'Run any of these in the Terminal panel. Higher tiers include everything a lower tier can do.' }));
  }

  /* ---------------- key blocking manual ---------------- */
  function blockingPanel(body) {
    var keys = window.HS_KEYS || [];
    var manual = window.HS_BLOCKING_MANUAL || [];
    body.appendChild(HS.el('p', { class: 'hs-msg', text: 'Blocking refuses a key and tells the person why. Everything is set in js/keys.js — nothing else to install.' }));
    var cards = HS.el('div', { class: 'hs-cards' });
    cards.style.marginTop = '12px';
    manual.forEach(function (step) {
      var card = HS.el('div', { class: 'hs-card' });
      card.appendChild(HS.el('strong', { text: step.heading }));
      card.appendChild(HS.el('span', { text: step.text }));
      cards.appendChild(card);
    });
    body.appendChild(cards);

    var code = HS.el('pre', { class: 'hs-pre', text: "{ key: 'htmlstudio', tier: 'dev', label: 'Developer access', enabled: true,\n  blocked: true, blockedReason: 'Access paused — invoice unpaid.' }" });
    code.style.marginTop = '14px';
    body.appendChild(code);

    var head = HS.el('div', { class: 'hs-group', text: 'Keys in js/keys.js' });
    head.style.paddingLeft = '0';
    body.appendChild(head);
    keys.forEach(function (k) {
      var line = HS.el('div', { class: 'hs-row' });
      line.style.flexWrap = 'wrap';
      line.appendChild(HS.el('span', { text: k.label + (k.username ? ' (@' + k.username + ')' : '') }));
      var state = HS.el('span', { class: 'hs-tag', text: k.blocked === true ? 'blocked' : (k.enabled === false ? 'disabled' : 'active') });
      if (k.blocked === true) state.style.color = 'var(--hs-danger)';
      line.appendChild(state);
      if (k.blocked === true) {
        var why = HS.el('span', { class: 'hint', text: k.blockedReason || 'No reason given' });
        why.style.flexBasis = '100%';
        line.appendChild(why);
      }
      body.appendChild(line);
    });
    body.appendChild(HS.el('p', { class: 'hs-msg', text: 'Full write-up: BLOCKING.md next to index.html — the same manual is on the User Account page of the React app.' }));
  }

  /* ---------------- open ---------------- */
  var META = {
    themes: ['Theme Gallery', 'Preview every built-in, personal and plugin theme, then apply one.'],
    history: ['Console History', 'Searchable record of terminal commands and their output.'],
    monitor: ['System Monitor', 'Live performance and storage diagnostics for this studio.'],
    assets: ['Asset Manager', 'Images and files kept in this browser, ready to reference from your pages.'],
    account: ['User Account', 'Your username, account status and the security keys linked to this session.'],
    commands: ['Command Registry', 'Every terminal command and the minimum tier it needs.'],
    blocking: ['Key Blocking Manual', 'How to block a key, add a reason, and unblock it again.']
  };

  function open(id, ctx) {
    ctx = ctx || {};
    var meta = META[id] || META.commands;
    var cleanup = null;
    var shellApi = shell(meta[0], meta[1], function () { if (cleanup) cleanup(); });
    var api = { close: shellApi.close, say: ctx.say || function () {} };
    var body = shellApi.body;
    try {
      if (id === 'themes') themePanel(body, ctx, api);
      else if (id === 'history') historyPanel(body, ctx, api);
      else if (id === 'monitor') cleanup = monitorPanel(body, ctx);
      else if (id === 'assets') assetsPanel(body, ctx, api);
      else if (id === 'account') accountPanel(body, ctx, api);
      else if (id === 'blocking') blockingPanel(body);
      else commandsPanel(body);
    } catch (e) {
      body.appendChild(HS.el('p', { class: 'hs-msg bad', text: 'This panel hit an error: ' + e.message }));
    }
    return api.close;
  }

  return { open: open };
})();
