<script setup lang="ts">
import { RouterView } from 'vue-router';
import HomeMusicNav from './HomeMusicNav.vue';
</script>

<template>
    <div class="content">
        <video class="bg-video" autoplay muted loop playsinline>
            <source src="/video/bg.mp4" type="video/mp4">
        </video>
        <div class="contenttext">
              <HomeMusicNav></HomeMusicNav>
              <router-view></router-view>
        </div>
    </div>
</template>

<style scoped lang="scss">
    .content{
        position: relative;
        width: 78%;
        height: 96%;
        margin: 1% 0;
        border-radius: 0 20px 20px 0;
            .bg-video{
                position: absolute;
                display: block;
                width: 1000px;
                height: 672px;
                transform: scaleY(1.2);
                opacity: 0.3;
            }
            .contenttext{
                position: absolute;
                width: 100%;
                height: 100%;
                overflow-y: scroll;
                z-index: 10;
                background-color: rgba(0,0,0,0.3);
            }
            .contenttext::-webkit-scrollbar {
                display: none;
            }
        }
        router-view {
            overflow: visible !important;
        }
</style>