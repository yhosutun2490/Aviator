import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import Stats from 'three/examples/jsm/libs/stats.module'
// import { GUI } from 'dat.gui'
import * as CANNON from 'cannon-es'
import CannonDebugRenderer from '../utils/cannonDebugRenderer' // 觀察物理世界物件網格
// import CannonUtils from '../utils/cannonUtils' //轉換網格
export default function createSceneTest(canvas) {
  // 創建場景
  const scene = new THREE.Scene()
  scene.add(new THREE.AxesHelper(5)) // 三維座標軸指示

  // 聚光燈1
  const light1 = new THREE.SpotLight(0xffffff, 100)
  light1.position.set(2.5, 5, 5)
  light1.angle = Math.PI / 4
  light1.penumbra = 0.5 // 這個是什麼???
  light1.castShadow = true // 這個是什麼???
  light1.shadow.mapSize.width = 1024
  light1.shadow.mapSize.height = 1024
  light1.shadow.camera.near = 0.5
  light1.shadow.camera.far = 20
  scene.add(light1)

  //聚光燈2
  const light2 = new THREE.SpotLight(0xffffff, 100)
  light2.position.set(-2.5, 5, 5)
  light2.angle = Math.PI / 4
  light2.penumbra = 0.5
  light2.castShadow = true
  light2.shadow.mapSize.width = 1024
  light2.shadow.mapSize.height = 1024
  light2.shadow.camera.near = 0.5
  light2.shadow.camera.far = 20
  scene.add(light2)

  //相機
  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
    )
    camera.position.set(0, 2, 4)

  //渲染器設定
  const renderer = new THREE.WebGLRenderer()
  renderer.setSize(canvas.offsetWidth, canvas.offsetHeight)
  renderer.shadowMap.enabled = true
  canvas.appendChild(renderer.domElement)

  // 相機控制器
  const controls = new OrbitControls(camera, renderer.domElement)
  controls.enableDamping = true
  controls.target.y = 0.5

  // 初始化材質設定
  const normalMaterial = new THREE.MeshNormalMaterial()
  const phongMaterial = new THREE.MeshPhongMaterial()

  // 物理引擎世界初始化
  const world = new CANNON.World()
  world.gravity.set(0, -9.82, 0)
  world.broadphase = new CANNON.NaiveBroadphase()
  // ;(world.solver as CANNON.GSSolver).iterations = 10
  world.allowSleep = true

  // 方塊物件 three.js
  const cubeGeometry = new THREE.BoxGeometry(1, 1, 1)
  const cubeMesh = new THREE.Mesh(cubeGeometry, normalMaterial)
  cubeMesh.position.x = -3
  cubeMesh.position.y = 3
  cubeMesh.castShadow = true
  scene.add(cubeMesh)

  // 方塊物件 cannon.js 方塊的長寬計算比例會是three.js實體一半
  const cubeShape = new CANNON.Box(new CANNON.Vec3(0.5, 0.5, 0.5))
  const cubeBody = new CANNON.Body({ mass: 1 })
  cubeBody.addShape(cubeShape)
  cubeBody.position.x = cubeMesh.position.x
  cubeBody.position.y = cubeMesh.position.y
  cubeBody.position.z = cubeMesh.position.z
  world.addBody(cubeBody)
  
  // 球體物件Three.js 
  const sphereGeometry = new THREE.SphereGeometry()
  const sphereMesh = new THREE.Mesh(sphereGeometry, normalMaterial)
  sphereMesh.position.x = -1
  sphereMesh.position.y = 3
  sphereMesh.castShadow = true
  scene.add(sphereMesh)

  // 球體物件 cannon.js
  const sphereShape = new CANNON.Sphere(1)
  const sphereBodyMaterial = new CANNON.Material()
  const sphereBody = new CANNON.Body({ 
    mass: 1,
    material: sphereBodyMaterial
   })
  sphereBody.addShape(sphereShape)
  sphereBody.position.x = sphereMesh.position.x
  sphereBody.position.y = sphereMesh.position.y
  sphereBody.position.z = sphereMesh.position.z
  world.addBody(sphereBody)

  // 多邊形體物件Three.js 
  const icosahedronGeometry = new THREE.IcosahedronGeometry(1, 0)
  const icosahedronMesh = new THREE.Mesh(icosahedronGeometry, normalMaterial)
  icosahedronMesh.position.x = 1
  icosahedronMesh.position.y = 3
  icosahedronMesh.castShadow = true
  scene.add(icosahedronMesh)

  // 多邊形體物件Cannon.js 

  const icosahedronPoints = []

  let position = icosahedronMesh.geometry.attributes.position.array
for (let i = 0; i < position.length; i += 3) {
    icosahedronPoints.push(new CANNON.Vec3(position[i], position[i + 1], position[i + 2]))
  }
  const icosahedronFaces = []

for (let i = 0; i < position.length / 3; i += 3) {
    icosahedronFaces.push([i, i + 1, i + 2])
}
  const icosahedronShape = new CANNON.ConvexPolyhedron({
    vertices: icosahedronPoints,
    faces: icosahedronFaces,
  })
  const icosahedronBody = new CANNON.Body({ mass: 1 })
  icosahedronBody.addShape(icosahedronShape)
  icosahedronBody.position.x = icosahedronMesh.position.x
  icosahedronBody.position.y = icosahedronMesh.position.y
  icosahedronBody.position.z = icosahedronMesh.position.z
  world.addBody(icosahedronBody)

  //圓環扭結體 Three.js 
  const torusKnotGeometry = new THREE.TorusKnotGeometry()
  const torusKnotMesh = new THREE.Mesh(torusKnotGeometry, normalMaterial)
  torusKnotMesh.position.x = 4
  torusKnotMesh.position.y = 3
  torusKnotMesh.castShadow = true
  scene.add(torusKnotMesh)

  //圓環扭結體 Cannon.js 
  const torusKnotShape = CreateTrimesh(torusKnotMesh.geometry)
  const torusKnotBody = new CANNON.Body({ mass: 1 })
  torusKnotBody.addShape(torusKnotShape)
  torusKnotBody.position.x = torusKnotMesh.position.x
  torusKnotBody.position.y = torusKnotMesh.position.y
  torusKnotBody.position.z = torusKnotMesh.position.z
  world.addBody(torusKnotBody)

  // 重力平板 three.js
  const planeGeometry = new THREE.PlaneGeometry(25, 25)
  const planeMesh = new THREE.Mesh(planeGeometry, phongMaterial)
  // 轉向變成平躺
  planeMesh.rotateX(-Math.PI / 2)
  planeMesh.receiveShadow = true
  scene.add(planeMesh)

  // 重力平板 cannon.js
  const planeShape = new CANNON.Plane(12.5,12.5)
  // mas 質量設成=0 代表為靜態不移動
  const planeBodyMaterial = new CANNON.Material()
  const planeBody = new CANNON.Body({
     mass: 0,
     material: planeBodyMaterial 
    })
 
  planeBody.addShape(planeShape)
  // cannon body物件旋轉用api
  planeBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2)
  world.addBody(planeBody)

  // 三角面產生器
  function CreateTrimesh(geometry) {
    const vertices = geometry.attributes.position.array
    console.log("圓環緩衝扭結體vertices",vertices)
    const indices = Object.keys(vertices).map(Number)
    // 必須返回多個三角面產生器 去讓物理引擎產生障礙網格
    return new CANNON.Trimesh(vertices, indices)
  }

  // 設定剛體間碰撞係數
  let sphereGroundContact
  sphereGroundContact = new CANNON.ContactMaterial(planeBodyMaterial, sphereBodyMaterial, {
    friction: 0.5, // 摩擦係數
    restitution: 0.7 //反彈恢復係數
  })
  world.addContactMaterial(sphereGroundContact)
  // 視窗RWD調整3D場景
  window.addEventListener('resize', onWindowResize, false)
  
  function onWindowResize() {
    camera.aspect = canvas.offsetWidth / canvas.offsetHeight
    camera.updateProjectionMatrix()
    renderer.setSize(canvas.offsetWidth,canvas.offsetHeight)
    render()
  }

  // 渲染函式
  function render() {
    renderer.render(scene, camera)
  }

  //GUI產生器
  const stats = new Stats()
  canvas.appendChild(stats.dom)

  // const gui = new GUI()
  // const physicsFolder = gui.addFolder('Physics')
  // physicsFolder.add(world.gravity, 'x', -10.0, 10.0, 0.1)
  // physicsFolder.add(world.gravity, 'y', -10.0, 10.0, 0.1)
  // physicsFolder.add(world.gravity, 'z', -10.0, 10.0, 0.1)
  // physicsFolder.open()

  // 自己創造箱子GUI
  // const CubeGui =  gui.addFolder('Cube')
  // CubeGui.add(cubeBody.position,'x',-2,0,2)
  // CubeGui.open() 
  const clock = new THREE.Clock()
  let delta

  const cannonDebugRenderer = new CannonDebugRenderer(scene, world)

  // 動畫每帪更新
  
function animate() {
    requestAnimationFrame(animate)
    controls.update()
    // 呼叫實例化後的update function
    console.log("cannonDebugRenderer實力",cannonDebugRenderer)
    cannonDebugRenderer.update()

    // delta = clock.getDelta()
    delta = Math.min(clock.getDelta(), 0.1)
    world.step(delta)
 
    cubeMesh.position.set(cubeBody.position.x, cubeBody.position.y, cubeBody.position.z)
    cubeMesh.quaternion.set(
        cubeBody.quaternion.x,
        cubeBody.quaternion.y,
        cubeBody.quaternion.z,
        cubeBody.quaternion.w
    )
    sphereMesh.position.set(sphereBody.position.x, sphereBody.position.y, sphereBody.position.z)
    sphereMesh.quaternion.set(
        sphereBody.quaternion.x,
        sphereBody.quaternion.y,
        sphereBody.quaternion.z,
        sphereBody.quaternion.w
    )
    icosahedronMesh.position.set(
        icosahedronBody.position.x,
        icosahedronBody.position.y,
        icosahedronBody.position.z
    )
    icosahedronMesh.quaternion.set(
        icosahedronBody.quaternion.x,
        icosahedronBody.quaternion.y,
        icosahedronBody.quaternion.z,
        icosahedronBody.quaternion.w
    )
    torusKnotMesh.position.set(
        torusKnotBody.position.x,
        torusKnotBody.position.y,
        torusKnotBody.position.z
    )
    torusKnotMesh.quaternion.set(
        torusKnotBody.quaternion.x,
        torusKnotBody.quaternion.y,
        torusKnotBody.quaternion.z,
        torusKnotBody.quaternion.w
    )

    render()

    stats.update()
  }

  animate()
}