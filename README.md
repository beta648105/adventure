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
assets/player.png       캐릭터 스프라이트 시트 (16x16 x 3프레임)
src/config.js           해상도·월드 크기·속도 등 설정값
src/input.js            키보드 입력
src/assets.js           이미지 로더
src/sprites.js          스프라이트 시트 자르기 / 애니메이션 순서
src/camera.js           플레이어를 따라가는 카메라
src/world.js            맵 배경 (지금은 격자만, 타일셋 붙일 자리)
src/game.js             게임 루프
src/entities/player.js  플레이어 이동·애니메이션
```

## 화면과 월드

화면에 보이는 영역은 320x180, 월드는 그 3x3 크기인 960x540입니다.
카메라가 플레이어를 화면 한가운데 두고 따라가되, 월드 가장자리에서는 멈춥니다.
크기는 `src/config.js`의 `VIEW_W` / `WORLD_W` 등에서 바꿉니다.

배경 격자는 위치를 가늠하려고 임시로 그려둔 것입니다.
타일셋이 준비되면 `src/world.js`의 `draw()` 안쪽만 갈아끼우면 됩니다.

## 스프라이트

`assets/player.png` = 16x16 프레임 3개가 가로로 붙은 시트입니다.

- 걷기: 1 → 2 → 3 → 2 순서로 한 장당 0.14초
- 정지: 2번

지금은 정면 그림만 있어서 위/좌/우로 갈 때도 같은 그림을 씁니다.
방향별 시트가 생기면 `src/sprites.js`의 `SHEETS`에 경로만 추가하면 됩니다
(주석으로 자리를 만들어 뒀습니다).

프레임 크기를 바꿀 때는 `src/config.js`의 `CHAR_W` / `CHAR_H`를 같이 바꿔야 합니다.

## 배포

`main` 브랜치에 push하면 GitHub Actions가 GitHub Pages로 자동 배포합니다.
저장소 Settings → Pages → Source를 **GitHub Actions**로 한 번 설정해 두어야 합니다.
