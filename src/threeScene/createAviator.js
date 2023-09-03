import * as THREE from 'three' // 導入three.js
import WebGL from 'three/addons/capabilities/WebGL.js' // 如果不支援WwbGL需要警示
import * as TWEEN from '@tweenjs/tween.js'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'; //導入控制器
import * as CANNON from 'cannon-es' // 物理引擎
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader' //模型載入
import CannonDebugRenderer from '../utils/cannonDebugRenderer'
import createSea from '../utils/createSea';
import createLight from '../utils/createLight';
import createSky from '../utils/createSky';
import createMeteorites from '../utils/createMeteorite';
import createCoin from '../utils/createCoin';
import createParticle from '../utils/createParticles';




export default async function createAviator(canvas) {
  console.log("createScene",canvas.offsetWidth,canvas.offsetHeight)
  const scene = new THREE.Scene();

  // 物理引擎
  const solver = new CANNON.GSSolver()
  const world = new CANNON.World()
  world.broadphase = new CANNON.NaiveBroadphase(world) //這段模式不太一樣
  world.gravity.set(-5, -5, 0)
  solver.iterations = 7 // 解算迭代次數，越高越精確，一般設定 7 即可
  solver.tolerance = 0.01 // 解算容許誤差值
  const split = true
  if (split) world.solver = new CANNON.SplitSolver(solver)
  else world.solver = solver
  // 建立鏡頭
  const camera = new THREE.PerspectiveCamera(70,canvas.offsetWidth  / canvas.offsetHeight, 1,2000); 

  // 遊戲狀態資料
  scene.gameData = {
    meteoritesPool:[],
    coinsPool: [],
    deltaTime: 0, // 遊戲經過時間
    newTime: new Date().getTime(),
    oldTime: new Date().getTime(),
    timeExtra: 0,
    // 遊戲level
    gameLevel: 1,
    gameSpeed: 0.0000001,
    gameBaseSpeed: 0.0000035,
    levelLastUpdateDistance:0,
    distanceForLevelUpdate:300,
     // 飛行距離
    flyDistance: 0,

    // 被隕石撞到的參數
    collisionSpeedX:0,
    collisionSpeedY:0,
    collisionAngle:0,
    // 恢復碎片飛行的高度
    coinsMovePosY:80,
    // 隕石飛行高度
    stonesMovePosY: 50,
    // 飛機的energy
    energy: 100,
    // 撞到飛機或石頭要扣血的值
    stoneCollisionValue: 10,
    coinCollisionValue: 1,
   
    // 轉一圈預設距離
    ratioSpeedDistance:50,
    // 遊戲狀態
    gameSate: "playing"
  }


  // 使用者滑鼠移動位置
  let mouseMovPos = {x:0 ,y:0}

  //建構環境光源
  // const ambient = new THREE.AmbientLight( 0xffffcc );
  // scene.add(ambient);
 

  const axesHelper = new THREE.AxesHelper(600);
  // xyz helper顏色 x=紅 y=綠 z=藍
  axesHelper.setColors ("#FF0000", "#009100","#0000E3")
  scene.add(axesHelper);

 // 創建海洋
 const sea = createSea(scene)

 // 創建光
 const light = createLight(scene)
 // 產生天空
  const sky = createSky(scene)
  // 創建飛機
  // const airPlane = createAirPlane(scene)

  // 載入飛機模型
await loadingFbxModel()
const airPlaneModel =  scene.getObjectByName('airplane_model')
const modelPointLight = scene.getObjectByName('Point')
modelPointLight.intensity = 1500
console.log("飛機模型",airPlaneModel,"點光",modelPointLight)
airPlaneModel.position.x = 0
airPlaneModel.position.y = 0
airPlaneModel.position.z = 0
airPlaneModel.rotation.z = Math.PI/6

// 飛機加入物理世界
// const planeShape =  new CANNON.Box(new CANNON.Vec3(80, 30, 50))
const planeShape =  new CANNON.Sphere(33)
const planeMaterial = new CANNON.Material()
const planeBody = new CANNON.Body(
  { 
    mass: 10,
    material: planeMaterial
  })
// planeBody.position.set(airPlaneModel.position)
planeBody.addShape(planeShape)
planeBody.name = "airplane_model"
planeBody.position.set(
  airPlaneModel.position.x,
  airPlaneModel.position.y,
  airPlaneModel.position.z,
)
world.addBody(planeBody)


//產生隕石
const stonesHolder = createMeteorites(scene,world)
stonesHolder.createMeteorites()


// 產生恢復用的三角碎片
const coinsHolder = createCoin(scene,world)
coinsHolder.createCoins()

// 找出3d場景和物理引擎的相對物件
// const coinGroup = scene.children.filter(mesh=>mesh.name ==="coins_Group")
// const coinsInScene = coinGroup[0].children.filter(mesh=>mesh.name.includes("coin"))


// 產生撞擊的碎片
 const particleHolder = createParticle(scene)

 // 相機lookat 物件
  camera.position.set(0, -50, 500);
  const renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias:true,});
  renderer.render( scene, camera );
  renderer.setSize( canvas.offsetWidth, canvas.offsetHeight);
  
  // 設備像素比
  renderer.setPixelRatio(window.devicePixelRatio)
  // 渲染器背景顏色
  renderer.setClearColor(0x445588, 1)
  renderer.outputColorSpace = THREE.SRGBColorSpace
  // 背景透明度 預設是false
  renderer.setClearAlpha(0.8);
  // 啟動陰影
  renderer.shadowMap.enabled = true

  // 一定要加入這段不然不會出現在畫面，填充入canvas子節點
  canvas.appendChild(renderer.domElement);

  // 相機控制器設定
  const controls = new OrbitControls(camera, canvas)
  controls.enableDamping = false;
  // 上下旋轉範圍
  controls.minPolarAngle = Math.PI/2.0;//默认值0
  controls.maxPolarAngle = Math.PI/1.8;//默认值Math.PI
  controls.minDistance = 100
  controls.maxDistance = 700
  // 左右旋轉上限
  controls.maxAzimuthAngle = 5.0
  controls.minAzimuthAngle = 0.0


  // const clock = new THREE.Clock(); // 獲取renderLoop時間間隔
  const cannonDebugRenderer = new CannonDebugRenderer(scene, world)
  
  
  
  // 設定使用者鼠標跟隨
  document.addEventListener("mousemove",handleMouseMove,false)

  // 動畫播放器
  const mixer = new THREE.AnimationMixer(scene);
  // const clipAction1 = mixer.clipAction(airPlaneModel.animations[1])
  const clipAction2 = mixer.clipAction(airPlaneModel.animations[3])
  // clipAction1.play(); //播放動畫
  clipAction2.play();


  

  function handleMouseMove(event) {
    // 要捕捉使用者游標位置 必須要轉成 1到-1之間
    const transformClientX = -1 + (event.clientX/canvas.offsetWidth)*2 
    const transformClientY = 1 - (event.clientY/canvas.offsetHeight)*2 
    mouseMovPos = {x:transformClientX ,y:transformClientY}
    // console.log("滑鼠座標",event.clientX,event.clientY)
  }
  // 帶入滑鼠游標位置去控制飛機在3D場景位置
  function upadteAirPlan() {
    const targetX = normalizeLimit(mouseMovPos.x,-1,1,-200,300) + scene.gameData.collisionSpeedX
    const targetY = normalizeLimit(mouseMovPos.y,-1,1,-200,200) + scene.gameData.collisionSpeedY

    // 飛機實體位置調整
    airPlaneModel.position.x = targetX
    airPlaneModel.position.y = targetY
    airPlaneModel.rotateX(scene.gameData.collisionAngle)
  }
  // 向量正規化轉換 需要複習這段原理~~~
  function normalizeLimit(pos,posMin,posMax,VecMin,VecMax) {
    // 取出位於1~-1之間移動轉換值
    const normalizeMovPos = Math.max(Math.min(pos,posMax),posMin)
    const distanceXaixis = posMax - posMin
    const distanceYaixis = VecMax - VecMin
    const pc = (normalizeMovPos-posMin)/distanceXaixis
    const movNext = VecMin + (pc*distanceYaixis)
    return  movNext
  }
  
  async function loadingFbxModel() {
    // fbx路徑
    const modelFilePath = 'src/assets/airPlane/'
    const fbxLoader = new FBXLoader()
    // 模型名稱
  const modelName = ['Airplane']
  const loader = modelName.map((item,index)=>{ 
    return new Promise((resolve,reject)=>{
    fbxLoader.load(
    modelFilePath+`${item}.fbx`,
    (object) => {
        console.log("進入loader",item,index)
        object.traverse(function (child) {
            // const texLoader = new THREE.TextureLoader();
            console.log("傳入的物件child",child.name)
        })
        console.log("fbx物件",object)
        //先調整各模型scale/position
        object.scale.set(0.2, 0.2, 0.2)
        object.rotateY(-Math.PI/2)
        object.rotateZ(-Math.PI/6)
        object.position.y = 0.1
        object.castShadow = true
        // 關閉模型點光
        object.children[1].visible = true
        object.name = "airplane_model"
        scene.add(object) 
        resolve()
    },
    (xhr) => {
        // 這裡撰寫進度條顯示邏輯
        // console.log((xhr.loaded / xhr.total) * 100 + '% loaded')
        // const percent = xhr.loaded / xhr.total *100/modelName.length;
        // const percentDiv = document.getElementById("loading-progress")
        // percentDiv.style.width = percent * 400 + "px"; //進度條元素长度
        // percentDiv.style.textIndent = percent * 400 + 5 + "px"; //縮進元素中的首行文
        // percentDiv.innerText = Math.floor(percent * 100) + '%'; //進度百分比
    },
    (error) => {
        console.log(error)
        reject()
    }
)
  })

  })

   return Promise.all(loader);

}

 // 設置監聽器 偵測飛機是否遭碰撞 畫面執行翻轉
  planeBody.addEventListener("collide",function(e) {
        console.log("飛機撞到隕石了",e.body.name)
        if (e.body.name.includes("stone")) {
          scene.gameData.collisionSpeedX = -90
          scene.gameData.collisionSpeedY = 90
          airPlaneModel.rotateX(Math.PI/10)
          // 產生撞擊碎片
          particleHolder.createParticle(planeBody.position.clone(), 15,  	"#FFDC35", 0.8)
          removeEnergy()
          updateEnergyBar()
        } else if (e.body.name.includes("coin")) {
           // 產生撞擊碎片
          particleHolder.createParticle(planeBody.position.clone(), 15,  	"#4F9D9D", 0.4)
          addEnergy()
          updateEnergyBar()
        }
      })

// 撞擊後飛機energy更新
function removeEnergy() {
  scene.gameData.energy -= scene.gameData.stoneCollisionValue
  scene.gameData.energy = Math.max(0,scene.gameData.energy)
  if (scene.gameData.energy<=0) {
    scene.gameData.gameOver = true
  }
}
function addEnergy() {
  scene.gameData.energy += scene.gameData.coinCollisionValue
  scene.gameData.energy = Math.min(scene.gameData.energy,100)
}
// 先去抓energy bar dom節點 再更新energy bar 樣式 (之後可以用Vuex重構更新)
function updateEnergyBar() {
  const energyBar = document.querySelector('.energy_bar')
  energyBar.style.right = (100-scene.gameData.energy) +"%"
  // 根據血量設定energy bar呈現顏色
  if (scene.gameData.energy<=50) {
     energyBar.style.backgroundColor = 'yellow'
  } 
  if (scene.gameData.energy<=30) {
    energyBar.style.backgroundColor = 'red'
  } 
  if (scene.gameData.energy >50) {
    energyBar.style.backgroundColor = 'green'
  }
}
function updateDistance() {
  const distanceValueHTML = document.querySelector('.score_distance_value')
  scene.gameData.flyDistance += scene.gameData.gameSpeed*scene.gameData.deltaTime*scene.gameData.ratioSpeedDistance
  distanceValueHTML.innerHTML = Math.floor(scene.gameData.flyDistance)
}
// 飛行500km為一個level
function updateLevel() {
  const levelValueHTML = document.querySelector('.score_level_value')
  levelValueHTML.innerHTML = scene.gameData.gameLevel
   // 如果達到進入下一階段的距離
   if (Math.floor(scene.gameData.flyDistance)%scene.gameData.distanceForLevelUpdate === 0 && Math.floor(scene.gameData.flyDistance) > scene.gameData.levelLastUpdateDistance) {
     // 紀錄上一階段里程數
     scene.gameData.levelLastUpdateDistance = Math.floor(scene.gameData.flyDistance)
     // level+1
     scene.gameData.gameLevel ++
     stonesHolder.createMeteorites()
     coinsHolder.createCoins()
     scene.gameData.oldTime = new Date().getTime()
     // 等級提升 隕石增加
    
    //  scene.gameData.timeExtra += 100
   }
  // 外圍圈圈css設定
  const ratio = (Math.floor(scene.gameData.flyDistance)-scene.gameData.levelLastUpdateDistance)*(189/scene.gameData.distanceForLevelUpdate)
  const circle = document.querySelector('.circle')
  circle.style.strokeDasharray = `${ratio} 189`
}

const clock = new THREE.Clock(); // 時間數據

function renderLoop() {
  if (scene.gameData.collisionSpeedY>0 || scene.gameData.collisionSpeedX <0) {
    scene.gameData.collisionSpeedX += 1 
    scene.gameData.collisionSpeedY -= 1
  }
  // 飛機撞擊後逐漸導正
  if( airPlaneModel.rotation.x>0) {
     airPlaneModel.rotateX(-Math.PI/200)
  }
   

	requestAnimationFrame(renderLoop);
    // const spt = clock.getDelta()*1000;//毫秒
    // 物件旋轉
    // stats.update();
    // 海洋波浪效果
    sea.moveWaves()
    // 天空旋轉帶動雲朵
    sky.mesh.rotation.z += 0.005
    // 飛機位置隨滑鼠移動
    upadteAirPlan()|
    // 隕石和碎片擺動
    stonesHolder.rotate()
    coinsHolder.rotate()
 

    cannonDebugRenderer.update()
    // const delta = Math.min(clock, 0.5)
    const timeStemp = 14/1000
    controls.update()
    world.step(timeStemp)

    // 遊戲時間計時器----------
    scene.gameData.newTime = new Date().getTime()
    scene.gameData.deltaTime = scene.gameData.newTime - scene.gameData.oldTime + scene.gameData.timeExtra

  
    renderer.render( scene, camera );
    // 用法和webgl渲染器渲染方法类似
    const frameT = clock.getDelta();
    // 更新播放器相关的时间
    mixer.update(frameT);

    // three.js和cannon.js 同步更新 
    // 微調物理碰撞球體位置
    planeBody.position.set(
       airPlaneModel.position.x+25 ,
       airPlaneModel.position.y+100 ,
       airPlaneModel.position.z
    )
    planeBody.quaternion.set(
       airPlaneModel.quaternion.x,
       airPlaneModel.quaternion.y,
       airPlaneModel.quaternion.z,
       airPlaneModel.quaternion.w, 
    )

  
    // 隕石同步
    const stonesInWorld = world.bodies.filter(mesh=>mesh.name.includes("stone"))
    const stonesInScene = scene.children.filter(mesh=>mesh.name.includes("stone"))
    console.log("stonesMatchedId",stonesInScene)
    stonesInWorld.forEach(stoneItem=> {
      const stoneMatchedId = stonesInScene[0].children.find(item=>item.name===stoneItem.name) 
      stoneItem.position.set(
        stoneMatchedId.position.x,
        stoneMatchedId.position.y -600 ,
        stoneMatchedId.position.z 
        )
     }
    )
    // 恢復碎片同步
    const coinsInWorld = world.bodies.filter(mesh=>mesh.name.includes("coin"))
    const coinsInScene = scene.children.filter(mesh=>mesh.name.includes("coin"))
    coinsInWorld.forEach(coinItem=> {
      const coinMatchedId = coinsInScene[0].children.find(item=>item.name===coinItem.name) 
      coinItem.position.set(
        coinMatchedId.position.x,
        coinMatchedId.position.y ,
        coinMatchedId.position.z 
        )
     }
    )
    TWEEN.update()
    updateDistance()
    updateLevel()

    // 遊戲速度控制
    scene.gameData.speed += scene.gameData.gameBaseSpeed
    // 遊戲game over
    
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