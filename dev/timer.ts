class Timer {

  private element:HTMLElement;
  private startTime:number;
  private time:number = 0;
  private fastestTime:number = 0;
  private running:boolean = false;
  private interval:number;

  public constructor() {
    this.element = document.getElementById('timer');
  }

  /**
   * Update the timer's HTML.
   */
  public update() {
    this.element.innerHTML = this.formatTime(this.time) + '<p>' + this.formatTime(this.fastestTime) + '</p>';
  }

  /**
   * Start the timer.
   */
  public start() {
    if (!this.running) {
      this.startTime = new Date().getTime();
      this.interval = setInterval(() => this.count(), 10);
      this.running = true;
    }
  }

  /**
   * Stop the timer and save fastest time.
   */
  public stop() {
    if (this.running) {
      clearInterval(this.interval);
      this.running = false;
      if (this.fastestTime === 0 || this.fastestTime > this.time) {
        this.fastestTime = this.time;
      }
    }
  }

  /**
   * Add time.
   */
  private count() {
    this.time = new Date().getTime() - this.startTime;
  }

  /**
   * Format milliseconds to readable time.
   * 
   * @param {number} milliseconds 
   * 
   * @returns {string}
   */
  private formatTime(milliseconds:number):string {
    let millis = (milliseconds % 1000).toString();
    let seconds = (Math.floor(milliseconds / 1000) % 60).toString();
    let minutes = (Math.floor(milliseconds / 1000 / 60)).toString();

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

    return `${minutes}:${seconds}:${millis}`;
  }

}