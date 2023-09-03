import * as THREE from 'three' // 導入three.js
import WebGL from 'three/addons/capabilities/WebGL.js' // 如果不支援WwbGL需要警示
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'; //導入控制器
import * as CANNON from 'cannon-es' // 物理引擎
import CannonDebugRenderer from '../utils/cannonDebugRenderer'  //物理世界格線顯示
// import createRigidVehicle from '../utils/createRigidVehicle';
import createRayCastVehicle from '../utils/createRayCastVehicle';
export default function createTerrian(canvas) {
   console.log("createScene",canvas.offsetWidth,canvas.offsetHeight)
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(70,canvas.offsetWidth  / canvas.offsetHeight, 1,500); // 建立鏡頭

  //建構環境光源
  const ambient = new THREE.AmbientLight( 0xffffcc );
  scene.add(ambient);
 

const axesHelper = new THREE.AxesHelper(100);
scene.add(axesHelper);
 

 // 相機lookat 物件
  camera.position.set(-5, 0, 0);
  const renderer = new THREE.WebGLRenderer( {antialias:true,});
  renderer.render( scene, camera );
  renderer.setSize( canvas.offsetWidth, canvas.offsetHeight);
  
  // 設備像素比
  renderer.setPixelRatio(window.devicePixelRatio)
  // 渲染器背景顏色
  renderer.setClearColor(0x444444, 1)
  renderer.outputColorSpace = THREE.SRGBColorSpace
  // 背景透明度 預設是false
  renderer.setClearAlpha(0.9);
  // 物理引擎

  const solver = new CANNON.GSSolver()
  const world = new CANNON.World()
  world.broadphase = new CANNON.SAPBroadphase(world) //這段模式不太一樣
  world.gravity.set(0, -9.82, 0)
  solver.iterations = 14 // 解算迭代次數，越高越精確，一般設定 7 即可
  solver.tolerance = 0.01 // 解算容許誤差值
  const split = true
  if (split) world.solver = new CANNON.SplitSolver(solver)
  else world.solver = solver
  // 創建高地地形
  // Add the ground
        const sizeX = 16 // x軸大小位置
        const sizeZ = 16 // z軸大小位置
        const matrix = []
        // 總共網格數 =總共網格數 = sizeX * sizeZ
        for (let i = 0; i < sizeX; i++) {
          matrix.push([])
          for (let j = 0; j < sizeZ; j++) {
            // 跑到最後一項 邊緣時周圍邊框高度
            if (i === 0 || i === sizeX - 1 || j === 0 || j === sizeZ - 1) {
              const height = 3
              matrix[i].push(height)
              continue
            }
            // 地形邊坡高度
            const height = Math.cos((i / sizeX) * Math.PI * 10) * Math.cos((j / sizeZ) * Math.PI * 5) * 2 + 2
            matrix[i].push(height)
          }
        }

        const groundMaterial = new CANNON.Material('ground')
        // elementSize 越大網格越大 效果較不明顯
        console.log("matrix",matrix)
        const heightfieldShape = new CANNON.Heightfield(matrix, {
          elementSize: 100 / sizeX,
        })
        const heightfieldBody = new CANNON.Body({ mass: 0, material: groundMaterial })
        heightfieldBody.name= 'height_field' 
        heightfieldBody.addShape(heightfieldShape)
        heightfieldBody.position.set(
          // -((sizeX - 1) * heightfieldShape.elementSize) / 2,
          -(sizeX * heightfieldShape.elementSize) / 2,
          -1,
          // ((sizeZ - 1) * heightfieldShape.elementSize) / 2
          (sizeZ * heightfieldShape.elementSize) / 2
        )
        heightfieldBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0)
        world.addBody(heightfieldBody)
        createRayCastVehicle(world)

  // 一定要加入這段不然不會出現在畫面，填充入canvas子節點
  canvas.appendChild(renderer.domElement);

  
  
  // 相機控制器設定
  const controls = new OrbitControls(camera, canvas)
  controls.enableDamping = true;
  controls.target.set(0, 0, 0);
  // 上下旋轉範圍
  controls.minPolarAngle = 0;//默认值0
  controls.maxPolarAngle = Math.PI/2.5;//默认值Math.PI
  controls.minDistance = 3
  controls.maxDistance = 10


  // const clock = new THREE.Clock(); // 獲取renderLoop時間間隔
  const cannonDebugRenderer = new CannonDebugRenderer(scene, world)
  console.log("物理引擎world",world)

  
  function renderLoop() {
	requestAnimationFrame(renderLoop);
    // const spt = clock.getDelta()*1000;//毫秒
    // 物件旋轉
    // stats.update();

    renderer.render( scene, camera );
    // 用法和webgl渲染器渲染方法类似
    // const frameT = clock.getDelta();
    // 更新播放器相关的时间
    // mixer.update(frameT);
    cannonDebugRenderer.update()
    // const delta = Math.min(clock, 0.5)
    const timeStemp = 14/1000
    controls.update()
    world.step(timeStemp)
   


	}
if (WebGL.isWebGLAvailable()) {
    // Initiate function or other initializations here
    renderLoop();
} else {
    const warning = WebGL.getWebGLErrorMessage();
    canvas.appendChild(warning);
}
  // 視窗寬度改變時resize
  window.onresize = function() {
    // canvas 畫布
    renderer.setSize(canvas.offsetWidth,canvas.offsetHeight)
 
    // 相機比例
    camera.aspect=canvas.offsetWidth/canvas.offsetHeight
    // 更新相機投影
    camera.updateProjectionMatrix()
  }


}