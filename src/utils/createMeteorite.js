import * as THREE from 'three' // 導入three.js
import * as CANNON from 'cannon-es' // 物理引擎
class Meteteorite {
  constructor(scene) {
    this.mesh = new THREE.Object3D()
    this.meteteoriteInUse = []
    this.scene =scene
    // 隕石的角度和距離
    this.distance = 0
    this.angle = 0
    // 使用十二面緩衝體
    const MeteteoGeoMetry = new THREE.DodecahedronGeometry(25)
    // 查詢shineness specukar參數用途
    const material = new THREE.MeshPhongMaterial({
       color:"#e0115f",
       shininess:0,
       specular:0xffffff,
       flatShading: true,
    })
    this.mesh = new THREE.Mesh(MeteteoGeoMetry,material)
    this.mesh.castShadow = true
    this.mesh.receiveShadow = true
  }
}

class MeteteoRitesHolder {
  constructor(scene,world) {
    // 隕石定位基準點
    this.mesh = new THREE.Object3D();
    this.mesh.name = 'stones_Group'
    this.meteteoriteInUse = [];
    this.scene = scene
    this.world = world // 物理引擎世界
    this.stonesInWorld = []
    this.stonesHeightRatio = [0.8,0.6,0.9,0.6,0.75,0.6,0.55,0.89,0.65]
  }
  createMeteorites() {
    // 先清掉舊有scene和world物理世界的隕石
    this.stonesInWorld.forEach(stone=>{
      this.world.removeBody(stone)
    })
    this.stonesInWorld = []
    this.meteteoriteInUse = [];
    const stonesGroup = this.scene.children.filter(mesh=>mesh.name ==="stones_Group")
    if (stonesGroup.length) {
      const stonesInScene = stonesGroup[0].children.filter(mesh=>mesh.name.includes("stone"))
      console.log("stonesInScene",stonesInScene)
       stonesInScene.forEach(stone=> {
         //刪除隕石子節點
         this.mesh.remove(stone)
       })
      
    }
    this.mesh.position.x = 0
    this.mesh.position.y = -600
    // 要產生的隕石數重構成遊戲level決定(最多5+2顆)
    const num_MeteoRites = this.scene.gameData.gameLevel + 2
    console.log("現在隕石產生數",num_MeteoRites)
    for (let i = 0; i<num_MeteoRites;i++) {
      const stone = new Meteteorite()
      stone.angle = -(i*0.25)
      // x介於-200~300 y介於 -100~150
      // distance = 海洋半徑 + 預設飛機高 + (-1~1)* 飛機振福
      // stone.distance = 1050 + (Math.random()*2-1)*80
      stone.distance = 850
      stone.mesh.position.y =  -600 + Math.sin(stone.angle)*stone.distance + 50*i
      stone.mesh.position.x =  Math.cos(stone.angle)*stone.distance
      stone.mesh.position.z = 0
      stone.mesh.name = `stone${i}`
      stone.randomHeight = (-1 + Math.random() * 2) *100


      // 推入使用中的隕石清單 推入隕石實體(包含角度等)
      this.mesh.add(stone.mesh)
      this.meteteoriteInUse.push(stone);
      // 隕石加入物理世界
      const stoneMaterial = new CANNON.Material()
      const stoneShape =  new CANNON.Sphere(25)
      const stoneBody = new CANNON.Body(
        { 
          mass: 0,
          material:stoneMaterial
        })
      stoneBody.addShape(stoneShape)
      stoneBody.name = `stone${i}`
      stoneBody.position.set(
        stone.mesh.position.x,
        stone.mesh.position.y - 600,
        stone.mesh.position.z,
      )
      this.world.addBody(stoneBody)
      console.log("this world boddies",this.world.bodies)
    } 
     this.stonesInWorld = this.world.bodies.filter(item=>item.name.includes("stone"))
     this.scene.add(this.mesh)
  }
  rotate() { 
    // 正在使用的隕石加入旋轉
    this.meteteoriteInUse.forEach((stone,index)=>{
        // 重構程式碼---------------------------
        if (index>0) {
            stone.mesh.position.y = (100 + Math.sin(stone.angle)* stone.distance*this.stonesHeightRatio[index] + this.scene.gameData.stonesMovePosY) 
          } else {
              stone.mesh.position.y = (100 +Math.sin(stone.angle)* stone.distance*this.stonesHeightRatio[index] + this.scene.gameData.stonesMovePosY) 
            }
        // 再次出現時隨機高度
        // 掉到海裡再調整隕石下一批出現的高度
        if (Math.cos(stone.angle)> 0.1 && Math.cos(stone.angle)>0.999999) {
          console.log("隕石變換高度")
          this.scene.gameData.stonesMovePosY = Math.floor(Math.random()*(200+ 150 + 1) -200)
         }
          stone.mesh.position.x =  Math.cos(stone.angle)*stone.distance +this.scene.gameData.stonesMovePosY*1*index
          stone.angle += 0.0015*(this.scene.gameData.deltaTime/1000)*0.6
          stone.mesh.rotation.z += Math.random()*.1;
          stone.mesh.rotation.y += Math.random()*.1;
    })

  }
  
}

export default function createMeteorites(scene,world) {
  const meteteoRitesHolder = new MeteteoRitesHolder(scene,world)
  scene.add(meteteoRitesHolder.mesh)

  return meteteoRitesHolder
}