// 키보드 입력 상태. 방향키 / WASD 둘 다 받습니다.

const KEY_MAP = {
  ArrowUp: 'up',    KeyW: 'up',
  ArrowDown: 'down',  KeyS: 'down',
  ArrowLeft: 'left',  KeyA: 'left',
  ArrowRight: 'right', KeyD: 'right',
  Space: 'action',  Enter: 'action',  KeyZ: 'action',
  Escape: 'cancel', KeyX: 'cancel',
};

const held = new Set();      // 현재 누르고 있는 키
const pressed = new Set();   // 이번 프레임에 새로 눌린 키 (대사 넘기기 등에 사용)

export function initInput() {
  window.addEventListener('keydown', (e) => {
    const name = KEY_MAP[e.code];
    if (!name) return;
    e.preventDefault();          // 스페이스로 화면 스크롤되는 것 방지
    if (!held.has(name)) pressed.add(name);
    held.add(name);
  });

  window.addEventListener('keyup', (e) => {
    const name = KEY_MAP[e.code];
    if (!name) return;
    e.preventDefault();
    held.delete(name);
  });

  // 탭을 벗어나면 키가 눌린 채로 남는 걸 막습니다.
  window.addEventListener('blur', () => held.clear());
}

/** 누르고 있는 중인가 */
export function isDown(name) {
  return held.has(name);
}

/** 이번 프레임에 막 눌렸는가 (한 번만 true) */
export function wasPressed(name) {
  return pressed.has(name);
}

/** 매 프레임 끝에서 호출. 단발 입력을 비웁니다. */
export function endFrame() {
  pressed.clear();
}
