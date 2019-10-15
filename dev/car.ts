class Car {

  public _element:HTMLElement;

  public gasmeterElement:HTMLElement;
  public gasmeterElementInner:HTMLElement;
  public gas:number = 0;

  private y:number = -300;

  public tires:Tire[] = [];

  public done:boolean = false;

  public constructor() {
    // Create car element.
    this._element = document.createElement('div');
    this._element.classList.add('car');
    document.body.appendChild(this._element);

    // Create gasmeter elements.
    this.gasmeterElement = document.createElement('div');
    this.gasmeterElement.classList.add('car-gasmeter');
    this._element.appendChild(this.gasmeterElement);

    this.gasmeterElementInner = document.createElement('div');
    this.gasmeterElementInner.classList.add('car-gasmeter-inner');
    this.gasmeterElement.appendChild(this.gasmeterElementInner);
  }

  /**
   * Move the car into place.
   */
  public enter() {
    if (this.y < 300) {
      this.y += 50;
      this._element.style.top = this.y + 'px';
    }
  }

  /**
   * Remove the car from the view and set car as DONE.
   */
  private leave() {
    if (this.y < 1200) {
      this.y += 50;
      this._element.style.top = this.y + 'px';
    }
    else {
      this._element.remove();
      this.done = true;
    }
  }

  /**
   * Runs every game tick.
   */
  public update() {
    if (this.tires.length !== 4 || this.gas <= 50) {
      this.enter();
    }
    else {
      this.leave();
    }

    this.gasmeterElementInner.style.height = this.gas + 'px';
    
    const red = 100;
    const green = this.gas * 5;
    this.gasmeterElementInner.style.backgroundColor = `rgba(${red}, ${green}, 0, 1)`
  }

  /**
   * Add tire to the car.
   * 
   * @param {Tire} tire 
   */
  public addTire(tire:Tire) {
    this.tires.push(tire);
  }

  /**
   * Increase amount of gas.
   */
  public fill() {
    this.gas ++;
  }

}