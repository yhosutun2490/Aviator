<template>
  <main>
    <header>
      <h1>
        <span class="sub-title">The</span>
        <span class="title">
           Aviator Game 
          <span class="author">by Rafael</span>
        </span>
      </h1>
      <h2>Fly to the End</h2>
      <div class="score">
        <div class="score_content" id="level">
          <div class="score_label">Level</div>
          <div class="score_circle">
            <!--實作進度圓餅圖-->
           <svg width="80" height="80">
            <circle r="30" cx="40" cy="40" class="circle"/>
           </svg>
             <div class="score_level_value">{{ gameLevel }}</div>
          </div>
        </div>
        <div class="score_content" id="distance">
          <div class="score_label">Distance</div>
          <div class="score_distance_value">{{ flyDistance }}</div> km
        </div>
        <div class="score_content" id="energy">
          <div class="score_label">ENERGY</div>
          <div class="score_energy_value">
             <div class="energy_bar"></div>
          </div>
         
        </div>
      </div>
    </header>
    <div class="camera-option">
      <div class="option-normal" :class="[cameraOption==='normal'?'active': '' ]" @click="changeCamera('normal')">Normal cam</div>
      <div class="option-follow" :class="[cameraOption === 'follow' ? 'active' : '']"  @click="changeCamera('follow')">Follow cam</div>
    </div>
    <div id="canvas"></div>
  </main>
</template>
<script setup>
import { computed, onMounted } from "vue";
import createAviator from "../threeScene/createAviator"
import { useStore } from 'vuex'
// import createCannonScene from "../threeScene/createCannonScene";

const store = useStore()
onMounted(() => {
  const canvas = document.getElementById('canvas');
  console.log("canvasDom", canvas)
  createAviator(canvas)
})

const cameraOption = computed(()=>store.state.cameraOption)
function changeCamera(option) {
  store.commit("changeCamera",option)
}
const gameLevel = computed(() => store.state.gameLevel)
const flyDistance = computed(()=> store.state.flyDistance)
</script>
<style lang="scss" scoped>
main {
  width: 100vw;
  height: 100vh;
  position: relative;
}
header {
  position: absolute;
  top: 2.5%;
  left: 50%;
  font-family: 'Playfair Display';
  color: #c36523;
  transform: translate(-50%,0);
  font-weight: 400;
  h1  {
    font-size: 1.2rem;
    /* display: flex;
    flex-direction: column; */
  } 
  h2 {
    font-size: 1.15rem;
    color: #9ACD32;
    letter-spacing: 1rem;
    text-transform: uppercase;
    font-weight: 700;
    text-align: center;
  }
  .sub-title {
     position: absolute;
     left: 7.5%;
     top: 5.5%; 
  }
  .title {
    font-size: 3.5rem;
    position: relative;
    transform: translate(0%,-50%);
    font-weight: 700;
    text-transform: capitalize;
    .author {
      font-size: 1.0rem;
    }
  }
}
.score {
  display: flex;
  justify-content: space-around;
  margin-top: 10px ;
  .score_content {
     color: #df8f0d;
     padding: 0 2rem;
     text-align: center;
     min-width: 100px;
     font-weight: 700;
     /*第二個block設定左右邊界*/
     &:nth-child(2) {
      border-left: 2px solid #edce9f;
      border-right: 2px solid #edce9f;
     }
     
     .score_label {
      opacity: 0.8;
      color: #c36523;
      font-weight: 500;
     }
     /*level 圓餅svg*/
     .score_circle {
      position: relative;
      .score_level_value {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%,-60%);
        color: #655;
        font-size: 1.2rem;
      }
      svg {
        transform: rotate(-90deg);
      }
      circle {
        fill:#b8d819; // 填滿顏色
        stroke: #655; // 邊框顏色
        stroke-width: 10;
        stroke-dasharray: 0 189; //storke長度,缺口長度 px計算
        /* animation: circleFillUp 5s linear infinite; */
      }
     }
  }
  @keyframes circleFillUp {
     to { stroke-dasharray: 189 189; } 
  }
  /*distance*/
  #distance {
    .score_distance_value {
      font-weight: bold;
      margin-top: 20px;
      font-size: 2rem;
    }

  }
 /*energy 能量進度條*/
 #energy {
  .score_energy_value {
    width: 80px;
    height: 8px;
    position: relative;
    margin-top: 50px ;
    border-radius: 3px;
    background-color: #d1b790;
    .energy_bar {
      position: absolute;
      background-color: rgb(59, 206, 91);
      margin-left: 2px;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0%;
    } 

  }

 }
}

#canvas {
  width: 100%;
  height: 100%;
}
.camera-option {
  position: absolute;
  width: 270px;
  padding: 5px ;
  top: 5%;
  left: 10%;
  display: flex;
  justify-content: space-around;
  border: 2px solid #edce9f;
  border-radius: 8px;
  font-size: 1.1rem;
  .active {
    border: 2px solid #6e675c;
    background-color: #b8d819;
    border-radius: 12px;
    padding: 2px 4px;
  }
  .option-follow,.option-normal {
    padding: 2px 4px;
    text-align: center;
    border: 2px solid #6e675c;
    border-radius: 12px;
    width: 120px;
    cursor: pointer;
  }
}
</style>

