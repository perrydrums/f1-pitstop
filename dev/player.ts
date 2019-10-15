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

  /**
   * Runs every game tick.
   */
  public update():void {
    // Movement.
    this._element.style.transform = `translate(${this.posX += this.speedX}px, ${this.posY += this.speedY}px)`;

    // Tire collision detection.
    const tires = Game.getInstance().tires;
    for (let i = 0; i < tires.length; i ++) {
      if (this.isCollision(tires[i]._element)) {
        if (!this.currentTire) {
          tires[i].grabbed();
          this.currentTire = tires[i];
        }
      }
    }

    // Car collision detection.
    const car = Game.getInstance()._car;
    if (car) {
      if (this.isCollision(car._element)) {
        if (this.currentTire) {
          car.addTire(this.currentTire);
          this.currentTire = null;
        }
      }
    }

    // Check for tire.
    this.currentTire ? this._element.classList.add('has-tire') : this._element.classList.remove('has-tire');
  }

  /**
   * Set speed when holding down arrow keys.
   * 
   * @param KeyboardEvent e 
   */
  private onKeyDown(e:KeyboardEvent):void {
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

  /**
   * Set speed to 0 when letting go of the arrow keys.
   * 
   * @param KeyboardEvent e
   */
  private onKeyUp(e:KeyboardEvent):void {
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

  /**
   * Checks if there's a collision between the class' HTMLElement and the HTMLElement in the parameter.
   * 
   * @param HTMLElement element 
   * 
   * @return boolean
   */
  private isCollision(element:HTMLElement):boolean {
    if (
      this._element.getBoundingClientRect().left < element.getBoundingClientRect().right &&
      this._element.getBoundingClientRect().right > element.getBoundingClientRect().left &&
      this._element.getBoundingClientRect().bottom > element.getBoundingClientRect().top &&
      this._element.getBoundingClientRect().top < element.getBoundingClientRect().bottom
    ) {
      return true;
    }

    return false;
  }

}