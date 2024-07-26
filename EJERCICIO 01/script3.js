// script.js
const colores = ["#A1EC74", "#F0DC82", "#EEA9F0", "#3D57DF", "#E27D70"];
let elementos = [];
let angulos = [];
let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");
let startAngle = 0;
let arc = Math.PI / 6;
let spinTimeout = null;
let spinAngleStart = 10;
let spinTime = 0;
let spinTimeTotal = 0;
let textarea = document.getElementById("textarea");
let resultado = document.getElementById("resultado");

document.getElementById("iniciar").addEventListener("click", spin);
document.getElementById("reiniciar").addEventListener("click", reiniciar);
textarea.addEventListener("input", actualizarRuleta);
document.addEventListener("keydown", function (event) {
    if (event.code === "Space") spin();
    if (event.code === "KeyS") resaltarUltimo();
    if (event.code === "KeyE") editar();
    if (event.code === "KeyR") reiniciar();
    if (event.code === "KeyF") pantallaCompleta();
});

function dibujarRuleta() {
    elementos = textarea.value.split("\n").filter(e => e.trim() !== "");
    angulos = [];
    let arc = 2 * Math.PI / elementos.length;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < elementos.length; i++) {
        let angle = startAngle + i * arc;
        angulos.push(angle);
        ctx.fillStyle = colores[i % colores.length];
        ctx.beginPath();
        ctx.arc(250, 250, 200, angle, angle + arc, false);
        ctx.lineTo(250, 250);
        ctx.fill();
        ctx.save();
        ctx.fillStyle = "white";
        ctx.translate(250 + Math.cos(angle + arc / 2) * 150, 250 + Math.sin(angle + arc / 2) * 150);
        ctx.rotate(angle + arc / 2 + Math.PI / 2);
        let text = elementos[i];
        ctx.fillText(text, -ctx.measureText(text).width / 2, 0);
        ctx.restore();
    }
}

function spin() {
    spinAngleStart = Math.random() * 10 + 10;
    spinTime = 0;
    spinTimeTotal = Math.random() * 3 + 4 * 1000;
    rotateWheel();
}

function rotateWheel() {
    spinTime += 30;
    if (spinTime >= spinTimeTotal) {
        stopRotateWheel();
        return;
    }
    let spinAngle = spinAngleStart - easeOut(spinTime, 0, spinAngleStart, spinTimeTotal);
    startAngle += (spinAngle * Math.PI / 180);
    dibujarRuleta();
    spinTimeout = setTimeout('rotateWheel()', 30);
}

function stopRotateWheel() {
    clearTimeout(spinTimeout);
    let degrees = startAngle * 180 / Math.PI + 90;
    let arcd = arc * 180 / Math.PI;
    let index = Math.floor((360 - degrees % 360) / arcd);
    ctx.save();
    ctx.font = 'bold 30px Helvetica, Arial';
    let text = elementos[index]
    resultado.textContent = `Elemento seleccionado: ${text}`;
    ctx.restore();
}

function easeOut(t, b, c, d) {
    let ts = (t /= d) * t;
    let tc = ts * t;
    return b + c * (tc + -3 * ts + 3 * t);
}

function actualizarRuleta() {
    dibujarRuleta();
}

function resaltarUltimo() {
    let lines = textarea.value.split('\n');
    let lastElement = resultado.textContent.replace('Elemento seleccionado: ', '');
    let updatedLines = lines.map(line => line === lastElement ? '' : line);
    textarea.value = updatedLines.join('\n');
    actualizarRuleta();
}

function editar() {
    textarea.disabled = !textarea.disabled;
}

function reiniciar() {
    textarea.disabled = false;
    resultado.textContent = '';
    actualizarRuleta();
}

function pantallaCompleta() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        }
    }
}

dibujarRuleta();
