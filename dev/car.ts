class Car {

  public _element:HTMLElement;

  private y:number = -300;

  public tires:Tire[] = [];

  public done:boolean = false;

  public constructor() {
    this._element = document.createElement('div');
    this._element.classList.add('car');
    document.body.appendChild(this._element);
  }

  public enter() {
    if (this.y < 300) {
      this.y += 50;
      this._element.style.top = this.y + 'px';
    }
  }

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

  public update() {
    if (this.tires.length !== 4) {
      this.enter();
    }
    else {
      this.leave();
    }
  }

  public addTire(tire:Tire) {
    this.tires.push(tire);
  }

}