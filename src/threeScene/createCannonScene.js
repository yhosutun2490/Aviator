import * as THREE from 'three' // 導入three.js
import WebGL from 'three/addons/capabilities/WebGL.js' // 如果不支援WwbGL需要警示
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'; //導入控制器
import * as CANNON from 'cannon-es' // 物理引擎
export default async function createCannonScene(canvas) {
  console.log("createScene",canvas.offsetWidth,canvas.offsetHeight)
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75,canvas.offsetWidth  / canvas.offsetHeight, 1,100); 
  const ambient = new THREE.AmbientLight( 0xffffcc );
  scene.add(ambient);
  const axesHelper = new THREE.AxesHelper(100);
  scene.add(axesHelper);
 
 
 // 相機lookat 物件
  camera.position.set(-5, 0, 0);
  camera.lookAt(0, 0, 0);
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
  // 一定要加入這段不然不會出現在畫面，填充入canvas子節點
  canvas.appendChild(renderer.domElement);

  // 相機控制器設定
  const controls = new OrbitControls(camera, canvas)
  controls.enableDamping = true;
  controls.target.set(0, 0, 0);
  // 上下旋轉範圍
  controls.minPolarAngle = 0;//默认值0
  controls.maxPolarAngle = Math.PI/2.5;//默认值Math.PI
  controls.minDistance = 4
  controls.maxDistance = 12

  // CANNON.js物理引擎世界設定
  // 建立物理世界
  const world = new CANNON.World()
  console.log("cannon場景",world)
  // 設定重力場為 y 軸 -9.8 m/s²
  world.gravity.set(0, -9.8, 0)
  // 碰撞偵測
  world.broadphase = new CANNON.NaiveBroadphase()
  // 建立球剛體
  let sphereShape = new CANNON.Sphere(1)
  let sphereCM = new CANNON.Material()
  let sphereBody = new CANNON.Body({
      mass: 5, // 設定質量讓他有重力作用
      shape: sphereShape,
      position: new CANNON.Vec3(0, 10, 0),
      material: sphereCM
    })
  world.addBody(sphereBody)
  // 建立地板剛體
let groundShape = new CANNON.Plane()
let groundCM = new CANNON.Material()
let groundBody = new CANNON.Body({
  mass: 0,
  shape: groundShape,
  material: groundCM
})
// setFromAxisAngle 旋轉 x 軸 -90 度
groundBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2)
world.addBody(groundBody)

// 設定剛體間碰撞係數
let sphereGroundContact
sphereGroundContact = new CANNON.ContactMaterial(groundCM, sphereCM, {
  friction: 0.5, // 摩擦係數
  restitution: 0.7 //反彈恢復係數
})
world.addContactMaterial(sphereGroundContact)

// 地板網格
let groundGeometry = new THREE.PlaneGeometry(20, 20, 32)
let groundMaterial = new THREE.MeshLambertMaterial({
  color: 0xa5a5a5,
  side: THREE.DoubleSide
})
let ground = new THREE.Mesh(groundGeometry, groundMaterial)
ground.rotation.x = -Math.PI / 2
ground.receiveShadow = true
scene.add(ground)

// 球網格
let sphereGeometry = new THREE.SphereGeometry(1, 32, 32)
let sphereMaterial = new THREE.MeshStandardMaterial({ color: 0x33aaaa })
let sphere = new THREE.Mesh(sphereGeometry, sphereMaterial)
sphere.castShadow = true
scene.add(sphere)

// 物理引擎刷新頻率 
const timeStep = 1.0 / 60.0 

function renderLoop() {
	requestAnimationFrame(renderLoop);
    controls.update()
    // 測試相機位置改變
    // console.log('camera.position',camera.position);
    // console.log('camera.target',controls.target);
    renderer.render( scene, camera );
    world.step(timeStep)
  if (sphere) {
    // three.js球的物件 跟著剛體物件位置同步 很重要!!!!!
    sphere.position.copy(sphereBody.position)
    sphere.quaternion.copy(sphereBody.quaternion)
  }

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