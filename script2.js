document.getElementById("startButton").addEventListener("click", function () {
    document.getElementById("startScreen").style.display = "none";
    document.getElementById("roseCanvas").style.display = "block";
    document.getElementById("valentineText").style.display = "block";

    let music = document.getElementById("backgroundMusic");
    music.play().catch(error => console.log("Autoplay blocked:", error));

    init(); // Start the rose animation
    animate();
});


const canvas = document.getElementById("roseCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const roses = [];
let mouse = { x: null, y: null };

class Rose {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = 2;
        this.bloomRate = Math.random() * 0.2 + 0.05;
        this.opacity = 0;
        this.speedX = (Math.random() - 0.5) * 1;
        this.speedY = (Math.random() - 0.5) * 1;
        this.attractionForce = 0.05;
        this.petals = [];
        this.defaultPetalCount = 6 + Math.floor(Math.random() * 6);
        this.currentPetalCount = this.defaultPetalCount;
        this.createPetals();
        this.clicked = false;
        this.clickTimer = 0;
        this.gradientIndex = 0;
        this.gradients = [
            ["rgba(255, 50, 50, 1)", "rgba(180, 0, 0, 1)"],
            ["rgba(255, 80, 80, 1)", "rgba(200, 20, 20, 1)"],
            ["rgba(255, 120, 120, 1)", "rgba(220, 40, 40, 1)"]
        ];
    }

    createPetals() {
        this.petals = [];
        for (let i = 0; i < this.currentPetalCount; i++) {
            let angle = (Math.PI * 2 * i) / this.currentPetalCount;
            let delay = Math.random() * 50;
            this.petals.push({ angle, sizeFactor: 0, delay });
        }
    }

    draw() {
        ctx.save();
        ctx.translate(this.x, this.y);

        // Draw petals
        this.petals.forEach((petal, index) => {
            if (petal.delay > 0) {
                petal.delay -= 1;
            } else {
                petal.sizeFactor += 0.02;
                if (petal.sizeFactor > 1) petal.sizeFactor = 1;
            }

            let angle = petal.angle;
            let sizeFactor = petal.sizeFactor;
            let growthFactor = this.clicked ? 1.5 : 1;
            let petalSize = this.size * sizeFactor * 2 * growthFactor;

            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.bezierCurveTo(
                Math.cos(angle - 0.3) * petalSize,
                Math.sin(angle - 0.3) * petalSize * 0.6,
                Math.cos(angle + 0.3) * petalSize,
                Math.sin(angle + 0.3) * petalSize * 0.6,
                Math.cos(angle) * petalSize,
                Math.sin(angle) * petalSize
            );
            ctx.closePath();

            let gradient = ctx.createRadialGradient(
                0, 0, 5,
                Math.cos(angle) * petalSize * 0.7,
                Math.sin(angle) * petalSize * 0.7,
                petalSize
            );

            let colors = this.gradients[this.gradientIndex];
            gradient.addColorStop(0, colors[0]);
            gradient.addColorStop(1, colors[1]);

            ctx.fillStyle = gradient;
            ctx.fill();
        });

        // Draw flower center
        ctx.beginPath();
        ctx.arc(0, 0, this.size / 6, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255, 200, 0, 1)";
        ctx.fill();
        ctx.closePath();

        ctx.restore();
    }

    update() {
        if (this.size < 40) {
            this.size += this.bloomRate;
        }
        if (this.opacity < 1) {
            this.opacity += 0.02;
        }

        // Attraction effect towards cursor
        if (mouse.x !== null && mouse.y !== null) {
            let dx = mouse.x - this.x;
            let dy = mouse.y - this.y;
            let distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 200) {
                this.speedX += dx * this.attractionForce / distance;
                this.speedY += dy * this.attractionForce / distance;
            }
        }

        this.x += this.speedX;
        this.y += this.speedY;

        // Bounce off edges
        if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
        if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;

        // Handle clicking effect
        if (this.clicked) {
            this.clickTimer++;
            if (this.clickTimer < 50) {
                this.currentPetalCount = this.defaultPetalCount + Math.floor(this.clickTimer / 10);
                this.createPetals();
            }
            if (this.clickTimer > 100) {
                this.clicked = false;
                this.currentPetalCount = this.defaultPetalCount;
                this.createPetals();
                this.gradientIndex = 0;
                this.clickTimer = 0;
            }
        }
    }

    checkClick(x, y) {
        let distance = Math.sqrt((x - this.x) ** 2 + (y - this.y) ** 2);
        if (distance < this.size / 6) {
            this.clicked = true;
            this.clickTimer = 0;
            this.gradientIndex = (this.gradientIndex + 1) % this.gradients.length;
        }
    }
}

function init() {
    for (let i = 0; i < 15; i++) {
        let x = Math.random() * canvas.width;
        let y = Math.random() * canvas.height;
        roses.push(new Rose(x, y));
    }
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    roses.forEach(rose => {
        rose.update();
        rose.draw();
    });

    requestAnimationFrame(animate);
}

canvas.addEventListener("mousemove", (event) => {
    mouse.x = event.clientX;
    mouse.y = event.clientY;
});

canvas.addEventListener("mouseleave", () => {
    mouse.x = null;
    mouse.y = null;
});

canvas.addEventListener("click", (event) => {
    let clickX = event.clientX;
    let clickY = event.clientY;
    roses.forEach(rose => {
        rose.checkClick(clickX, clickY);
    });
});

init();
animate();
