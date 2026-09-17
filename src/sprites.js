import { CHAR_W, CHAR_H } from './config.js';
import { loadImage } from './assets.js';

// 방향별 그림을 한 장으로 합친 시트. 가로 = 프레임, 세로 = 방향.
// assets/sprites/ 의 원본들을 tools/build_sprites.py 로 합쳐서 만듭니다.
export const SHEET = 'assets/player.png';

// 시트의 줄 순서. tools/build_sprites.py 의 ROW_ORDER 와 같아야 합니다.
export const ROW_ORDER = ['down', 'up', 'left', 'right'];

// 걷기 순서: 1 → 2 → 3 → 2 (0부터 세는 번호라 0,1,2,1)
export const WALK_ORDER = [0, 1, 2, 1];

// 가만히 서 있을 때의 프레임: 2번 그림
export const IDLE_FRAME = 1;

/**
 * 시트의 한 줄을 프레임 단위로 잘라 캔버스 배열로 만듭니다.
 * 매 프레임 잘라 쓰는 대신 미리 잘라두면 그리기가 단순해집니다.
 * @param {HTMLImageElement} image 시트 이미지
 * @param {number} row 몇 번째 줄(방향)인지
 * @param {number} count 가로 프레임 수
 */
export function sliceRow(image, row, count) {
  const frames = [];

  for (let i = 0; i < count; i++) {
    const canvas = document.createElement('canvas');
    canvas.width = CHAR_W;
    canvas.height = CHAR_H;
    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = false;
    // 시트에서 (i번째 칸, row번째 줄)만 잘라서 그립니다.
    ctx.drawImage(image, i * CHAR_W, row * CHAR_H, CHAR_W, CHAR_H, 0, 0, CHAR_W, CHAR_H);
    frames.push(canvas);
  }
  return frames;
}

/** 시트를 불러와 방향별 프레임 묶음으로 만듭니다. */
export async function loadCharacterSprites() {
  const image = await loadImage(SHEET);

  const count = Math.floor(image.width / CHAR_W);
  const rows = Math.floor(image.height / CHAR_H);

  if (count < 1 || rows < 1) {
    throw new Error(
      `스프라이트 시트가 프레임 크기보다 작습니다. `
      + `이미지=${image.width}x${image.height}, 프레임=${CHAR_W}x${CHAR_H}`,
    );
  }
  if (rows < ROW_ORDER.length) {
    console.warn(
      `시트에 ${rows}줄만 있습니다. ${ROW_ORDER.length}줄(${ROW_ORDER.join('/')})을 기대합니다. `
      + `tools/build_sprites.py 를 다시 돌려보세요.`,
    );
  }

  const sprites = {};
  ROW_ORDER.forEach((direction, row) => {
    // 줄이 모자라면 첫 줄(정면)로 대신합니다.
    sprites[direction] = sliceRow(image, Math.min(row, rows - 1), count);
  });
  return sprites;
}
