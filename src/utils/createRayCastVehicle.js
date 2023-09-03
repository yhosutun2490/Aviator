import * as CANNON from "cannon-es"
export default function createRayCastVehicle(world) {
    const startPos =  new CANNON.Vec3(0,3.0,0)
    const chassisShape = new CANNON.Box(new CANNON.Vec3(0.5,0.1,0.5));
    const chassisBody = new CANNON.Body({ mass: 5 });
    chassisBody.addShape(chassisShape);
    chassisBody.position = startPos
    chassisBody.angularVelocity.set(0, 0, 0)
    chassisBody.name ="main_cart"
    // chassisBody.quaternion.setFromAxisAngle(new CANNON.Vec3(0, 0, 0), -Math.PI/2)

    const options = {
        radius: 0.3,
        directionLocal: new CANNON.Vec3(0, -1, 0), //車輪方向(垂直車身向下'垂直車身向下')
        suspensionStiffness: 30,
        suspensionRestLength: 0.3,
        frictionSlip: 15, //摩擦係數
        dampingRelaxation: 2.3,
        dampingCompression: 4.4,
        maxSuspensionForce: 100000,
        rollInfluence:  0.01, //側向力係數防止翻轉
        axleLocal: new CANNON.Vec3(0, 0, 1), //車軸方向
        chassisConnectionPointLocal: new CANNON.Vec3(1, 1, 0),
        maxSuspensionTravel: 0.3,
        customSlidingRotationalSpeed: -30,
        useCustomSlidingRotationalSpeed: true
        };

        // 產生車子實例
        const vehicle = new CANNON.RaycastVehicle({
              chassisBody: chassisBody,
        });
        // 掛上輪胎位置
        options.chassisConnectionPointLocal.set(0.5, 0, -0.5);
        vehicle.addWheel(options);

        options.chassisConnectionPointLocal.set(0.5, 0, 0.5);
        vehicle.addWheel(options);

        options.chassisConnectionPointLocal.set(-0.5, 0, -0.5);
        vehicle.addWheel(options);

        options.chassisConnectionPointLocal.set(-0.5, 0, 0.5);
        vehicle.addWheel(options);

        vehicle.addToWorld(world);
         
         //輪胎塑形
         const wheelBodies = []
        const wheelMaterial = new CANNON.Material('wheel')
        vehicle.wheelInfos.forEach((wheel) => {
          const cylinderShape = new CANNON.Cylinder(wheel.radius, wheel.radius, wheel.radius / 2, 20)
          // const sphereShape = new CANNON.Sphere(0.15)
          const wheelBody = new CANNON.Body({
            mass: 3,
            material: wheelMaterial,
          })
          wheelBody.type = CANNON.Body.KINEMATIC
          wheelBody.collisionFilterGroup = 0 // turn off collisions
          const quaternion = new CANNON.Quaternion().setFromEuler(-Math.PI / 2, 0, 0) // 車輪扭轉
          wheelBody.addShape(cylinderShape , new CANNON.Vec3(),quaternion)
          wheelBodies.push(wheelBody)
          world.addBody(wheelBody)
        })

        // 設定碰撞材質
        // Define interactions between wheels and ground
        console.log("產生車車word",world)
        const heightfieldBody = world.bodies.filter(item=>item.name==="height_field")
        
        const wheel_ground = new CANNON.ContactMaterial(wheelMaterial,  heightfieldBody[0].material, {
          friction: 3,
          restitution: 0,
          contactEquationStiffness: 10,
        })
        world.addContactMaterial(wheel_ground)

            // Update wheels
            world.addEventListener('postStep', function(){
                for (let i = 0; i < vehicle.wheelInfos.length; i++) {
                    vehicle.updateWheelTransform(i);
                    let t = vehicle.wheelInfos[i].worldTransform;
                    let wheelBody = wheelBodies[i];
                    wheelBody.position.copy(t.position);
                    wheelBody.quaternion.copy(t.quaternion);
                }
            });

            // 增加鍵盤互動事件
        document.addEventListener('keydown', (event) => {
          const maxSteerVal = 0.5
          const maxForce = 15
          const brakeForce = 15

          switch (event.key) {
            case 'w':
            case 'ArrowUp':
              vehicle.applyEngineForce(maxForce, 2)
              vehicle.applyEngineForce(maxForce, 3)
              break

            case 's':
            case 'ArrowDown':
              vehicle.applyEngineForce(-maxForce, 2)
              vehicle.applyEngineForce(-maxForce, 3)
              break

            case 'a':
            case 'ArrowLeft':
              vehicle.setSteeringValue(maxSteerVal, 0)
              vehicle.setSteeringValue(maxSteerVal, 1)
              break

            case 'd':
            case 'ArrowRight':
              vehicle.setSteeringValue(-maxSteerVal, 0)
              vehicle.setSteeringValue(-maxSteerVal, 1)
              break

            case 'b':
              vehicle.setBrake(brakeForce, 0)
              vehicle.setBrake(brakeForce, 1)
              vehicle.setBrake(brakeForce, 2)
              vehicle.setBrake(brakeForce, 3)
              break
          }
        })

        // Reset force on keyup
        document.addEventListener('keyup', (event) => {
          switch (event.key) {
            case 'w':
            case 'ArrowUp':
              vehicle.applyEngineForce(0, 2)
              vehicle.applyEngineForce(0, 3)
              break

            case 's':
            case 'ArrowDown':
              vehicle.applyEngineForce(0, 2)
              vehicle.applyEngineForce(0, 3)
              break

            case 'a':
            case 'ArrowLeft':
              vehicle.setSteeringValue(0, 0)
              vehicle.setSteeringValue(0, 1)
              break

            case 'd':
            case 'ArrowRight':
              vehicle.setSteeringValue(0, 0)
              vehicle.setSteeringValue(0, 1)
              break

            case 'b':
              vehicle.setBrake(0, 0)
              vehicle.setBrake(0, 1)
              vehicle.setBrake(0, 2)
              vehicle.setBrake(0, 3)
              break
          }
        })
    return vehicle
}