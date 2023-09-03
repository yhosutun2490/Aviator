import * as THREE from 'three' // 導入three.js
export default function createTexture() {
  // 產生幾何體
  const geometry = new THREE.PlaneGeometry(60, 100);
  // 引入圖片加載器
  const textureLoader = new THREE.TextureLoader()
  const textureImage = textureLoader.load("/images/膽小狗.jpg")
  //重物材質貼圖形成磁磚
  textureImage.wrapS = THREE.RepeatWrapping;
  textureImage.wrapT = THREE.RepeatWrapping;
  textureImage.offset.x +=0.0;//纹理U方向偏移
  // 设置.wrapS也就是U方向，纹理映射模式(包裹模式)
  textureImage.wrapS = THREE.RepeatWrapping;//对应offste.x偏移
  // uv两个方向纹理重复数量
  textureImage.repeat.set(4,4);//注意选择合适的阵列数量
  const material = new THREE.MeshLambertMaterial({
    map: textureImage ,//map表示材质的颜色贴图属性
    side:THREE.DoubleSide,
    transparent: true
});
  // 測試利用uv裁切圖片
//   const uvs = new Float32Array([
//     0, 0, //图片左下角
//     0.5, 0, //图片右下角
//     0.5, 0.5, //图片右上角
//     0, 1.0, //图片左上角
// ]);
  // geometry.attributes.uv = new THREE.BufferAttribute(uvs, 2)

  const mesh = new THREE.Mesh(geometry,material)
  mesh.rotateX(-Math.PI/2);
  return {mesh,textureImage}
}