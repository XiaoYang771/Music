<script setup lang="ts">
    import { useMusicStore } from '@/stores/music';
    import { useSongListStore } from '@/stores/songList';
    import { ref,watch } from 'vue';
    //引入歌曲pinia的数据
    const musicStore = useMusicStore()
    //引入歌单pinia的数据
    const SongListStore = useSongListStore()
    //定义响应式筛选后歌取列表的变量
    const stepOneLike = localStorage.getItem('MusicListLike') || '[]'
    const stepTwoLike = JSON.parse(stepOneLike)
    const filterMusicLike = ref(stepTwoLike)
    //点击向播放列表中添加歌曲
    const addPlayList = () => {
        while(musicStore.playList[0]) {
            musicStore.playList.shift()
        }
        for(const item of musicStore.LikeMusicList) {
            musicStore.playList.push(item)
        }
        musicStore.playMusicById(musicStore.playList[0]!.id)
        musicStore.isinitialization = true
        musicStore.finallyMusicIndex = musicStore.playList.length - 1
    }
    //点击清除喜欢的歌曲
    const clearMusicLike = (id:number) => {
        //首先先排除掉去除的那一首歌
           filterMusicLike.value =  musicStore.LikeMusicList.filter(music => music.id !== id)
        //其次再需要对歌曲列表中的爱心进行取消
           musicStore.finallyMusic.forEach(item => {
                if(item.id === id){
                    item.like = false
                }
           })
        //对歌单列表中的爱心进行取消
           SongListStore.songLists.forEach(songList => {
                songList.song.forEach(song => {
                if(song.id === id){
                    song.like = false
                }
                })
           })
        //将喜欢列表中的值全删除变为空数组，直接赋值为改变响应式
            while(musicStore.LikeMusicList[0]) {
                musicStore.LikeMusicList.shift()
            }
        //再把排除后的歌曲的每一项项喜欢列表中添加，不会改变响应式
            for(const item of filterMusicLike.value) {
                musicStore.LikeMusicList.push(item)
            }
    } 
    //对喜欢列表进行监听并存入本地  
    watch(
        () => musicStore.LikeMusicList,
        () => {
            localStorage.setItem('MusicListLike',JSON.stringify(musicStore.LikeMusicList))
        },{
            deep: true
    })
    //对歌曲列表进行监听并存入本地
    watch(
        () => musicStore.finallyMusic,
        () => {
            localStorage.setItem('MusicList',JSON.stringify(musicStore.finallyMusic))
        },{
        deep:true
    })
      //对歌单列表进行监听
    watch(
        () => SongListStore.songLists,
        () => {
        localStorage.setItem('songListOne',JSON.stringify( SongListStore.songLists))
        },{
            deep:true
        }
    )
    //对我的歌单进行监听
    watch(
        () => SongListStore.createSongList,
        (newVal) => {
            localStorage.setItem('MySongList', JSON.stringify(newVal))
            // router.push('/musicuser')
        },
        { deep: true }
    )
</script>

<template>
    <div class="likeMain">
        <div class="musicIntroduce">
            <div class="introduceLeft">
                <img :src="`${musicStore.LikeMusicList[0]?.img || '/images/zanwu.png'}`" alt="">
            </div>
            <div class="introduceRight">
                <h2>我喜欢的音乐</h2>
                <p>
                    <button @click="addPlayList">播放全部</button>
                </p>
            </div>
        </div>
        <div class="likeList">
            <ul>
                <li><a href="#">歌曲</a></li>
            </ul>
            <table>
                <tr class="musicTitle">
                    <td>#</td>
                    <td>标题</td>
                    <td>专辑</td>
                    <td>喜欢</td>
                    <td>时长</td>
                </tr>
                <tr 
                v-for="(music,index) in filterMusicLike" 
                v-if="musicStore.LikeMusicList.length !== 0"
                :key="music.id"
                >
                    <td>{{index + 1 }}</td>
                    <td>
                        <div class="titlebox">
                            <div class="imgBox">
                                <img :src="`${music.img}`" alt="">
                            </div>
                            <div class="introduce">
                                <p>{{ music.name }}</p>
                                <p>{{ music.singers }}</p>
                            </div>
                        </div>
                    </td>
                    <td>{{ music.name }}</td>
                    <td><img  @click="clearMusicLike(music.id)" src="/images/hongaixin.svg" alt=""></td>
                    <td>{{ music.time }}</td>
                </tr>
                <tr v-else class="nothingMusic">
                    <td>
                        <p>还没有喜欢歌曲哦~快去添加吧</p>
                        <p><img src="/images/a-Group46.png" alt=""></p>
                    </td>
                </tr>
            </table>
        </div>
    </div> 
</template>

<style scoped lang="scss">
    .likeMain{
        width: 99%;
        background-color: rgba(0,0,0,0.4);
        color: #fff;
        .musicIntroduce{
            display: flex;
            width: 100%;
            height: 35%;
            .introduceLeft{
                flex: 3;
                border-radius: 20px;
                img{
                   width: 200px;
                   height: 200px;
                   margin: 8.78px 48.55px;
                   border-radius: 20px;
                }
            }
            .introduceRight{
                flex: 7;
                h2{
                    margin-top: 8.78px;
                }
                p{
                    margin-top: 135px;
                    button{
                        width: 100px;
                        height: 30px;
                        border-radius: 10px;
                        text-align: center;
                        border: 0;
                        cursor: pointer;
                        background-color: rgb(252, 81, 81);
                    }
                }
            }
        }
        .likeList{
            width: 100%;
            ul{
                width: 100%;
                height: 40px;
                line-height: 40px;
                li{
                    width: 50px;
                    height: 40px;
                    margin-left: 48.55px;
                    list-style: none;
                    text-align: center;
                    a{
                        text-decoration: none;
                        color: #fff;
                    }
                }   
            }
            table{
                width: 90%;
                height: 100%;
                margin: 10px 5%;
                .musicTitle{
                    height: 30px;
                    line-height: 30px;
                    border-bottom: 1px solid #ddd;
                }
                tr{
                    display: flex;
                    width: 100%;
                    height: 50px;
                    line-height: 50px;
                    margin-bottom: 10px;
                    &:not(:first-child):hover{
                        background-color: rgba(255,255,255,0.1);
                    }
                    :first-child{
                        flex: 1;
                        text-align: center;
                    }
                    :nth-child(2){
                        flex: 4;
                        div{
                            display: flex;
                            position: relative;
                            .imgBox{
                                flex: none;
                                position: relative;
                                width: 40px;
                                height: 40px;
                                margin: 5px 5px 5px 0;
                                border-radius: 10px;
                                cursor: pointer;
                                img{
                                    position: absolute;
                                    top: 0;
                                    width: 40px;
                                    height: 40px;
                                    margin: 0;
                                    border-radius: 10px;
                                    cursor: pointer;
                                }
                            }
                        }
                             .introduce{
                                flex: 8;
                                display: block;
                                p{
                                    flex: none;
                                    height: 25px;   
                                    line-height: 25px;
                                    font-size: 12px;
                                    text-align: left;
                                    margin-left: 10px;
                                }
                                :first-child{
                                    font-size: 16px;
                                }
                            }
                            
                        }
                    }
                    :nth-child(3){
                        flex: 3;
                        text-align: left;
                    }
                    :nth-child(4){
                        flex: 1;
                        text-align: center;
                        img{
                            width: 40px;
                            height: 40px;
                            margin-top: 5px;
                            cursor: pointer;
                        }
                    }
                    :last-child{
                        flex: 1;
                        text-align: center;
                    }
                }
                .nothingMusic{
                    height: 300px;
                        &:hover{
                            background-color: rgba(0,0,0,0) !important;  
                        }
                    img{
                        width: 200px;
                        height: 200px;
                    }
                }
        }
    }
</style>