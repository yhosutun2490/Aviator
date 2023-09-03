import * as THREE from 'three' // 導入three.js
import WebGL from 'three/addons/capabilities/WebGL.js' // 如果不支援WwbGL需要警示
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'; //導入控制器
import * as CANNON from 'cannon-es' // 物理引擎
// import Stats from 'three/addons/libs/stats.module.js'; //性能偵率檢測
//  GUI標籤庫
// import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
// import createPoints from './createBufferGeometry'
// import createLineModel from './createLineModel'
// import createGeometry from './createGeometry'
// import createGroup from './createGroup';
// import createTexture from './createTextrue';
// 引入CSS2渲染器CSS2DRenderer和CSS2模型对象CSS2DObject
import { CSS2DRenderer,CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js';
// 引入CSS3渲染器CSS3DRenderer
// import {CSS3DRenderer,CSS3DObject} from 'three/addons/renderers/CSS3DRenderer.js';

import loadingFbx from './loadingFbx';
import createRigidVehicle from '../utils/createRigidVehicle';
import createRayCastVehicle from '../utils/createRayCastVehicle';
import CannonDebugRenderer from '../utils/cannonDebugRenderer' 

export default async function createScene(canvas) {
  console.log("createScene",canvas.offsetWidth,canvas.offsetHeight)
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(70,canvas.offsetWidth  / canvas.offsetHeight, 1,500); // 建立鏡頭
  // const geometry = new THREE.BoxGeometry(50,50,50);
  // 受光照影響的材質
//   const material = new THREE.MeshPhongMaterial({
//     color: 0xff0000,
//     shininess: 50, //高光部分的亮度，默认30
//     specular: 0x774444, //高光部分的颜色
// });
//   const mesh = new THREE.Mesh(geometry, material)
  //设置网格模型在三维空间中的位置坐标，默认是坐标原点
  // scene.add(mesh)
  // 加光源
  // let pointLight = new THREE.PointLight(0xeeff00,1.0)
  // pointLight.position.set(50, 50, 50)
  // pointLight.castShadow = true
  // scene.add(pointLight)
  // let pointLightHelper = new THREE.PointLightHelper(pointLight)
  // scene.add(pointLightHelper)
  //建構環境光源
  const ambient = new THREE.AmbientLight( 0xffffcc );
  scene.add(ambient);
  // AxesHelper：辅助观察的坐标系
  // 平行光
// const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
// directionalLight.position.set(80, 100, 50);
// directionalLight.target = mesh;
// scene.add(directionalLight);
// let directionalLightHelper = new THREE.DirectionalLightHelper(
//   directionalLight
// )
// scene.add(directionalLightHelper)

const axesHelper = new THREE.AxesHelper(100);
scene.add(axesHelper);
 
 
 
   // 渲染時間偵測
//    const clock = new THREE.Clock();
  // 渲染FPS測定
  // const stats = new Stats();
  // document.body.appendChild(stats.domElement); 

  // 實例化GUI
  // const gui = new GUI();
  // gui.domElement.style.right = '0px';
  // gui.domElement.style.width = '300px';
 


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
  world.broadphase = new CANNON.NaiveBroadphase()
  world.gravity.set(0, -9.82, 0)
  solver.iterations = 14 // 解算迭代次數，越高越精確，一般設定 7 即可
  solver.tolerance = 0.01 // 解算容許誤差值
  const split = true
  if (split) world.solver = new CANNON.SplitSolver(solver)
  else world.solver = solver


  // 一定要加入這段不然不會出現在畫面，填充入canvas子節點
  canvas.appendChild(renderer.domElement);
  await loadingFbx(scene,world)
  // 模型載完進度條要關閉顯示
  document.getElementById("progress-bar").style.display = 'none';
  // 抓出車子和跑道進行相對定位
  const kartMesh = scene.getObjectByName('Kart')
  const roadMesh = scene.getObjectByName('road')

  
  kartMesh.geometry.rotateY(Math.PI/2)
  kartMesh.geometry.scale(0.5,0.5,0.5)

  // console.log("卡丁車賽道scene","卡丁車",kartMesh,"賽道",roadMesh,"賽道邊緣",roadBorder)
  roadMesh.add(kartMesh)

  // 卡丁車打射線到賽道上
  const raycaster = new THREE.Raycaster();
  raycaster.ray.origin = kartMesh.position
  raycaster.ray.direction = new THREE.Vector3(0, -2, 0);
  
  // 相機控制器設定
  const controls = new OrbitControls(camera, canvas)
  controls.enableDamping = true;
  controls.target.set(0, 0, 0);
  // 上下旋轉範圍
  controls.minPolarAngle = 0;//默认值0
  controls.maxPolarAngle = Math.PI/2.5;//默认值Math.PI
  controls.minDistance = 3
  controls.maxDistance = 16

  // 2D標籤渲染入3D場景中
  const div = document.getElementById('button');
  // HTML元素转化为threejs的CSS2模型对象
  const tag = new CSS2DObject(div);
  tag.position.set(2.8,1.5,4.5);
  scene.add(tag)
  // 创建一个CSS2渲染器CSS2DRenderer
  const css2Renderer = new CSS2DRenderer();
 
  // width, height：canvas画布宽高度
  css2Renderer.setSize(canvas.offsetWidth, canvas.offsetHeight);
  canvas.appendChild(css2Renderer.domElement);
  css2Renderer.domElement.style.position = 'absolute';
  css2Renderer.domElement.style.top = '0%';
  css2Renderer.domElement.style.left = '0%';
  // css2Renderer.domElement.style.transform = 'translate(-50px,-50px)';

  // 卡丁車動畫測試 設定keyframeTrack
  const times = [0, 1, 2]; //時間軸
  // 各時間變換的參數 ex: 3d座標、顏色等
  const values = [2, 0, 0, 1, 0, 0, 0, 0, 0]; // 座標
  // keyframe種類
  const posKF = new THREE.KeyframeTrack('Kart.position', times, values);
  // 創建animaiton clip
  const clip = new THREE.AnimationClip("test",3,[posKF]);
  // 播放器AnimationMixer
  //包含关键帧动画的模型对象作为AnimationMixer的参数创建一个播放器mixer
  const mixer = new THREE.AnimationMixer(kartMesh);
  //AnimationMixer的`.clipAction()`返回一个AnimationAction对象
  const clipAction = mixer.clipAction(clip); 
  //.play()控制动画播放，默认循环播放
  clipAction.play(); 
  //不循环播放，执行一次后默认回到动画开头
  // clipAction.loop = THREE.LoopOnce; 
  // 物体状态停留在动画结束的时候
  // clipAction.clampWhenFinished = true;

  // const clock = new THREE.Clock(); // 獲取renderLoop時間間隔
  const cannonDebugRenderer = new CannonDebugRenderer(scene, world)
  console.log("物理引擎world",world)

  // 產生RigidVehicle
  createRigidVehicle(world)
  const mainCarBody = world.bodies.filter(item=>item.name==="main_cart")
  console.log("物理事件的cart",mainCarBody)

  // 修補部分賽道被車子穿透(以box阻擋)
  function createBorderCube(x,y,z,rotateAngle,long=1.2,width=0.25) {
    const barCubeShape = new CANNON.Box(new CANNON.Vec3(width, 0.5, long))
    const cubeBody = new CANNON.Body({ mass: 0 })
    cubeBody.addShape(barCubeShape)
    cubeBody.position.x = x
    cubeBody.position.y = y
    cubeBody.position.z = z
    cubeBody.quaternion.setFromAxisAngle(new CANNON.Vec3(0, 1, 0), rotateAngle)
    world.addBody(cubeBody)
  }
  const borderCubePosition =[
    // 彎曲賽道
    [0.9,0,-2.0, -Math.PI/7.7],
    [2.2,0,-5, -Math.PI/5],
    [3.7,0,-7, -Math.PI/4.5],
    [5.5,0,-8.6, -Math.PI/3.6],
    [7.8,0,-9.0, -Math.PI/2,1.5],
    [10.2,0,-8.0, Math.PI/4.1],
    [12.3,0,-6.3, Math.PI/3,0.8],
    [14.5,0,-6.1, -Math.PI/2.4,1.5],
    [17.5,0,-7.7, -Math.PI/3.2],
    [19.5,0,-8.9, -Math.PI/2.8,0.8],
    // S髮夾灣
    [24.5,0,-9.1, -Math.PI/1.78,0.8,0.15],
    [25.3,0,-8.9, -Math.PI/1.5,0.6,0.15],
    // S髮夾灣雙層border
    [26.0,0,-7.8, -Math.PI/1.3,0.6,0.35],
    [26.5,0,-6.6, -Math.PI/1.1,0.6,0.35],
    [26.7,0,-5.7, -Math.PI,0.6,0.35],
    [26.7,0,-5.0, -Math.PI,0.6,0.35],
    [26.7,0,-3.0, -Math.PI,0.6,0.35],
    // 直線賽道
    [12.5,0,-9.7, -Math.PI/1.99,11,0.15],
    [3.2,0,-9.7, -Math.PI/1.99,5,0.15],
    // 起始休息區賽道
    [-31.3,0,-1, -Math.PI/150,9,0.2],
    [-30.5,0,-11, -Math.PI/8,1,0.2],
    [-28.8,0,-12.8, -Math.PI/3,1,0.2],
    // 起始休息區賽道尾端後(直線邊緣)
    [-24.0,0,-13.5, -Math.PI/2,3,0.2],



  ]
  borderCubePosition.forEach(params=> createBorderCube(...params))
  
 
  

  function renderLoop() {
	requestAnimationFrame(renderLoop);
    // const spt = clock.getDelta()*1000;//毫秒
    // 物件旋轉
    // stats.update();
  

    renderer.render( scene, camera );
     // 用法和webgl渲染器渲染方法类似
    css2Renderer.render(scene, camera);
    // const frameT = clock.getDelta();
    // 更新播放器相关的时间
    // mixer.update(frameT);
    cannonDebugRenderer.update()
    // const delta = Math.min(clock, 0.5)
    const timeStemp = 14/1000
    world.step(timeStemp) 
    
    // world.bodies[0].position.x +=0.01
    // 物理引擎物件也要更新
    kartMesh.position.set(
       mainCarBody[0].position.x,
       mainCarBody[0].position.y - 0.25,
       mainCarBody[0].position.z
    )

    kartMesh.quaternion.set(
      mainCarBody[0].quaternion.x,
      mainCarBody[0].quaternion.y,
      mainCarBody[0].quaternion.z,
      mainCarBody[0].quaternion.w,
      )
    // const cameraOffset = new THREE.Vector3(0.0, 1.25, -2.0)
    // const objectPosition = new THREE.Vector3();
    // kartMesh.getWorldPosition(objectPosition);
    // camera.position.copy(objectPosition).add(cameraOffset)
  const relativeCameraOffset = new THREE.Vector3(-8, 4, 0);  
    
  const cameraOffset = relativeCameraOffset.applyMatrix4(kartMesh.matrixWorld );  
  camera.position.x = cameraOffset.x;  
  camera.position.y = cameraOffset.y;
  camera.position.z = cameraOffset.z;

   controls.target = new THREE.Vector3(mainCarBody[0].position.x,mainCarBody[0].position.y, mainCarBody[0].position.z)
   controls.update()
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
    // 2D標籤隨螢幕縮放
    css2Renderer.setSize(canvas.offsetWidth,canvas.offsetHeight)
    // 相機比例
    camera.aspect=canvas.offsetWidth/canvas.offsetHeight
    // 更新相機投影
    camera.updateProjectionMatrix()
  }

}