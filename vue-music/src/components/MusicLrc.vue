<script setup lang="ts">
import { useMusicStore } from '@/stores/music'
import { computed }  from 'vue'
//引入歌曲pinia的数据
const musicStore = useMusicStore()
// 关键：通过 computed 实时监听 Pinia 中的 currentLrcIndex，计算滚动距离
const scrollY = computed(() => {
    // 如果还没有歌词索引（未播放），不滚动
    if (musicStore.currentLrcIndex === -1) return 0
      const lineHeight = 36
      const containerHeight = 500
    // 计算逻辑：让当前歌词居中显示
    const centerY = containerHeight / 2 // 容器中心点
    const currentLineY = musicStore.currentLrcIndex * lineHeight // 当前歌词的 Y 坐标
    const offset = centerY - currentLineY - (lineHeight / 2) // 减去行高一半，精准居中
    return offset;
})
const scrolly = computed(() => {

})

</script>

<template>
    <div v-if="musicStore.playList.length !== 0" class="lrccontent" >
        <div class="picture">
            <img :src="`${musicStore.playList[musicStore.currentIndex]?.img}`" :class="{ 'rotating': musicStore.isPlaying }" alt="">
        </div>
        <div :style="{ transform: `translateY(${scrollY}px)` }" class="lrclist" >
            <div 
                v-for="(item, i) in musicStore.lyrics" 
                :key="i"
                :class="{ active: musicStore.currentLrcIndex === i }"
                class="musiclrc"
            >
                {{ item.text }}
            </div>
        </div>
  </div>
  <div v-else class="nothingLrc">
    <p>播放列表暂无歌曲哦~</p>
    <img src="/images/hashiqi.png" alt="">
  </div>
</template>

<style scoped lang="scss">
//定义歌曲图片旋转效果
@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
.rotating {
  animation: rotate 20s linear infinite; 
}
    .lrccontent{
        display: flex;
        height: 475px ;
        margin: 50px;
        overflow: hidden;
        position: relative;
        color: #fff;
        font-size: 16px;
        .picture{
            width: 300px;
            height: 300px;
            margin: 100px 0 0 20px;
            img{
                width: 100%;
                height: 100%;
                border-radius: 50%;
            }
            
        }
        .lrclist {
            flex: 1;
            transition: transform 0.3s ease-out; /* 平滑滚动动画 */
            .musiclrc{
                height:36px; /* 绑定 Pinia 中的行高 */
                line-height: 36px;
                text-align: center;
            }
        }
        .active{
            color: red !important;
            font-weight: bold;
        }
    }
    .nothingLrc{
        width: 100%;
        height: 200px;
        color: #fff;
        font-size: 30px;
        text-align: center;
        p{
            margin-top: 200px;
            margin-bottom: 20px;
        }
    }
</style>