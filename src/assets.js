/** 이미지 한 장을 불러옵니다. 실패하면 어디서 막혔는지 알 수 있게 에러를 던집니다. */
export function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`이미지를 불러오지 못했습니다: ${src}`));
    img.src = src;
  });
}

/**
 * { 이름: 경로 } 를 받아 { 이름: Image } 로 돌려줍니다.
 * @param {Record<string, string>} sources
 */
export async function loadImages(sources) {
  const names = Object.keys(sources);
  const images = await Promise.all(names.map((n) => loadImage(sources[n])));
  return Object.fromEntries(names.map((n, i) => [n, images[i]]));
}
