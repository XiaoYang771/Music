<script setup lang="ts">
import { ref,watch } from 'vue'
import { useRoute,useRouter } from 'vue-router';
import { useMusicStore } from '@/stores/music';
//引入歌曲pinia的数据
const MusicStore = useMusicStore()
//定义歌曲类型
interface musictype {
        id:number
        name:string
        singers:string
        img:string
        src:string
        videoSrc?:string
        videoImg?:string
        time:string
        like:boolean
        isplay:boolean
        lyric:string
}
//引入路由
const route = useRoute()
//引入路由器
const router = useRouter()
//定义路由传过来的ID变量
const ID = ref(Number(route.query.id))
//定义当前的MV歌曲
let nowMusicVideo = ref(MusicStore.MusicList.find(music => music.id === ID.value))
//定义存储随机数MV的数组列表
const RangeMusicVideo = ref<Array<musictype>>([])
//定义随机数数组，存放随机数
let RangeArray:number[] = []
//获得随机数并添加到随机数组中
function getRange() {
  for(let i = 0 ; i < MusicStore.MusicList.length ; i++){
    const rangeMusic = Math.floor(Math.random() * MusicStore.MusicList.length)
    if(!RangeArray.includes(rangeMusic) && RangeArray.length < 4 && MusicStore.MusicList[rangeMusic]!.videoSrc){
        RangeArray.push(rangeMusic)
        MusicStore.MusicList.forEach((music:musictype) => {
            if(music.id === rangeMusic){
                RangeMusicVideo.value.unshift(music)
            }
        })
    }
  }
}
getRange()
//点击换一批功能实现
const newGetRange = () => {
    RangeMusicVideo.value = []
    RangeArray = []
    getRange()
}
const switchVideo = (id:number) => {
    router.push({
        path:'musicvideo',
        query:{
            VideoId:id
        }
    })
}
watch(() => route.query.VideoId, (newId) => {
  ID.value = Number(newId)
})
watch(() => ID.value, (newId) => {
  nowMusicVideo.value = MusicStore.MusicList.find(music => music.id === newId)
})
</script>

<template>
   <div class="videoBox">
        <div class="video">
            <video v-if="nowMusicVideo?.videoSrc" :key="nowMusicVideo.id" loop controls playsinline :poster="nowMusicVideo.videoImg">
                <source :src="`${nowMusicVideo?.videoSrc}`" type="video/mp4">
            </video>
            <p v-else>
                <span>该歌曲暂无MV哦~</span><br>
                <img src="/images/zanwu.png" alt="">
            </p>
        </div>
        <div class="otherVideoBox">
            <h3>其他MV<span @click="newGetRange">换一批</span></h3>
            <div class="otherVideo">
                <ul>
                    <li v-for="(music,index) in RangeMusicVideo" :key="music.id" @click="switchVideo(music.id)">
                        <video loop playsinline :poster="music.videoImg">
                            <source :src="`${music?.videoSrc}`" type="video/mp4">
                        </video>
                        <span>{{ music.name }}</span>
                    </li>
                </ul>
            </div>
        </div>
   </div>
</template>

<style scoped lang="scss">
    .videoBox{
        position: relative;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        color: #fff;
        width: 100%;
        height: 990px;
        background-color: rgba(0,0,0,0.5);
        .video{
            width: 90%;
            height: 100%;
            margin: 5%;
            object-fit: cover;
            video{
                position: absolute;
                left: 5%;
                width: 90%;
                height: 60%;
                object-fit: cover;
            }
            p{
                font-size: 30px;
                text-align: center;
                margin-top: 100px;
                img{
                    margin-top: 20px;
                }
            }
        }
        .otherVideoBox{
            position: absolute;
            bottom:0;
            width: 90%;
            height: 30%;
            background-color: rgba(0,0,0,0.5);
            h3{
                margin-top: 20px;
                span{
                    float: right;
                    cursor: pointer;
                }
            }
            .otherVideo{
                position: relative;
                width: 100%;
                height: 200.77px;
                // overflow: hidden;
                line-height: 137.77px;
                text-align: center;
                font-size: 35px;
                .otherVideoLeft{
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 20px;
                    height: 100%;
                }
                ul{
                    position: absolute;
                    top: 0;
                    left: 20px;
                    height: 200.77px;
                    li{
                        position: relative;
                        float: left;
                        width: 200px;
                        height: 200.77px;
                        margin-left: 13px;
                        margin-top: 3px;
                        list-style: none;
                        cursor: pointer;
                        video{
                            width: 100%;
                            height: 90%;
                        }
                        span{
                            position: absolute;
                            width: 100px;
                            height: 20%;
                            bottom: 25%;
                            left: 50px;
                            color: #fff;
                            font-size: 16px;
                        }
                    }
                }
                .otherVideoRight{
                    position: absolute;
                    top: 0;
                    right: 0;
                    width: 20px;
                    height: 100%;
                    background-color: aqua;
                }
            }
        }
    }
</style>