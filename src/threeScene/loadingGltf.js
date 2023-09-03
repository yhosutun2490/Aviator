// 引入gltf模型加載器GLTFLoader.js
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
export default function loadingGltf(scene) {
  // 實例畫加載器對象
  const loader = new GLTFLoader();
  loader.load( 'src/assets/glf/house.glb', function ( gltf ) {
  console.log('gltf對象',gltf);
  console.log('gltf物件場景',gltf.scene);

  // 返回模型場景對象scene.gltf
  scene.add(gltf.scene)
  console.log("場景中有沒有包含gltf",scene)

})
}