import { VIEW_W, VIEW_H, WORLD_W, WORLD_H, CHAR_W, CHAR_H, BG_COLOR } from './config.js';
import { initInput, endFrame } from './input.js';
import { Player } from './entities/player.js';
import { Camera } from './camera.js';
import { World } from './world.js';

export class Game {
  constructor(canvas) {
    this.canvas = canvas;
    this.canvas.width = VIEW_W;
    this.canvas.height = VIEW_H;

    this.ctx = canvas.getContext('2d');
    this.ctx.imageSmoothingEnabled = false;   // 확대해도 도트가 뭉개지지 않게

    this.world = new World();

    // 월드 한가운데에서 시작
    this.player = new Player(
      Math.floor((WORLD_W - CHAR_W) / 2),
      Math.floor((WORLD_H - CHAR_H) / 2),
    );

    this.camera = new Camera();
    this.camera.follow(this.player);

    this.lastTime = 0;
    this.loop = this.loop.bind(this);
  }

  start() {
    initInput();
    this.resize();
    window.addEventListener('resize', () => this.resize());
    requestAnimationFrame((t) => {
      this.lastTime = t;
      requestAnimationFrame(this.loop);
    });
  }

  /** 창 크기에 맞춰 정수배로 확대합니다. 정수배라야 픽셀이 균일합니다. */
  resize() {
    const scale = Math.max(
      1,
      Math.floor(Math.min(window.innerWidth / VIEW_W, window.innerHeight / VIEW_H)),
    );
    this.canvas.style.width = `${VIEW_W * scale}px`;
    this.canvas.style.height = `${VIEW_H * scale}px`;
  }

  loop(time) {
    // dt = 지난 프레임과의 시간 간격(초). 탭 전환 등으로 튀는 값은 잘라냅니다.
    const dt = Math.min((time - this.lastTime) / 1000, 0.1);
    this.lastTime = time;

    this.update(dt);
    this.draw();
    endFrame();

    requestAnimationFrame(this.loop);
  }

  update(dt) {
    this.player.update(dt);
    this.camera.follow(this.player);   // 플레이어가 움직인 뒤에 따라갑니다
  }

  draw() {
    const { ctx } = this;

    // 월드 가장자리에서 카메라가 멈췄을 때 이전 프레임이 남지 않도록 먼저 지웁니다.
    ctx.fillStyle = BG_COLOR;
    ctx.fillRect(0, 0, VIEW_W, VIEW_H);

    this.camera.apply(ctx);            // 여기서부터는 월드 좌표로 그립니다
    this.world.draw(ctx, this.camera.bounds);
    this.player.draw(ctx);
    this.camera.restore(ctx);
  }
}
