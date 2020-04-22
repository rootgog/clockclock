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
    // seg.set("111100111001111"); //5
    seg.set("111101111101111"); //8
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

          //to left or down change dial 2 (index 1)
          //to up or right change dial 1 (index 0)
          const LEFT_DOWN = 1;
          const RIGHT_UP = 0;

          if (
            arr[y + 1] == undefined ||
            (arr[y + 1] != undefined && arr[y + 1][x] == "0")
          ) {
            //bottom
            bottomleft.dials[RIGHT_UP] = RIGHT;
            bottomright.dials[LEFT_DOWN] = LEFT;

            //corners
            if (x == 0) {
              //bottom left
              bottomleft.dials[LEFT_DOWN] = RIGHT;
            }
          }

          if (arr[y][x + 1] == undefined || arr[y][x + 1] == "0") {
            //right
            topright.dials[LEFT_DOWN] = DOWN;
            bottomright.dials[RIGHT_UP] = UP;

            //corners
            if (y == 0) {
              //top left
              topright.dials[RIGHT_UP] = LEFT;
            }
          }
          if (y == 0 || (arr[y - 1] != undefined && arr[y - 1][x] == "0")) {
            //top
            topleft.dials[RIGHT_UP] = RIGHT;
            topright.dials[LEFT_DOWN] = LEFT;

            //corners
            if (y != 0 && arr[y - 1][x] == "0") {
              //top left

              if (arr[y - 1][x - 1] != "0") {
                topleft.dials[LEFT_DOWN] = UP;
              }
              if (arr[y - 1][x + 1] != "0" && arr[y][x + 1] != "1") {
                topright.dials[RIGHT_UP] = LEFT;
                topright.dials[LEFT_DOWN] = DOWN;
              }
            }
          }
          if (x == 0 || arr[y][x - 1] == "0") {
            //left
            topleft.dials[LEFT_DOWN] = DOWN;
            bottomleft.dials[RIGHT_UP] = UP;

            //corners
            if (
              arr[y][x - 1] == "0" &&
              arr[y - 1] != undefined &&
              arr[y - 1][x - 1] == "1"
            ) {
              topleft.dials[RIGHT_UP] = LEFT;
            }

            if (arr[y - 1] != undefined && arr[y - 1][x] == "0") {
              topright.dials[RIGHT_UP] = RIGHT;
            }
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
