export default class ClockClock {
  constructor({ element } = {}) {
    this.canvas = document.createElement("canvas");
    this.ctx = this.canvas.getContext("2d");
    element.appendChild(this.canvas);
    this.canvas.height = 480;
    this.canvas.width = 320;

    let seg = new Segment();

    // seg.set("111101101101111"); //0
    // seg.set("110010010010111"); //1
    // seg.set("111001111100111"); //2
    // seg.set("111001111001111"); //3
    // seg.set("101101111001001"); //4
    // seg.set("111100111001111"); //5
    // seg.set("111100111101111"); //6
    // seg.set("111101001001001"); //7
    // seg.set("111101111101111"); //8
    // seg.set("111101111001111"); //9

    seg.draw(this.ctx);
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
  set(serialised) {
    let arr = serialised.match(/.{1,3}/g).map((row) => {
      return row.match(/.{1}/g);
    });
    for (let y = 0; y < arr.length; y++) {
      const row = arr[y];
      for (let x = 0; x < row.length; x++) {
        const cell = row[x];
        if (cell == "1") {
          let topleft = this.clocks[y][x];
          let topright = this.clocks[y][x + 1];
          let bottomleft = this.clocks[y + 1][x];
          let bottomright = this.clocks[y + 1][x + 1];

          const DOWN = 180;
          const UP = 0;
          const RIGHT = 90;
          const LEFT = 270;

          const DIAL_1 = 1;
          const DIAL_2 = 0;

          function isZeroVal(x, y) {
            if (arr[y] == undefined) return true;
            if (arr[y][x] != "1") return true;
          }

          const zeroAbove = isZeroVal(x, y - 1);
          const zeroBelow = isZeroVal(x, y + 1);
          const zeroRight = isZeroVal(x + 1, y);
          const zeroLeft = isZeroVal(x - 1, y);

          if (zeroRight) {
            //zero to right
            topright.dials[DIAL_2] = DOWN;
            bottomright.dials[DIAL_1] = UP;
          }
          if (zeroLeft) {
            //zero to left
            topleft.dials[DIAL_1] = DOWN;
            bottomleft.dials[DIAL_2] = UP;
          }

          if (zeroBelow) {
            //zero below
            bottomright.dials[DIAL_2] = LEFT;
            bottomleft.dials[DIAL_1] = RIGHT;
          }

          if (zeroAbove) {
            //zero above
            topright.dials[DIAL_1] = LEFT;
            topleft.dials[DIAL_2] = RIGHT;
          }
        }
      }
    }
  }
}

class Clock {
  constructor({ pos = { x: 0, y: 0 }, raduis = 40, dials = [45, 45] } = {}) {
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
