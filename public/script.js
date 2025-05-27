// DOM elements
const canvas = document.getElementById('canvas');
const ctx = canvas ? canvas.getContext('2d') : null;
const saveButton = document.getElementById('saveButton');

if (!canvas || !ctx || !saveButton) {
  console.error('Error: Required DOM elements (canvas, saveButton) not found.');
}

let baseImage = new Image();
let texts = [];
let overlayImage = null;

function loadBaseImage(url) {
  baseImage.crossOrigin = 'anonymous';
  baseImage.src = url;
  baseImage.onload = () => {
    canvas.width = baseImage.naturalWidth;
    canvas.height = baseImage.naturalHeight;
    redrawCanvas();
  };
  baseImage.onerror = () => {
    console.error(`Error: Failed to load base image from ${url}`);
    alert(`Failed to load base image. Please try again or check the image URL.`);
  };
}

function generateBkashTrxID() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let trxID = 'C';
  for (let i = 0; i < 9; i++) {
    trxID += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return trxID;
}

function formatTime(date) {
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
}

function formatDateTime(date) {
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  const hours = date.getHours() % 12 || 12;
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const period = date.getHours() >= 12 ? 'PM' : 'AM';
  return `${day}-${month}-${year} ${hours}:${minutes} ${period}`;
}

function formatTimeAlt(date) {
  const hours = (date.getHours() % 12 || 12).toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const period = date.getHours() >= 12 ? 'pm' : 'am';
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear().toString().slice(-2);
  return `${hours}:${minutes}${period} ${day}/${month}/${year}`;
}

function formatAccountTime(date) {
  const hours = date.getHours() % 12 || 12;
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
}

function capitalizeName(name) {
  return name.replace(/\b\w/g, char => char.toUpperCase());
}

function generateImage() {
  const mode = document.getElementById('mode').value;
  texts = [];

  if (mode === 'send-money') {
    const mobileInput = document.getElementById('mobile');
    const amountInput = document.getElementById('amount');
    const timeInput = document.getElementById('time');

    if (!mobileInput || !amountInput) {
      alert('Error: Mobile number and amount inputs are required.');
      return;
    }

    const mobile = mobileInput.value.trim();
    const amount = parseFloat(amountInput.value);
    const timeValue = timeInput.value;

    if (!/^[0][0-9]{10}$/.test(mobile)) {
      alert('Error: Mobile number must be 11 digits starting with 0 (e.g., 01XXXXXXXXX).');
      return;
    }
    if (isNaN(amount) || amount < 1 || amount > 50000) {
      alert('Error: Amount must be between 1 and 50,000.');
      return;
    }

    const date = timeValue ? new Date(timeValue) : new Date();
    if (isNaN(date.getTime())) {
      alert('Error: Invalid date/time.');
      return;
    }

    const charge = amount >= 51 ? (amount * 0.0185).toFixed(2) : 0;
    const total = amount >= 51 ? (amount + parseFloat(charge)).toFixed(2) : amount.toFixed(2);
    const chargeText = amount >= 51 ? `৳${amount.toFixed(2)} + ৳${charge}` : '+ চার্জ প্রযোজ্য নয়';

    texts = [
      { text: formatTime(date), x: 50.42, y: 40.3, fontSize: 19.15, color: '#ffffff', rotate: 0, font: 'Roboto-Regular', opacity: 1.0 },
      { text: formatDateTime(date), x: 173.45, y: 189.41, fontSize: 20.15, color: '#e3e3e3', rotate: 0, font: 'Roboto-Regular', opacity: 1.0 },
      { text: `+880${mobile.slice(1)}`, x: 125.04, y: 352.63, fontSize: 22.18, color: '#242424', rotate: 0, font: 'Roboto-Bold', opacity: 1.0 },
      { text: mobile, x: 125.04, y: 384.86, fontSize: 22.18, color: '#242424', rotate: 0, font: 'Roboto-Light', opacity: 1.0 },
      { text: formatTimeAlt(date), x: 32.27, y: 544.05, fontSize: 22.18, color: '#242424', rotate: 0, font: 'Roboto-Regular', opacity: 1.0 },
      { text: chargeText, x: 32.27, y: 694.95, fontSize: 22.18, color: '#000000', rotate: 0, font: 'NotoSansBengali-Regular', opacity: 0.5 },
      { text: '৳', x: 32.27, y: 659.91, fontSize: 22.18, color: '#000000', rotate: 0, font: 'NotoSansBengali-Medium', opacity: 1.0 },
      { text: total, x: 46.27, y: 659.91, fontSize: 22.18, color: '#000000', rotate: 0, font: 'Roboto-Regular', opacity: 1.0 },
      { text: generateBkashTrxID(), x: 393.28, y: 546.96, fontSize: 24.18, color: '#000000', rotate: 0,STITUTE: 'Roboto-Regular', opacity: 1.0 }
    ];

    loadBaseImage('https://i.imgur.com/VaWuYSV.png');
  } else {
    const accountNameInput = document.getElementById('account-name');
    const balanceInput = document.getElementById('balance');
    const timeInput = document.getElementById('account-time');
    const imageInput = document.getElementById('account-image');

    if (!accountNameInput || !balanceInput) {
      alert('Error: Account name and balance inputs are required.');
      return;
    }

    const accountName = accountNameInput.value.trim();
    const balance = parseFloat(balanceInput.value);
    const timeValue = timeInput.value;

    if (!/^[A-Za-z\s]+$/.test(accountName)) {
      alert('Error: Account name must contain only English letters and spaces.');
      return;
    }
    if (isNaN(balance) || balance < 0 || balance > 5000000) {
      alert('Error: Balance must be between 0 and 5,000,000.');
      return;
    }

    const date = timeValue ? new Date(timeValue) : new Date();
    if (isNaN(date.getTime())) {
      alert('Error: Invalid date/time.');
      return;
    }

    const formattedName = capitalizeName(accountName);
    texts = [
      { text: formattedName, x: 98, y: 85, fontSize: 17, color: '#ffffff', rotate: 0, font: 'Product-Sans-Regular', opacity: 1.0, letterSpacing: 1 },
      { text: balance.toFixed(2), x: 195, y: 118, fontSize: 17, color: '#e2136e', rotate: 0, font: 'Roboto-Bold', opacity: 1.0, align: 'center' },
      { text: formatAccountTime(date), x: 52, y: 30, fontSize: 16, color: '#ffffff', rotate: 0, font: 'Roboto-Medium', opacity: 1.0, align: 'center' }
    ];

    if (!imageInput.files[0]) {
      texts.push({
        text: formattedName[0].toUpperCase(),
        x: 52,
        y: 108,
        fontSize: 24,
        color: '#ffffff',
        rotate: 0,
        font: 'Roboto-Medium',
        opacity: 1.0,
        align: 'center'
      });
    }

    loadBaseImage('https://i.imgur.com/XE0qLTT.png');

    if (imageInput.files[0]) {
      const reader = new FileReader();
      reader.onload = () => {
        overlayImage = new Image();
        overlayImage.src = reader.result;
        overlayImage.onload = () => redrawCanvas();
      };
      reader.readAsDataURL(imageInput.files[0]);
    } else {
      overlayImage = null;
      redrawCanvas();
    }
  }

  canvas.style.display = 'block';
  saveButton.style.display = 'block';
}

function redrawCanvas() {
  if (!ctx) return;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  if (baseImage.src && baseImage.complete) ctx.drawImage(baseImage, 0, 0);

  if (overlayImage && overlayImage.complete) {
    ctx.save();
    ctx.beginPath();
    ctx.arc(22 + 59 / 2, 71 + 59 / 2, 59 / 2, 0, Math.PI * 2);
    ctx.clip();
    ctx.drawImage(overlayImage, 22, 71, 59, 59);
    ctx.restore();
  }

  for (const text of texts) {
    ctx.save();
    ctx.translate(text.x, text.y);
    ctx.rotate((text.rotate * Math.PI) / 180);
    ctx.font = `${text.fontSize}px "${text.font}"`;
    ctx.fillStyle = text.color;
    ctx.globalAlpha = text.opacity;
    ctx.textAlign = text.align || 'left';
    if (text.letterSpacing) {
      let xOffset = 0;
      for (let char of text.text) {
        ctx.fillText(char, xOffset, 0);
        xOffset += ctx.measureText(char).width + text.letterSpacing;
      }
    } else {
      ctx.fillText(text.text, 0, 0);
    }
    ctx.restore();
  }
}

function formatFileNameTime(date) {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const hours = date.getHours() % 12 || 12;
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const period = date.getHours() >= 12 ? 'PM' : 'AM';
  return `${year}-${month}-${day}_${hours}-${minutes}-${period}`;
}

function saveImage() {
  if (!baseImage.src && texts.length === 0) {
    alert('Error: Canvas is empty. Nothing to save.');
    return;
  }
  const link = document.createElement('a');
  const currentTime = formatFileNameTime(new Date());
  const mode = document.getElementById('mode').value;
  const prefix = mode === 'send-money' ? 'Send Money' : 'Account Money';
  link.download = `Fake SS ${prefix} by Zeroex ${currentTime}.png`;
  link.href = canvas.toDataURL('image/png');
  link.click();
}

function loadFonts() {
  const fontFiles = [
    { name: 'Roboto-Regular', url: '/fonts/Roboto-Regular.ttf' },
    { name: 'Roboto-Bold', url: '/fonts/Roboto-Bold.ttf' },
    { name: 'Roboto-Light', url: '/fonts/Roboto-Light.ttf' },
    { name: 'Roboto-Medium', url: '/fonts/Roboto-Medium.ttf' },
    { name: 'NotoSansBengali-Regular', url: '/fonts/NotoSansBengali-Regular.ttf' },
    { name: 'NotoSansBengali-Medium', url: '/fonts/NotoSansBengali-Medium.ttf' },
    { name: 'Product-Sans-Regular', url: '/fonts/Product-Sans-Regular.ttf' }
  ];

  fontFiles.forEach(font => {
    const fontFace = new FontFace(font.name, `url(${font.url})`);
    fontFace.load()
      .then(loadedFont => {
        document.fonts.add(loadedFont);
      })
      .catch(err => console.error(`Error loading font "${font.name}": ${err.message}`));
  });
}

function getQueryParams() {
  const params = new URLSearchParams(window.location.search);
  return {
    mode: params.get('mode') || 'send-money',
    mobile: params.get('mobile') || '',
    amount: params.get('amount') || '',
    time: params.get('time') || '',
    accountName: params.get('account-name') || '',
    balance: params.get('balance') || '',
    accountTime: params.get('account-time') || ''
  };
}

function initQueryParams() {
  const { mode, mobile, amount, time, accountName, balance, accountTime } = getQueryParams();
  const modeSelect = document.getElementById('mode');
  const mobileInput = document.getElementById('mobile');
  const amountInput = document.getElementById('amount');
  const timeInput = document.getElementById('time');
  const accountNameInput = document.getElementById('account-name');
  const balanceInput = document.getElementById('balance');
  const accountTimeInput = document.getElementById('account-time');

  modeSelect.value = mode;
  toggleForm(new Event('change'));

  if (mode === 'send-money') {
    if (mobile) mobileInput.value = mobile;
    if (amount) amountInput.value = amount;
    if (time && time !== 'blank') timeInput.value = time;
    mobileInput.dispatchEvent(new Event('input'));
    amountInput.dispatchEvent(new Event('input'));
    if (mobile && amount && /^[0][0-9]{10}$/.test(mobile) && !isNaN(amount) && amount >= 1 && amount <= 50000) {
      document.fonts.ready.then(() => {
        generateImage();
      });
    }
  } else {
    if (accountName) accountNameInput.value = accountName;
    if (balance) balanceInput.value = balance;
    if (accountTime && accountTime !== 'blank') accountTimeInput.value = accountTime;
    accountNameInput.dispatchEvent(new Event('input'));
    balanceInput.dispatchEvent(new Event('input'));
    if (accountName && balance && /^[A-Za-z\s]+$/.test(accountName) && !isNaN(balance) && balance >= 0 && balance <= 5000000) {
      document.fonts.ready.then(() => {
        generateImage();
      });
    }
  }
}

loadFonts();
initQueryParams();
