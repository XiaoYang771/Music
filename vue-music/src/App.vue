<script setup lang="ts">
import { useMusicStore } from './stores/music';
import HomePageAside from './components/HomePageAside.vue';
import HomePageContent from './components/HomePageContent.vue';
import ButtomApiBtn from './components/ButtomApiBtn.vue';
import Login from './views/Login.vue';
const MusicStore = useMusicStore()
</script>

<template>
  <div v-if="MusicStore.nowMusicUser.length === 1 ? false : true" class="login">
    <Login></Login>
  </div>
  <div v-else class="bg-container" :style="{backgroundColor:MusicStore.subjectColor}">
    <div class="main" @click="MusicStore.isShowSongList = false">
      <!-- <div v-if="MusicStore.nowMusicUser.length === 1" class="login">
        <Login></Login>
      </div> -->
      <!-- <div v-else id="main"> -->
        <HomePageAside></HomePageAside>
        <HomePageContent></HomePageContent>
      <!-- </div> -->
    </div>
    <div class="footer">
        <ButtomApiBtn></ButtomApiBtn>
    </div>
  </div>
  
</template>

<style lang="scss">
  *{
    margin: 0;
    padding: 0;
    user-select: none;
  .login{
    width: 100%;
    height: 765px;
  }
  .bg-container{
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 765px;
    overflow: hidden;
    .main{
      display: flex;
      width: 90%;
      height: 700px;
      border-radius: 20px;
      background-color: rgb(52, 49, 49);
      #main{
        display: flex;
        width: 100%;
        height: 700px;
        border-radius: 20px;
        background-color: rgb(52, 49, 49);
      }
      // .login {
      //   width: 100%;
      //   height: 100%;
      // }
    }
  }
  .footer{
      position: fixed;
      width: 100%;
      height: 70px;
      bottom: 0;
      z-index: 10;
    }
  }
</style>
