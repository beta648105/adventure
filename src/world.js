import {
  TILE, VIEW_W, VIEW_H, WORLD_W, WORLD_H,
  BG_COLOR, GRID_COLOR, GRID_MAJOR_COLOR, BORDER_COLOR,
} from './config.js';

/**
 * 맵 배경. 지금은 타일 그래픽이 없어서 격자만 그립니다.
 * 나중에 타일셋이 생기면 draw() 안쪽만 갈아끼우면 됩니다.
 */
export class World {
  constructor() {
    this.width = WORLD_W;
    this.height = WORLD_H;
  }

  /**
   * @param {CanvasRenderingContext2D} ctx 카메라가 적용된 상태로 들어옵니다
   * @param {{left:number,top:number,right:number,bottom:number}} view 보이는 영역
   */
  draw(ctx, view) {
    // 흰 바탕
    ctx.fillStyle = BG_COLOR;
    ctx.fillRect(view.left, view.top, VIEW_W, VIEW_H);

    // 보이는 범위의 격자만 그립니다. 월드 전체를 그리면 낭비라서요.
    const x0 = Math.max(0, Math.floor(view.left / TILE) * TILE);
    const x1 = Math.min(WORLD_W, view.right + TILE);
    const y0 = Math.max(0, Math.floor(view.top / TILE) * TILE);
    const y1 = Math.min(WORLD_H, view.bottom + TILE);

    for (let x = x0; x <= x1; x += TILE) {
      // 화면 한 칸(VIEW_W)마다 조금 진한 선 → 얼마나 움직였는지 보이라고
      ctx.fillStyle = x % VIEW_W === 0 ? GRID_MAJOR_COLOR : GRID_COLOR;
      ctx.fillRect(x, y0, 1, y1 - y0);
    }
    for (let y = y0; y <= y1; y += TILE) {
      ctx.fillStyle = y % VIEW_H === 0 ? GRID_MAJOR_COLOR : GRID_COLOR;
      ctx.fillRect(x0, y, x1 - x0, 1);
    }

    // 월드 바깥 경계
    ctx.fillStyle = BORDER_COLOR;
    ctx.fillRect(0, 0, WORLD_W, 1);
    ctx.fillRect(0, WORLD_H - 1, WORLD_W, 1);
    ctx.fillRect(0, 0, 1, WORLD_H);
    ctx.fillRect(WORLD_W - 1, 0, 1, WORLD_H);
  }
}
