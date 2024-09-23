const canvas = document.querySelector("canvas");
const ctx = canvas.getContext('2d');

const pointer = {
    x: .5 * window.innerWidth,
    y: .5 * window.innerHeight,
}
const params = {
    pointsNumber: 40,
    widthFactor: .3,
    mouseThreshold: .6,
    spring: .4,
    friction: .5
};

const trail = new Array(params.pointsNumber);
for (let i = 0; i < params.pointsNumber; i++) {
    trail[i] = {
        x: pointer.x,
        y: pointer.y,
        dx: 0,
        dy: 0,
    }
}

window.addEventListener("click", e => {
    updateMousePosition(e.pageX, e.pageY);
});
window.addEventListener("mousemove", e => {
    mouseMoved = true;
    updateMousePosition(e.pageX, e.pageY);
});
window.addEventListener("touchmove", e => {
    mouseMoved = true;
    updateMousePosition(e.targetTouches[0].pageX, e.targetTouches[0].pageY);
});

function updateMousePosition(eX, eY) {
    pointer.x = eX;
    pointer.y = eY;
}

setupCanvas();
update(0);
window.addEventListener("resize", setupCanvas);


function update(t) {

    // for intro motion
    if (!mouseMoved) {
        pointer.x = (.5 + .3 * Math.cos(.002 * t) * (Math.sin(.005 * t))) * window.innerWidth;
        pointer.y = (.5 + .2 * (Math.cos(.005 * t)) + .1 * Math.cos(.01 * t)) * window.innerHeight;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    trail.forEach((p, pIdx) => {
        const prev = pIdx === 0 ? pointer : trail[pIdx - 1];
        const spring = pIdx === 0 ? .4 * params.spring : params.spring;
        p.dx += (prev.x - p.x) * spring;
        p.dy += (prev.y - p.y) * spring;
        p.dx *= params.friction;
        p.dy *= params.friction;
        p.x += p.dx;
        p.y += p.dy;
    });

    ctx.strokeStyle = "#a1a1a1"

    ctx.lineCap = "round";
	 ctx.beginPath();
    ctx.moveTo(trail[0].x, trail[0].y);

    for (let i = 1; i < trail.length - 1; i++) {
        const xc = .5 * (trail[i].x + trail[i + 1].x);
        const yc = .5 * (trail[i].y + trail[i + 1].y);
        ctx.quadraticCurveTo(trail[i].x, trail[i].y, xc, yc);
        ctx.lineWidth = params.widthFactor * (params.pointsNumber - i);
        ctx.stroke();
    }
    ctx.lineTo(trail[trail.length - 1].x, trail[trail.length - 1].y);
    ctx.stroke();
    
    window.requestAnimationFrame(update);
}

function setupCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

const botoes = document.querySelectorAll('.btn--1');

function formatPhone(input) {
    let value = input.value.replace(/\D/g, '');

    if (value.length > 11) {
        value = value.substring(0, 11);
    }

    if (value.length > 6) {
        input.value = `(${value.substring(0, 2)}) ${value.substring(2, 7)}-${value.substring(7)}`;
    } else if (value.length > 2) {
        input.value = `(${value.substring(0, 2)}) ${value.substring(2)}`;
    } else {
        input.value = value;
    }
}

const emailInput = document.getElementById('email');
const emailSuggestions = document.getElementById('email-suggestions');

const emailDomains = ['gmail.com', 'outlook.com', 'yahoo.com', 'hotmail.com', 'icloud.com'];

emailInput.addEventListener('input', function () {
    const value = emailInput.value;
    const atIndex = value.indexOf('@');
    
    if (atIndex !== -1) {
        const username = value.substring(0, atIndex);
        const typedDomain = value.substring(atIndex + 1).toLowerCase();

        emailSuggestions.innerHTML = '';

        emailDomains
            .filter(domain => domain.startsWith(typedDomain))
            .forEach(domain => {
                const option = document.createElement('option');
                option.value = `${username}@${domain}`;
                emailSuggestions.appendChild(option);
            });
    } else {
        emailSuggestions.innerHTML = '';
    }
});

const submitButton = document.getElementById('submitButton');
const limparButton = document.querySelector('.limpar');
const form = document.querySelector('form');

submitButton.addEventListener('click', function (event) {
    event.preventDefault(); // impede o envio padrão do formulário ja que o botão ta dentro do form

    // verifica se todos os campos obrigatórios estão preenchidos
    if (form.checkValidity()) {
        submitButton.classList.add('btn-verde'); // adc classe verde
        alert("Formulário enviado!");
        setTimeout(() => {
            location.reload(); // reload na pag
        }, 2000);
    } else {
        alert("Por favor, preencha todos os campos obrigatórios.");
    }
});

limparButton.addEventListener('click', function () {
    event.preventDefault();
    limparButton.classList.add('btn-vermelho'); // adc classe vermelha
    setTimeout(() => {
        location.reload(); // da reload na pag
    }, 1000);
});
