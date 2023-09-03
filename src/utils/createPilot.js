import * as THREE from 'three' // 導入three.js
class Pilot {
  constructor() {
    this.mesh = new THREE.Object3D()
    this.mesh.name = "pilot"
    // 飛行員頭髮角度
    this.hairAngle = 0
    // 飛行員身體
    const bodyGeoMetry = new THREE.BoxGeometry(15,15,15)
    const bodyMaterial = new THREE.MeshPhongMaterial({
      color: "#57D6D0",
      transparent:false,
      opacity: 1.0,
      flatShading: true,
    })
    const body = new THREE.Mesh(bodyGeoMetry,bodyMaterial)
    this.mesh.add(body)
    body.position.set(2,-12,0)

    // 飛行員臉蛋
    const faceGeoMetry = new THREE.BoxGeometry(10,10,10)
    const faceMaterial = new THREE.MeshPhongMaterial({
      color: "f9c6cf",
      transparent:false,
      opacity: 1.0,
      flatShading: true,
    })
    const face = new THREE.Mesh(faceGeoMetry,faceMaterial)
    this.add(face)

    // 頭髮
    const hairGeoMetry = new THREE.BoxGeometry(4,4,4)
    const hairMaterial = new THREE.MeshPhongMaterial({
      color: "#444444",
      transparent:false,
      opacity: 1.0,
      flatShading: true,
    })
    const hair = new THREE.Mesh( hairGeoMetry,hairMaterial)
    // appyMatrix 需要釐清這段用意
    hair.geometry.applyMatrix4(new THREE.Matrix4().makeTranslation(0,2,0))
    this.add(hair)
    // 創建頭髮基礎節點
    const hairs = new THREE.Object3D()
    // 頭髮動畫的節點(@調用render loop進行)
    this.hairsTop = new THREE.Object3D()
    for(let i=0;i<12;i++) {
      const hairClone = hair.clone()
      const col = i%3
      const row = Math.floor(i/3)
      const startPosZ = -4
      const startPosX = -4
      hairClone.position.set(startPosX+row*4,startPosZ+col*4)
      this.hairsTop.add(hairClone)
    }
  }
}