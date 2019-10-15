class Gas {

  public element:HTMLElement;

  public amount:number;

  public constructor() {
    this.element = document.getElementById('game-gasmeter');
    this.amount = 100;
  }

  public update() {
    // Update the game gasmeter element.
    // Do the amount of gas * 4.8 to match the element height.
    const height = (this.amount * 4.8) + 'px';
    const innerElement = document.getElementById('game-gasmeter-inner');
    innerElement.style.height = height;
  }

  public drain() {
    this.amount --;
  }

  public reset() {
    this.amount = 100;
  }

}