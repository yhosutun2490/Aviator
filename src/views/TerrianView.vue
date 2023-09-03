<template>
  <main>
    <div id="canvas"></div>
    <div id="progress-bar">
      <!-- 進度條 -->
      <div id="loading-progress"></div>
    </div>
  </main>
</template>
<script setup>
import { onMounted } from "vue";
import  createTerrian from '../threeScene/createTerrian'
onMounted(() => {
  const canvas = document.getElementById('canvas');
  console.log("canvasDom", canvas)
  createTerrian(canvas)
})
</script>
<style scoped>
main {
  width: 100vw;
  height: 100vh;
  position: relative;
}

#canvas {
  width: 100%;
  height: 100%;
}

#button {
  background: greenyellow;
  width: 80px;
  height: 50px;
  opacity: 0.5;
}

#progress-bar {
  position: absolute;
  width: 400px;
  height: 16px;
  top: 5%;
  left: 50%;
  margin-left: -200px;
  margin-top: -8px;
  border-radius: 8px;
  border: 1px solid #009999;
  overflow: hidden;
}

#loading-progress {
  height: 100%;
  width: 20px;
  background: #00ffff;
  color: #00ffff;
  line-height: 15px;
}
</style>

