import { html, TemplateResult } from 'lit';
import { customElement } from 'lit/decorators.js';
import { Mimisiku } from '../core/mimisiku';

import Page from '../core/strategies/Page';
import { Pages } from '../mimisiku-app';

@customElement('ui-not-found')
export class NotFoundController extends Page {
  private pageTitle;

  constructor(title: string) {
    super();
    this.pageTitle = title;
  }

  protected firstUpdated(): void {
    Mimisiku()?.disconnectKonami();

    const maze = document.getElementById('maze');
    const thingie = document.getElementById('thingie');
    const home = document.getElementById('home');
    const emo = document.getElementById('emo');

    const bu = document.getElementById('bu');
    const bd = document.getElementById('bd');
    const bl = document.getElementById('bl');
    const br = document.getElementById('br');

    const step = 20;
    const size = 20;
    const bwidth = 2;
    const mazeHeight = 200;
    const mazeWidth = 300;
    const nogoX: number[] = [];
    const nogoX2: number[] = [];
    const nogoY: number[] = [];
    const nogoY2: number[] = [];
    let prevDist = mazeWidth * 2;

    //tilt vars
    let lastUD = 0;
    let lastLR = 0;
    const mThreshold = 15;
    let firstMove = true;
    let allowTilt = true;

    //generate sides and starting position
    genSides();

    //define size
    const my = mazeHeight / step;
    const mx = mazeWidth / step;

    //create full grid
    const grid: Record<string, number>[][] = [];
    for (let i = 0; i < my; i++) {
      const sg = [];
      for (let a = 0; a < mx; a++) {
        sg.push({ u: 0, d: 0, l: 0, r: 0, v: 0 });
      }
      grid.push(sg);
    }

    //create direction arrays
    const dirs = ['u', 'd', 'l', 'r'];
    const modDir = {
      u: { y: -1, x: 0, o: 'd' },
      d: { y: 1, x: 0, o: 'u' },
      l: { y: 0, x: -1, o: 'r' },
      r: { y: 0, x: 1, o: 'l' }
    } as Record<string, { y: number, x: number, o: string; }>;

    //generate maze
    genMaze(0, 0, 0);
    drawMaze();

    //get all the barriers
    const barriers = document.getElementsByClassName('barrier') as HTMLCollectionOf<HTMLElement>;
    for (let b = 0; b < barriers.length; b++) {
      nogoX.push(barriers[b].offsetLeft);
      nogoX2.push(barriers[b].offsetLeft + barriers[b].clientWidth);
      nogoY.push(barriers[b].offsetTop);
      nogoY2.push(barriers[b].offsetTop + barriers[b].clientHeight);
    }
    //console.log(nogoX, nogoX2, nogoY, nogoY2);

    document.addEventListener('keydown', keys);

    function keys(e: { code: string; }) {
      const code = e.code;
      switch (code) {
        //arrows
        case 'ArrowUp':
          up();
          break;
        case 'ArrowDown':
          down();
          break;
        case 'ArrowLeft':
          left();
          break;
        case 'ArrowRight':
          right();
          break;
        //wasd
        case 'KeyW':
          up();
          break;
        case 'KeyS':
          down();
          break;
        case 'KeyA':
          left();
          break;
        case 'KeyD':
          right();
          break;
      }
    }

    if(!bu || !bd || !bl || !br) { return; }

    bu.addEventListener('click', (e) => {
      up();
      firstMove = true;
    });
    bd.addEventListener('click', (e) => {
      down();
      firstMove = true;
    });
    bl.addEventListener('click', (e) => {
      left();
      firstMove = true;
    });
    br.addEventListener('click', (e) => {
      right();
      firstMove = true;
    });

    function up() {
      if(!thingie) { return; }

      animKeys(bu);
      if (checkYboundry('u')) {
        thingie.style.top = thingie.offsetTop - step + 'px';
        updateEmo(false);
      }
    }

    function down() {
      if(!thingie) { return; }

      animKeys(bd);
      if (checkYboundry('d')) {
        thingie.style.top = thingie.offsetTop + step + 'px';
        updateEmo(false);
      }
    }

    function left() {
      if(!thingie) { return; }

      animKeys(bl);
      if (checkXboundry('l')) {
        thingie.style.left = thingie.offsetLeft - step + 'px';
      }
      updateEmo(true);
    }

    function right() {
      if(!thingie) { return; }

      animKeys(br);
      if (checkXboundry('r')) {
        thingie.style.left = thingie.offsetLeft + step + 'px';
      }
      updateEmo(true);
    }

    //check if one can move horizontally
    function checkXboundry(dir: string) {
      if(!thingie) { return; }

      const x = thingie.offsetLeft;
      const y = thingie.offsetTop;
      const ok = [];
      const len = Math.max(nogoX.length, nogoX2.length, nogoY.length, nogoY2.length);

      let check = 0;
      for (let i = 0; i < len; i++) {
        check = 0;
        if (y < nogoY[i] || y > nogoY2[i] - size) {
          check = 1;
        }
        if (dir === 'r') {
          if (x < nogoX[i] - size || x > nogoX2[i] - size) {
            check = 1;
          }
        }
        if (dir === 'l') {
          if (x < nogoX[i] || x > nogoX2[i]) {
            check = 1;
          }
        }
        ok.push(check);
      }
      //check what to return
      const res = ok.every(function (e) {
        return e > 0;
      });
      return res;
    }

    //check if one can move vertically
    function checkYboundry(dir: string) {
      if(!thingie) { return; }
      const x = thingie.offsetLeft;
      const y = thingie.offsetTop;
      const ok = [];
      const len = Math.max(nogoX.length, nogoX2.length, nogoY.length, nogoY2.length);

      let check = 0;
      for (let i = 0; i < len; i++) {
        check = 0;
        if (x < nogoX[i] || x > nogoX2[i] - size) {
          check = 1;
        }
        if (dir === 'u') {
          if (y < nogoY[i] || y > nogoY2[i]) {
            check = 1;
          }
        }
        if (dir === 'd') {
          if (y < nogoY[i] - size || y > nogoY2[i] - size) {
            check = 1;
          }
        }
        ok.push(check);
      }
      //check what to return
      const res = ok.every(function (e) {
        return e > 0;
      });
      return res;
    }

    //generate sides with random entry and exit points
    function genSides() {
      if(!thingie || !home || !maze) { return; }
      const max = mazeHeight / step;
      const l1 = Math.floor(Math.random() * max) * step;
      //let l1 = 0;
      const l2 = mazeHeight - step - l1;
      //console.log(l1, l2);

      const lb1 = document.createElement('div');
      lb1.style.top = step + 'px';
      lb1.style.left = step + 'px';
      lb1.style.height = l1 + 'px';

      const lb2 = document.createElement('div');
      lb2.style.top = l1 + step * 2 + 'px';
      lb2.style.left = step + 'px';
      lb2.style.height = l2 + 'px';

      const rb1 = document.createElement('div');
      rb1.style.top = step + 'px';
      rb1.style.left = mazeWidth + step + 'px';
      rb1.style.height = l2 + 'px';

      const rb2 = document.createElement('div');
      rb2.style.top = l2 + step * 2 + 'px';
      rb2.style.left = mazeWidth + step + 'px';
      rb2.style.height = l1 + 'px';

      //create invisible barriers for start and end: vertical left, vertical right, left top, left bottom, right top, right bottom
      nogoX.push(0, mazeWidth + 2 * step, 0, 0, mazeWidth + step, mazeWidth + step);
      nogoX2.push(
        0 + bwidth,
        mazeWidth + 2 * step + bwidth,
        step,
        step,
        mazeWidth + 2 * step,
        mazeWidth + 2 * step
      );
      nogoY.push(
        l1 + step,
        l2 + step,
        l1 + step,
        l1 + 2 * step,
        l2 + step,
        l2 + 2 * step
      );
      nogoY2.push(
        l1 + 2 * step,
        l2 + 2 * step,
        l1 + step + bwidth,
        l1 + 2 * step + bwidth,
        l2 + step + bwidth,
        l2 + 2 * step + bwidth
      );
      //set start-pos
      thingie.style.top = l1 + step + 'px';
      thingie.style.left = 0 + 'px';
      //set end-pos & store height of end
      home.style.top = l2 + step + 'px';
      home.style.left = mazeWidth + step + 'px';

      //style & append
      const els = [lb1, lb2, rb1, rb2];
      for (let i = 0; i < els.length; i++) {
        confSideEl(els[i]);
        maze.appendChild(els[i]);
      }
    }

    function confSideEl(el: HTMLDivElement) {
      el.setAttribute('class', 'barrier');
      el.style.width = bwidth + 'px';
    }

    //gen maze using Recursive Backtracking
    function genMaze(cx: number, cy: number, s: number) {
      // shuffle unchecked directions
      const d = limShuffle(dirs, s);

      for (let i = 0; i < d.length; i++) {
        const nx = cx + modDir[d[i]].x;
        const ny = cy + modDir[d[i]].y;
        grid[cy][cx].v = 1;

        if (nx >= 0 && nx < mx && ny >= 0 && ny < my && grid[ny][nx].v === 0) {
          grid[cy][cx][d[i]] = 1;
          grid[ny][nx][modDir[d[i]].o] = 1;
          //avoid shuffling d if d's not exhausted.. hence the i
          genMaze(nx, ny, i);
        }
      }
    }

    //draw maze
    function drawMaze() {
      for (let x = 0; x < mx; x++) {
        for (let y = 0; y < my; y++) {
          const l = grid[y][x].l;
          const r = grid[y][x].r;
          const u = grid[y][x].u;
          const d = grid[y][x].d;

          drawLines(x, y, l, r, u, d);
        }
      }
    }

    //draw the actual lines
    function drawLines(x: number, y: number, l: number, _r: number, _u: number, d: number) {
      const top = (y + 1) * step;
      const left = (x + 1) * step;
      if (l === 0 && x > 0) {
        const el = document.createElement('div');
        el.style.left = left + 'px';
        el.style.height = step + 'px';
        el.style.top = top + 'px';
        el.setAttribute('class', 'barrier');
        el.style.width = bwidth + 'px';
        maze?.appendChild(el);
      }

      if (d === 0 && y < my - 1) {
        const el = document.createElement('div');
        el.style.left = left + 'px';
        el.style.height = bwidth + 'px';
        el.style.top = top + step + 'px';
        el.setAttribute('class', 'barrier');
        el.style.width = step + bwidth + 'px';
        maze?.appendChild(el);
      }
    }

    function limShuffle(array: string[], s: number) {
      const con = array.slice(0, s);
      const ran = array.slice(s, array.length);

      for (let i = ran.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        //console.log(i, j);
        [ran[i], ran[j]] = [ran[j], ran[i]];
      }
      const comb = con.concat(ran);
      return comb;
    }

    function animKeys(key: HTMLElement | null) {
      if(!key) { return; }
      if (key.id === 'bu') {
        key.style.border = '3px #fff solid';
        key.style.borderTop = '1px #fff solid';
        key.style.borderBottom = '4px #fff solid';
        key.style.transform = 'translateY(-2px)';
      }
      if (key.id === 'bd') {
        key.style.border = '3px #fff solid';
        key.style.borderBottom = '1px #fff solid';
        key.style.borderTop = '4px #fff solid';
        key.style.transform = 'translateY(2px)';
      }
      if (key.id === 'bl') {
        key.style.border = '3px #fff solid';
        key.style.borderLeft = '1px #fff solid';
        key.style.borderRight = '4px #fff solid';
        key.style.transform = 'translateX(-2px)';
      }
      if (key.id === 'br') {
        key.style.border = '3px #fff solid';
        key.style.borderRight = '1px #fff solid';
        key.style.borderLeft = '4px #fff solid';
        key.style.transform = 'translateX(2px)';
      }

      //reset
      setTimeout(() => {
        key.style.border = '2px #fff solid';
        key.style.borderTop = '2px #fff solid';
        key.style.borderBottom = '2px #fff solid';
        key.style.borderLeft = '2px #fff solid';
        key.style.borderRight = '2px #fff solid';
        key.style.transform = 'translateY(0px)';
        key.style.transform = 'translateX(0px)';
      }, 150);
    }

    //let maxl = 0;
    // let prevl = 0;
    function updateEmo(lr: boolean) {
      if(!thingie || !emo || !home) { return; }

       	//Variant: Detect distance to target using old Greeks: Phytagoras (More scientifically interesting, but somehow less funny 🙃)
       	const h = home.offsetLeft - thingie.offsetLeft;
       	const v = Math.abs(home.offsetTop - thingie.offsetTop);
       	const dist = Math.hypot(h, v);
       	console.log(h, v, dist);

       	//dist = h;

       	//dynamic stuff
       	if (dist <= prevDist) {
       		//happy
       		emo.innerHTML = '😀';
       	} else {
      // 		//sad
       		emo.innerHTML = '🙄';
       	}

      // 	//fixed values
       	if (dist === 20) {
       		emo.innerHTML = '🤗';
       	}
       	if (dist === 0) {
       		emo.innerHTML = '🥳';
       		home.innerHTML = '';
          Mimisiku()?.success().then(() => Mimisiku()?.navigateTo(null, Pages.home));
       	} else {
       		home.innerHTML = '🏠';
       	}

      prevDist = dist;
    }

    window.addEventListener('deviceorientation', handleOrientation);

    function tiltTimer() {
      allowTilt = false;
      setTimeout(() => {
        allowTilt = true;
      }, 200);
    }

    function handleOrientation(e: DeviceOrientationEvent) {
      if(!e.beta || !e.gamma) { return;}
      //up/down = beta (smaller = up)
      //left/right = gamma (neg = left)

      if (firstMove) {
        lastUD = e.beta;
        lastLR = e.gamma;
        firstMove = false;
      }
      if (allowTilt) {
        if (e.beta < lastUD - mThreshold) {
          up();
          tiltTimer();
        }
        if (e.beta > lastUD + mThreshold) {
          down();
          tiltTimer();
        }
        if (e.gamma < lastLR - mThreshold) {
          left();
          tiltTimer();
        }
        if (e.gamma > lastLR + mThreshold) {
          right();
          tiltTimer();
        }
      }
    }
  }

  public render(): void | TemplateResult {
    return html`
      <div id="page" class="page" role="main">
        <div class="content-section-header">
            <p>${this.pageTitle}</p>
        </div>
        <div class="maze-error">
          <div class="mbox">
            <div id="maze">
              <div id="thingie">
                <div class="emo" id="emo">🥺</div>
              </div>
              <div id="home">
                <div class="emo">🏠</div>
              </div>
              <div class="barrier" id="top"></div>
              <div class="barrier" id="bottom"></div>
            </div>
              </div>
            <div class="controls">
              <div class="buttons">
                <button class="btn" id="bu"><div class="chevron">↑</div></button>
                <button class="btn" id="bd"><div class="chevron">↓</div></button>
                <button class="btn" id="bl"><div class="chevron">←</div></button>
                <button class="btn" id="br"><div class="chevron">→</div></button>
              </div>
            </div>
        </div>
      </div>
    `;
  }
}

declare global {
	interface HTMLElementTagNameMap {
		'ui-not-found': NotFoundController;
	}
}