const canvas = document.getElementById('drawingCanvas');
const ctx = canvas.getContext('2d');
const completionResult = document.getElementById('completionResult');
const perfectnessResult = document.getElementById('perfectnessResult');
const popup = document.getElementById('popup');
const popupMessage = document.getElementById('popupMessage');
const popupGif = document.getElementById('popupGif');
const closePopup = document.getElementById('closePopup');

// Set canvas to full screen
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// Calculate center and radius based on screen size
let centerX = canvas.width / 2;
let centerY = canvas.height / 2;
let radius = Math.min(canvas.width, canvas.height) / 4;

let isDrawing = false;
let x = 0, y = 0;
let totalDrawnDistance = 0;
let lastX = null, lastY = null;
let drawnPath = [];

// Array of random GIF URLs - replace with your actual GIF paths
const gifs = [
    'gifs/STK-20231015-WA0013.webp',
    'gifs/STK-20231116-WA0003.webp',
    'gifs/STK-20231125-WA0002.webp',
    'gifs/STK-20231211-WA0002.webp',
    'gifs/STK-20231221-WA0011.webp',
    'gifs/STK-20231223-WA0003.webp',
    'gifs/STK-20231223-WA0004.webp',
    'gifs/STK-20231224-WA0000.webp',
    'gifs/STK-20231226-WA0013.webp',
    'gifs/STK-20231231-WA0000.webp',
    'gifs/STK-20240101-WA0001.webp',
    'gifs/STK-20240102-WA0000.webp',
    'gifs/STK-20240102-WA0001.webp',
    'gifs/STK-20240104-WA0001.webp',
    'gifs/STK-20240109-WA0016.webp',
    'gifs/STK-20240118-WA0000.webp',
    'gifs/STK-20240118-WA0002.webp',
    'gifs/STK-20240118-WA0003.webp',
    'gifs/STK-20240118-WA0004.webp',
    'gifs/STK-20240120-WA0017.webp',
    'gifs/STK-20240121-WA0018.webp',
    'gifs/STK-20240121-WA0019.webp',
    'gifs/STK-20240121-WA0186.webp',
    'gifs/STK-20240122-WA0101.webp',
    'gifs/STK-20240123-WA0046.webp',
    'gifs/STK-20240125-WA0005.webp',
    'gifs/STK-20240125-WA0011.webp',
    'gifs/STK-20240128-WA0017.webp',
    'gifs/STK-20240128-WA0018.webp',
    'gifs/STK-20240129-WA0003.webp',
    'gifs/STK-20240129-WA0004.webp',
    'gifs/STK-20240202-WA0002.webp',
    'gifs/STK-20240202-WA0003.webp',
    'gifs/STK-20240202-WA0007.webp',
    'gifs/STK-20240203-WA0008.webp',
    'gifs/STK-20240203-WA0024.webp',
    'gifs/STK-20240203-WA0027.webp',
    'gifs/STK-20240203-WA0030.webp',
    'gifs/STK-20240204-WA0018.webp',
    'gifs/STK-20240205-WA0005.webp',
    'gifs/STK-20240206-WA0019.webp',
    'gifs/STK-20240206-WA0022.webp',
    'gifs/STK-20240207-WA0129.webp',
    'gifs/STK-20240209-WA0009.webp',
    'gifs/STK-20240214-WA0011.webp',
    'gifs/STK-20240214-WA0012.webp',
    'gifs/STK-20240214-WA0018.webp',
    'gifs/STK-20240224-WA0001.webp',
    'gifs/STK-20240225-WA0005.webp',
    'gifs/STK-20240225-WA0006.webp',
    'gifs/STK-20240225-WA0007.webp',
    'gifs/STK-20240225-WA0011.webp',
    'gifs/STK-20240225-WA0018.webp',
    'gifs/STK-20240226-WA0012.webp',
    'gifs/STK-20240226-WA0014.webp',
    'gifs/STK-20240226-WA0015.webp',
    'gifs/STK-20240228-WA0000.webp',
    'gifs/STK-20240301-WA0198.webp',
    'gifs/STK-20240301-WA0203.webp',
    'gifs/STK-20240303-WA0004.webp',
    'gifs/STK-20240305-WA0003.webp',
    'gifs/STK-20240305-WA0010.webp',
    'gifs/STK-20240305-WA0011.webp',
    'gifs/STK-20240311-WA0001.webp',
    'gifs/STK-20240316-WA0030.webp',
    'gifs/STK-20240317-WA0048.webp',
    'gifs/STK-20240320-WA0031.webp',
    'gifs/STK-20240325-WA0002.webp',
    'gifs/STK-20240325-WA0021.webp',
    'gifs/STK-20240326-WA0010.webp',
    'gifs/STK-20240328-WA0016.webp',
    'gifs/STK-20240401-WA0042.webp',
    'gifs/STK-20240408-WA0002.webp',
    'gifs/STK-20240411-WA0019.webp',
    'gifs/STK-20240413-WA0003.webp',
    'gifs/STK-20240414-WA0048.webp',
    'gifs/STK-20240416-WA0045.webp',
    'gifs/STK-20240417-WA0031.webp',
    'gifs/STK-20240418-WA0056.webp',
    'gifs/STK-20240419-WA0073.webp',
    'gifs/STK-20240501-WA0021.webp',
    'gifs/STK-20240501-WA0029.webp',
    'gifs/STK-20240504-WA0014.webp',
    'gifs/STK-20240504-WA0026.webp',
    'gifs/STK-20240505-WA0002.webp',
    'gifs/STK-20240505-WA0005.webp',
    'gifs/STK-20240505-WA0008.webp',
    'gifs/STK-20240505-WA0009.webp',
    'gifs/STK-20240505-WA0010.webp',
    'gifs/STK-20240505-WA0011.webp',
    'gifs/STK-20240505-WA0017.webp',
    'gifs/STK-20240507-WA0002.webp',
    'gifs/STK-20240514-WA0008.webp',
    'gifs/STK-20240518-WA0006.webp',
    'gifs/STK-20240525-WA0019.webp',
    'gifs/STK-20240601-WA0002.webp',
    'gifs/STK-20240603-WA0002.webp',
    'gifs/STK-20240603-WA0007.webp',
    'gifs/STK-20240603-WA0013.webp',
    'gifs/STK-20240616-WA0020.webp',
    'gifs/STK-20240617-WA0006.webp',
    'gifs/STK-20240711-WA0047.webp',
    'gifs/STK-20240714-WA0004.webp',
    'gifs/STK-20240718-WA0012.webp',
    'gifs/STK-20240722-WA0000.webp',
    'gifs/STK-20240724-WA0048.webp',
    'gifs/STK-20240801-WA0011.webp',
    'gifs/STK-20240801-WA0013.webp',
    'gifs/STK-20240801-WA0025.webp',
    'gifs/STK-20240801-WA0026.webp',
    'gifs/STK-20240801-WA0039.webp',
    'gifs/STK-20240809-WA0003.webp',
    'gifs/STK-20240809-WA0004.webp',
    'gifs/STK-20240810-WA0001.webp',
    'gifs/STK-20240814-WA0002.webp',
    'gifs/STK-20240820-WA0000.webp',
    'gifs/STK-20240828-WA0003.webp',
    'gifs/STK-20240828-WA0005.webp',
    'gifs/STK-20240828-WA0006.webp',
    'gifs/STK-20240829-WA0000.webp',
    'gifs/STK-20240905-WA0020.webp',
    'gifs/STK-20240905-WA0027.webp',
    'gifs/STK-20240905-WA0028.webp',
    'gifs/STK-20240906-WA0020.webp',
    'gifs/STK-20240912-WA0004.webp',
    'gifs/STK-20240915-WA0003.webp',
    'gifs/STK-20240915-WA0025.webp',
    'gifs/STK-20240916-WA0004.webp',
    'gifs/STK-20240920-WA0042.webp',
    'gifs/STK-20240920-WA0043.webp',
    'gifs/STK-20240920-WA0046.webp',
    'gifs/STK-20240924-WA0010.webp',
    'gifs/STK-20240929-WA0021.webp',
    'gifs/STK-20241003-WA0001.webp',
    'gifs/STK-20241005-WA0051.webp',
    'gifs/STK-20241006-WA0017.webp',
    'gifs/STK-20241015-WA0044.webp',
    'gifs/STK-20241016-WA0006.webp',
    'gifs/STK-20241023-WA0005.webp',
];

// Mouse events
canvas.addEventListener('mousedown', startDrawing);
canvas.addEventListener('mousemove', draw);
canvas.addEventListener('mouseup', endDrawing);
canvas.addEventListener('mouseleave', endDrawing);

// Touch events
canvas.addEventListener('touchstart', handleTouchStart);
canvas.addEventListener('touchmove', handleTouchMove);
canvas.addEventListener('touchend', endDrawing);

function handleTouchStart(e) {
    e.preventDefault();
    const touch = e.touches[0];
    const rect = canvas.getBoundingClientRect();
    x = touch.clientX - rect.left;
    y = touch.clientY - rect.top;
    startDrawing({ offsetX: x, offsetY: y });
}

function handleTouchMove(e) {
    e.preventDefault();
    if (!isDrawing) return;
    const touch = e.touches[0];
    const rect = canvas.getBoundingClientRect();
    x = touch.clientX - rect.left;
    y = touch.clientY - rect.top;
    draw({ offsetX: x, offsetY: y });
}

function startDrawing(e) {
    isDrawing = true;
    [x, y] = [e.offsetX, e.offsetY];
    lastX = x;
    lastY = y;
    drawnPath = [];
    totalDrawnDistance = 0;
}

function draw(e) {
    if (!isDrawing) return;

    ctx.strokeStyle = 'white';
    ctx.lineWidth = 5;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(x, y);
    [x, y] = [e.offsetX, e.offsetY];
    ctx.lineTo(x, y);
    ctx.stroke();

    drawnPath.push({ x, y });

    if (lastX !== null && lastY !== null) {
        const distance = Math.sqrt((x - lastX) ** 2 + (y - lastY) ** 2);
        totalDrawnDistance += distance;
        lastX = x;
        lastY = y;
    }

    updateCompletion();
}

function updateCompletion() {
    const circumference = 2 * Math.PI * radius;
    const completionPercentage = Math.min(100, (totalDrawnDistance / circumference) * 100).toFixed(2);
    completionResult.textContent = `Completion: ${completionPercentage}%`;
}

function calculatePerfectness() {
    let totalDeviation = 0;

    for (let point of drawnPath) {
        const distanceFromCenter = Math.sqrt((point.x - centerX) ** 2 + (point.y - centerY) ** 2);
        const deviation = Math.abs(distanceFromCenter - radius);
        totalDeviation += deviation;
    }

    const averageDeviation = totalDeviation / drawnPath.length;
    let perfectnessScore = Math.max(0, 100 - (averageDeviation * 10));

    const completionPercentage = (totalDrawnDistance / (2 * Math.PI * radius)) * 100;

    if (completionPercentage > 50) {
        perfectnessScore = Math.max(48, perfectnessScore);
    }

    if (completionPercentage > 50 && perfectnessScore < 87) {
        perfectnessScore = Math.min(87, perfectnessScore + (completionPercentage - 50) * (30 / 38));
    }

    perfectnessResult.textContent = `Perfectness: ${perfectnessScore.toFixed(2)}%`;
    return perfectnessScore;
}

function endDrawing() {
    if (!isDrawing) return;
    isDrawing = false;
    const perfectnessScore = calculatePerfectness();
    showPopup(perfectnessScore);
    clearCanvas();
}

function showPopup(perfectnessScore) {
    const randomGif = gifs[Math.floor(Math.random() * gifs.length)];
    popupMessage.textContent = `Perfectness: ${perfectnessScore.toFixed(2)}%`;
    popupGif.src = randomGif;
    popup.style.display = 'flex';
}

function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    completionResult.textContent = 'Completion: 0%';
    perfectnessResult.textContent = 'Perfectness: -';
    totalDrawnDistance = 0;
    lastX = null;
    lastY = null;
    drawnPath = [];
}

closePopup.addEventListener('click', () => {
    popup.style.display = 'none';
});

// Handle window resize
window.addEventListener('resize', () => {
    const prevCenterX = centerX;
    const prevCenterY = centerY;

    resizeCanvas(); // Call resizeCanvas to adjust the size
    centerX = canvas.width / 2;
    centerY = canvas.height / 2;
    radius = Math.min(canvas.width, canvas.height) / 4;

    // Update drawn path coordinates if exists
    drawnPath = drawnPath.map(point => ({
        x: point.x * (canvas.width / prevCenterX),
        y: point.y * (canvas.height / prevCenterY)
    }));
});
