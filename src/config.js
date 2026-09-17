// 게임 전역 설정값. 숫자 하나만 바꿔도 화면 전체가 따라옵니다.

// 화면에 한 번에 보이는 영역(논리 픽셀). 실제 창에는 정수배로 확대해서 그립니다.
export const VIEW_W = 320;
export const VIEW_H = 180;

// 타일 한 칸 크기.
export const TILE = 16;

// 월드(맵) 전체 크기. 화면보다 크기 때문에 카메라가 따라다닙니다.
// 지금은 가로 3화면 x 세로 3화면 크기입니다.
export const WORLD_W = VIEW_W * 3;   // 960
export const WORLD_H = VIEW_H * 3;   // 540

// 캐릭터 한 프레임 크기 (assets/player.png 기준 16 x 16)
export const CHAR_W = 16;
export const CHAR_H = 16;

// 이동 속도 (논리 픽셀 / 초)
export const WALK_SPEED = 60;

// 걷기 애니메이션 한 프레임당 유지 시간 (초)
export const WALK_FRAME_TIME = 0.14;

// 배경색 (흰색)
export const BG_COLOR = '#ffffff';

// 맵 격자선 색. 아직 타일 그래픽이 없어서 위치를 가늠하려고 그려둡니다.
// 실제 타일셋을 붙이면 world.js에서 이 부분을 지우면 됩니다.
export const GRID_COLOR = '#e8e8e8';
export const GRID_MAJOR_COLOR = '#d0d0d0';   // 화면 한 칸 경계
export const BORDER_COLOR = '#b0b0b0';       // 월드 바깥 경계
