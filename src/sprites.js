import { CHAR_W, CHAR_H } from './config.js';
import { loadImages } from './assets.js';

// 방향별 스프라이트 시트. 가로로 프레임이 나열된 png입니다.
// 지금은 정면(down) 그림만 있어서 나머지 방향도 같은 걸 씁니다.
// up / left / right 그림이 생기면 아래에 경로만 추가하면 됩니다.
export const SHEETS = {
  down: 'assets/player.png',
  // up:    'assets/player_up.png',
  // left:  'assets/player_left.png',
  // right: 'assets/player_right.png',
};

// 걷기 순서: 1 → 2 → 3 → 2 (0부터 세는 번호라 0,1,2,1)
export const WALK_ORDER = [0, 1, 2, 1];

// 가만히 서 있을 때의 프레임: 2번 그림
export const IDLE_FRAME = 1;

/**
 * 가로로 늘어선 스프라이트 시트를 프레임 단위로 잘라 캔버스 배열로 만듭니다.
 * 매 프레임 잘라 쓰는 대신 미리 잘라두면 그리기가 단순해집니다.
 * @param {HTMLImageElement} image 시트 이미지
 * @param {boolean} flipX 좌우 반전 (옆모습을 반대편에 재활용할 때)
 */
export function sliceSheet(image, flipX = false) {
  if (image.width % CHAR_W !== 0 || image.height !== CHAR_H) {
    console.warn(
      `스프라이트 크기가 설정과 다릅니다. 이미지=${image.width}x${image.height}, `
      + `기대값=${CHAR_W}의 배수 x ${CHAR_H}. config.js의 CHAR_W/CHAR_H를 확인하세요.`,
    );
  }

  const count = Math.max(1, Math.floor(image.width / CHAR_W));
  const frames = [];

  for (let i = 0; i < count; i++) {
    const canvas = document.createElement('canvas');
    canvas.width = CHAR_W;
    canvas.height = CHAR_H;
    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = false;

    if (flipX) {
      ctx.translate(CHAR_W, 0);
      ctx.scale(-1, 1);
    }
    // 시트에서 i번째 칸만 잘라서 그립니다.
    ctx.drawImage(image, i * CHAR_W, 0, CHAR_W, CHAR_H, 0, 0, CHAR_W, CHAR_H);
    frames.push(canvas);
  }
  return frames;
}

/**
 * 4방향 스프라이트를 모두 준비합니다.
 * 시트가 없는 방향은 정면 그림으로 대신합니다.
 */
export async function loadCharacterSprites() {
  const images = await loadImages(SHEETS);
  const sliced = Object.fromEntries(
    Object.entries(images).map(([dir, img]) => [dir, sliceSheet(img)]),
  );

  const fallback = sliced.down;
  return {
    down: sliced.down,
    up: sliced.up ?? fallback,
    left: sliced.left ?? fallback,
    right: sliced.right ?? fallback,
  };
}
