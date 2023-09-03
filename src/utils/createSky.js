import * as THREE from 'three' // 導入three.js
import Clouds  from '../utils/createClouds'

class Sky {
  constructor() {
    // 定義天空物件Group節點
    this.mesh = new THREE.Object3D()
    // 設定雲朵產生數量
    const number_clouds = 20
    // 為了讓雲朵均勻分布在空間裡 將360度除以雲朵數
    const cloudDistributedAngle = Math.PI*2 / number_clouds
    // 產生雲朵實例
    for (let i=0;i<number_clouds;i++) {
      const cloud = new Clouds()
      const angle =  cloudDistributedAngle*i
      const height = 700 + Math.random()*200
      cloud.mesh.position.x = Math.sin(angle) * height
      cloud.mesh.position.y = Math.cos(angle) * height +20
      // z軸旋轉
      cloud.mesh.rotation.z = angle + Math.PI/2
      // 放大縮小倍率
      const size = 1+Math.random()*2
      cloud.mesh.scale.set(size,size,size)
      this.mesh.add(cloud.mesh)
    }
  }
}

export default function createSky(scene) {
  const sky = new Sky()
  sky.mesh.position.y = -700
  scene.add(sky.mesh)
  return sky
}