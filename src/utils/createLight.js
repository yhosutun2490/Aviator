import * as THREE from 'three' // 導入three.js
class Light {
  constructor() {
  // 球形光
  this.hemiSphereLight = new THREE.HemisphereLight(0xaaaaaa, 0x000000, .9)
  // 環境光
  this.ambientLight = new THREE.AmbientLight(0xdc8877, .5);
  // 平行光
  this.shadowLight = new THREE.DirectionalLight(0xffffff,0.9)
   // 設定陰影 平行光位置
  this.shadowLight.position.set(150,350,350)
  this.shadowLight.castShadow = true
  // 定義陰影的可視範圍
  this.shadowLight.shadow.camera.top = 400
  this.shadowLight.shadow.camera.left = -400
  this.shadowLight.shadow.camera.right = 400
  this.shadowLight.shadow.camera.bottom = -400
  this.shadowLight.shadow.near = 1
  this.shadowLight.shadow.far = 1000

  // 光源解析度
  this.shadowLight.shadow.mapSize.width = 2048
  this.shadowLight.shadow.mapSize.height = 2048

  }

}
export default function createLight(scene) {
  const light = new Light()
  scene.add(light.shadowLight)
  scene.add(light.hemiSphereLight)
  scene.add(light.ambientLight)
  return light
}