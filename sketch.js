let bolaImagem;
let jogadorImagem;
let computadorImagem;
let fundoImagem;
let quicarSom;
let golSom;

let pontosJogador = 0;
let pontosComputador = 0;

class Raquete {
	constructor(x) {
		this.x = x;
		this.y = height / 2;
		this.w = 10;
		this.h = 60;
	}

	update() {
		if (this.x < width / 2) {
			this.y = mouseY;
		} else {
			if (this.y > bola.y) {
				this.y -= 3;
			} else {
				this.y += 3;
			}
		}

		if (this.y < 0) {
			this.y = 0;
		}
		if (this.y > height - this.h) {
			this.y = height - this.h;
		}
	}

	desenha() {
		if (this.x < width / 2) {
			image(jogadorImagem, this.x, this.y, this.w, this.h);
		} else {
			image(computadorImagem, this.x, this.y, this.w, this.h);
		}
	}
}

class Bola {
	constructor() {
		this.r = 12;
		this.reset();
	}
	
	reset() {
		this.x = width / 2;
		this.y = height / 2;
		const velocidadeMaxima = 5
		this.vx = Math.random() * velocidadeMaxima * 2 - velocidadeMaxima;
		this.vy = Math.random() * velocidadeMaxima * 2 - velocidadeMaxima;
		this.angulo = 0;

  }

  update() {
		this.x += this.vx;
		this.y += this.vy;
		
		this.angulo += Math.sqrt(this.vx * this.vx + this.vy * this.vy) / 20;

		if (this.x < this.r || this.x > width - this.r) {
			if(this.x < this.r) {
				pontosComputador++;
			} else {
				pontosJogador++;
			}
			falaPontos();
			golSom.play();
			 this.reset();
		}
		if (this.y < this.r || this.y > height - this.r) {
			 this.vy *= -1;
		}

		if (colideRantanguloCirculo(this.x, this.y, this.r, jogador.x, jogador.y, jogador.w, jogador.h) ||
			colideRantanguloCirculo(this.x, this.y, this.r, computador.x, computador.y, computador.w, computador.h)
		) {
			quicarSom.play();
			this.vx *= -1;
			this.vx *= 1.1;
			this.vy *= 1.1;
		}
  }

  desenha() {
		push();
		translate(this.x, this.y);
		rotate(this.angulo);
		imageMode(CENTER);
		image(bolaImagem, 0, 0, this.r * 2, this.r * 2);
		pop();
  }
}

function colideRantanguloCirculo(cx, cy, raio, x, y, w, h) {
	if(cx + raio < x || cx - raio > x + w) {
		return false;
	}
	if(cy + raio < y || cy - raio > y + h) {
		return false;
	}
	return true;
}

let bola;
let jogador;
let computador;

function falaPontos() {
	if("speechSynthesis" in window) {
		const pontuacao = "A pontuação é " + pontosJogador + " a " + pontosComputador;
		const	msg = new SpeechSynthesisUtterance(pontuacao);
		msg.lang = 'pt-BR';
		window.speechSynthesis.speak(msg);
	}
}

function preload() {
	bolaImagem = loadImage("./sprites/bola.png");
	jogadorImagem = loadImage("./sprites/barra01.png");
	computadorImagem = loadImage("./sprites/barra02.png");
	fundoImagem = loadImage("./sprites/fundo2.png");
	quicarSom = loadSound("./sounds/bounce.wav");
	golSom = loadSound("./sounds/point.wav");
}

function	setup() {
	createCanvas(800, 400);
	background(255);
	bola = new Bola();
	jogador = new Raquete(30);
	computador = new Raquete(width - 30 - 10);
}

function	draw() {
	let canvasAspectRatio = width / height;
   let fundoAspectRatio = fundoImagem.width / fundoImagem.height;
   let zoom = 1;
   if (canvasAspectRatio > fundoAspectRatio) {
       zoom = width / fundoImagem.width;
   } else {
       zoom = height / fundoImagem.height;
   }
   let scaledWidth = fundoImagem.width * zoom;
   let scaledHeight = fundoImagem.height * zoom;
   image(fundoImagem, (width - scaledWidth) / 2, (height - scaledHeight) / 2, scaledWidth, scaledHeight);
	
	bola.update();
	bola.desenha();
	jogador.update();
	jogador.desenha();
	computador.update();
	computador.desenha();
}