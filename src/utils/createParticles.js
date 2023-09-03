import * as THREE from 'three' // 導入three.js
import tween from './Tween' // 輔間動畫器
class Particle {
  constructor() {
    // 碰撞後碎片以四面幾何體為基礎 後面的參數會讓形狀的面變多
    const particleGeometry = new THREE.TetrahedronGeometry(10,1)
    const material = new THREE.MeshPhongMaterial({
       color:"#FFD700",
       shininess:0,
       specular:0xffffff,
       flatShading: true,
    })
    this.mesh = new THREE.Mesh(particleGeometry,material)
  }
  // 爆炸效果
  explode(pos,color,scale) {
    // pos = start position
    console.log('碎片爆炸')
    this.mesh.material.color = new THREE.Color(color)
    this.mesh.material.needsUpdate = true
    this.mesh.scale.set(scale,scale,scale)
    // 設定移動最終位置 targetX,targetY
    const targetX = pos.x - (-1 + Math.random()*20)*10
    const targetY = pos.y + (-1 + Math.random()*20)*10
    const startPos = {
      start:{x:this.mesh.position.x,y:this.mesh.position.y},
      end:{x:targetX,y:targetY}
    }
    const startScale = {
      start:scale,
      end: 0.05
    } 
    const startRotate = {
      start:{x:this.mesh.rotation.x,y:this.mesh.rotation.y},
      end: {x:Math.random()*12, y:Math.random()*12},
    }

    // 旋轉、放大和位移動畫
    tween(this.mesh,startPos,startScale,startRotate,500)

  }
  
}
class ParticleHolder {
  constructor() {
    // 建立碎片定位基準點
    this.mesh = new THREE.Object3D()
  }
  // 碰撞物起始位置，碎片產生數，顏色，大小
  createParticle(pos, density, color, scale) {
    console.log("產生碎片pos",pos)
    const nums_particle = density
    for (let i=0; i<nums_particle; i++){
      // 產生碎片實例 加入碎片節點
      const particle = new Particle();
      this.mesh.add(particle.mesh);
      particle.mesh.visible = true;
      // 設定碎片起始位置為碰撞物
      particle.mesh.position.y = pos.y ;
      particle.mesh.position.x = pos.x ;
      particle.explode(pos,color,scale);
  }

  }
}

export default function createParticle(scene) {
  const particleHolder = new ParticleHolder()
  // 未來呼叫particleHolder.createParicle就會加入場警
  scene.add(particleHolder.mesh)
  return particleHolder
}