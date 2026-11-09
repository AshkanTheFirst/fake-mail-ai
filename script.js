// =========================================================
// FakeMail Neo·AI - Application Core
// =========================================================

const providers = [
  {
    id: '22do',
    emoji: '🐢',
    name: '22.do',
    category: 'gmail',
    url: 'https://22.do/en/fake-gmail-generator',
    tag: 'Gmail Engine',
    desc: 'Dedicated fake Gmail generator with instant custom prefixes and temporary Google-style inboxes.'
  },
  {
    id: 'temptf',
    emoji: '🐝',
    name: 'temp.tf',
    category: 'instant',
    url: 'https://temp.tf/',
    tag: 'Ultra-Fast',
    desc: 'Ultra-minimalistic temporary email service focusing on speed and zero configuration.'
  },
  {
    id: 'tmail',
    emoji: '🐡',
    name: 'tmail.io',
    category: 'gmail',
    url: 'https://tmail.io/temporary-disposable-gmail',
    tag: 'Gmail Disposable',
    desc: 'Disposable Gmail address generation with automated message polling and preview.'
  },
  {
    id: 'dispose',
    emoji: '🦩',
    name: 'dispose.lol',
    category: 'instant',
    url: 'https://dispose.lol/',
    tag: 'One-Click Burner',
    desc: 'Modern, privacy-centric disposable burner email address with instant inbox activation.'
  },
  {
    id: 'boomlify',
    emoji: '🦌',
    name: 'boomlify.com',
    category: 'gmail',
    url: 'https://boomlify.com/gmail-temp-mail',
    tag: 'Gmail Temp',
    desc: 'Specialized temporary Gmail inbox generator designed for bypassing sign-up verifications.'
  },
  {
    id: 'emailtick1',
    emoji: '🐦‍⬛',
    name: 'emailtick.com',
    category: 'inbox',
    url: 'https://www.emailtick.com/',
    tag: 'Live Web Inbox',
    desc: 'Feature-rich disposable email platform with instant message viewer and auto-refresh.'
  },
  {
    id: 'emailtick2',
    emoji: '🦘',
    name: 'emailtick (Fast)',
    category: 'inbox',
    url: 'https://www.emailtick.com/',
    tag: 'Alt Server',
    desc: 'High-availability mirror node for rapid disposable inbox creation.'
  },
  {
    id: 'tempgbox',
    emoji: '🐐',
    name: 'tempgbox.net',
    category: 'gmail',
    url: 'https://tempgbox.net/',
    tag: 'G-Box Temp',
    desc: 'Temporary Gmail-compatible mailboxes with robust spam filtering and active webhooks.'
  },
  {
    id: 'tempinbox',
    emoji: '🕷️',
    name: 'temp-inbox.me',
    category: 'gmail',
    url: 'https://temp-inbox.me/temp-gmail',
    tag: 'Gmail Tunnel',
    desc: 'Instant temporary Gmail generator with auto-destroy and anonymous forwarding.'
  },
  {
    id: 'tempmailg',
    emoji: '🐎',
    name: 'tempmailg.com',
    category: 'gmail',
    url: 'https://tempmailg.com/gmail-temp-mail',
    tag: 'Gmail Temp',
    desc: 'Clean disposable Gmail mailboxes that handle OTPs and confirmation links with ease.'
  },
  {
    id: 'mailticking',
    emoji: '🐷',
    name: 'mailticking.com',
    category: 'inbox',
    url: 'https://www.mailticking.com/',
    tag: 'Ticking Inbox',
    desc: 'Countdown-based disposable email address with customizable expiration timers.'
  },
  {
    id: 'emailnator',
    emoji: '🐋',
    name: 'emailnator.com',
    category: 'instant',
    url: 'https://www.emailnator.com/',
    tag: 'Multi-Format',
    desc: 'Multi-service generator capable of crafting Gmail dot-addresses, plus-addresses, and custom domains.'
  },
  {
    id: 'tempmailhub',
    emoji: '🐊',
    name: 'tempmailhub.org',
    category: 'inbox',
    url: 'https://tempmailhub.org/',
    tag: 'Hub Inbox',
    desc: 'Unified disposable mail hub with multi-domain selection and persistent browser sessions.'
  },
  {
    id: 'tempgmailer',
    emoji: '🐓',
    name: 'tempgmailer.com',
    category: 'gmail',
    url: 'https://tempgmailer.com/',
    tag: 'Gmail Specialist',
    desc: 'Dedicated temporary Gmail engine optimized for rapid verification and account creation.'
  },
  {
    id: 'temporarymail',
    emoji: '🐶',
    name: 'temporary-mail.net',
    category: 'instant',
    url: 'https://www.temporary-mail.net/',
    tag: 'Standard Burner',
    desc: 'Fast, secure, standard temporary email generator with no registration needed.'
  }
];

// ---- DOM Elements ----
const providersGrid = document.getElementById('providersGrid');
const searchInput = document.getElementById('searchInput');
const searchCount = document.getElementById('searchCount');
const filterPills = document.querySelectorAll('.filter-pill');

// AI Studio elements
const tabButtons = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');
const burnerEmail = document.getElementById('burnerEmail');
const domainSelect = document.getElementById('domainSelect');
const btnGenBurner = document.getElementById('btnGenBurner');
const btnCopyBurner = document.getElementById('btnCopyBurner');

const gmailBaseInput = document.getElementById('gmailBaseInput');
const btnGenDotTrick = document.getElementById('btnGenDotTrick');
const aliasesContainer = document.getElementById('aliasesContainer');

const personaName = document.getElementById('personaName');
const personaUser = document.getElementById('personaUser');
const personaMail = document.getElementById('personaMail');
const personaPass = document.getElementById('personaPass');
const btnGenPersona = document.getElementById('btnGenPersona');
const btnCopyPersona = document.getElementById('btnCopyPersona');

// Modal elements
const modalOverlay = document.getElementById('modalOverlay');
const modalClose = document.getElementById('modalClose');
const modalEmoji = document.getElementById('modalEmoji');
const modalTitle = document.getElementById('modalTitle');
const modalTag = document.getElementById('modalTag');
const modalUrl = document.getElementById('modalUrl');
const modalDesc = document.getElementById('modalDesc');
const modalLaunch = document.getElementById('modalLaunch');
const modalCopyBtn = document.getElementById('modalCopyBtn');

// Toast
const toast = document.getElementById('toast');
const toastMsg = document.getElementById('toastMsg');
let toastTimeout;

function showToast(message) {
  toastMsg.textContent = message;
  toast.classList.add('show');
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    toast.classList.remove('show');
  }, 2400);
}

function copyToClipboard(text, customMessage = 'Copied to clipboard!') {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(() => showToast(customMessage));
  } else {
    const input = document.createElement('textarea');
    input.value = text;
    document.body.appendChild(input);
    input.select();
    document.execCommand('copy');
    document.body.removeChild(input);
    showToast(customMessage);
  }
}

// ---- Render Providers ----
let activeFilter = 'all';

function renderProviders() {
  const query = searchInput.value.toLowerCase().trim();
  providersGrid.innerHTML = '';

  const filtered = providers.filter(p => {
    const matchesFilter = activeFilter === 'all' || p.category === activeFilter;
    const matchesSearch = p.name.toLowerCase().includes(query) ||
                          p.desc.toLowerCase().includes(query) ||
                          p.tag.toLowerCase().includes(query) ||
                          p.url.toLowerCase().includes(query);
    return matchesFilter && matchesSearch;
  });

  searchCount.textContent = `${filtered.length} / ${providers.length}`;

  if (filtered.length === 0) {
    providersGrid.innerHTML = `
      <div style="grid-column: 1/-1; text-align: center; padding: 48px; color: var(--text-dim);">
        <p style="font-size: 16px;">No providers match your query.</p>
      </div>
    `;
    return;
  }

  filtered.forEach(p => {
    const card = document.createElement('div');
    card.className = 'provider-card';
    card.innerHTML = `
      <div class="card-header">
        <div class="card-title-group">
          <span class="card-emoji">${p.emoji}</span>
          <div>
            <h4 class="card-name">${p.name}</h4>
          </div>
        </div>
        <span class="card-badge">${p.tag}</span>
      </div>
      <p class="card-desc">${p.desc}</p>
      <div class="card-url-preview">${p.url}</div>
      <div class="card-footer-actions">
        <a href="${p.url}" target="_blank" rel="noopener noreferrer" class="btn btn-gradient">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
          Open Site
        </a>
        <button class="btn btn-outline" data-action="details" data-id="${p.id}">
          Details
        </button>
      </div>
    `;

    // Click on details
    const detailsBtn = card.querySelector('[data-action="details"]');
    detailsBtn.addEventListener('click', () => openModal(p));

    providersGrid.appendChild(card);
  });
}

// Modal logic
let currentActiveProvider = null;

function openModal(provider) {
  currentActiveProvider = provider;
  modalEmoji.textContent = provider.emoji;
  modalTitle.textContent = provider.name;
  modalTag.textContent = provider.tag;
  modalUrl.textContent = provider.url;
  modalDesc.textContent = provider.desc;
  modalLaunch.href = provider.url;
  modalOverlay.classList.add('active');
}

function closeModal() {
  modalOverlay.classList.remove('active');
  currentActiveProvider = null;
}

modalClose.addEventListener('click', closeModal);
modalOverlay.addEventListener('click', (e) => {
  if (e.target === modalOverlay) closeModal();
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeModal();
});

modalCopyBtn.addEventListener('click', () => {
  if (currentActiveProvider) {
    copyToClipboard(currentActiveProvider.url, 'Provider URL copied!');
  }
});

// Filters & Search
filterPills.forEach(pill => {
  pill.addEventListener('click', () => {
    filterPills.forEach(p => p.classList.remove('active'));
    pill.classList.add('active');
    activeFilter = pill.dataset.filter;
    renderProviders();
  });
});

searchInput.addEventListener('input', renderProviders);

// Tab switching
tabButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    tabButtons.forEach(b => b.classList.remove('active'));
    tabContents.forEach(c => c.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById(`tab-${btn.dataset.tab}`).classList.add('active');
  });
});

// AI Synthetic Generator Logic
const adjectives = ['cyber', 'neon', 'phantom', 'shadow', 'quantum', 'hyper', 'sonic', 'void', 'echo', 'flux', 'vortex', 'alpha', 'nova', 'apex'];
const nouns = ['pulse', 'runner', 'hawk', 'agent', 'spark', 'matrix', 'stream', 'pilot', 'cipher', 'nexus', 'ghost', 'specter', 'drifter'];
const firstNames = ['Alexander', 'Elena', 'Lucas', 'Maya', 'Julian', 'Sofia', 'Dmitri', 'Aria', 'Kaelen', 'Zara'];
const lastNames = ['Vance', 'Sterling', 'Mercer', 'Novak', 'Sinclair', 'Cross', 'Winters', 'Frost', 'Kovacs'];

function getRandomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateRandomNumber(len = 4) {
  return Math.floor(Math.random() * Math.pow(10, len)).toString().padStart(len, '0');
}

// 1. Burner Generator
function generateBurner() {
  const adj = getRandomItem(adjectives);
  const noun = getRandomItem(nouns);
  const num = generateRandomNumber(3);
  const domain = domainSelect.value;
  const email = `${adj}.${noun}${num}${domain}`;
  burnerEmail.textContent = email;
}

btnGenBurner.addEventListener('click', generateBurner);
btnCopyBurner.addEventListener('click', () => {
  const email = burnerEmail.textContent;
  if (!email || email.includes('...')) {
    generateBurner();
  }
  copyToClipboard(burnerEmail.textContent, 'Burner email copied!');
});

// 2. Gmail Dot-Trick Generator
function generateDotTrickAliases(base) {
  const clean = base.replace(/[^a-zA-Z0-9]/g, '').toLowerCase() || 'alexhunter';
  const aliases = [];

  // Dot combinations
  if (clean.length > 2) {
    aliases.push(`${clean[0]}.${clean.slice(1)}@gmail.com`);
    aliases.push(`${clean.slice(0, 2)}.${clean.slice(2)}@gmail.com`);
    if (clean.length > 4) {
      aliases.push(`${clean.slice(0, 2)}.${clean.slice(2, 4)}.${clean.slice(4)}@gmail.com`);
    }
  }

  // Plus tag variations
  aliases.push(`${clean}+verify@gmail.com`);
  aliases.push(`${clean}+temp${generateRandomNumber(2)}@gmail.com`);
  aliases.push(`${clean}+auth@gmail.com`);
  aliases.push(`${clean}+bypass@gmail.com`);
  aliases.push(`${clean}@googlemail.com`);

  aliasesContainer.innerHTML = '';
  aliases.forEach(alias => {
    const chip = document.createElement('div');
    chip.className = 'alias-chip';
    chip.innerHTML = `
      <span>${alias}</span>
      <span style="color: var(--accent-cyan); font-size: 11px;">Copy 📋</span>
    `;
    chip.addEventListener('click', () => copyToClipboard(alias, `Copied ${alias}!`));
    aliasesContainer.appendChild(chip);
  });
}

btnGenDotTrick.addEventListener('click', () => {
  const val = gmailBaseInput.value.trim() || 'alexhunter';
  generateDotTrickAliases(val);
});

// 3. Full Persona Generator
function generatePersona() {
  const first = getRandomItem(firstNames);
  const last = getRandomItem(lastNames);
  const user = `${first.toLowerCase()}.${last.toLowerCase()}${generateRandomNumber(2)}`;
  const mail = `${user}@dispostar.net`;
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$%^&*';
  let pass = '';
  for (let i = 0; i < 14; i++) {
    pass += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  personaName.textContent = `${first} ${last}`;
  personaUser.textContent = user;
  personaMail.textContent = mail;
  personaPass.textContent = pass;
}

btnGenPersona.addEventListener('click', generatePersona);
btnCopyPersona.addEventListener('click', () => {
  const data = `Name: ${personaName.textContent}\nUsername: ${personaUser.textContent}\nEmail: ${personaMail.textContent}\nPassword: ${personaPass.textContent}`;
  copyToClipboard(data, 'Persona details copied to clipboard!');
});

// Initialize
renderProviders();
generateBurner();
generateDotTrickAliases('alexhunter');
generatePersona();
document.getElementById('yearSpan').textContent = new Date().getFullYear();
