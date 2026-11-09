// =========================================================
// FakeMail Neo·AI - Application Core & Live In-App Mailbox
// =========================================================

// ---- 15 External Providers Data ----
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

// ---- Toast & Utility Functions ----
const toast = document.getElementById('toast');
const toastMsg = document.getElementById('toastMsg');
let toastTimeout;

function showToast(message) {
  toastMsg.textContent = message;
  toast.classList.add('show');
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    toast.classList.remove('show');
  }, 2600);
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

// =========================================================
// Real In-App Live Mailbox Engine (Powered by Mail.tm API)
// =========================================================
const API_BASE = 'https://api.mail.tm';

let currentAccount = {
  address: '',
  password: '',
  token: '',
  id: ''
};

let messages = [];
let pollCountdown = 5;
let pollInterval = null;
let isPolling = false;

// DOM Elements for Live Inbox
const liveEmailText = document.getElementById('liveEmailText');
const btnCopyLive = document.getElementById('btnCopyLive');
const btnNewLive = document.getElementById('btnNewLive');
const btnRefreshLive = document.getElementById('btnRefreshLive');
const pollTimer = document.getElementById('pollTimer');
const syncStatus = document.getElementById('syncStatus');
const messagesList = document.getElementById('messagesList');
const msgCountBadge = document.getElementById('msgCountBadge');

// Message Reader Modal Elements
const readModalOverlay = document.getElementById('readModalOverlay');
const readModalClose = document.getElementById('readModalClose');
const readerSubject = document.getElementById('readerSubject');
const readerDate = document.getElementById('readerDate');
const readerFrom = document.getElementById('readerFrom');
const readerTo = document.getElementById('readerTo');
const readerBody = document.getElementById('readerBody');
const otpBanner = document.getElementById('otpBanner');
const otpCode = document.getElementById('otpCode');
const btnCopyOtp = document.getElementById('btnCopyOtp');
const btnDeleteMsg = document.getElementById('btnDeleteMsg');
let currentViewingMsgId = null;

// Initialize Live Mailbox
async function initLiveMailbox() {
  const saved = localStorage.getItem('fakemail_account');
  if (saved) {
    try {
      currentAccount = JSON.parse(saved);
      // Verify token
      const res = await fetch(`${API_BASE}/me`, {
        headers: { 'Authorization': `Bearer ${currentAccount.token}` }
      });
      if (res.ok) {
        liveEmailText.textContent = currentAccount.address;
        startPolling();
        fetchMessages();
        return;
      }
    } catch (e) {
      console.warn('Saved account expired, generating new one...', e);
    }
  }
  await createNewLiveMailbox();
}

async function createNewLiveMailbox() {
  try {
    liveEmailText.textContent = 'Contacting mail server...';
    syncStatus.textContent = 'Fetching domain...';

    // 1. Get available domains
    const domainRes = await fetch(`${API_BASE}/domains`);
    if (!domainRes.ok) throw new Error('Could not fetch mail domains');
    const domainData = await domainRes.json();
    const domain = domainData['hydra:member']?.[0]?.domain || 'fldubai.com';

    // 2. Generate random credentials
    const user = 'user_' + Math.random().toString(36).substring(2, 10);
    const address = `${user}@${domain}`;
    const password = 'Pwd_' + Math.random().toString(36).substring(2, 12) + '!';

    // 3. Create account
    const accRes = await fetch(`${API_BASE}/accounts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ address, password })
    });
    if (!accRes.ok) throw new Error('Failed to create mail account');
    const accData = await accRes.json();

    // 4. Get auth token
    const tokenRes = await fetch(`${API_BASE}/token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ address, password })
    });
    if (!tokenRes.ok) throw new Error('Failed to retrieve mail token');
    const tokenData = await tokenRes.json();

    currentAccount = {
      address,
      password,
      token: tokenData.token,
      id: accData.id
    };

    localStorage.setItem('fakemail_account', JSON.stringify(currentAccount));
    liveEmailText.textContent = address;
    showToast('New Live Mailbox Ready!');
    messages = [];
    renderMessages();
    startPolling();
    fetchMessages();
  } catch (err) {
    console.error('Error creating live mailbox:', err);
    liveEmailText.textContent = 'Service connecting... Click "New Address" to retry';
    syncStatus.textContent = 'Server busy, click refresh to retry';
  }
}

// Polling Loop
function startPolling() {
  if (pollInterval) clearInterval(pollInterval);
  pollCountdown = 5;

  pollInterval = setInterval(async () => {
    pollCountdown--;
    if (pollCountdown <= 0) {
      pollCountdown = 5;
      await fetchMessages();
    }
    pollTimer.textContent = `Auto-refresh: ${pollCountdown}s`;
  }, 1000);
}

async function fetchMessages() {
  if (!currentAccount.token || isPolling) return;
  isPolling = true;
  syncStatus.textContent = 'Checking inbox...';

  try {
    const res = await fetch(`${API_BASE}/messages`, {
      headers: { 'Authorization': `Bearer ${currentAccount.token}` }
    });

    if (res.ok) {
      const data = await res.json();
      const newMessages = data['hydra:member'] || [];

      // Check if new email arrived
      if (newMessages.length > messages.length) {
        showToast(`🎉 New email received! (${newMessages.length} total)`);
      }

      messages = newMessages;
      msgCountBadge.textContent = messages.length;
      renderMessages();
      syncStatus.textContent = `Active · Synced ${new Date().toLocaleTimeString()}`;
    }
  } catch (e) {
    syncStatus.textContent = 'Network check failed, retrying...';
  } finally {
    isPolling = false;
  }
}

// Render Messages List
function renderMessages() {
  if (messages.length === 0) {
    messagesList.innerHTML = `
      <div class="empty-inbox">
        <div class="radar-spinner">
          <div class="radar-pulse"></div>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
        </div>
        <p class="empty-title">Waiting for incoming emails...</p>
        <p class="empty-desc">Send a confirmation email or sign-up link to <strong>${currentAccount.address || 'your address'}</strong>. It will appear here automatically!</p>
      </div>
    `;
    return;
  }

  messagesList.innerHTML = '';
  messages.forEach(msg => {
    const item = document.createElement('div');
    item.className = 'message-item';
    const dateFormatted = new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const fromName = msg.from.name || msg.from.address;

    item.innerHTML = `
      <div class="message-left">
        <div class="message-from">${fromName}</div>
        <div class="message-subject">${msg.subject || '(No Subject)'}</div>
        <div class="message-intro">${msg.intro || 'Click to view full message body...'}</div>
      </div>
      <div class="message-right">
        <span class="message-time">${dateFormatted}</span>
        <button class="read-btn-pill">Read ↗</button>
      </div>
    `;

    item.addEventListener('click', () => openMessage(msg.id));
    messagesList.appendChild(item);
  });
}

// Open Message Modal & Fetch Full Content
async function openMessage(msgId) {
  currentViewingMsgId = msgId;
  readModalOverlay.classList.add('active');
  readerBody.innerHTML = '<div style="padding: 20px; text-align: center; color: #666;">Decrypting message content...</div>';
  otpBanner.style.display = 'none';

  try {
    const res = await fetch(`${API_BASE}/messages/${msgId}`, {
      headers: { 'Authorization': `Bearer ${currentAccount.token}` }
    });

    if (!res.ok) throw new Error('Failed to load message');
    const msg = await res.json();

    readerSubject.textContent = msg.subject || '(No Subject)';
    readerDate.textContent = new Date(msg.createdAt).toLocaleString();
    readerFrom.textContent = `${msg.from.name ? msg.from.name + ' ' : ''}<${msg.from.address}>`;
    readerTo.textContent = msg.to.map(t => t.address).join(', ');

    // Extract OTP / verification code
    const fullText = (msg.text || '') + ' ' + (msg.subject || '');
    const otpMatch = fullText.match(/\b(?:\d{4,8}|[A-Z0-9]{5,8})\b/) || fullText.match(/(?:code|otp|pin|verify|verification)[:\s]+([0-9]{4,8})/i);

    if (otpMatch) {
      const codeFound = otpMatch[1] || otpMatch[0];
      // Exclude simple years like 2026 if false positive
      if (codeFound && codeFound !== '2026' && codeFound.length >= 4) {
        otpCode.textContent = codeFound;
        otpBanner.style.display = 'flex';
      }
    }

    // Render HTML safely inside iframe or text
    if (msg.html && msg.html.length > 0) {
      const iframe = document.createElement('iframe');
      readerBody.innerHTML = '';
      readerBody.appendChild(iframe);
      iframe.contentWindow.document.open();
      iframe.contentWindow.document.write(`
        <!DOCTYPE html><html><head><style>body { font-family: sans-serif; font-size: 14px; color: #111; line-height: 1.5; padding: 12px; margin: 0; }</style></head><body>${msg.html[0]}</body></html>
      `);
      iframe.contentWindow.document.close();
    } else {
      readerBody.innerHTML = `<pre style="white-space: pre-wrap; font-family: sans-serif; font-size: 14px; margin: 0;">${escapeHtml(msg.text || 'No text content.')}</pre>`;
    }
  } catch (e) {
    readerBody.innerHTML = '<div style="color: red; padding: 16px;">Failed to load message. Please try again.</div>';
  }
}

function escapeHtml(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

// Reader actions
btnCopyOtp.addEventListener('click', () => {
  copyToClipboard(otpCode.textContent, 'OTP Code copied!');
});

btnDeleteMsg.addEventListener('click', async () => {
  if (!currentViewingMsgId || !currentAccount.token) return;
  try {
    await fetch(`${API_BASE}/messages/${currentViewingMsgId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${currentAccount.token}` }
    });
    showToast('Message deleted.');
    readModalOverlay.classList.remove('active');
    fetchMessages();
  } catch (e) {
    showToast('Could not delete message.');
  }
});

readModalClose.addEventListener('click', () => {
  readModalOverlay.classList.remove('active');
});

// Live Inbox Buttons
btnCopyLive.addEventListener('click', () => {
  if (currentAccount.address) {
    copyToClipboard(currentAccount.address, 'Live email address copied!');
  }
});

btnNewLive.addEventListener('click', () => {
  createNewLiveMailbox();
});

btnRefreshLive.addEventListener('click', () => {
  btnRefreshLive.style.transform = 'rotate(360deg)';
  setTimeout(() => { btnRefreshLive.style.transform = ''; }, 400);
  fetchMessages();
  showToast('Checked for new emails!');
});

// =========================================================
// Section 2: AI Aliases & Dot-Trick Generator
// =========================================================
const tabButtons = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');
const gmailBaseInput = document.getElementById('gmailBaseInput');
const btnGenDotTrick = document.getElementById('btnGenDotTrick');
const aliasesContainer = document.getElementById('aliasesContainer');

const personaName = document.getElementById('personaName');
const personaUser = document.getElementById('personaUser');
const personaMail = document.getElementById('personaMail');
const personaPass = document.getElementById('personaPass');
const btnGenPersona = document.getElementById('btnGenPersona');
const btnCopyPersona = document.getElementById('btnCopyPersona');

tabButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    tabButtons.forEach(b => b.classList.remove('active'));
    tabContents.forEach(c => c.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById(`tab-${btn.dataset.tab}`).classList.add('active');
  });
});

function generateDotTrickAliases(base) {
  const clean = base.replace(/[^a-zA-Z0-9]/g, '').toLowerCase() || 'alexhunter';
  const aliases = [];

  if (clean.length > 2) {
    aliases.push(`${clean[0]}.${clean.slice(1)}@gmail.com`);
    aliases.push(`${clean.slice(0, 2)}.${clean.slice(2)}@gmail.com`);
    if (clean.length > 4) {
      aliases.push(`${clean.slice(0, 2)}.${clean.slice(2, 4)}.${clean.slice(4)}@gmail.com`);
    }
  }

  aliases.push(`${clean}+verify@gmail.com`);
  aliases.push(`${clean}+temp${Math.floor(Math.random() * 99)}@gmail.com`);
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

const firstNames = ['Alexander', 'Elena', 'Lucas', 'Maya', 'Julian', 'Sofia', 'Dmitri', 'Aria', 'Kaelen', 'Zara'];
const lastNames = ['Vance', 'Sterling', 'Mercer', 'Novak', 'Sinclair', 'Cross', 'Winters', 'Frost', 'Kovacs'];

function generatePersona() {
  const first = firstNames[Math.floor(Math.random() * firstNames.length)];
  const last = lastNames[Math.floor(Math.random() * lastNames.length)];
  const user = `${first.toLowerCase()}.${last.toLowerCase()}${Math.floor(Math.random() * 99)}`;
  const mail = `${user}@ghostmail.org`;
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

// =========================================================
// Section 3: 15 Verified External Mail Web Services
// =========================================================
const providersGrid = document.getElementById('providersGrid');
const searchInput = document.getElementById('searchInput');
const searchCount = document.getElementById('searchCount');
const filterPills = document.querySelectorAll('.filter-pill');

const modalOverlay = document.getElementById('modalOverlay');
const modalClose = document.getElementById('modalClose');
const modalEmoji = document.getElementById('modalEmoji');
const modalTitle = document.getElementById('modalTitle');
const modalTag = document.getElementById('modalTag');
const modalUrl = document.getElementById('modalUrl');
const modalDesc = document.getElementById('modalDesc');
const modalLaunch = document.getElementById('modalLaunch');
const modalCopyBtn = document.getElementById('modalCopyBtn');

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

    const detailsBtn = card.querySelector('[data-action="details"]');
    detailsBtn.addEventListener('click', () => openExternalModal(p));
    providersGrid.appendChild(card);
  });
}

let currentExternalProvider = null;

function openExternalModal(provider) {
  currentExternalProvider = provider;
  modalEmoji.textContent = provider.emoji;
  modalTitle.textContent = provider.name;
  modalTag.textContent = provider.tag;
  modalUrl.textContent = provider.url;
  modalDesc.textContent = provider.desc;
  modalLaunch.href = provider.url;
  modalOverlay.classList.add('active');
}

modalClose.addEventListener('click', () => modalOverlay.classList.remove('active'));
modalCopyBtn.addEventListener('click', () => {
  if (currentExternalProvider) copyToClipboard(currentExternalProvider.url, 'Provider URL copied!');
});

filterPills.forEach(pill => {
  pill.addEventListener('click', () => {
    filterPills.forEach(p => p.classList.remove('active'));
    pill.classList.add('active');
    activeFilter = pill.dataset.filter;
    renderProviders();
  });
});

searchInput.addEventListener('input', renderProviders);

// Global modal overlays closing
[modalOverlay, readModalOverlay].forEach(overlay => {
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) overlay.classList.remove('active');
  });
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    modalOverlay.classList.remove('active');
    readModalOverlay.classList.remove('active');
  }
});

// ---- Boot Everything ----
initLiveMailbox();
renderProviders();
generateDotTrickAliases('alexhunter');
generatePersona();
document.getElementById('yearSpan').textContent = new Date().getFullYear();
