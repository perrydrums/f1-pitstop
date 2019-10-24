"use strict";
var Car = (function () {
    function Car() {
        this.gas = 0;
        this.y = -300;
        this.tires = [];
        this.done = false;
        this._element = document.createElement('div');
        this._element.classList.add('car');
        document.body.appendChild(this._element);
        this.gasmeterElement = document.createElement('div');
        this.gasmeterElement.classList.add('car-gasmeter');
        this._element.appendChild(this.gasmeterElement);
        this.gasmeterElementInner = document.createElement('div');
        this.gasmeterElementInner.classList.add('car-gasmeter-inner');
        this.gasmeterElement.appendChild(this.gasmeterElementInner);
    }
    Car.prototype.enter = function () {
        if (this.y < 300) {
            this.y += 50;
            this._element.style.top = this.y + 'px';
        }
    };
    Car.prototype.leave = function () {
        if (this.y < 1200) {
            this.y += 50;
            this._element.style.top = this.y + 'px';
        }
        else {
            this._element.remove();
            this.done = true;
        }
    };
    Car.prototype.update = function () {
        if (this.tires.length !== 4 || this.gas <= 50) {
            this.enter();
        }
        else {
            this.leave();
        }
        this.gasmeterElementInner.style.height = this.gas + 'px';
        var red = 100;
        var green = this.gas * 5;
        this.gasmeterElementInner.style.backgroundColor = "rgba(" + red + ", " + green + ", 0, 1)";
    };
    Car.prototype.addTire = function (tire) {
        this.tires.push(tire);
    };
    Car.prototype.fill = function () {
        this.gas++;
    };
    return Car;
}());
var Dialog = (function () {
    function Dialog() {
        this.overlay = document.createElement('div');
        this.overlay.classList.add('overlay');
        document.body.appendChild(this.overlay);
        this.element = document.createElement('div');
        this.element.classList.add('dialog');
        this.element.classList.add('dialog-start');
        document.body.appendChild(this.element);
    }
    Dialog.getInstance = function () {
        if (!this._instance) {
            this._instance = new Dialog();
        }
        return this._instance;
    };
    Dialog.prototype.setHTML = function (html) {
        this.element.innerHTML = html;
    };
    Dialog.prototype.addButton = function () {
        this.button = document.createElement('button');
        this.button.innerText = 'START';
        this.button.onclick = function () { Dialog.getInstance().startGame(); };
        this.element.appendChild(this.button);
    };
    Dialog.prototype.startGame = function () {
        Game.getInstance().startGame();
        this.element.remove();
        this.overlay.remove();
    };
    return Dialog;
}());
var Game = (function () {
    function Game() {
        this._fps = 30;
        this._carTime = 0;
        this.tires = [];
        this.running = false;
        this._fpsInterval = 1000 / this._fps;
        this._then = Date.now();
        this.spawnTires();
        this.player = new Player();
        this.gasmeter = new Gas();
        this.timer = new Timer();
        this.gameLoop();
    }
    Game.getInstance = function () {
        if (!this._instance) {
            this._instance = new Game();
        }
        return this._instance;
    };
    Game.prototype.startGame = function () {
        this.running = true;
    };
    Game.prototype.gameLoop = function () {
        var _this = this;
        requestAnimationFrame(function () { return _this.gameLoop(); });
        var now = Date.now();
        var elapsed = now - this._then;
        if (this.running) {
            if (elapsed > this._fpsInterval) {
                this.player.update();
                this.gasmeter.update();
                this.timer.update();
                this.checkCar();
                this._then = now - (elapsed % this._fpsInterval);
            }
        }
        else {
            if (!this.dialog) {
                this.dialog = Dialog.getInstance();
                this.dialog.setHTML('<h1>KMar F1 - Pitstop</h1>' +
                    '<p>Jij bent verantwoordelijk voor de pitstop. Probeer de snelste tijd neer te zetten.</p>' +
                    '<p>Beweeg met de pijltjestoetsen en pak spullen vast met de spatiebalk.</p>' +
                    '<p>Zet de banden op de auto en vul de auto met benzine.</p>');
                this.dialog.addButton();
            }
        }
    };
    Game.prototype.spawnTires = function () {
        for (var i = 0; i < 4; i++) {
            this.tires.push(new Tire());
        }
    };
    Game.prototype.checkCar = function () {
        if (this._carTime > this._fps * 5) {
            if (!this._car) {
                this._car = new Car();
                this.timer.start();
            }
            this._carTime = 0;
        }
        this._carTime++;
        if (this._car) {
            this._car.update();
            if (this._car.done) {
                this._car = null;
                this.spawnTires();
                this.gasmeter.reset();
                this.timer.stop();
            }
        }
    };
    return Game;
}());
window.addEventListener("load", function () {
    Game.getInstance();
});
var Gas = (function () {
    function Gas() {
        this.element = document.getElementById('game-gasmeter');
        this.amount = 100;
    }
    Gas.prototype.update = function () {
        var height = (this.amount * 4.8) + 'px';
        var innerElement = document.getElementById('game-gasmeter-inner');
        innerElement.style.height = height;
    };
    Gas.prototype.drain = function () {
        this.amount--;
    };
    Gas.prototype.reset = function () {
        this.amount = 100;
    };
    return Gas;
}());
var Player = (function () {
    function Player() {
        var _this = this;
        this.flipped = false;
        this.speedX = 0;
        this.speedY = 0;
        this.posX = 0;
        this.posY = 0;
        this.hasGasoline = false;
        this._element = document.createElement('div');
        this._element.classList.add('player');
        document.body.appendChild(this._element);
        window.addEventListener('keydown', function (e) { return _this.onKeyDown(e); });
        window.addEventListener('keyup', function (e) { return _this.onKeyUp(e); });
        setInterval(function () {
            _this.flipped = !_this.flipped;
        }, 500);
    }
    Player.prototype.update = function () {
        var scaleX = this.flipped ? '-1' : '1';
        this._element.style.transform = "translate(" + (this.posX += this.speedX) + "px, " + (this.posY += this.speedY) + "px) scaleX(" + scaleX + ")";
        this.currentTire ? this._element.classList.add('has-tire') : this._element.classList.remove('has-tire');
        this.hasGasoline ? this._element.classList.add('has-gasoline') : this._element.classList.remove('has-gasoline');
    };
    Player.prototype.onKeyDown = function (e) {
        switch (e.keyCode) {
            case 37:
                this.speedX = -15;
                break;
            case 38:
                this.speedY = -15;
                break;
            case 40:
                this.speedY = 15;
                break;
            case 39:
                this.speedX = 15;
                break;
            case 32:
                this.interactHold();
                break;
        }
    };
    Player.prototype.onKeyUp = function (e) {
        switch (e.keyCode) {
            case 37:
            case 39:
                this.speedX = 0;
                break;
            case 38:
            case 40:
                this.speedY = 0;
                break;
            case 32:
                this.interact();
                break;
        }
    };
    Player.prototype.isCollision = function (element) {
        if (this._element.getBoundingClientRect().left < element.getBoundingClientRect().right &&
            this._element.getBoundingClientRect().right > element.getBoundingClientRect().left &&
            this._element.getBoundingClientRect().bottom > element.getBoundingClientRect().top &&
            this._element.getBoundingClientRect().top < element.getBoundingClientRect().bottom) {
            return true;
        }
        return false;
    };
    Player.prototype.interact = function () {
        var gasoline = document.getElementById('gasoline');
        if (this.isCollision(gasoline) && !this.currentTire) {
            this.hasGasoline = !this.hasGasoline;
        }
        var tires = Game.getInstance().tires;
        for (var i = 0; i < tires.length; i++) {
            if (this.isCollision(tires[i]._element) && !this.hasGasoline) {
                if (!this.currentTire) {
                    tires[i].grabbed();
                    this.currentTire = tires[i];
                }
            }
        }
        var car = Game.getInstance()._car;
        if (car) {
            if (this.isCollision(car._element)) {
                if (this.currentTire) {
                    car.addTire(this.currentTire);
                    this.currentTire = null;
                }
            }
        }
    };
    Player.prototype.interactHold = function () {
        var car = Game.getInstance()._car;
        var gasmeter = Game.getInstance().gasmeter;
        if (car && this.hasGasoline) {
            if (this.isCollision(car._element)) {
                gasmeter.drain();
                car.fill();
            }
        }
    };
    return Player;
}());
var Timer = (function () {
    function Timer() {
        this.time = 0;
        this.fastestTime = 0;
        this.running = false;
        this.element = document.getElementById('timer');
    }
    Timer.prototype.update = function () {
        this.element.innerHTML = this.formatTime(this.time) + '<p>' + this.formatTime(this.fastestTime) + '</p>';
    };
    Timer.prototype.start = function () {
        var _this = this;
        if (!this.running) {
            this.startTime = new Date().getTime();
            this.interval = setInterval(function () { return _this.count(); }, 10);
            this.running = true;
        }
    };
    Timer.prototype.stop = function () {
        if (this.running) {
            clearInterval(this.interval);
            this.running = false;
            if (this.fastestTime === 0 || this.fastestTime > this.time) {
                this.fastestTime = this.time;
            }
        }
    };
    Timer.prototype.count = function () {
        this.time = new Date().getTime() - this.startTime;
    };
    Timer.prototype.formatTime = function (milliseconds) {
        var millis = (milliseconds % 1000).toString();
        var seconds = (Math.floor(milliseconds / 1000) % 60).toString();
        var minutes = (Math.floor(milliseconds / 1000 / 60)).toString();
        if (millis.length === 1) {
            millis = '00' + millis;
        }
        else if (millis.length === 2) {
            millis = '0' + millis;
        }
        if (seconds.length === 1) {
            seconds = '0' + seconds;
        }
        if (minutes.length === 1) {
            minutes = '0' + minutes;
        }
        return minutes + ":" + seconds + ":" + millis;
    };
    return Timer;
}());
var Tire = (function () {
    function Tire() {
        this._element = document.createElement('div');
        this._element.classList.add('tire');
        document.getElementById('tirerack').appendChild(this._element);
    }
    Tire.prototype.grabbed = function () {
        this._element.remove();
    };
    return Tire;
}());
//# sourceMappingURL=main.js.map