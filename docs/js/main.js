"use strict";
var Car = (function () {
    function Car() {
        this.y = -300;
        this.tires = [];
        this.done = false;
        this._element = document.createElement('div');
        this._element.classList.add('car');
        document.body.appendChild(this._element);
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
        if (this.tires.length !== 4) {
            this.enter();
        }
        else {
            this.leave();
        }
    };
    Car.prototype.addTire = function (tire) {
        this.tires.push(tire);
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
    }
    return Gas;
}());
var Player = (function () {
    function Player() {
        var _this = this;
        this.speedX = 0;
        this.speedY = 0;
        this.posX = 0;
        this.posY = 0;
        this._element = document.createElement('div');
        this._element.classList.add('player');
        document.body.appendChild(this._element);
        window.addEventListener('keydown', function (e) { return _this.onKeyDown(e); });
        window.addEventListener("keyup", function (e) { return _this.onKeyUp(e); });
    }
    Player.prototype.update = function () {
        this._element.style.transform = "translate(" + (this.posX += this.speedX) + "px, " + (this.posY += this.speedY) + "px)";
        var tires = Game.getInstance().tires;
        for (var i = 0; i < tires.length; i++) {
            if (this.isCollision(tires[i]._element)) {
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
        this.currentTire ? this._element.classList.add('has-tire') : this._element.classList.remove('has-tire');
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
        }
    };
    Player.prototype.onKeyUp = function (e) {
        switch (e.keyCode) {
            case 37:
                this.speedX = 0;
                break;
            case 38:
                this.speedY = 0;
                break;
            case 40:
                this.speedY = 0;
                break;
            case 39:
                this.speedX = 0;
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