# Pixel Adventure

픽셀 어드벤쳐 게임. 빌드 도구 없이 순수 HTML5 Canvas + ES 모듈로 만듭니다.

## 실행

ES 모듈은 `file://`로 열면 브라우저가 막기 때문에, 로컬 서버로 띄워야 합니다.

```
start.bat
```

또는 직접:

```
python -m http.server 8000
```

그 뒤 http://localhost:8000 접속.

## 조작

| 키 | 동작 |
|---|---|
| 방향키 / WASD | 이동 |
| Space / Enter / Z | 확인 (아직 미구현) |
| Esc / X | 취소 (아직 미구현) |

## 구조

```
index.html              캔버스 한 장
src/config.js           해상도·속도 등 설정값
src/input.js            키보드 입력
src/sprites.js          8x16 도트 데이터 (문자열로 되어 있어 바로 수정 가능)
src/game.js             게임 루프
src/entities/player.js  플레이어 이동·애니메이션
```

## 배포

`main` 브랜치에 push하면 GitHub Actions가 GitHub Pages로 자동 배포합니다.
저장소 Settings → Pages → Source를 **GitHub Actions**로 한 번 설정해 두어야 합니다.
