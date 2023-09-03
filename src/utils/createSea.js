import * as THREE from 'three' // 導入three.js
import * as BufferGeometryUtils from 'three/addons/utils/BufferGeometryUtils.js';
class Sea {
  // 海洋物件的幾何體
  constructor() {
    // 圓柱體參數 頂部半徑、底部半徑
    const threeMesh = new THREE.CylinderGeometry(650, 650, 1000, 60, 10)
    this.seaGeoMetry =  BufferGeometryUtils.mergeVertices(threeMesh);
    // 利用matrix矩陣達到rotation等動態變化 圓柱體倒放
    this.seaGeoMetry.applyMatrix4(new THREE.Matrix4().makeRotationX(-Math.PI/2))
    this.verticesObj = 
    // 波浪
    this.waves = []
    this.material = new THREE.MeshPhongMaterial({
    color: "#57D6D0",
    transparent:true,
    opacity: 0.8,
    flatShading: true,
  })
    this.mesh = new THREE.Mesh(this.seaGeoMetry,this.material)
    this.mesh.receiveShadow = true
    // 迴圈產生渲染wave的頂點矩陣
    for (let i=0; i<this.seaGeoMetry.attributes.position.array.length;i+=3) {
      // 推入waves陣列資料並指定隨機波浪
      this.waves.push(
        {
          x:this.seaGeoMetry.attributes.position.array[i],
          y:this.seaGeoMetry.attributes.position.array[i+1],
          z:this.seaGeoMetry.attributes.position.array[i+2],
          //隨機角度
          angle: Math.random()*Math.PI*2,
          // 震幅
          amp: 5 + Math.random()*30,
          // 波浪速度
          speed: 0.016 + Math.random()*0.032
        }
      )
    }
    
  }
  // 海波浪效果
  moveWaves() {
    // 主要是要把設定好的wave頂點陣列資料 送回原本海浪物件attribute
    const vertices = this.seaGeoMetry.attributes.position.array
   // 檢測重複頂點vertice table
    const verticesMap = {}
    let waveIndex = 0
     for (let i=0; i<vertices.length;i+=3) {
      const wave = this.waves[waveIndex]  
      // verticesMap key
      const key = Math.round(vertices[i] * 100) +
        "_" +
        Math.round(vertices[i+1] * 100) +
        "_" +
        Math.round(vertices[i+2] * 100)
      // 如果有重複頂點vertice 取用先前重複頂點xyz
      if(verticesMap[key]) {
          vertices[i] = verticesMap[key][0]
          vertices[i+1] = verticesMap[key][1]
          vertices[i+2] = verticesMap[key][2]
          // console.log("有重複頂點vertices","i值",i)
      } else {
          // 透過改變原本頂點座標位置和角度產生海浪效果
          vertices[i] = wave.x + Math.cos(wave.angle)*15 + wave.amp
          vertices[i+1] = wave.y + Math.sin(wave.angle)*15 + wave.amp 
          verticesMap[key] = [vertices[i],vertices[i+1],vertices[i+2]]
      }
      // // 增加下一禎海浪角度
       this.waves[waveIndex].angle = this.waves[waveIndex].angle + this.waves[waveIndex].speed
       waveIndex++
      //  this.seaGeoMetry.setAttribute('position', new THREE.BufferAttribute( vertices, 3 ) );
       // 更新海浪新的頂點座標
       this.seaGeoMetry.attributes.position.needsUpdate = true
    }
      // this.seaGeoMetry.setAttribute('position', new THREE.BufferAttribute( vertices, 3 ) );
      // 海洋旋轉
      this.mesh.rotation.z += 0.005
  }
}

export default function createSea(scene) {
  const sea = new Sea()
  console.log("this waves",sea.waves)
  sea.mesh.position.y = -800
  scene.add(sea.mesh)
  return sea
}