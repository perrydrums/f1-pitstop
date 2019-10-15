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
        if (this.tires.length !== 4 || this.gas <= 100) {
            this.enter();
        }
        else {
            this.leave();
        }
        this.gasmeterElementInner.style.height = (this.gas / 2) + 'px';
    };
    Car.prototype.addTire = function (tire) {
        this.tires.push(tire);
    };
    Car.prototype.fill = function () {
        this.gas++;
    };
    return Car;
}());
var Game = (function () {
    function Game() {
        this._fps = 30;
        this._carTime = 0;
        this.tires = [];
        this._fpsInterval = 1000 / this._fps;
        this._then = Date.now();
        this.spawnTires();
        this.player = new Player();
        this.gasmeter = new Gas();
        this.gameLoop();
    }
    Game.getInstance = function () {
        if (!this._instance) {
            this._instance = new Game();
        }
        return this._instance;
    };
    Game.prototype.gameLoop = function () {
        var _this = this;
        requestAnimationFrame(function () { return _this.gameLoop(); });
        var now = Date.now();
        var elapsed = now - this._then;
        if (elapsed > this._fpsInterval) {
            this.player.update();
            this.gasmeter.update();
            this.checkCar();
            this._then = now - (elapsed % this._fpsInterval);
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
    }
    Player.prototype.update = function () {
        this._element.style.transform = "translate(" + (this.posX += this.speedX) + "px, " + (this.posY += this.speedY) + "px)";
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