"""assets/sprites/ 의 방향별 png 를 한 장의 스프라이트 시트로 합칩니다.

    python tools/build_sprites.py

입력  assets/sprites/player.png        정면(아래)
      assets/sprites/player(back).png  뒷모습(위)
      assets/sprites/player(left).png  왼쪽    - 아직 없으면 생략 가능
      assets/sprites/player(right).png 오른쪽  - "(side)" 로 두면 좌우 반전해서 양쪽에 씁니다

출력  assets/player.png   가로=프레임, 세로=방향(아래/위/왼쪽/오른쪽 순)

없는 방향은 정면 그림으로 채웁니다. 그래야 게임 쪽에서 예외 처리 없이
"몇 번째 줄" 만 보고 그릴 수 있습니다.
"""
from pathlib import Path
import re
import sys

from PIL import Image

# 윈도우 기본 콘솔에서도 한글이 깨지지 않게
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

ROOT = Path(__file__).resolve().parent.parent
SRC_DIR = ROOT / 'assets' / 'sprites'
OUT = ROOT / 'assets' / 'player.png'

# 게임 쪽 ROW_ORDER 와 순서가 같아야 합니다 (src/sprites.js)
ROW_ORDER = ['down', 'up', 'left', 'right']

# 파일 이름의 괄호 안 표기 → 방향
SUFFIX_TO_DIR = {
    '': 'down', 'front': 'down', 'down': 'down',
    'back': 'up', 'up': 'up',
    'left': 'left',
    'right': 'right',
    'side': 'right',      # 한쪽만 그렸을 때. 왼쪽은 반전해서 만듭니다.
}


def collect():
    """assets/sprites/player*.png 를 방향별로 모읍니다."""
    found = {}
    for path in sorted(SRC_DIR.glob('player*.png')):
        m = re.fullmatch(r'player(?:\((.*)\))?', path.stem)
        if not m:
            print(f'  건너뜀: {path.name} (이름 형식이 player 또는 player(방향) 이 아닙니다)')
            continue
        suffix = (m.group(1) or '').strip().lower()
        if suffix not in SUFFIX_TO_DIR:
            print(f'  건너뜀: {path.name} (모르는 방향 "{suffix}")')
            continue
        found[SUFFIX_TO_DIR[suffix]] = (path, suffix == 'side')
    return found


def main():
    if not SRC_DIR.is_dir():
        sys.exit(f'{SRC_DIR} 가 없습니다.')

    found = collect()
    if 'down' not in found:
        sys.exit('정면 그림(assets/sprites/player.png)이 없습니다. 이게 기준이라 반드시 필요합니다.')

    images = {d: Image.open(p).convert('RGBA') for d, (p, _) in found.items()}

    # "(side)" 를 오른쪽으로 받았고 왼쪽 그림이 없으면 반전해서 채웁니다.
    if found.get('right', (None, False))[1] and 'left' not in images:
        images['left'] = images['right'].transpose(Image.FLIP_LEFT_RIGHT)
        found['left'] = (found['right'][0], True)

    base = images['down']
    fw = fh = base.height                       # 프레임은 정사각형(16x16) 기준
    frames = base.width // fw

    for d, img in images.items():
        if img.size != base.size:
            sys.exit(f'{found[d][0].name} 크기가 {img.size} 입니다. '
                     f'정면 그림과 같은 {base.size} 여야 합니다.')

    sheet = Image.new('RGBA', (base.width, fh * len(ROW_ORDER)), (0, 0, 0, 0))
    for row, direction in enumerate(ROW_ORDER):
        img = images.get(direction, base)        # 없는 방향은 정면으로
        sheet.paste(img, (0, row * fh))
        src = found[direction][0].name if direction in found else f'{found["down"][0].name} (대체)'
        print(f'  {row}행 {direction:<5} ← {src}')

    OUT.parent.mkdir(parents=True, exist_ok=True)
    sheet.save(OUT)
    print(f'\n{OUT.relative_to(ROOT)} 저장: {sheet.width}x{sheet.height} '
          f'(프레임 {fw}x{fh}, 가로 {frames}칸, 세로 {len(ROW_ORDER)}방향)')
    missing = [d for d in ROW_ORDER if d not in found]
    if missing:
        print(f'아직 그림이 없는 방향: {", ".join(missing)}')


if __name__ == '__main__':
    main()
