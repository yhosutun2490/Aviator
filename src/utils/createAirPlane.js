import * as THREE from 'three' // 導入three.js
import * as BufferGeometryUtils from 'three/addons/utils/BufferGeometryUtils.js';
class AirPlane {
  constructor() {
    // 飛機主體
    this.mesh = new THREE.Object3D()
    // 機艙、機尾、引擎、翅膀
    // 機艙 boxgeometry 長寬高+解析度分段數
    const cockPitGeoMetryOriginal = new THREE.BoxGeometry(120,50,50,1,1,1)
    const cockPitGeoMetry = BufferGeometryUtils.mergeVertices( cockPitGeoMetryOriginal)
    const cockPitMaterial = new THREE.MeshPhongMaterial({
      color: "#FF5151",
      transparent:true,
      opacity: 1.0,
      flatShading: true,
    })
    const cockPitMesh = new THREE.Mesh(cockPitGeoMetry,cockPitMaterial)
    cockPitMesh.name = 'cockpit'
    // 陰影設定
    cockPitMesh.receiveShadow = true
    cockPitMesh.castShadow = true
    this.mesh.add(cockPitMesh)
    cockPitMesh.position.x = -30
    console.log("機艙geometry",cockPitGeoMetry)
    // const cockPitvertices = cockPitGeoMetry.attributes.position.array
    // 修飾機艙形狀
    // for (let i=0;i<cockPitMesh.geometry.attributes.position.count;i+=3) {
    //   if(i<=12) {
    //     cockPitMesh.geometry.attributes.position.array[i+1] +=50
    //      cockPitMesh.geometry.attributes.position.array[i+2] -= 20 
    //   }
    // }
    cockPitGeoMetry.attributes.position.needsUpdate = true
    //---------------------------------------------
    //引擎主體
    const engineGeoMetry = new THREE.BoxGeometry(20,70,50,1,1,1)
    const engineMaterial = new THREE.MeshPhongMaterial({
      color: "#FCFCFC",
      transparent:true,
      opacity: 1.0,
      flatShading: true,
    })
    const engineMesh = new THREE.Mesh(engineGeoMetry,engineMaterial)
    engineMesh.name ="engine"
    // 陰影設定
    engineMesh.receiveShadow = true
    engineMesh.castShadow = true
    // 調整引擎位置(以飛機主體為座標原始參考點)
    this.mesh.add(engineMesh)
    engineMesh.position.x = 40

    // 機尾
    const tailGeoMetry = new THREE.BoxGeometry(15,30,5,1,1,1)
    const tailMaterial = new THREE.MeshPhongMaterial({
      color: "#006030",
      transparent:true,
      opacity: 1.0,
      flatShading: true,
    })
    const tailMesh = new THREE.Mesh(tailGeoMetry,tailMaterial)
    tailMesh.name = 'tail'
    // 陰影設定
    tailMesh.receiveShadow = true
    tailMesh.castShadow = true
    // 調整引擎位置(以飛機主體為座標原始參考點)
    this.mesh.add(tailMesh)
    tailMesh.position.set(-90,25,0)
    tailMesh.rotateZ(Math.PI/5)

    // 機翼
    const sideWingGeoMetry = new THREE.BoxGeometry(40,80,150,1,1,1)
    const sideWingMaterial = new THREE.MeshPhongMaterial({
      color: "#613030",
      transparent:true,
      opacity: 1.0,
      flatShading: true,
    })
    const sideWingMesh = new THREE.Mesh(sideWingGeoMetry,sideWingMaterial)
    sideWingMesh.name ='sideWing'
    // 陰影設定
    sideWingMesh.receiveShadow = true
    sideWingMesh.castShadow = true
    // 調整引擎位置(以飛機主體為座標原始參考點)
    this.mesh.add(sideWingMesh)
    
    //螺旋槳轉軸propeller
    const propellerGeoMetry = new THREE.BoxGeometry(20,10,10,1,1,1)
    const  propellerMaterial = new THREE.MeshPhongMaterial({
      color: "#F9F900",
      transparent:true,
      opacity: 1.0,
      flatShading: true,
    })
    const  propellerMesh = new THREE.Mesh(propellerGeoMetry,propellerMaterial)
    propellerMesh.name ="propeller"
    // 陰影設定
    propellerMesh.receiveShadow = true
    propellerMesh.castShadow = true
    // 調整引擎位置(以飛機主體為座標原始參考點)
    this.mesh.add(propellerMesh)
    propellerMesh.position.x = 60

    // 螺旋槳扇片
    const bladeGeoMetry = new THREE.BoxGeometry(150,5,10,1,1,1)
    const  bladeMaterial = new THREE.MeshPhongMaterial({
      color: "#009100",
      transparent:true,
      opacity: 1.0,
      flatShading: true,
    })
    const  bladeMesh = new THREE.Mesh(bladeGeoMetry,bladeMaterial)
    bladeMesh.name = 'blade'
    // 陰影設定
    bladeMesh.receiveShadow = true
    bladeMesh.castShadow = true
    // 調整引擎位置(以飛機主體為座標原始參考點)
    this.mesh.add(bladeMesh)
    propellerMesh.add(bladeMesh)
    bladeMesh.position.set(5,0,0)
    bladeMesh.rotation.y = -Math.PI/2

  }
}

export default function createAirPlane(scene) {
  const airPlane = new AirPlane()
  //調整飛機大小
  airPlane.mesh.scale.set(0.9,0.9,0.9)
  airPlane.mesh.position.y = 
  airPlane.mesh.position.z = 5
  scene.add(airPlane.mesh)
  return airPlane
}