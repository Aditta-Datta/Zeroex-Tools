// DOM elements
const canvas = document.getElementById('canvas');
const ctx = canvas ? canvas.getContext('2d') : null;
const saveButton = document.getElementById('saveButton');

if (!canvas || !ctx || !saveButton) {
  console.error('Error: Required DOM elements (canvas, saveButton) not found.');
}

let baseImage = new Image();
let texts = [];

function loadBaseImage(url = 'https://i.imgur.com/VaWuYSV.png') {
  baseImage.crossOrigin = 'anonymous';
  baseImage.src = url;
}

baseImage.onload = () => {
  canvas.width = baseImage.naturalWidth;
  canvas.height = baseImage.naturalHeight;
  redrawCanvas();
};

baseImage.onerror = () => {
  console.error('Error: Failed to load base image.');
};

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

function generateImage() {
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
  const chargeText = amount >= 51 ? `৳${amount.toFixed(2)} + ৳${charge}` : '৳ চার্জ প্রযোজ্য নয়';

  texts = [
    { text: formatTime(date), x: 50.42, y: 40.3, fontSize: 19.15, color: '#ffffff', rotate: 0, font: 'Roboto-Regular', opacity: 1.0 },
    { text: formatDateTime(date), x: 173.45, y: 189.41, fontSize: 20.15, color: '#C4C4C4', rotate: 0, font: 'Roboto-Regular', opacity: 1.0 },
    { text: `+880${mobile.slice(1)}`, x: 125.04, y: 352.63, fontSize: 22.18, color: '#242424', rotate: 0, font: 'Roboto-Bold', opacity: 1.0 },
    { text: mobile, x: 125.04, y: 384.86, fontSize: 22.18, color: '#242424', rotate: 0, font: 'Roboto-Light', opacity: 1.0 },
    { text: formatTimeAlt(date), x: 32.27, y: 544.05, fontSize: 22.18, color: '#242424', rotate: 0, font: 'Roboto-Regular', opacity: 1.0 },
    { text: chargeText, x: 32.27, y: 694.95, fontSize: 22.18, color: '#000000', rotate: 0, font: 'Roboto-Regular', opacity: 0.5 },
    { text: `৳${total}`, x: 32.27, y: 659.91, fontSize: 22.18, color: '#000000', rotate: 0, font: 'Roboto-Regular', opacity: 1.0 },
    { text: generateBkashTrxID(), x: 393.28, y: 546.96, fontSize: 24.18, color: '#000000', rotate: 0, font: 'Roboto-Regular', opacity: 1.0 }
  ];

  loadBaseImage();
  canvas.style.display = 'block'; // Show canvas after generating
  saveButton.style.display = 'block'; // Show Save Image button
}

function redrawCanvas() {
  if (!ctx) return;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  if (baseImage.src) ctx.drawImage(baseImage, 0, 0);

  for (const text of texts) {
    ctx.save();
    ctx.translate(text.x, text.y);
    ctx.rotate((text.rotate * Math.PI) / 180);
    ctx.font = `${text.fontSize}px "${text.font}"`;
    ctx.fillStyle = text.color;
    ctx.globalAlpha = text.opacity; // Apply opacity
    ctx.textAlign = 'left';
    ctx.fillText(text.text, 0, 0);
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
  link.download = `Fake SS by Zeroex ${currentTime}.png`;
  link.href = canvas.toDataURL('image/png');
  link.click();
}

// Load fonts
function loadFonts() {
  const fontFiles = [
    { name: 'Roboto-Regular', url: '/fonts/Roboto-Regular.ttf' },
    { name: 'Roboto-Bold', url: '/fonts/Roboto-Bold.ttf' },
    { name: 'Roboto-Light', url: '/fonts/Roboto-Light.ttf' }
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

// Initialize fonts
loadFonts();
