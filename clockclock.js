export default class ClockClock {
  constructor({ element, updateRate = 30 } = {}) {
    this.canvas = document.createElement("canvas");
    this.ctx = this.canvas.getContext("2d");
    element.appendChild(this.canvas);
    this.canvas.height = 1000;
    this.canvas.width = 1000;
    this.updateRate = updateRate;

    this.segments = {};

    this.numbers = [
      "111101101101111",
      "110010010010111",
      "111001111100111",
      "111001111001111",
      "101101111001001",
      "111100111001111",
      "111100111101111",
      "111101001001001",
      "111101111101111",
      "111101111001111",
    ];
  }
  addSegment({ name, radius = 20, pos = { x: 0, y: 0 } } = {}) {
    this.segments[name] = new Segment({ radius, pos });
  }
  updateSegment(name, number) {
    if (!this.segments.hasOwnProperty(name)) {
      throw new Error("segment does not exist");
    }
    this.segments[name].set(this.numbers[number]);
    return this;
  }

  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    for (const key in this.segments) {
      if (this.segments.hasOwnProperty(key)) {
        const segment = this.segments[key];
        segment.draw(this.ctx);
      }
    }
    requestAnimationFrame(this.draw.bind(this));
  }
}

class Segment {
  constructor({ radius = 40, pos = { x: 0, y: 0 } } = {}) {
    this.radius = radius;
    this.pos = pos;
    this.clocks = [];

    //create seg array

    for (let y = 0; y < 6; y++) {
      let row = [];

      for (let x = 0; x < 4; x++) {
        row.push(
          new Clock({
            pos: {
              x: x * this.radius + x * this.radius + this.radius + this.pos.x,
              y: y * this.radius + y * this.radius + this.radius + this.pos.y,
            },
            raduis: radius,
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

        const zeroAbove = isZeroVal(x, y - 1);
        const zeroBelow = isZeroVal(x, y + 1);
        const zeroRight = isZeroVal(x + 1, y);
        const zeroLeft = isZeroVal(x - 1, y);

        let topleft = this.clocks[y][x];
        let topright = this.clocks[y][x + 1];
        let bottomleft = this.clocks[y + 1][x];
        let bottomright = this.clocks[y + 1][x + 1];

        const DOWN = 180;
        const UP = 0;
        const RIGHT = 90;
        const LEFT = 270;
        const RESTING = 45;

        const DIAL_1 = "first";
        const DIAL_2 = "second";

        function isZeroVal(x, y) {
          if (arr[y] == undefined) return true;
          if (arr[y][x] != "1") return true;
        }

        function animateValue(obj, to, time = 0.6) {
          let updateRate = 30;

          //need diff
          let a = obj.value;
          let b = to;

          let d = Math.abs(a - b) % 360;
          let r = d > 180 ? 360 - d : d;

          //calculate sign
          let sign =
            (a - b >= 0 && a - b <= 180) || (a - b <= -180 && a - b >= -360)
              ? 1
              : -1;
          r *= sign;

          let diff = r ? 180 + r : 360;

          let step = diff / time / (1000 / updateRate);

          let currentProgress = 0;
          let startingVal = obj.value * 1;

          let interval = setInterval(() => {
            currentProgress += step;
            obj.value = currentProgress + startingVal;
            if (currentProgress > diff) {
              obj.value = to;
              obj.animating = false;
              clearInterval(interval);
            }
          }, 1000 / updateRate);
        }

        if (cell == "1") {
          if (zeroRight) {
            //zero to right
            animateValue(topright.dials[DIAL_2], DOWN);
            animateValue(bottomright.dials[DIAL_1], UP);
          }
          if (zeroLeft) {
            //zero to left
            animateValue(topleft.dials[DIAL_1], DOWN);
            animateValue(bottomleft.dials[DIAL_2], UP);
          }

          if (zeroBelow) {
            //zero below
            animateValue(bottomright.dials[DIAL_2], LEFT);
            animateValue(bottomleft.dials[DIAL_1], RIGHT);
          }

          if (zeroAbove) {
            //zero above
            animateValue(topright.dials[DIAL_1], LEFT);
            animateValue(topleft.dials[DIAL_2], RIGHT);
          }
        } else {
          if (zeroBelow) {
            if (zeroRight) {
              animateValue(bottomright.dials[DIAL_2], RESTING);
              animateValue(bottomright.dials[DIAL_1], RESTING);
            }
            if (zeroLeft) {
              animateValue(bottomleft.dials[DIAL_1], RESTING);
              animateValue(bottomleft.dials[DIAL_2], RESTING);
            }
          }
          if (zeroAbove) {
            if (zeroRight) {
              animateValue(topright.dials[DIAL_2], RESTING);
              animateValue(topright.dials[DIAL_1], RESTING);
            }
          }
        }
      }
    }
    return this;
  }
}

class Clock {
  constructor({
    pos = { x: 0, y: 0 },
    raduis = 40,
    dials = {
      first: {
        value: 45,
      },
      second: {
        value: 45,
      },
    },
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
    ctx.fillStyle = "whitesmoke";
    ctx.arc(this.pos.x, this.pos.y, this.raduis, 0, 2 * Math.PI);
    ctx.fill();
    /**
     * dials
     */
    for (const key in this.dials) {
      if (this.dials.hasOwnProperty(key)) {
        const dial = this.dials[key];
        ctx.beginPath();
        ctx.fillStyle = "#000000";
        ctx.moveTo(this.pos.x, this.pos.y);
        ctx.lineTo(
          this.pos.x +
            Math.cos((Math.PI / 180.0) * (dial.value - 90)) * this.raduis,
          this.pos.y +
            Math.sin((Math.PI / 180.0) * (dial.value - 90)) * this.raduis
        );
        ctx.stroke();
      }
    }
  }
}
