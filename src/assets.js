/** 이미지 한 장을 불러옵니다. 실패하면 어디서 막혔는지 알 수 있게 에러를 던집니다. */
export function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`이미지를 불러오지 못했습니다: ${src}`));
    img.src = src;
  });
}
