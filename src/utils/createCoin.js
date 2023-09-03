import * as THREE from 'three' // 導入three.js
import * as CANNON from 'cannon-es' // 物理引擎
class Coin {
  constructor(i) {
    this.coinInUse = []
    // 恢復energy的三角體的角度和距離
    this.distance = 0
    this.angle = 0
    // 使用三面緩衝體
    const CoinGeoMetry = new THREE.TetrahedronGeometry(12)
    // 查詢shineness specukar參數用途
    const material = new THREE.MeshPhongMaterial({
       color:"#00ffff",
       shininess:0,
       specular:0xffffff,
       flatShading: true,
    })
    this.mesh = new THREE.Mesh(CoinGeoMetry,material)
    this.mesh.name = `coin${i}`
    this.mesh.castShadow = true
    this.mesh.receiveShadow = true
  }
}
class CoinsHolder {
  constructor(scene,world) {
    // coins Holder 基準點
    this.mesh = new THREE.Object3D()
    this.mesh.name = "coins_Group"
    // 恢復碎片取用的3d物件庫
    this.coinsInUse = []
    this.coinsPool = []
    this.scene = scene
    this.world = world
    this.coinsInWorld = []
  }
  // 產生恢復碎片的功能
  createCoins() {
    // 先清掉舊有scene和world物理世界的碎片
    this.coinsInWorld.forEach(stone=>{
      this.world.removeBody(stone)
    })
    this.coinsInUse= []
    this.coinsInWorld = [];
    const coinsGroup = this.scene.children.filter(mesh=>mesh.name ==="coins_Group")
    if (coinsGroup.length) {
      const coinsInScene = coinsGroup[0].children.filter(mesh=>mesh.name.includes("coin"))
       coinsInScene.forEach(coin=> {
         //刪除隕石子節點
         this.mesh.remove(coin)
       })
      
    }

    // 產生的碎片數隨機產生 (1~10個碎片)
    const num_Coins = 1+Math.floor(Math.random()*10)
    // 碎片距離
    const distance = 800 + 150 + (Math.random()*2-1)*150
    // 碎片擺盪幅度
    const amplitude = 10 + Math.round(Math.random()*10)
    // 迴圈產生生碎片
    for (let i=0; i<num_Coins;i++) {
      const coin = new Coin(i)
      this.mesh.add(coin.mesh)
      this.coinsInUse.push(coin)
      coin.angle = -(i*0.005)
      coin.distance = distance + Math.cos(i*0.1)*amplitude
      // 產生碎片的初始位置 (之後再靠rotation功能去移動)
      coin.mesh.name = `coin${i}`
      coin.mesh.position.y = Math.sin(coin.angle)*coin.distance
      coin.mesh.position.x = Math.cos(coin.angle)*coin.distance - i*60
      // 三角碎片加入物理引擎
      this.coinsInUse.forEach((item,index)=> {
        const coinShape =  new CANNON.Sphere(5)
        const coinMaterial = new CANNON.Material()
        const coinBody = new CANNON.Body(
          { 
            mass: 10,
            material: coinMaterial
            })
            coinBody.addShape(coinShape)
            coinBody.name = `coin${index}`
            coinBody.position.set(
              item.mesh.position.x,
              item.mesh.position.y,
              item.mesh.position.z,
              )
            this.world.addBody(coinBody)
            })
          }
      this.coinsInWorld = this.world.bodies.filter(item=>item.name.includes("coin"))
      this.scene.add(this.mesh)
    }
  rotate() {
     // 正在使用的碎片加入旋轉
    this.coinsInUse.forEach((coin,index)=>{
         if (coin.angle > Math.PI) {
          // 控制碎片再次出現的弧度
          coin.angle = 0 
          coin.mesh.position.y =  -600 + Math.sin(coin.angle)*coin.distance
          coin.mesh.position.x =  Math.cos(coin.angle)*coin.distance
          this.scene.gameData.coinsMovePosY = -100 + Math.random()*200 
        }
        // 在飛行視線(在海上看的到時)
        else if (0<=coin.angle<=Math.PI) {
          // coin.mesh.position.y =  -100 + 100*index*Math.sin(coin.angle)
          coin.mesh.position.y =  this.scene.gameData.coinsMovePosY 
          coin.mesh.position.x =  Math.cos(coin.angle)*coin.distance - index *50
        }
          coin.angle += 0.001*this.scene.gameData.deltaTime/20*0.01
          coin.mesh.rotation.z += Math.random()*.1;
          coin.mesh.rotation.y += Math.random()*.1;
          coin.mesh.rotation.z += Math.random()*.1;
          coin.mesh.rotation.y += Math.random()*.1;
        }
    )
  }
}


export default function createCoin(scene,world) {
  const coinsHolder = new CoinsHolder(scene,world)
  return coinsHolder 
 
}