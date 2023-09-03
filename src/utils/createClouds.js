import * as THREE from 'three' // 導入three.js
class Clouds {
  // 創建一個中心大雲朵立方體 + 子節點組裝起來
  constructor() {
    this.mesh = new THREE.Object3D()
    this.mesh.name = 'main_cloud'
    // Geometry幾何體
    const cloudGeoMetry = new THREE.BoxGeometry(20,20,20)
    // Material材質
    const material = new THREE.MeshPhongMaterial({
      color: "#FFC78E",
      transparent:true,
      opacity: 0.5,
      flatShading: true,
    })
    // 隨機數量的雲朵
    const number_blocks = 5 + Math.floor(Math.random()*3)
    // 產生雲朵mesh
    for(let i=0;i<number_blocks;i++) {
      const cloudMesh = new THREE.Mesh(cloudGeoMetry.clone(),material)
      // 雲朵位置和轉向隨機
      cloudMesh.position.x = i*15
      cloudMesh.position.y = Math.random()*100
      cloudMesh.position.z = Math.random()*10
      cloudMesh.rotation.y = Math.random()*Math.PI*2
      cloudMesh.rotation.z = Math.random()*Math.PI*2
      // 雲朵大小
      const size = Math.random()*0.9
      cloudMesh.scale.set(size,size,size)
      this.mesh.add(cloudMesh)
      // 陰影設定
      cloudMesh.receiveShadow = true
      cloudMesh.castShadow = true
    }

  }
}
export default Clouds