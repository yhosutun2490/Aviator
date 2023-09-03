import * as THREE from "three"
import * as CANNON from "cannon-es"

class CannonUtils {
  // 每3個1組的頂點數據都產生三角面
  static CreateTrimesh(geometry) {
    let vertices
    console.log("三角面geometry",geometry)
    if (geometry.index === null) {
      // 針對road處理
      if (geometry.name==='road') {
         vertices = geometry.attributes.position.array
      } else {
        vertices = geometry.attributes.position.array
      }
      console.log("跑到Trimesh Null",geometry,'名稱',geometry.name,"頂點位置vertices",vertices)
    } else {
      vertices = geometry.clone().toNonIndexed().attributes.position.array
      console.log("跑到Trimesh else",geometry.name,"頂點位置vertices",vertices)
    }
    const indices = Object.keys(vertices).map(Number)
    console.log("跑到Trimesh indices",indices)
    return new CANNON.Trimesh(vertices, indices)
  }

  static CreateConvexPolyhedron(geometry) {
    console.log("CreateConvexPolyhedron幾何體資料",geometry)
    let position = geometry.attributes.position
    let normal = geometry.attributes.normal
    let vertices = []
    console.log("ployconvex position",position)
    // 建立頂點位置 並以THREE.Vector3為單位
    for (let i = 0; i < position.count; i++) {
      vertices.push(new THREE.Vector3().fromBufferAttribute(position, i))
      // vertices.push(position[i])
    }
    console.log("ployconvex vertices",vertices)
    // 每個形狀面朝向方向 normal法向量
    const faces = []
    for (let i = 0; i < position.count; i += 3) {
      const vertexNormals =
        normal === undefined
          ? []
          : [
              new THREE.Vector3().fromBufferAttribute(normal, i),
              new THREE.Vector3().fromBufferAttribute(normal, i + 1),
              new THREE.Vector3().fromBufferAttribute(normal, i + 2)
            ]
      const face = {
        a: i,
        b: i + 1,
        c: i + 2,
        normals: vertexNormals
      }
      faces.push(face)
    }
    // 重複頂點處理 
    const verticesMap = {}
    const points = []
    const changes = []
    for (let i = 0, il = vertices.length; i < il; i++) {
      const v = vertices[i]
      // 用座標形成每個頂點key值 如果沒有重複的話 加入points
      const key =
        Math.round(v.x * 100) +
        "_" +
        Math.round(v.y * 100) +
        "_" +
        Math.round(v.z * 100)
      if (verticesMap[key] === undefined) {
        verticesMap[key] = i
        points.push(
          new CANNON.Vec3(vertices[i].x, vertices[i].y, vertices[i].z)
        )
        changes[i] = points.length - 1
      } else {
        // 有重複的話
        changes[i] = changes[verticesMap[key]]
      }
    }

    const faceIdsToRemove = []
    for (let i = 0, il = faces.length; i < il; i++) {
      const face = faces[i]
      face.a = changes[face.a]
      face.b = changes[face.b]
      face.c = changes[face.c]
      const indices = [face.a, face.b, face.c]
      for (let n = 0; n < 3; n++) {
        if (indices[n] === indices[(n + 1) % 3]) {
          faceIdsToRemove.push(i)
          break
        }
      }
    }

    for (let i = faceIdsToRemove.length - 1; i >= 0; i--) {
      const idx = faceIdsToRemove[i]
      faces.splice(idx, 1)
    }

    const cannonFaces = faces.map(function(f) {
      return [f.a, f.b, f.c]
    })
    console.log("ployconvex result" , points,cannonFaces)
    return new CANNON.ConvexPolyhedron({
      vertices: points,
      faces: cannonFaces
    })
  }

  static offsetCenterOfMass(body, centreOfMass) {
    body.shapeOffsets.forEach(function(offset) {
      centreOfMass.vadd(offset, centreOfMass)
    })
    centreOfMass.scale(1 / body.shapes.length, centreOfMass)
    body.shapeOffsets.forEach(function(offset) {
      offset.vsub(centreOfMass, offset)
    })
    const worldCenterOfMass = new CANNON.Vec3()
    body.vectorToWorldFrame(centreOfMass, worldCenterOfMass)
    body.position.vadd(worldCenterOfMass, body.position)
  }
}

export default CannonUtils
