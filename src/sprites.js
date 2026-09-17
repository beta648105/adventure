// 8x16 기본 캐릭터 도트. 문자 한 글자 = 픽셀 한 개입니다.
// 여기 글자만 바꿔도 캐릭터 모양이 바로 바뀝니다. (가로 8글자 / 세로 16줄 고정)
//
//   .  투명       h  머리카락    s  피부      o  눈/윤곽
//   c  옷         p  바지        b  신발

export const PALETTE = {
  '.': null,
  h: '#3b2a1e',
  s: '#f0c8a0',
  o: '#2a2119',
  c: '#4a7ec8',
  p: '#39405c',
  b: '#2a2119',
};

// 정면(아래를 볼 때) - 서 있는 자세
const DOWN_IDLE = [
  '..hhhh..',
  '.hhhhhh.',
  '.hhhhhh.',
  '.ssssss.',
  '.sossos.',
  '.ssssss.',
  '..ssss..',
  '.cccccc.',
  'sccccccs',
  'sccccccs',
  '.cccccc.',
  '.pppppp.',
  '.pp..pp.',
  '.pp..pp.',
  '.pp..pp.',
  '.bb..bb.',
];

// 정면 - 걷는 자세 (다리 벌림)
const DOWN_WALK = [
  '..hhhh..',
  '.hhhhhh.',
  '.hhhhhh.',
  '.ssssss.',
  '.sossos.',
  '.ssssss.',
  '..ssss..',
  '.cccccc.',
  '.cccccc.',
  'scccccc.',
  '.ccccccs',
  '.pppppp.',
  '.pppppp.',
  '.pp..pp.',
  '.pp...pp',
  'bb....bb',
];

// 뒷모습(위를 볼 때) - 얼굴이 없습니다
const UP_IDLE = [
  '..hhhh..',
  '.hhhhhh.',
  '.hhhhhh.',
  '.hhhhhh.',
  '.hhhhhh.',
  '.hhhhhh.',
  '..ssss..',
  '.cccccc.',
  'sccccccs',
  'sccccccs',
  '.cccccc.',
  '.pppppp.',
  '.pp..pp.',
  '.pp..pp.',
  '.pp..pp.',
  '.bb..bb.',
];

const UP_WALK = [
  '..hhhh..',
  '.hhhhhh.',
  '.hhhhhh.',
  '.hhhhhh.',
  '.hhhhhh.',
  '.hhhhhh.',
  '..ssss..',
  '.cccccc.',
  '.cccccc.',
  'scccccc.',
  '.ccccccs',
  '.pppppp.',
  '.pppppp.',
  '.pp..pp.',
  '.pp...pp',
  'bb....bb',
];

// 오른쪽을 볼 때. 왼쪽은 이걸 좌우 반전해서 씁니다.
const RIGHT_IDLE = [
  '..hhhh..',
  '.hhhhhh.',
  '.hhhhhhh',
  '..sssshh',
  '..sossh.',
  '..sssss.',
  '..ssss..',
  '..cccc..',
  '..ccccs.',
  '..ccccs.',
  '..cccc..',
  '..pppp..',
  '..pppp..',
  '..pppp..',
  '..pp.pp.',
  '..bb.bb.',
];

const RIGHT_WALK = [
  '..hhhh..',
  '.hhhhhh.',
  '.hhhhhhh',
  '..sssshh',
  '..sossh.',
  '..sssss.',
  '..ssss..',
  '..cccc..',
  '..cccc..',
  '..cccccs',
  '..cccc..',
  '..pppp..',
  '..pppp..',
  '.ppppp..',
  '.pp..pp.',
  'bb....bb',
];

// 방향별 애니메이션 프레임. [기본, 걷기1, 기본, 걷기2] 4프레임 순환입니다.
export const CHARACTER_FRAMES = {
  down:  [DOWN_IDLE, DOWN_WALK],
  up:    [UP_IDLE, UP_WALK],
  right: [RIGHT_IDLE, RIGHT_WALK],
};

/**
 * 도트 문자열을 오프스크린 캔버스로 구워둡니다.
 * 매 프레임 픽셀을 하나씩 찍으면 느리니까, 미리 그려놓고 통째로 복사합니다.
 * @param {string[]} rows 도트 문자열
 * @param {boolean} flipX 좌우 반전 여부
 */
export function bake(rows, flipX = false) {
  const w = rows[0].length;
  const h = rows.length;
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const color = PALETTE[rows[y][x]];
      if (!color) continue;
      ctx.fillStyle = color;
      ctx.fillRect(flipX ? w - 1 - x : x, y, 1, 1);
    }
  }
  return canvas;
}

/** 4방향 x 2프레임 스프라이트를 전부 구워서 돌려줍니다. */
export function bakeCharacter() {
  const { down, up, right } = CHARACTER_FRAMES;
  return {
    down: down.map((f) => bake(f)),
    up: up.map((f) => bake(f)),
    right: right.map((f) => bake(f)),
    left: right.map((f) => bake(f, true)),   // 오른쪽 스프라이트를 반전
  };
}
