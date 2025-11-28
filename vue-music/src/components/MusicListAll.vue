<script setup lang="ts">
import { useSongListStore } from '@/stores/songList';
import { watch,ref } from 'vue';
import { useRouter } from 'vue-router';
import MusicButtom from './MusicButtom.vue';
//引入路由器
const router = useRouter()
//引入歌单pinia的数据
const songListStore = useSongListStore()
const songListAll = ref(songListStore.songLists.concat(songListStore.createSongList))
//点击查看歌单列表
const checkMusicList = (songListID:number) => {
        router.push({
            path:'/musiclistmain',
            query:{
                songListID:songListID
            }
    })
}
</script>

<template>
    <div class="musicListAll">
        <h2>歌单广场</h2>
        <div class="musicList">
            <ul>
                <li 
                v-for="(SongList,index) in songListAll"
                @click="checkMusicList(SongList.id)" 
                :key="SongList.id"
                >
                    <img :src="`${SongList.songListImg}`" alt="">
                    <span>{{ SongList.title }}</span>
                </li>
            </ul>
        </div>
    </div>
</template>

<style scoped lang="scss">
    .musicListAll{
        width: 99%;
        height: 100%;
        color: #fff;
        h2{
            padding: 20px;
        }
        .musicList{
            width: 100%;
            height: 100%;
            ul{
                height: 100%;
                padding: 0 20px;
                li{
                    position: relative;
                    width: 195px;
                    height: 195px;
                    list-style: none;
                    float: left;
                    margin: 20px;
                    border-radius: 10px;
                    cursor: pointer;
                    img{
                        width: 100%;
                        height: 100%;
                        border-radius: 10px;
                    }
                    span{
                        position:absolute;
                        left: 60px;
                        bottom: 10px;
                        font-size: 18px;
                    }
                }
            }
        }
    }
</style>