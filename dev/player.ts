class Player {

  private _element:HTMLElement;

  private speedX:number = 0;
  private speedY:number = 0;

  private posX:number = 0;
  private posY:number = 0;

  private currentTire:Tire;

  public constructor() {
    this._element = document.createElement('div');
    this._element.classList.add('player');
    document.body.appendChild(this._element);

    window.addEventListener('keydown', (e:KeyboardEvent) => this.onKeyDown(e));
    window.addEventListener("keyup", (e:KeyboardEvent) => this.onKeyUp(e));
  }

  public update() {
    // Movement.
    this._element.style.transform = `translate(${this.posX += this.speedX}px, ${this.posY += this.speedY}px)`;

    // Tire collision detection.
    const tires = Game.getInstance().tires;
    for (let i = 0; i < tires.length; i ++) {
      if (
        this._element.getBoundingClientRect().left < tires[i]._element.getBoundingClientRect().right &&
        this._element.getBoundingClientRect().right > tires[i]._element.getBoundingClientRect().left &&
        this._element.getBoundingClientRect().bottom > tires[i]._element.getBoundingClientRect().top &&
        this._element.getBoundingClientRect().top < tires[i]._element.getBoundingClientRect().bottom
      ) {
        if (!this.currentTire) {
          tires[i].grabbed();
          this.currentTire = tires[i];
        }
      }
    }

    // Car collision detection.
    const car = Game.getInstance()._car;
    if (car) {
      if (
        this._element.getBoundingClientRect().left < car._element.getBoundingClientRect().right &&
        this._element.getBoundingClientRect().right > car._element.getBoundingClientRect().left &&
        this._element.getBoundingClientRect().bottom > car._element.getBoundingClientRect().top &&
        this._element.getBoundingClientRect().top < car._element.getBoundingClientRect().bottom
      ) {
        if (this.currentTire) {
          car.addTire(this.currentTire);
          this.currentTire = null;
        }
      }
    }

    // Check for tire.
    if (this.currentTire) {
      this._element.classList.add('has-tire');
    }
    else {
      this._element.classList.remove('has-tire');
    }
  }

  private onKeyDown(e:KeyboardEvent) {
    switch(e.keyCode){
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
  }

  private onKeyUp(e:KeyboardEvent) {
    switch(e.keyCode){
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
  }

}