export default class ClockClock {
  constructor({ element } = {}) {
    this.canvas = document.createElement("canvas");
    this.ctx = this.canvas.getContext("2d");
    element.appendChild(this.canvas);
    this.canvas.height = 480;
    this.canvas.width = 320;

    let seg = new Segment();
    seg.draw(this.ctx);

    seg.set([
      [1, 1, 1, 1],
      [1, 0, 0, 1],
      [1, 0, 0, 1],
      [1, 0, 0, 1],
      [1, 0, 0, 1],
      [1, 1, 1, 1],
    ]);
  }
}

class Segment {
  constructor({ raduis = 40, pos = { x: 0, y: 0 } } = {}) {
    this.raduis = raduis;
    this.pos = pos;
    this.clocks = [];

    //create seg array

    for (let y = 0; y < 6; y++) {
      let row = [];

      for (let x = 0; x < 4; x++) {
        row.push(
          new Clock({
            pos: {
              x: x * this.raduis + x * this.raduis + this.raduis,
              y: y * this.raduis + y * this.raduis + this.raduis,
            },
            raduis,
          })
        );
      }
      this.clocks.push(row);
    }
  }
  draw(ctx) {
    this.clocks.forEach((row) => {
      row.forEach((clock) => {
        clock.draw(ctx);
      });
    });
  }
}

class Clock {
  constructor({
    pos = { x: 0, y: 0 },
    raduis = 40,
    dials = [Math.floor(Math.random() * 360), Math.floor(Math.random() * 360)],
  } = {}) {
    this.pos = pos;
    this.raduis = raduis;
    this.dials = dials;
  }
  draw(ctx) {
    /**
     * circumferance
     */
    ctx.beginPath();
    ctx.arc(this.pos.x, this.pos.y, this.raduis, 0, 2 * Math.PI);
    ctx.stroke();
    /**
     * dials
     */
    this.dials.forEach((dial) => {
      ctx.moveTo(this.pos.x, this.pos.y);
      ctx.lineTo(
        this.pos.x + Math.cos((Math.PI / 180.0) * (dial - 90)) * this.raduis,
        this.pos.y + Math.sin((Math.PI / 180.0) * (dial - 90)) * this.raduis
      );
      ctx.stroke();
    });
  }
}
