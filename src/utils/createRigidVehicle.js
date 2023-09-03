import * as CANNON from "cannon-es"
export default function createRigidVehicle(world) {
  const startPos =  new CANNON.Vec3(-23.5,1.5,-5)

  const mainCarBody = world.bodies.filter(item=>item.name==="main_cart")


  // 測試加入rigidVehicle
  const carBody = new CANNON.Body({
    mass: 8,
    position: startPos, // 位置
    shape:new CANNON.Box(new CANNON.Vec3(0.7,0.10,0.4)) // 車子主體方塊大小
  })
  carBody.name ="main_cart"
  carBody.quaternion.setFromAxisAngle(new CANNON.Vec3(0, 1, 0), -Math.PI/2)

  const vehicle = new CANNON.RigidVehicle({
    chassisBody: carBody
  })
  // wheel parts 輪子部分
  const mass = 12
  const axisWidth = 4
  const wheelShape = new CANNON.Sphere(0.10) // 輪子球體
  const wheelMaterial = new CANNON.Material()
  const down = new CANNON.Vec3(0,-5,0)

  const wheelBody1 = new CANNON.Body({
    mass,
    material:wheelMaterial,
  })
  wheelBody1.addShape(wheelShape)
  wheelBody1.angularDamping = 0.4 //尚待了解這段作用
  wheelBody1.name ='wheelBody1'
  vehicle.addWheel({
    body: wheelBody1,
    position: new CANNON.Vec3(-0.7,0,axisWidth/12),
    axis: new CANNON.Vec3(0,0,1),
    direction: down,
  })

  const wheelBody2 = new CANNON.Body({
    mass,
    material:wheelMaterial,
  })
  wheelBody2.addShape(wheelShape)
  wheelBody2.angularDamping = 0.4 //尚待了解這段作用
  wheelBody2.name ='wheelBody2'
  vehicle.addWheel({
    body: wheelBody2,
    position: new CANNON.Vec3(0.7,0,axisWidth/12),
    axis: new CANNON.Vec3(0,0,1),
    direction: down,
  })

   const wheelBody3 = new CANNON.Body({
    mass,
    material:wheelMaterial,
  })
  wheelBody3.addShape(wheelShape)
  wheelBody3.angularDamping = 0.4 //尚待了解這段作用
  wheelBody3.name ='wheelBody3'
  vehicle.addWheel({
    body: wheelBody3,
    position: new CANNON.Vec3(0.7,0,-axisWidth/12),
    axis: new CANNON.Vec3(0,0,1),
    direction: down,
  })

  const wheelBody4 = new CANNON.Body({
    mass,
    material:wheelMaterial,
  })
  wheelBody4.addShape(wheelShape)
  wheelBody4.name ='wheelBody4'
  wheelBody4.angularDamping = 0.4 //尚待了解這段作用
  vehicle.addWheel({
    body: wheelBody4,
    position: new CANNON.Vec3(-0.7,0,-axisWidth/12),
    axis: new CANNON.Vec3(0,0,1),
    direction: down,
  })

  vehicle.addToWorld(world)
  // 設定摩擦材質
  
  // 增加控制器操縱物理世界Cart
  document.addEventListener("keydown",(event)=>{
    // 設定速度等參數
    const maxSteerVal = Math.PI/2
    const maxForce = 12
    // 0,3 後輪 1,2 前輪
    console.log("車輛",vehicle)
    const wheel0Force = vehicle.wheelForces[0] + 0.5
    const wheel3Force = vehicle.wheelForces[3] + 0.5

    switch(event.key) {
      case 'w':
      case 'ArrowUp':
        console.log("前進")
        vehicle.setWheelForce(-maxForce/2,0)
        vehicle.setWheelForce(-maxForce/2,3)
        break
      case 's':
      case 'ArrowDown':
        console.log("後退")
        vehicle.setWheelForce(maxForce,0)
        vehicle.setWheelForce(maxForce,3)
        break
      case 'a':
      case 'ArrowLeft':
        console.log("向左")
        // vehicle.setWheelForce(-10,0)
        // vehicle.setWheelForce(-10,3)
        vehicle.setSteeringValue(-maxSteerVal*1.8,1)
        vehicle.setSteeringValue(-maxSteerVal*1.8,2)
        

        console.log("車輪資訊",vehicle)
        break
      case 'd':
      case 'ArrowRight':
        console.log("向右")
        vehicle.setSteeringValue(-maxSteerVal*0.8,1)
        vehicle.setSteeringValue(-maxSteerVal*0.8,2)
        // vehicle.setWheelForce(-maxForce/2,1)
        // vehicle.setWheelForce(-maxForce/2,2)
        // vehicle.setWheelForce(-maxForce/2,0)
        // vehicle.setWheelForce(-maxForce/2,3)
        console.log("車輪資訊",vehicle)
   
        break
      // 空白飄移鍵
      case ' ':
        console.log("空白鍵")
        vehicle.setWheelForce(wheel0Force ,0)
        vehicle.setWheelForce(wheel3Force ,3)
        break


    }

  })
  document.addEventListener("keyup",(event)=>{
    // 設定速度等參數
    const maxSteerVal = Math.PI/2
    const maxForce = 4
  
   switch(event.key) {
      case 'w':
      case 'ArrowUp':
       console.log("前進")
      //  vehicle.setWheelForce(-maxForce/2,0)
      //  vehicle.setWheelForce(-maxForce/2,3)
       vehicle.setWheelForce(0,0)
       vehicle.setWheelForce(0,3)

        break
      case 's':
      case 'ArrowDown':
        console.log("後退")
      // vehicle.setWheelForce(maxForce/2,0)
      // vehicle.setWheelForce(maxForce/2,3)
      vehicle.setWheelForce(0,0)
      vehicle.setWheelForce(0,3)
        break
      case 'a':
      case 'ArrowLeft':
        console.log("向左")
        vehicle.setSteeringValue(0,1)
        vehicle.setSteeringValue(0,2)
        break
      case 'd':
      case 'ArrowRight':
        console.log("向右")
        vehicle.setSteeringValue(0,1)
        vehicle.setSteeringValue(0,2)
        break
    }
 })
 return vehicle

}