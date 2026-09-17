import { VIEW_W, VIEW_H, WORLD_W, WORLD_H } from './config.js';

/**
 * 대상을 화면 한가운데에 두고 따라다니는 카메라.
 * 단, 월드 바깥이 보이지 않도록 가장자리에서는 멈춥니다.
 * (젤다 신들의 트라이포스 필드 방식)
 */
export class Camera {
  constructor() {
    this.x = 0;   // 화면 왼쪽 위가 월드의 어느 지점인지
    this.y = 0;
  }

  /** @param {{x:number, y:number, w:number, h:number}} target 따라갈 대상 */
  follow(target) {
    // 대상의 중심을 화면 중심에 맞춥니다.
    this.x = target.x + target.w / 2 - VIEW_W / 2;
    this.y = target.y + target.h / 2 - VIEW_H / 2;
    this.clamp();
  }

  /** 월드 밖 여백이 보이지 않게 카메라를 가둡니다. */
  clamp() {
    // 월드가 화면보다 작으면 가운데 정렬(가둘 수가 없으므로)
    this.x = WORLD_W <= VIEW_W
      ? (WORLD_W - VIEW_W) / 2
      : Math.max(0, Math.min(WORLD_W - VIEW_W, this.x));

    this.y = WORLD_H <= VIEW_H
      ? (WORLD_H - VIEW_H) / 2
      : Math.max(0, Math.min(WORLD_H - VIEW_H, this.y));
  }

  /** 그리기 직전에 호출. 카메라만큼 화면을 밀어줍니다. */
  apply(ctx) {
    ctx.save();
    // 정수로 반올림해야 배경과 캐릭터가 같은 픽셀 격자 위에 놓입니다.
    ctx.translate(-Math.round(this.x), -Math.round(this.y));
  }

  restore(ctx) {
    ctx.restore();
  }

  /** 지금 보이는 월드 영역. 화면 밖 타일을 안 그리려고 씁니다. */
  get bounds() {
    const x = Math.round(this.x);
    const y = Math.round(this.y);
    return { left: x, top: y, right: x + VIEW_W, bottom: y + VIEW_H };
  }
}
