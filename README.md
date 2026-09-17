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
assets/sprites/         방향별 원본 그림 (여기에 새 그림을 넣습니다)
assets/player.png       합쳐진 스프라이트 시트 (자동 생성)
tools/build_sprites.py  원본들을 시트 한 장으로 합치는 스크립트
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

원본은 `assets/sprites/` 에 방향별로 넣고, 스크립트로 한 장에 합쳐서 씁니다.

```
assets/sprites/player.png         정면 (기준. 반드시 필요)
assets/sprites/player(back).png   뒷모습
assets/sprites/player(left).png   왼쪽    - 아직 없음
assets/sprites/player(right).png  오른쪽  - 아직 없음
```

새 그림을 넣은 뒤:

```
python tools/build_sprites.py
```

`assets/player.png` 가 다시 만들어집니다. 가로가 프레임, 세로가 방향(아래/위/왼쪽/오른쪽)입니다.
아직 그림이 없는 방향은 정면 그림으로 채워집니다.

- 한 프레임 16x16, 가로 3칸
- 걷기: 1 → 2 → 3 → 2 순서로 한 장당 0.14초
- 정지: 2번

한쪽 옆모습만 그렸다면 `player(side).png` 로 두세요. 오른쪽으로 쓰고 왼쪽은 좌우 반전해서 만듭니다.
프레임 크기를 바꿀 때는 `src/config.js` 의 `CHAR_W` / `CHAR_H` 를 같이 바꿔야 합니다.

## 배포

`main` 브랜치에 push하면 GitHub Actions가 GitHub Pages로 자동 배포합니다.
저장소 Settings → Pages → Source를 **GitHub Actions**로 한 번 설정해 두어야 합니다.
