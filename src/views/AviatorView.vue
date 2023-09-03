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
          <div class="score_label">LEVEL</div>
          <div class="score_circle">
            <!--實作進度圓餅圖-->
           <svg width="80" height="80">
            <circle r="30" cx="40" cy="40" class="circle"/>
           </svg>
             <div class="score_level_value">1</div>
          </div>
        </div>
        <div class="score_content" id="distance">
          <div class="score_label">DISTANCE</div>
          <div class="score_distance_value">1552</div> km
        </div>
        <div class="score_content" id="energy">
          <div class="score_label">ENERGY</div>
          <div class="score_energy_value">
             <div class="energy_bar"></div>
          </div>
         
        </div>
      </div>
    </header>
    <div id="canvas"></div>
  </main>
</template>
<script setup>
import { onMounted } from "vue";
import createAviator from "../threeScene/createAviator"
// import createCannonScene from "../threeScene/createCannonScene";
onMounted(() => {
  const canvas = document.getElementById('canvas');
  console.log("canvasDom", canvas)
  createAviator(canvas)
})

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
  color: #d1b790;
  transform: translate(-50%,0);
  font-weight: 400;
  h1  {
    font-size: 1.2rem;
    /* display: flex;
    flex-direction: column; */
  } 
  h2 {
    font-size: 0.85rem;
    color: #b8d819;
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
     color: #edce9f;
     padding: 0 2rem;
     text-align: center;
     min-width: 100px;
     /*第二個block設定左右邊界*/
     &:nth-child(2) {
      border-left: 2px solid #edce9f;
      border-right: 2px solid #edce9f;
     }
     
     .score_label {
      opacity: 0.5;
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

