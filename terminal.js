/* HTML Studio standalone — the HSL terminal language and its manual. */
window.HS = window.HS || {};

window.HS.MANUAL = `HSL — HTML Studio Language
==========================

HSL is the Terminal's own tiny language. One statement per line.
Plain words, no punctuation soup. Everything works in the app AND in the
standalone build.

BASICS
------
print "Hello"            Show a message.
echo "Hello"             Same thing.
clear                    Empty the terminal.
help                     List every command.
manual                   Open this manual.
whoami                   Show the current access tier.

VARIABLES
---------
let name = "Ada"         Store text.
let count = 3            Store a number.
print name               Print a variable.
math 12 * 4 + 1          Print a calculation ( + - * / % ).
count = count + 1        Change a stored number.

FILES AND TABS
--------------
ls                       List every file in the project.
tabs                     List open tabs.
new file about.html      Create a file and open it in a tab.
new folder assets        Create a folder.
open index.html          Focus that file's tab.
close styles.css         Close that tab.
rename tab new-name.html Rename the active tab.
format                   Reformat the active file.
run                      Re-run the preview.
export                   Download the project as a ZIP.

THEME AND SETTINGS
------------------
theme black              Switch theme (black, grey, white, retro, custom id).
name "My Studio"         Rename the studio.
set fps true             Show FPS in preview.
set ram true             Show RAM in preview.
set minimap false        Hide the code minimap.
set sidetabs true        Tabs on the side of the explorer.

LIBRARY AND PLUGINS
-------------------
snippets                 List saved snippets.
snippet add "Reset"      Save the active file into the library.
plugins                  List installed plugins.
plugin example           Install the built-in example plugin.

KEY STORAGE
-----------
store                    Show what this key's storage holds.
store get <name>         Read a value.
store set <name> <value> Write a value (dev+).
store remove <name>      Delete a value (dev+).
store clear              Empty this key's storage (dev+).
account                  Show the signed-in key and account status.

OWNER ABILITIES (owner key only)
--------------------------------
keys list                Reveal every key and tier.
wipe                     Erase all local storage and reload.
audit                    Full session audit.
purge <tier>             Clear one key's storage.
broadcast <message>      Post a banner everyone sees.
broadcast clear          Remove the banner.
seal                     Instantly lock the studio.
backup                   Download every key storage + project.
stats                    Storage totals for every key.
sudo <tier>              View as a lower tier (sudo restore).
purgeall                 Clear every key's storage.

PROGRAMMING
-----------
repeat 3 { print "hi" }          Repeat inside the braces.
if name == "Ada" { print "yes" } Compare two values.
if count > 2 { print "big" }

SECURITY
--------
keys                     List which tiers exist (not the keys themselves).
keys list                Owner only — reveal every key and its tier.
owner                    Show whether owner controls are active.
wipe                     Owner only — erase all local storage and reload.
key <access key>         Unlock a tier. Access is role-based: read commands
                         need any key, edit commands need dev+, plugins need
                         admin+, and keys list / wipe need the owner key.

EXAMPLES
--------
let title = "Launch day"
repeat 2 { print title }
new file demo.html
theme retro
`;

window.HS.createInterpreter = function (options) {
  var handler = options.handler;
  var print = options.print;
  var vars = {};

  function resolve(token) {
    if (token === undefined || token === null) return '';
    var t = String(token).trim();
    if ((t.charAt(0) === '"' && t.slice(-1) === '"') || (t.charAt(0) === "'" && t.slice(-1) === "'")) return t.slice(1, -1);
    if (Object.prototype.hasOwnProperty.call(vars, t)) return vars[t];
    if (/^-?\d+(\.\d+)?$/.test(t)) return Number(t);
    return t;
  }

  function evaluate(expr) {
    return expr.replace(/[A-Za-z_][\w]*/g, function (m) {
      return Object.prototype.hasOwnProperty.call(vars, m) ? vars[m] : m;
    });
  }

  function splitBlocks(lines) {
    var out = [], buffer = '', depth = 0;
    lines.forEach(function (line) {
      var trimmed = line.trim();
      if (!trimmed) return;
      depth += (trimmed.match(/\{/g) || []).length - (trimmed.match(/\}/g) || []).length;
      buffer += (buffer ? ' ' : '') + trimmed;
      if (depth <= 0) { out.push(buffer.trim()); buffer = ''; depth = 0; }
    });
    if (buffer.trim()) out.push(buffer.trim());
    return out;
  }

  function runBlock(body, depth) {
    if (depth > 12) return;
    splitBlocks(body.trim().split('\n')).forEach(function (cmd) { exec(cmd, depth + 1); });
  }

  function exec(statement, depth) {
    var line = String(statement).trim();
    depth = depth || 0;
    if (!line) return;
    var blockMatch = /^(repeat\s+\d+|if\s+.+?)\s*\{([\s\S]*)\}\s*$/.exec(line);
    if (blockMatch) {
      var head = blockMatch[1].trim(), body = blockMatch[2], i;
      if (head.indexOf('repeat') === 0) {
        var times = Math.min(200, parseInt(head.split(/\s+/)[1], 10) || 0);
        for (i = 0; i < times; i += 1) runBlock(body, depth);
        return;
      }
      var cond = head.slice(2).trim();
      var m = /^(.+?)\s*(==|!=|>=|<=|>|<)\s*(.+)$/.exec(cond);
      var pass = false;
      if (m) {
        var a = resolve(m[1].trim());
        var b = resolve(m[3].trim());
        if (typeof a === 'string' && /^-?\d+(\.\d+)?$/.test(a)) a = Number(a);
        if (typeof b === 'string' && /^-?\d+(\.\d+)?$/.test(b)) b = Number(b);
        if (m[2] === '==') pass = a === b;
        else if (m[2] === '!=') pass = a !== b;
        else if (m[2] === '>') pass = a > b;
        else if (m[2] === '<') pass = a < b;
        else if (m[2] === '>=') pass = a >= b;
        else pass = a <= b;
      }
      if (pass) runBlock(body, depth);
      return;
    }

    var parts = line.split(/\s+/);
    var command = (parts[0] || '').toLowerCase();
    var args = parts.slice(1).join(' ');

    var assign = /^([A-Za-z_]\w*)\s*=\s*([\s\S]+)$/.exec(line);
    if (assign && command !== 'set' && command !== 'if') {
      var value = resolve(assign[2]);
      var current = vars[assign[1]];
      if (typeof current === 'number') {
        var expr = assign[2].replace(/[A-Za-z_]\w*/g, function (n) { return vars[n] !== undefined ? vars[n] : n; });
        try { vars[assign[1]] = Function('"use strict";return (' + expr + ')')(); } catch (e) { vars[assign[1]] = value; }
      } else {
        vars[assign[1]] = value;
      }
      return;
    }

    if (command === 'print' || command === 'echo') {
      print(args.split(/\s+/).filter(Boolean).map(function (t) { return String(resolve(t)); }).join(' '));
      return;
    }
    if (command === 'math') {
      var safe = evaluate(args).replace(/[^0-9+\-*/%().\s]/g, '');
      try { print(String(Function('"use strict";return (' + safe + ')')())); } catch (e) { print('Cannot compute that.'); }
      return;
    }
    if (command === 'let') {
      var letMatch = /^([A-Za-z_]\w*)\s*=\s*([\s\S]+)$/.exec(args);
      if (letMatch) { vars[letMatch[1]] = resolve(letMatch[2]); return; }
      print('Usage: let name = "value"');
      return;
    }

    var result = handler(command, args, { vars: vars, resolve: resolve });
    if (typeof result === 'string' && result) print(result);
    else if (result === undefined) print('Unknown command: ' + parts[0] + ' — type help');
  }

  return {
    vars: vars,
    run: function (source) {
      splitBlocks(String(source).replace(/\r\n/g, '\n').split('\n')).forEach(function (cmd) { exec(cmd, 0); });
    }
  };
};

/* Command registry — every terminal command with the minimum tier it needs.
   Backs the Command Registry panel and the `commands` command. */
window.HS.ROLE_LABEL = { guest: 'Guest+', dev: 'Dev+', admin: 'Admin+', owner: 'Owner' };
window.HS.ROLE_COLOR = { guest: 'var(--hs-dim)', dev: 'var(--hs-accent)', admin: '#81c995', owner: '#fdd663' };

window.HS.COMMAND_REGISTRY = [
  {
    group: 'Basics',
    items: [
      { usage: 'help', desc: 'List every command.', role: 'guest' },
      { usage: 'manual', desc: 'Read the HSL manual.', role: 'guest' },
      { usage: 'print / echo "text"', desc: 'Write a message.', role: 'guest' },
      { usage: 'math 2 + 2', desc: 'Calculate an expression.', role: 'guest' },
      { usage: 'let name = value', desc: 'Store a value.', role: 'guest' },
      { usage: 'whoami', desc: 'Show the active tier.', role: 'guest' },
      { usage: 'account', desc: 'Show the signed-in key and account status.', role: 'guest' },
      { usage: 'commands', desc: 'Open this command registry.', role: 'guest' },
      { usage: 'version', desc: 'Show studio name, theme and plugin count.', role: 'guest' },
      { usage: 'clear', desc: 'Empty the terminal.', role: 'guest' }
    ]
  },
  {
    group: 'Files & tabs',
    items: [
      { usage: 'ls', desc: 'List every file.', role: 'guest' },
      { usage: 'tabs', desc: 'List open tabs.', role: 'guest' },
      { usage: 'open <file>', desc: 'Focus a file tab.', role: 'guest' },
      { usage: 'close <file>', desc: 'Close a file tab.', role: 'guest' },
      { usage: 'new file <name>', desc: 'Create and open a file.', role: 'dev' },
      { usage: 'new folder <name>', desc: 'Create a folder.', role: 'dev' },
      { usage: 'rename tab <name>', desc: 'Rename the active tab.', role: 'dev' },
      { usage: 'format', desc: 'Reformat the active file.', role: 'dev' },
      { usage: 'export', desc: 'Download the project as a ZIP.', role: 'dev' }
    ]
  },
  {
    group: 'Preview & settings',
    items: [
      { usage: 'run', desc: 'Re-run the preview.', role: 'guest' },
      { usage: 'theme <id>', desc: 'Switch theme.', role: 'dev' },
      { usage: 'name "Studio"', desc: 'Rename the studio.', role: 'dev' },
      { usage: 'set fps|ram|minimap|wrap|sidetabs <bool>', desc: 'Change a setting.', role: 'dev' }
    ]
  },
  {
    group: 'Library & plugins',
    items: [
      { usage: 'snippets', desc: 'List saved snippets.', role: 'guest' },
      { usage: 'snippet add "Title"', desc: 'Save the active file to the library.', role: 'dev' },
      { usage: 'plugins', desc: 'List installed plugins.', role: 'guest' },
      { usage: 'plugin example', desc: 'Install the built-in example plugin.', role: 'admin' }
    ]
  },
  {
    group: 'Key storage',
    items: [
      { usage: 'store', desc: "Show what this key's storage holds.", role: 'guest' },
      { usage: 'store get <name>', desc: "Read one value from this key's storage.", role: 'guest' },
      { usage: 'store manage', desc: 'Open the Key Storage Manager.', role: 'guest' },
      { usage: 'store set <name> <value>', desc: "Write a value to this key's storage.", role: 'dev' },
      { usage: 'store remove <name>', desc: "Delete one value from this key's storage.", role: 'dev' },
      { usage: 'store clear', desc: "Empty this key's storage.", role: 'dev' },
      { usage: 'store script / copy', desc: 'Download or copy this key\'s storage script.', role: 'dev' },
      { usage: 'store rename <name>', desc: 'Rename this key\'s storage script.', role: 'dev' },
      { usage: 'store export / import', desc: 'Download or restore every key storage.', role: 'dev' }
    ]
  },
  {
    group: 'Security',
    items: [
      { usage: 'key <access key>', desc: 'Unlock a tier (use: key <username> <key>).', role: 'guest' },
      { usage: 'keys', desc: 'List which tiers exist.', role: 'guest' },
      { usage: 'owner', desc: 'Show owner status.', role: 'guest' },
      { usage: 'keys list', desc: 'Reveal every key and tier.', role: 'owner' },
      { usage: 'wipe', desc: 'Erase all local storage and reload.', role: 'owner' }
    ]
  },
  {
    group: 'Owner tools',
    items: [
      { usage: 'audit', desc: 'Full session audit.', role: 'owner' },
      { usage: 'purge <tier>', desc: "Clear one tier's key storage.", role: 'owner' },
      { usage: 'purgeall', desc: "Clear every key's storage.", role: 'owner' },
      { usage: 'broadcast <message>', desc: 'Post a banner in the status bar.', role: 'owner' },
      { usage: 'seal', desc: 'Instantly lock the studio.', role: 'owner' },
      { usage: 'backup', desc: 'Download every key storage plus the project.', role: 'owner' },
      { usage: 'stats', desc: 'Storage totals for every key.', role: 'owner' },
      { usage: 'sudo <tier>', desc: 'View as a lower tier (sudo restore).', role: 'owner' }
    ]
  }
];

/* Flat list for quick lookups. */
window.HS.TERMINAL_COMMANDS = window.HS.COMMAND_REGISTRY.reduce(function (out, group) {
  return out.concat(group.items.map(function (item) { return [item.usage, item.desc]; }));
}, []);
