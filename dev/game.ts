class Game {

  private static _instance:Game;

  /**
   * The speed, in frames per second, the game runs at.
   */
  private _fps:number = 30;

  private _fpsInterval:number;

  private _then:number;

  public _car:Car;

  private _carTime:number = 0;

  public tires:Tire[] = [];

  private player:Player;

  public gasmeter:Gas;

  public timer:Timer;

  /**
   * Make the constructor private.
   */
  private constructor() {
      this._fpsInterval = 1000 / this._fps;
      this._then = Date.now();

      this.spawnTires();

      this.player = new Player();
      this.gasmeter = new Gas();
      this.timer = new Timer();

      this.gameLoop();
  }

  /**
   * There can always only be one Game instance.
   * 
   * @returns {Game}
   */
  public static getInstance() {
      if (!this._instance) {
         this._instance = new Game();
      }
      return this._instance;
  }
  
  /**
   * Runs approx. {this._fps} times a second.
   */
  gameLoop() {
      requestAnimationFrame(() => this.gameLoop());

      // Calculate elapsed time.
      const now = Date.now();
      const elapsed = now - this._then;
   
      // If enough time has elapsed, draw the next frame.
      if (elapsed > this._fpsInterval) {
        this.player.update();
        this.gasmeter.update();
        this.timer.update();

        // Every minute spawn a new car.
        this.checkCar();
          
        // Get ready for next frame by setting then=now, but...
        // Also, adjust for fpsInterval not being multiple of 16.67
        this._then = now - (elapsed % this._fpsInterval);
      }
  }

  private spawnTires() {
    for (let i = 0; i < 4; i ++) {
      this.tires.push(new Tire());
    }
  }

  private checkCar() {
    if (this._carTime > this._fps * 5) {
      if (!this._car) {
        this._car = new Car();
        this.timer.start();
      }
      this._carTime = 0;
    }
    this._carTime ++;

    if (this._car) {
      this._car.update();

      if (this._car.done) {
        this._car = null;
        this.spawnTires();
        this.gasmeter.reset();
        this.timer.stop();
      }
    }
    
  }

}

window.addEventListener("load", () => {
  Game.getInstance()
});