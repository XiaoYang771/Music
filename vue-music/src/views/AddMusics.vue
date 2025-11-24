<script setup lang="ts">
    import { useMusicStore } from '@/stores/music'
    import { useSongListStore } from '@/stores/songList'
    import { ref,watch } from 'vue'
    import { useRouter } from 'vue-router'
//数据
    //引入路由器
    const router = useRouter()
    //引入歌曲的pinia数据
    const MusicStore = useMusicStore()
    //引入歌单的pinia数据
    const SongListStore = useSongListStore()
    //定义是否打开添加列表的变量
    const showSongListFlag = ref(false)
    //定义现在想要添加的歌曲
    const nowMusic = ref()
    //定义歌单列表的标题
    const SongListTitle = ref('')
    //定义现在选择的歌单列表
    const nowSongList = ref()
    //定义歌曲类型
    interface musictype {
            id:number
            name:string
            singers:string
            img:string
            src:string
            videoSrc?:string
            time:string
            like:boolean
            isplay:boolean,
            lyric:string
    }
//方法
    //向播放列表中添加歌曲
    const addPlayList = (id:number) => {
        const addMusic = MusicStore.MusicList.find(music => music.id === id)    //想要添加的歌曲
        const repeatMusic =  MusicStore.playList.find(music => music.id === id) //播放列表中的重复歌曲
        if(addMusic && !repeatMusic){
            MusicStore.playList.unshift(addMusic)
            MusicStore.isinitialization = true
            MusicStore.playMusicByIndex(id)
        }
    }
    //向我的喜欢列表中添加歌曲
    const addLikeMusicList = (music:musictype) =>{
        music.like = true
        const repeatMusic = MusicStore.LikeMusicList.some(item => item.id === music.id)
        if(!repeatMusic){
            MusicStore.LikeMusicList.unshift(music)
        }
    }
    //前往歌词页面
    const goVideo = (id:number) => {
        router.push({
           path: '/musicvideo',
           query:{
            id:id
           }
        })
    }
    //点击展开添加列表
    const showSongList = (music:musictype) => {
        showSongListFlag.value = true
        nowMusic.value = music
    }
    //向歌单列表中添加歌曲
    const addSongList = () => {
        if(SongListTitle.value !== ''){
            nowSongList.value = SongListStore.songLists.find(songList => songList.title === SongListTitle.value)//当前歌单
            const repeatMusic = nowSongList.value?.song.find((song:musictype) => song.id === nowMusic.value.id )
            if(!repeatMusic){
                nowSongList.value?.song.push(nowMusic.value)//向当前歌单中添加歌曲
            }
            showSongListFlag.value = false
        }   
    }   
    //对歌曲列表进行监听并存入本地
    watch(
        MusicStore.finallyMusic,
        () => {
            localStorage.setItem('MusicList',JSON.stringify(MusicStore.finallyMusic))
        },{
        deep:true
    })
    //对歌单列表进行监听
    watch(
        SongListStore.songLists,
        () => {
        localStorage.setItem('songListOne',JSON.stringify( SongListStore.songLists))
        },{
            deep:true
        }
    )
</script>

<template>
    <div class="content">
        <table>
            <tr 
            v-for="(music,index) in MusicStore.finallyMusic" 
            :key="music.id">
                <td @click="addPlayList(music.id)">
                    <img :src="`${music.img}`" alt="">
                </td>
                <td @click="addPlayList(music.id)">
                    {{ music.name }}
                </td>
                <td @click="addPlayList(music.id)">
                    {{ music.singers }}
                </td>
                <td>
                    <img 
                    @click="addLikeMusicList(music)" 
                    :src="`${music.like || false ? '/images/hongaixin.svg':'/images/aixin.png'}`" 
                    alt="喜欢"
                    >
                </td>
                <td><img @click="goVideo(music.id)" src="/images/MV.png" alt=""></td>
                <td><img @click="showSongList(music)" src="/images/jia.svg" alt=""></td>
                <td @click="addPlayList(music.id)"><img src="../assets/icon/ai03.png" alt=""></td>
            </tr>
        </table>
    </div>
    <div v-if="showSongListFlag" class="addSongListBg">
        <div class="addSongList">
            <h3>添加歌曲<img @click="showSongListFlag = false" src="/images/chacha.png" alt=""></h3>
            <p>
                <span>请您选择歌单</span>
                <select name="" id="" v-model="SongListTitle">
                    <option v-for="(SongList,index) in SongListStore.songLists" :value="`${SongList.title}`">{{ SongList.title }}</option>
                </select>
                <button @click="addSongList" class="add">添加</button>
                <button @click="showSongListFlag = false" class="remove">取消</button>
            </p>
        </div>
    </div>
</template>

<style scoped lang="scss">
    .content{
        width: 99%;
        height: 100%;
        color: #fff;
        table{
            width: 100%;
            tr{
                display: flex;
                width: 100%;
                background-color: rgba(0,0,0,0.1);
                &:hover{
                     background-color: rgba(255,255,255,0.1);
                }
                td{
                    height: 60px;
                    line-height: 60px;
                    text-align: center;
                    img{
                        width: 30px;
                        height: 30px;
                        margin: 15px 29.72px;
                    }
                }
                :first-child{
                    flex: 1;
                    cursor: pointer;
                    img{
                        width: 50px;
                        height: 50px;
                        margin: 5px 19.72px;
                    }
                }
                :nth-child(2){
                    flex: 3;
                    cursor: pointer;
                }
                :nth-child(3){
                    flex: 3;
                    cursor: pointer;
                }
                :nth-child(4){
                    flex: 1;
                }
                :nth-child(5){
                    flex: 1;
                }
                :nth-child(6){
                    flex: 1;
                }
                :last-child{
                    flex: 1;
                }
            }
        }
    }
    .addSongListBg {
        position: fixed;
        width: 70%;
        height: 87%;
        margin-top: 50px;
        color: #fff;
        background-color: rgba(0,0,0,0.5);
        top: 0;
        .addSongList{
            width: 30%;
            height: 50%;
            margin: 18% 35%;
            background-color: rgba(0,0,0,0.8);
            h3{
                img{
                    width: 30px;
                    height: 30px;
                    margin: 5px;
                    float: right;
                    cursor: pointer;
                }
            }
            p{
                width: 100%;
                font-size: 14px;
                select{
                    width: 90%;
                    height: 30px;
                    margin: 10% 5%;
                }
                button{
                    width: 40%;
                    height: 40px;
                    margin: 100px 5%;
                    cursor: pointer;
                }
            }
        }
    }
</style>