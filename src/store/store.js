import { createStore } from 'vuex'

const store = createStore({
  state () {
    return {
      gameStatus: 'ready',
      cameraOption: "normal",
      gameLevel: 1,
      flyDistance: 0,
      energy: 100
    }
  },
  mutations: {
    changeCamera (state,payload) {
      state.cameraOption = payload
    },
    updateEnergy (state,payload) {
      state.energy = payload
    },
    updateLevel (state,payload) {
      state.gameLevel = payload
    },
    updateDistance (state,payload) {
      state.flyDistance = payload
    },
  }
})
export default store

