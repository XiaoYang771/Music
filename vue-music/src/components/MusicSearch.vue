<script setup lang="ts">
    import { useMusicStore } from '@/stores/musicapi'
    import { ref,onBeforeUpdate } from 'vue'
    import { useRouter } from 'vue-router'
    import { useRoute } from 'vue-router'
    import { useSongListStore } from '@/stores/songList'
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
    //定义歌单类型
    interface typeOne {
        id:number,
        songListImg:string,
        pageview?:number,
        title:string,
        content?:string,
        song:musictype[],
        isDelete?:boolean
    }
    //引入路由
    const route = useRoute() 
    //引入路由器
    const router = useRouter()
    //引入歌曲pinia的数据
    const MusicStore = useMusicStore()
    //引入歌单pinia的数据
    const SongListStore = useSongListStore()
    //定义是否打开添加列表的变量
    const showSongListFlag = ref(false)
    //定义现在想要添加的歌曲
    const nowMusic = ref()
    //定义现在选择的歌单列表
    const nowSongList = ref()
    //定义现在选择的歌单列表
    const MySongList = ref()
    //定义歌单列表的标题
    const SongListTitle = ref('')
    //从本地拿到我的歌单
    const mySongList = ref(JSON.parse(localStorage.getItem('MySongList') || '[]'))
    //再和歌单列表中的歌单进行拼接，得到总歌单
    const finnalySongList = ref(mySongList.value.concat(SongListStore.songLists))
    //声明搜索列表（搜索的歌曲都应该存在歌曲列表中）
    const MusicSearch = ref<musictype[]>([])
    //校验搜索内容与歌曲进行匹配
    const initView = () => {
        // 从路由查询参数中获取关键词，并转义正则特殊字符
        const keyword = route.query.name as string || ''
        const escapedKeyword = keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
        // 构建模糊匹配的正则（忽略大小写）
        const regex = new RegExp(escapedKeyword, 'i')
        MusicSearch.value = MusicStore.finallyMusic.filter(music => regex.test(music.name))
    }
    initView()
    //生命周期钩子，一旦数据进行改变就重新开始校验
    onBeforeUpdate(() => {
        initView()
    })
   //前往MV页面
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
            nowSongList.value = finnalySongList.value.find((songList:typeOne) => songList.title === SongListTitle.value)//当前歌单
            const repeatMusic = nowSongList.value?.song.find((song:musictype) => song.id === nowMusic.value.id )
            if(!repeatMusic){
                if(nowSongList.value.id <= 4){
                    nowSongList.value.song.push(nowMusic.value)//向当前歌单中添加歌曲
                }else{
                    MySongList.value = SongListStore.createSongList.find((songList:typeOne) => songList.title === SongListTitle.value)//当前歌单
                    MySongList.value.song.push(nowMusic.value)
                }
            }
            showSongListFlag.value = false
        }
    }   
</script>

<template>
    <div class="content">
        <table v-if="MusicSearch.length !== 0">
            <tr 
            v-for="(music,index) in MusicSearch" 
            :key="music.id">
                <td @click="MusicStore.addPlayList(music.id)">
                    <img :src="`${music.img}`" alt="">
                </td>
                <td @click="MusicStore.addPlayList(music.id)">
                    {{ music.name }}
                </td>
                <td @click="MusicStore.addPlayList(music.id)">
                    {{ music.singers }}
                </td>
                <td>
                    <img 
                    @click="MusicStore.switchLikeMusic(music)" 
                    :src="`${music.like || false ? '/images/hongaixin.svg':'/images/aixin.png'}`" 
                    alt="喜欢"
                    >
                </td>
                <td><img @click="goVideo(music.id)" src="/images/MV.png" alt=""></td>
                <td><img @click="showSongList(music)" src="/images/jia.svg" alt=""></td>
                <td><img @click="MusicStore.addPlayList(music.id)" src="../assets/icon/ai03.png" alt=""></td>
            </tr>
        </table>
        <div v-else class="nothingMusic">
            <h2>没有该歌曲哦~</h2>
            <img src="/images/hashiqi.png" alt="">
        </div>
    </div>
     <div v-if="showSongListFlag" class="addSongListBg">
        <div class="addSongList">
            <h3>添加歌曲<img @click="showSongListFlag = false" src="/images/chacha.png" alt=""></h3>
            <p>
                <span>请您选择歌单</span>
                <select name="" id="" v-model="SongListTitle">
                    <option v-for="(SongList,index) in finnalySongList" :value="`${SongList.title}`">{{ SongList.title }}</option>
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
        .nothingMusic{
            display: flex;
            justify-content: center;
            align-items: center;
            flex-direction: column;
            width: 100%;
            height: 80%;
            h2{
                margin-bottom: 30px;
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