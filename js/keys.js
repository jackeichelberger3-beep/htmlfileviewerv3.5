/**
 * HTML Studio standalone — access keys / passwords (with optional usernames).
 * ---------------------------------------------------------------------------
 * This single file holds EVERY key that locks the standalone studio.
 * Edit only this file to change, add, remove, disable or block keys.
 *
 * ────────────────────────────  SIMPLE  ────────────────────────────
 *  Each key is one line inside window.HS_KEYS below:
 *      { key: 'your-password', tier: 'admin', label: 'What this key unlocks', enabled: true }
 *  To add a username (optional): add a `username` field.
 *      { key: 'your-password', username: 'ada', tier: 'admin', label: 'Ada admin', enabled: true }
 *  When a username is set, BOTH the username AND the key must match to unlock.
 *  When no username is set, only the key is needed.
 *
 *  Tiers (pick one per key):
 *    owner — exclusive controls (reveal keys, wipe storage) + everything below
 *    admin — full access (every terminal command, plugins, export, settings)
 *    dev   — developer access (edit, run, format, import, export)
 *    guest — read-only access (look around, run the preview, no edits)
 *
 * ────────────────────────  DISABLING A KEY  ───────────────────────
 *  Flip one line and the key stops working — at the lock screen, in the
 *  Terminal, and for an already-unlocked session on the next reload:
 *
 *      { key: 'htmlstudio', tier: 'dev', label: 'Developer access', enabled: false }
 *
 *  Leave the line there (with enabled: false) so you can switch it back on
 *  later. `enabled: true`, or no `enabled` field at all, means the key works.
 *
 * ─────────────────────────  BLOCKING A KEY  ───────────────────────
 *  Blocking refuses a key AND tells the person why — add two fields:
 *
 *      { key: 'htmlstudio', tier: 'dev', label: 'Developer access', enabled: true,
 *        blocked: true, blockedReason: 'Access paused — invoice unpaid.' }
 *
 *  • blocked: true       → the key can no longer unlock the studio.
 *  • blockedReason: '…'  → shown on a full-screen notice that covers the whole
 *                          studio the moment that key is submitted.
 *  • blocked: false, or no blocked field at all → the key works normally.
 *  • Unblock = set blocked back to false. Nothing is deleted — the key's
 *    storage, the project and the settings all stay.
 *  • A blocked key also loses any session it had: on reload the studio locks.
 *  • Blocked is not the same as disabled: disabled is silent, blocked explains.
 *  • Full write-up: BLOCKING.md in this folder, or the 🚫 Key blocking manual
 *    panel in the side rail.
 *
 *  MASTER SWITCH — one line turns every key off at once:
 *      window.HS_KEYS_ENABLED = false;
 *  With the master switch off nobody can unlock the studio and the lock screen
 *  says so. Set it back to true to allow keys again. Nothing is deleted.
 *
 * ────────────────────────────  ADVANCED  ──────────────────────────
 *  • Keys are case-sensitive and trimmed. Usernames are case-insensitive.
 *  • Use long, random strings for real passwords, e.g. 'k7Qm2#vLp9!Xz'.
 *  • Two keys can share a tier — give each teammate their own key, same tier.
 *  • Higher tiers do NOT inherit lower ones; each key stands alone.
 *  • Access is role-based: each terminal command checks the minimum tier it
 *    needs (read / edit / admin / owner).
 *  • Every key owns its own key storage (js/keystorage.js). The storage script
 *    is named after the key, so each key's data is separate and downloadable.
 *  • The gate locks the WHOLE studio until any enabled, unblocked key is entered.
 *  • Unlocking persists for the browser session (reload stays unlocked).
 *  • For a public deployment, change every default key below before publishing.
 *  • The React app keeps the same list in src/lib/studio/keys.js — keep them
 *    in sync if you publish both versions.
  1. Nathan - dVA
 2. Dean - kok
 3. AJ - IBRP-AK22-8SPQ-BFHJ-50YM-396L-AHYA-8LGN
 4. James Petermyer - 9ZP0-528Q-LHEW-9LBL-LBYY-8J61-EU32-FVS8
 5. Paxton - ng_studio_QBk8yaFeLomZfElX2XLc6oGjMBs54N61
 6. Jaaken ng_studio_eAodIkSV2Qb4xMLJgP61MMEIxywGJLSu
 * ---------------------------------------------------------------------------
 */

/* Master switch — false refuses every key, even the ones enabled below. */
window.HS_KEYS_ENABLED = true;

window.HS_KEYS = [
  { key: 'ng_studio_dVA9Y3yQy6gRyhHualr1wTeGreKOjoQe',        tier: 'admin', label: 'Full admin access',              enabled: true, blocked: false, blockedReason: '' },
  { key: 'ng_studio_KoKVL6ZMyCfsGRvFvT0S3ngAirGdtc4a',        tier: 'admin', label: 'Full admin access',              enabled: true, blocked: false, blockedReason: '' },
  { key: 'ng_studio_QBk8yaFeLomZfElX2XLc6oGjMBs54N61',        tier: 'admin', label: 'Full admin access',              enabled: true, blocked: false, blockedReason: '' },
  { key: 'ng_studio_eAodIkSV2Qb4xMLJgP61MMEIxywGJLSu',        tier: 'admin', label: 'Full admin access',              enabled: true, blocked: false, blockedReason: '' },
  { key: 'ng_studio_IZWzL1VJNO9lAQCZI27s6EfrsR4k4UrK',        tier: 'admin', label: 'Full admin access',              enabled: true, blocked: false, blockedReason: '' },
  { key: 'ng_studio_2mszDW52aU8RLYrw2QIxuhpLESQTjGSO',        tier: 'admin', label: 'Full admin access',              enabled: true, blocked: false, blockedReason: '' },
  { key: 'ng_studio_bPnJxXKwSU0MsUbNcq59iuUB0EsZDAshVJJAXSMW',        tier: 'admin', label: 'Full admin access',              enabled: true, blocked: false, blockedReason: '' },
  { key: 'ng_studio_9ZP0-528Q-LHEW-9LBL-LBYY-8J61-EU32-FVS8',   tier: 'dev',   label: 'Developer access',               enabled: true, blocked: false, blockedReason: '' },
  { key: 'ng_studio_K0UV-5QLE-DE3V-4YZD-POP4-0UXJ-K8QY-QJQE',   tier: 'dev',   label: 'Developer access',               enabled: true, blocked: false, blockedReason: '' },
  { key: 'ng_studio_UQXK-IQYN-GARM-5VYT-91YS-2POO-U1BS-8A0H',   tier: 'dev',   label: 'Developer access',               enabled: true, blocked: false, blockedReason: '' },
  { key: 'ng_studio_JYCI-KYMH-3STK-ICLL-6YMS-UIUA-YFFU-2CQ2',   tier: 'dev',   label: 'Developer access',               enabled: true, blocked: false, blockedReason: '' },
  { key: 'ng_studio_IBRP-AK22-8SPQ-BFHJ-50YM-396L-AHYA-8LGN',   tier: 'dev',   label: 'Developer access',               enabled: true, blocked: false, blockedReason: '' },
  { key: 'ng_studio_cOmMGyhljIF98u4jHePOml2Sj4HoZAfVZa0yZI2z',   tier: 'dev',   label: 'Developer access',               enabled: true, blocked: false, blockedReason: '' },
  { key: 'ng_studio_Y3TEgbdk40puVEkzqABxz94a14FPV8XAKR89QsMr',   tier: 'dev',   label: 'Developer access',               enabled: true, blocked: false, blockedReason: '' },
  { key: 'ng_studio_3KhdEqUCKsU3UQCa2MkOnyCmLLPeBB5La4EZdA46',   tier: 'dev',   label: 'Developer access',               enabled: true, blocked: false, blockedReason: '' },
  { key: 'ng_studio_oZo3BfETDirLUviqThD6hEg3tvD9yB4gLDr0MH7E',   tier: 'dev',   label: 'Developer access',               enabled: true, blocked: false, blockedReason: '' },
  { key: 'ng_studio_fjBdB98QBUna4LOV7Db7f4fh1lyjVYmySvgWnrwp',   tier: 'dev',   label: 'Developer access',               enabled: true, blocked: false, blockedReason: '' },
  { key: 'ng_studio_gIbrxIBm6nguenbORekmearzPwcV5CBulrwpfVXP',   tier: 'dev',   label: 'Developer access',               enabled: true, blocked: false, blockedReason: '' },
  { key: 'ng_studio_JyrfBb70FLFPyDfsNWwCmuCRyu1hrTNhEX10UAZB',   tier: 'dev',   label: 'Developer access',               enabled: true, blocked: false, blockedReason: '' },
  { key: 'ng_studio_y2rsUhxzRMetDNlw0DatAnLDZMfRskYnA9mCbndg',   tier: 'dev',   label: 'Developer access',               enabled: true, blocked: false, blockedReason: '' },
  { key: 'ng_studio_VOaYWdC8SDThqL1Mmad52FbOjWsuDJ1ndVnxIQBI',   tier: 'dev',   label: 'Developer access',               enabled: true, blocked: false, blockedReason: '' },
  { key: 'ng_studio_UCelaluengaWOTX7bz5HNPNkbv7K2mvw8rX0TzTK',   tier: 'dev',   label: 'Developer access',               enabled: true, blocked: false, blockedReason: '' },
  { key: 'ng_studio_aRB5BjImbwSh62eSwGXenYb7YTJx8U8NgTsqazC4',   tier: 'dev',   label: 'Developer access',               enabled: true, blocked: false, blockedReason: '' },
  { key: 'ng_studio_S1B12ZQbAygruXnFdzevz23RPwjkI0H4ngcZ6WEn',   tier: 'dev',   label: 'Developer access',               enabled: true, blocked: false, blockedReason: '' },
  { key: 'ng_studio_Nhk3sUNhKfaIQLi7BNraRbtDMpJ7yElKDwPJNjpW',   tier: 'dev',   label: 'Developer access',               enabled: true, blocked: false, blockedReason: '' },
  { key: 'ng_studio_WhfV1Qb789nvBl5GO6BBrVyEw6Kn5heBLlMTNa2T',   tier: 'dev',   label: 'Developer access',               enabled: true, blocked: false, blockedReason: '' },
  { key: 'ng_studio_gZkWhozkGtg5JrGIYxAw9z51P97pYOYTzsZhly3f',   tier: 'dev',   label: 'Developer access',               enabled: true, blocked: false, blockedReason: '' },
  { key: 'ng_studio_9WbuB4RFK1dv9UgMrYNkEItzUXhlA9yRPUDsHpDx',   tier: 'dev',   label: 'Developer access',               enabled: true, blocked: false, blockedReason: '' },
  { key: 'ng_studio_pazX3ja0bNHC9tG9T0zko8Cix0FgmJszJSddq1Xx',   tier: 'dev',   label: 'Developer access',               enabled: true, blocked: false, blockedReason: '' },
  { key: 'ng_studio_NNVhqopnYFYj0tIyZVSx03DEmYJVIgrT5zV6fnh9',   tier: 'dev',   label: 'Developer access',               enabled: true, blocked: false, blockedReason: '' },
  { key: 'ng_studio_VjIA5AfRbC2SETytfoFJNf72C70xBWga6HKfRTVr',   tier: 'dev',   label: 'Developer access',               enabled: true, blocked: false, blockedReason: '' },
  { key: 'ng_studio_sx1e5A3QtKNywKbQMFimCgXCKOS2T1Xhlbxpu1QI',   tier: 'dev',   label: 'Developer access',               enabled: true, blocked: false, blockedReason: '' },
  { key: 'ng_studio_dKrkfURq8PWsFMnuyxP5g9iuMSdUIrosZslsguiU',   tier: 'dev',   label: 'Developer access',               enabled: true, blocked: false, blockedReason: '' },
  { key: 'ng_studio_8RzoBMytX8NT56uFJwBLsHNn7N8nXE1vVe1VhdV0',   tier: 'dev',   label: 'Developer access',               enabled: true, blocked: false, blockedReason: '' }, 
  { key: 'ng_studio_s0tctIvJP0HXoME9jl20Yq51HK7QIY7hCQUSK5E1',   tier: 'dev',   label: 'Developer access',               enabled: true, blocked: false, blockedReason: '' },
  { key: 'ng_studio_a3bbfujuymWpw8bymnzIVHFW1FRzr8BHFiKWIgRY',   tier: 'dev',   label: 'Developer access',               enabled: true, blocked: false, blockedReason: '' },
  { key: 'ng_studio_Zc4dKJw6ygClSZI2ZNivDUbJhG0Jp6ktkwVTByDl',   tier: 'dev',   label: 'Developer access',               enabled: true, blocked: false, blockedReason: '' }, 
  { key: 'ng_studio_GIgZ8JC66S8S53FfrPwMo6uvt6La12uJWD9ieekJ',   tier: 'dev',   label: 'Developer access',               enabled: true, blocked: false, blockedReason: '' },
  { key: 'ng_studio_sPxzy7uzgGpWzd2bSckwFCSrIrGwxznXSrNhEzX3',   tier: 'dev',   label: 'Developer access',               enabled: true, blocked: false, blockedReason: '' },
  { key: 'ng_studio_GLCYT2okLLLoI3nwa9RioafgJEHnBcsyzrBAjOnL',   tier: 'dev',   label: 'Developer access',               enabled: true, blocked: false, blockedReason: '' }, 
  { key: 'ng_studio_8IAKrYpxuzjL6erCwBAfFbNzkqDsuNBr2JjaucCL',   tier: 'dev',   label: 'Developer access',               enabled: true, blocked: false, blockedReason: '' },
  { key: 'ng_studio_adt6rAL8r8kSdypBHOFLXDHdowtsaBtGVWXqiwqJ',   tier: 'dev',   label: 'Developer access',               enabled: true, blocked: false, blockedReason: '' },
  { key: 'ng_studio_gGPuVNf5hu9J4gCkgaOo3hPg4Tehyvz0MQ30XQ22',   tier: 'dev',   label: 'Developer access',               enabled: true, blocked: false, blockedReason: '' }, 
  { key: 'ng_studio_5rUe74cHcoznt0ncjBLW8Mm95hk7Tp8KFegoe56L',   tier: 'dev',   label: 'Developer access',               enabled: true, blocked: false, blockedReason: '' },
  { key: 'ng_studio_KDpW5m2kmUgbXq783LeHYZVWabYB1QxJ1zAL6nUH',   tier: 'dev',   label: 'Developer access',               enabled: true, blocked: false, blockedReason: '' },
  { key: 'ng_studio_LhBaH3bYtXf8NaUL4g1hsrIttqG1MYSdEux2eFGZ',   tier: 'dev',   label: 'Developer access',               enabled: true, blocked: false, blockedReason: '' }, 
  { key: 'ng_studio_htmlstudio',   tier: 'dev',   label: 'Developer access',               enabled: true, blocked: false, blockedReason: '' },
  { key: 'open-sesame',  tier: 'guest', label: 'Read-only access',               enabled: true, blocked: false, blockedReason: '' },
  { key: 'ng-studio-studio-owner', username: 'iloveilyssa', tier: 'owner', label: 'Owner — exclusive controls', enabled: true, blocked: false, blockedReason: '' }
  { key: 'ng_studio_dean', username: 'Dean', tier: 'admin', label: 'Full admin access', enabled: true, blocked: false, blockedReason: '' }
  // Blocked example — set blocked back to false to let this key in again:
  // ,{ key: 'old-key', tier: 'dev', label: 'Former developer', enabled: true, blocked: true, blockedReason: 'Access paused — project finished on 12 May.' }
];

window.HS_KEYS_HELP = {
  simple: 'Edit js/keys.js — one line per key. Set enabled: false to switch a key off, or window.HS_KEYS_ENABLED = false to switch them all off.',
  tiers: 'Tiers: owner (exclusive + everything), admin (everything), dev (edit + run + export), guest (read-only). Each key stands alone.',
  blocking: 'Block a key with blocked: true and blockedReason: "why". The person who tries that key gets a full-screen block notice with your reason. Set blocked: false to let them back in.',
  file: 'Standalone: js/keys.js. React app: src/lib/studio/keys.js. Keep the two files in sync.'
};

/* The blocking manual — shown by the 🚫 Key blocking manual panel. */
window.HS_BLOCKING_MANUAL = [
  {
    heading: 'Block a key',
    text: "Add blocked: true and blockedReason: 'why' to that key's line in js/keys.js. Example: { key: 'htmlstudio', tier: 'dev', label: 'Developer access', enabled: true, blocked: true, blockedReason: 'Access paused — invoice unpaid.' }."
  },
  {
    heading: 'What the user sees',
    text: 'The moment a blocked key is submitted, a full-screen notice covers the whole studio: "Access blocked", the key\'s label and username, and your reason word for word. No files, tabs or preview are reachable behind it.'
  },
  {
    heading: 'Unblock a key',
    text: 'Set blocked: false (or delete the two fields). You can leave the reason in place — it is ignored until blocked is true again. Nothing is deleted: the key\'s storage, the project and the settings all stay.'
  },
  {
    heading: 'Blocked vs disabled vs master switch',
    text: 'enabled: false switches a key off silently, so the person just sees "invalid credentials". blocked: true refuses the key and explains why. The master switch (window.HS_KEYS_ENABLED = false) turns every key off at once.'
  },
  {
    heading: 'Where blocking applies',
    text: 'The lock screen, the Terminal "key <password>" command, and any session that was already unlocked — a blocked key stops validating, so the studio locks again on the next page load.'
  },
  {
    heading: 'Tips',
    text: 'The reason is shown to the person, so keep it factual. One reason per key. Blocked keys keep their own key storage untouched. Keep the app and standalone keys.js lists in sync so both builds block the same keys.'
  }
];

// True when this key record is marked blocked.
window.HSKeyBlocked = function (k) {
  return !!k && k.blocked === true;
};

// True when this key record is usable: the master switch is on and the key
// itself is not marked enabled: false.
window.HSKeyEnabled = function (k) {
  if (window.HS_KEYS_ENABLED === false) return false;
  return !!k && k.enabled !== false;
};

// Only the keys that can currently unlock the studio.
window.HSEnabledKeys = function () {
  return (window.HS_KEYS || []).filter(function (k) { return window.HSKeyEnabled(k) && !window.HSKeyBlocked(k); });
};

// Validates a username + key pair. Disabled and blocked keys are refused.
// Returns the matching key record, or null.
window.validateKey = function (keyInput, usernameInput) {
  if (!keyInput || window.HS_KEYS_ENABLED === false) return null;
  var key = String(keyInput).trim();
  var username = usernameInput ? String(usernameInput).trim().toLowerCase() : '';
  for (var i = 0; i < (window.HS_KEYS || []).length; i += 1) {
    var k = window.HS_KEYS[i];
    if (!window.HSKeyEnabled(k) || window.HSKeyBlocked(k)) continue;
    if (k.key !== key) continue;
    if (k.username) { if (k.username.toLowerCase() === username) return k; }
    else return k;
  }
  return null;
};

// Looks for a BLOCKED key matching these credentials, so the lock screen can
// show the owner's reason instead of "invalid credentials".
// Returns the blocked key record, or null.
window.HSFindBlockedKey = function (keyInput, usernameInput) {
  if (!keyInput) return null;
  var key = String(keyInput).trim();
  var username = usernameInput ? String(usernameInput).trim().toLowerCase() : '';
  for (var i = 0; i < (window.HS_KEYS || []).length; i += 1) {
    var k = window.HS_KEYS[i];
    if (!window.HSKeyBlocked(k)) continue;
    if (k.key !== key) continue;
    if (k.username) { if (k.username.toLowerCase() === username) return k; }
    else return k;
  }
  return null;
};

// Numeric rank for tier comparisons (higher = more access).
window.tierRank = function (tier) {
  return { guest: 1, dev: 2, admin: 3, owner: 4 }[tier] || 0;
};

// Permission thresholds — a tier grants a permission when its rank >= the minimum.
window.HS_PERMISSIONS = { read: 1, edit: 2, admin: 3, owner: 4 };

// Returns true if the current tier meets the minimum rank for a permission.
window.can = function (tier, perm) {
  return window.tierRank(tier) >= (window.HS_PERMISSIONS[perm] || 0);
};

// The ten exclusive powers of the owner key.
window.HS_OWNER_ABILITIES = [
  { id: 'reveal',    command: 'keys list',           label: 'Reveal all keys',        description: 'Show every access key, its tier, username, whether it is enabled and whether it is blocked.' },
  { id: 'wipe',      command: 'wipe',                label: 'Wipe everything',        description: 'Erase all local storage and reload the studio.' },
  { id: 'audit',     command: 'audit',               label: 'Session audit',          description: 'Full report of the active key, tier, storage and project.' },
  { id: 'purge',     command: 'purge <tier>',        label: 'Purge one key',          description: 'Clear the storage linked to a single key only.' },
  { id: 'broadcast', command: 'broadcast <message>', label: 'Studio broadcast',       description: 'Post a banner message everyone sees in the status bar.' },
  { id: 'seal',      command: 'seal',                label: 'Panic lock',             description: 'Instantly lock the studio and drop the current session.' },
  { id: 'backup',    command: 'backup',              label: 'Master backup',          description: 'Download every key storage plus the project in one file.' },
  { id: 'stats',     command: 'stats',               label: 'Storage totals',         description: 'See entries and bytes held by every key.' },
  { id: 'sudo',      command: 'sudo <tier>',         label: 'Impersonate a tier',     description: 'Temporarily view the studio as a lower tier.' },
  { id: 'purgeall',  command: 'purgeall',            label: 'Reset all storage',      description: 'Clear the storage of every key at once.' }
];
