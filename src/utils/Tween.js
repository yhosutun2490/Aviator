import * as TWEEN from '@tweenjs/tween.js'


export default function Tween(mesh,Pos,Scale,Rotate,time=5000) {
  // console.log("進入tween",this)
  if (Pos) {
    new TWEEN.Tween(Pos.start).to(Pos.end,time).easing(TWEEN.Easing.Quadratic.Out).onUpdate(function update() {
    mesh.position.x = Pos.start.x
    mesh.position.y = Pos.start.y
  }).onComplete(function disappear() {
    mesh.parent.remove(mesh)
  }).start()
  } 
  if (Scale) {
     new TWEEN.Tween(Scale.start).to(Scale.end,time).easing(TWEEN.Easing.Quadratic.Out).onUpdate(function update() {
    mesh.scale.set(Scale.start,Scale.start,Scale.start)
  }).start()
 }
  if (Rotate) {
     new TWEEN.Tween(Rotate.start).to(Rotate.end,time).easing(TWEEN.Easing.Quadratic.Out).onUpdate(function update() {
    mesh.rotation.x = Rotate.start.x
    mesh.rotation.y = Rotate.start.y
  }).start()

  }
  
}