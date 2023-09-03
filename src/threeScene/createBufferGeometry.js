import * as THREE from 'three' // 導入three.js

export default function createLineModel() {
  // 創建對象
const geometry = new THREE.BufferGeometry
// 頂點數組參數
const vertices = new Float32Array([
    0, 0, 0, //顶点1坐标
    50, 0, 0, //顶点2坐标
    0, 100, 0, //顶点3坐标
    0, 0, 10, //顶点4坐标
    0, 0, 100, //顶点5坐标
    50, 0, 10, //顶点6坐标
]);
// 創建頂點數據屬性
const attribute = new THREE.BufferAttribute(vertices, 3); 
// 设置几何体attributes属性的位置属性
geometry.attributes.position = attribute;
// 定義線材質
const material = new THREE.LineBasicMaterial({
    color: 0xffcccc, //线条颜色
    size:30.0
}); 
// 创建线模型对象
const point = new THREE.Points(geometry, material);
return point
}

