class Tire {

  public _element:HTMLElement;

  public constructor() {
    this._element = document.createElement('div');
    this._element.classList.add('tire');
    document.getElementById('tirerack').appendChild(this._element);
  }

  /**
   * Runs if the player has grabbed the tire from the tirerack.
   */
  public grabbed() {
    this._element.remove();
  }

}