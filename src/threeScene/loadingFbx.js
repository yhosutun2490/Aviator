import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader'
import * as THREE from 'three' // 導入three.js
import * as CANNON from 'cannon-es' // 物理引擎
import CannonUtils from '../utils/cannonUtils' //轉換網格



export default function loadingFbx(scene,world) {
  // fbx路徑
  const modelFilePath = 'src/assets/cartGame/'
  const fbxLoader = new FBXLoader()
  // 模型名稱
  const modelName = ['Kart','road','building','flag','beam','tire_large','tire_small']
  const loader = modelName.map((item,index)=>{ 
    return new Promise((resolve,reject)=>{
    fbxLoader.load(
    `src/assets/cartGame/${item}.fbx`,
    (object) => {
        console.log("進入loader",item,index)
        object.traverse(function (child) {
             const texLoader = new THREE.TextureLoader();
              console.log("傳入的物件child",child.name)
            if (child.name ==="border_1" || child.name ==="border_2") {
                const texture = texLoader.load(modelFilePath+'/border_mat_AlbedoTransparency.png');
                child.material = new THREE.MeshLambertMaterial({
                // 设置纹理贴图：Texture对象作为材质map属性的属性值
                 map: texture,//map表示材质的颜色贴图属性
                 transparent: false
                });
                console.log("賽道border geometry",child.geometry)
                // 賽道周圍border
                const boderShape = CannonUtils.CreateTrimesh(child.geometry)
                const borderMaterial = new CANNON.Material()
                const boderBody = new CANNON.Body({ 
                    mass: 0,
                    material:borderMaterial 
                })
                boderBody.position.y = 0.2
                boderBody.name = child.name
                boderBody.addShape(boderShape)
                world.addBody(boderBody)
            } 
           
            else if (child.name==="road") {
                const texture = texLoader.load(modelFilePath+'/road_diffuse.png');
                child.material = new THREE.MeshBasicMaterial({
                // 设置纹理贴图：Texture对象作为材质map属性的属性值
                 map: texture,//map表示材质的颜色贴图属性
                 transparent: false
                });
                // 賽道平面 child.geometry是一群陣列元素
                console.log("賽道geometry",child.geometry,"原始child",child)
                child.geometry.name = 'road'
         
                const roadShape = CannonUtils.CreateTrimesh(child.geometry)
                const roadMaterial = new CANNON.Material()
                const roadBody = new CANNON.Body({ 
                    mass: 0,
                    material:roadMaterial
                })
                roadBody.name = child.name
                // roadBody.collisionResponse = false
                roadBody.position.y +=0.15
              
                console.log("道路roadBody",roadBody)
                roadBody.addShape(roadShape)
                world.addBody(roadBody)

            }
        
            else if (child.name==="ground") {
                const texture = texLoader.load(modelFilePath+'/grass_diffuse.png');
                child.material = new THREE.MeshLambertMaterial({
                // 设置纹理贴图：Texture对象作为材质map属性的属性值
                 map: texture,//map表示材质的颜色贴图属性
                 transparent: false
                });
                const planeShape = CannonUtils.CreateTrimesh(child.geometry)
                const planeBody = new CANNON.Body({ 
                    mass: 0 
                })
                console.log("planeShape平板",planeShape)
                planeBody.addShape(planeShape)
                planeBody.name = child.name
                // planeBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI/2)
                world.addBody(planeBody)

            } else if (child.name==="Flag") {
                const texture = texLoader.load(modelFilePath+'/flag_Flag_AlbedoTransparency.png');
                child.material = new THREE.MeshLambertMaterial({
                // 设置纹理贴图：Texture对象作为材质map属性的属性值
                 map: texture,//map表示材质的颜色贴图属性
                 transparent: false
                });
                child.scale.set(0.05,0.05,0.05)

            }
            // 卡丁車物件 
            else if (child.name==="Kart") {
                const texture = texLoader.load(modelFilePath+'/Kart_Base_Color_2.png');
                child.material = new THREE.MeshLambertMaterial({
                // 設定紋理材質：Texture對象做為材質map資料屬性
                 map: texture, //map 黏貼圖片材質
                 transparent: false
                });
                child.scale.set(0.05,0.05,0.05)
                // child.position.x = -10
                // child.position.z = -5
                console.log("卡丁車物件子元件",child)

            }  else if (child.name==="wall") {
                const texture = texLoader.load(modelFilePath+'/wall_Concrete_MetallicSmoothness.png');
                child.material = new THREE.MeshLambertMaterial({
                // 设置纹理贴图：Texture对象作为材质map属性的属性值
                 map: texture,//map表示材质的颜色贴图属性
                 transparent: true
                });
                child.scale.set(1,1,1)
            }
                else if (child.name==="roof") {
                const texture = texLoader.load(modelFilePath+'/wall_Concrete_MetallicSmoothness.png');
                child.material = new THREE.MeshLambertMaterial({
                // 设置纹理贴图：Texture对象作为材质map属性的属性值
                 map: texture,//map表示材质的颜色贴图属性
                 transparent: true
                });
                child.scale.set(1,1,1)
            }  else if (child.name==="beam") {
                const texture = texLoader.load(modelFilePath+'/wall_Concrete_AlbedoTransparency.png');
                child.material = new THREE.MeshLambertMaterial({
                // 设置纹理贴图：Texture对象作为材质map属性的属性值
                 map: texture,//map表示材质的颜色贴图属性
                 transparent: false
                });
                child.scale.set(0.1,0.1,0.1)
            }  else if (child.name==="lamp") {
                const texture = texLoader.load(modelFilePath+'/Kart_Normal_OpenGL_1.png');
                child.material = new THREE.MeshLambertMaterial({
                // 设置纹理贴图：Texture对象作为材质map属性的属性值
                 map: texture,//map表示材质的颜色贴图属性
                 transparent: false
                });
                child.scale.set(0.1,0.1,0.1)
                child.position.y = 5
            }  else if (child.name==="Tire_large") {
                const texture = texLoader.load(modelFilePath+'/tire_2_Tire_AlbedoTransparency_2.png');
                child.material = new THREE.MeshLambertMaterial({
                // 设置纹理贴图：Texture对象作为材质map属性的属性值
                 map: texture,//map表示材质的颜色贴图属性
                 transparent: false
                });
                child.scale.set(0.02,0.02,0.02)
                child.position.x = 5
            } else if (child.name==="Tire") {
                const texture = texLoader.load(modelFilePath+'/tire_1_Tire_AlbedoTransparency_2.png');
                child.material = new THREE.MeshLambertMaterial({
                // 设置纹理贴图：Texture对象作为材质map属性的属性值
                 map: texture,//map表示材质的颜色贴图属性
                 transparent: false
                });
                child.scale.set(0.02,0.02,0.02)
                child.position.x = 7
                child.position.z = -2
            }
        })
        console.log("fbx物件",object)
        //先調整各模型scale/position
        object.scale.set(1, 1, 1)
        object.position.y = 0.15
        scene.add(object) 
        resolve()
    },
    (xhr) => {
        // 這裡撰寫進度條顯示邏輯
        console.log((xhr.loaded / xhr.total) * 100 + '% loaded')
        const percent = xhr.loaded / xhr.total *100/modelName.length;
        const percentDiv = document.getElementById("loading-progress")
        percentDiv.style.width = percent * 400 + "px"; //进度条元素长度
        percentDiv.style.textIndent = percent * 400 + 5 + "px"; //缩进元素中的首行文
        // Math.floor:小数加载进度取整
        percentDiv.innerText = Math.floor(percent * 100) + '%'; //进度百分比
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

