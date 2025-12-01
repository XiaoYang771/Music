<script setup lang="ts">
    import { useMusicStore } from '@/stores/music';
    import { useSongListStore } from '@/stores/songList';
    import { ref,watch } from 'vue';
    import { useRoute,useRouter } from 'vue-router';
    //引入路由
    const route = useRoute()
    const router = useRouter()
    //引入歌曲pinia的数据
    const musicStore = useMusicStore()
    //引入歌单pinia的数据
    const songListStore = useSongListStore()
    //定义歌曲的类型
    interface song {
        id: number
        name: string
        singers: string
        img: string
        src: string
        videoSrc:string
        time: string
        like: boolean
        isplay: boolean
        lyric: string
    }
    //定义歌单的类型
    interface typeOne {
        id:number,
        songListImg:string,
        pageview?:number,
        title:string,
        content?:string,
        song:song[],
        isDelete?:boolean
    }
    //定义路由传过来的ID
    const querySongListID = route.query.songListID
    //定义当前歌单的ID
    const nowSongListID: number = typeof querySongListID === 'string' ? parseInt(querySongListID, 10) : 0
    //通过当前歌单的ID找到当前歌单
    const filterSongList = ref<typeOne | undefined>((songListStore.songLists.find(songlist => songlist.id == nowSongListID)) || songListStore.createSongList.find(songlist => songlist.id == nowSongListID))
    const addPlayList = () => {
            while(musicStore.playList[0]) {
                musicStore.playList.shift()
            }
            for(const item of filterSongList.value!.song) {
                musicStore.playList.push(item)
            }
        musicStore.playMusicById(musicStore.playList[0]!.id)
        musicStore.isinitialization = true
        musicStore.finallyMusicIndex = musicStore.playList.length - 1
    }
    const spliceMusic = (id:number) => {
        const findMusic = filterSongList.value?.song.find((music:song) => music.id === id)
        if(findMusic){
            filterSongList.value!.song = filterSongList.value!.song.filter((music:song) => music.id !== id )
        }
    }
    //向我的喜欢列表中添加歌曲
    const addLikeMusicList = (music:song) =>{
        music.like = true
         for(let i = 0;i < musicStore.finallyMusic.length;i++) {
            if(musicStore.finallyMusic[i]!.id === music.id) {
                musicStore.finallyMusic[i]!.like = true
                break;
            }
        }
        const repeatMusic = musicStore.LikeMusicList.some(item => item.id === music.id)
        if(!repeatMusic){
            musicStore.LikeMusicList.unshift(music)
        }
    }
    const deleteSongList = (id:number) => {
        songListStore.createSongList = songListStore.createSongList.filter(songList => songList.id !== id)
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
        songListStore.songLists,
        () => {
        localStorage.setItem('songListOne',JSON.stringify( songListStore.songLists))
        },{
            deep:true
        }
    )
    //对我的歌单进行监听
    watch(
        () => songListStore.createSongList,
        (newVal) => {
            localStorage.setItem('MySongList', JSON.stringify(newVal))
        },
        { deep: true }
    )
</script>

<template>
    <div class="likeMain">
        <div class="musicIntroduce">
            <div class="introduceLeft">
                <img :src="`${filterSongList?.songListImg || '/images/zanwu.png'}`" alt="">
            </div>
            <div class="introduceRight">
                <h2>{{ filterSongList?.title }} <span v-if="filterSongList?.isDelete" @click="deleteSongList(filterSongList!.id)">删除歌单</span></h2>
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
                    <td>操作</td>
                </tr>
                <tr 
                v-for="(music,index) in filterSongList?.song" 
                v-if="filterSongList?.song.length !== 0"
                :key="index"
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
                    <td>
                         <img 
                            @click="addLikeMusicList(music)" 
                            :src="`${music.like || false ? '/images/hongaixin.svg':'/images/aixin.png'}`" 
                            alt="喜欢"
                        >
                    </td>
                    <td>{{ music.time }}</td>
                    <td><img @click="spliceMusic(music.id)" src="/images/chacha.png" alt=""></td>
                </tr>
                <tr v-else class="nothingMusic">
                    <td>
                        <p>歌单还没有歌曲哦~快去添加吧</p>
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
        height: 100%;
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
                    span{
                        float: right;
                        font-size: 16px;
                        margin-right: 30px;
                        margin-top: 20px;
                        cursor: pointer;
                        color: red;
                    }
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
                    :nth-child(5){
                        flex: 1;
                        text-align: center;
                    }
                    :last-child{
                        flex: 1;
                        text-align: center;
                    }
                    img{
                        width: 25px;
                        height: 25px;
                        margin-top: 10px;
                        cursor: pointer;
                    }
                }
                .nothingMusic{
                    height: 300px;
                    &:hover{
                        background-color: rgba(0,0,0,0.0) !important;
                    }
                    img{
                        width: 200px;
                        height: 200px;
                    }
                }
        }
    }
</style>