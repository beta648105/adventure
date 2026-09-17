import { Game } from './game.js';

const canvas = document.getElementById('screen');

new Game(canvas).start().catch((err) => {
  // 스프라이트를 못 불러오면 흰 화면만 나와서 원인을 알 수 없으니 화면에 띄웁니다.
  console.error(err);
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = '#c0392b';
  ctx.font = '8px monospace';
  ctx.fillText(err.message, 8, 20);
});
