import { CHAR_W, CHAR_H, WORLD_W, WORLD_H, WALK_SPEED, WALK_FRAME_TIME } from '../config.js';
import { isDown } from '../input.js';
import { bakeCharacter } from '../sprites.js';

// 4프레임 순환: 기본 → 걷기1 → 기본 → 걷기2
const FRAME_ORDER = [0, 1, 0, 1];

export class Player {
  constructor(x, y) {
    this.x = x;             // 월드 기준 위치(논리 픽셀), 왼쪽 위 모서리
    this.y = y;
    this.w = CHAR_W;        // 카메라가 중심을 잡을 때 씁니다
    this.h = CHAR_H;
    this.facing = 'down';   // 바라보는 방향
    this.moving = false;
    this.animTime = 0;
    this.sprites = bakeCharacter();
  }

  update(dt) {
    let dx = 0;
    let dy = 0;
    if (isDown('left'))  dx -= 1;
    if (isDown('right')) dx += 1;
    if (isDown('up'))    dy -= 1;
    if (isDown('down'))  dy += 1;

    this.moving = dx !== 0 || dy !== 0;

    if (this.moving) {
      // 대각선으로 갈 때 더 빨라지지 않게 정규화
      const len = Math.hypot(dx, dy);
      dx /= len;
      dy /= len;

      this.x += dx * WALK_SPEED * dt;
      this.y += dy * WALK_SPEED * dt;

      // 좌우 입력이 있으면 좌우를 우선해서 바라봅니다.
      if (dx < 0) this.facing = 'left';
      else if (dx > 0) this.facing = 'right';
      else if (dy < 0) this.facing = 'up';
      else if (dy > 0) this.facing = 'down';

      this.animTime += dt;
    } else {
      this.animTime = 0;    // 멈추면 기본 자세로
    }

    // 월드 밖으로 나가지 않게
    this.x = Math.max(0, Math.min(WORLD_W - CHAR_W, this.x));
    this.y = Math.max(0, Math.min(WORLD_H - CHAR_H, this.y));
  }

  draw(ctx) {
    const frames = this.sprites[this.facing];
    const step = this.moving
      ? FRAME_ORDER[Math.floor(this.animTime / WALK_FRAME_TIME) % FRAME_ORDER.length]
      : 0;

    // 좌표를 정수로 반올림해야 픽셀이 흐려지지 않습니다.
    ctx.drawImage(frames[step], Math.round(this.x), Math.round(this.y), CHAR_W, CHAR_H);
  }
}
