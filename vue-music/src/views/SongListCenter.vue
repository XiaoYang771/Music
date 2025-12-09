<script setup lang="ts">
    import { ref,onUnmounted } from 'vue'
    import { useMusicStore } from '@/stores/music'
    import { useSongListStore } from '@/stores/songList';
    import { useRouter } from 'vue-router'
    //引入路由器
    const router = useRouter()
    //引入歌曲pinia的数据
    const MusicStore = useMusicStore()
    //引入歌单pinia的数据
    const songListStore = useSongListStore()
    //定义轮播图列表图片类型
    interface navImgListType {
        id:number,
        src:string
    }
    //声明存储轮播图图片的列表数组
    const navImgList:navImgListType[] = [
        {id:0,src:"/images/banner2.png"},
        {id:1,src:"/images/banner11.jpg"},
        {id:2,src:"/images/banner12.jpg"},
    ]
//轮播图模块
    //声明响应式的src路径，实时取到图片列表里面的值并放到模板中渲染
    let src = ref('')
    //控制轮播图中左右箭头的隐藏，默认隐藏
    const isshow = ref(false)
    //获得轮播图中底部小圆点的索引和图片索引
    const activeIndex = ref(-1)
    //声明控制定时器的变量---方便销毁
    let timer: number | null = null
    //开始自动轮播
    const startbanner = () => {
        isshow.value = false    //左右箭头隐藏
        if (timer) clearInterval(timer)//防止重复创建定时器
        timer = setInterval(() => {
            activeIndex.value = (activeIndex.value + 1) % navImgList.length
            src.value = navImgList[activeIndex.value]!.src
        }, 2000)
    }
    //鼠标移入关闭清除定时器
    const stopbanner = () => {
        isshow.value = true
        if (timer) {
            clearInterval(timer)
            timer = null   //清除定时器 防止内存泄漏
        }
    }
    //轮播图切换下一张图片
    const DownImg = () => {
        activeIndex.value++
        console.log(activeIndex.value)
        if (activeIndex.value >= navImgList.length) {
            activeIndex.value = 0
        }
        src.value = navImgList[activeIndex.value]!.src
    }
    //轮播图切换上一张图片
    const UpImg = () => {
        activeIndex.value--
        if(activeIndex.value < 0){
            activeIndex.value = navImgList.length - 1
        }
        src.value = navImgList[activeIndex.value]!.src
    }
    //轮播图小圆点切换
    const SwitchImg = (index:number) =>{
        activeIndex.value = index
        src.value = navImgList[index]!.src
    }
    //一进页面就自动轮播
    startbanner()
    //组件销毁时清除定时器---防止内存泄漏
    onUnmounted(stopbanner)
//最新歌曲模块
    //点击歌取，向播放列表中添加
    const playMusic = (id:number) => {
        const addMusic = MusicStore.MusicList.find(music => music.id === id)    //想要添加的歌曲
        const repeatMusic =  MusicStore.playList.find(music => music.id === id) //播放列表中的重复歌曲
        if(addMusic && !repeatMusic){
            MusicStore.playList.unshift(addMusic)
            MusicStore.playMusicById(id)
        }
    }
    //点击查看歌单
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
    <!-- banner模块 -->
        <div class="banner" @mouseenter="stopbanner" @mouseleave="startbanner">
            <img v-if="isshow" @click="UpImg" src="../assets/icon/xiangzuojiantou.png" alt="" class="leftbtn">
            <div class="banner-img">
                <img :src="`${src || '/images/banner4.jpg'}`" alt="">
                <div class="activebox">
                    <span
                     v-for="(item, index) in navImgList" 
                    :key="index" 
                    :class="{ 'active': index === activeIndex }"
                    @click="SwitchImg(index)"
                    >
                    </span>
                </div>
            </div>
            <img v-if="isshow" @click="DownImg" src="../assets/icon/youjiantou.png" alt="" class="rightbtn">
        </div>
    <!-- 热门歌单模块 -->
        <div class="songlist">
                <h2>热门歌单 ></h2>
                <ul>
                    <li 
                    v-for="(songList,index) in songListStore.songLists" 
                    @click="checkMusicList(songList.id)"
                    :key="index"
                    :style="{
                        backgroundImage:`url(${songList.songListImg})`,
                        backgroundSize:'cover',
                        backgroundPosition:'center'
                    }"
                    >
                        <span><img src="../assets/icon/18erji-2.svg" alt="">{{ songList.pageview }}</span>
                        <span>{{ songList.title }}</span>
                        <p>{{ songList.content }}</p>
                    </li>
                </ul>
        </div>
    <!-- 最新歌曲模块 -->
        <div class="newmusic">
            <h2>最新音乐 ></h2>
            <div class="newmusiclist">
                <ul>
                    <li 
                    v-for="(song,index) in MusicStore.finallyMusic.slice(MusicStore.finallyMusic.length-6,
                    MusicStore.finallyMusic.length-3)" 
                    @click="playMusic(song.id)"
                    :key="song.id"
                    >
                        <a href="#">
                            <div 
                            :style="{
                                backgroundImage:`url(${song.img})`,
                                backgroundSize:'cover',
                                backgroundPosition:'center'
                            }"
                            class="newmusicImg" 
                            >
                            </div>
                            <div class="newmusiccontent">
                                <p>{{ song.name }}</p>
                                <p>{{ song.singers }}</p>
                            </div>
                        </a>
                    </li>
                </ul>
                <ul>
                    <li 
                    v-for="(song,index) in MusicStore.finallyMusic.slice(MusicStore.finallyMusic.length-3,
                    MusicStore.finallyMusic.length)" 
                    @click="playMusic(song.id)"
                    :key="song.id"
                    >
                        <a href="#">
                           <div 
                            :style="{
                            backgroundImage:`url(${song.img})`,
                            backgroundSize:'cover',
                            backgroundPosition:'center'
                            }"
                            class="newmusicImg" 
                            >
                            </div>
                            <div class="newmusiccontent">
                                <p>{{ song.name }}</p>
                                <p>{{ song.singers }}</p>
                            </div>
                        </a>
                    </li>
                </ul>
            </div>
        </div>
    <!-- 尾部模块 -->
        <footer>
              <p>Start:2025/10/28&nbsp&nbsp&nbspQQ:2824227382&nbsp&nbspGitHub&nbsp:xiaoyang771&nbsp&nbsp&nbsp欢迎大家与我积极交流</p>
        </footer>
</template>

<style scoped lang="scss">
    h2{
        margin-left: 10px;
        color: #fff;
    }
    .banner{
        position: relative;
        width: 90%;
        height: 250px;
        margin: 10px 5%;
        border-radius: 10px;
        img{
            width: 50px;
            height: 50px;
            cursor: pointer;
        }
        .leftbtn{
            position: absolute;
            top: 100px;
        }
        .rightbtn{
            position: absolute;
            right: 0;
            top: 100px;
        }
        div.banner-img{
            width: 100%;
            height: 250px;
            img{
                width: 100%;
                height: 250px;
                border-radius: 10px;
            }
            .activebox{
                position: absolute;
                bottom: 0;
                left: 44%;
                span {
                display: inline-block;
                width: 10px;
                height: 10px;
                border-radius: 50%;
                cursor: pointer;
                margin-left: 20px;
                background-color: #fff;
                }
                .active{
                    background-color: red !important;
                }
            }
            
        }
    }
    .songlist{
        width: 90%;
        height: 280px;
        margin: 10px 5%;
        ul{
            height: 85%;
            display: flex;
            justify-content: space-around;
            align-items: center;
            li{
                position: relative;
                list-style: none;
                width: 22%;
                height: 100%;
                border-radius: 10px;
                color: #fff;
                cursor: pointer;
                :first-child{
                    position: absolute;
                    right: 10px;
                    img{
                        position: absolute;
                        right: 35px;
                        bottom: 2px;
                        width: 17px;
                        height: 17px;
                    }
                }
                :nth-child(2){
                    position: absolute;
                    bottom: 50px;
                    font-size: 20px;
                    font-weight: 600;
                }
                :last-child{
                    position: absolute;
                    bottom: 0;
                }
            }
        }
    }
    .newmusic{
        width: 95%;
        height: 360px;
        margin: 10px 0 30px 5%;
        .newmusiclist{
            display: flex;
            width: 94%;
            height: 95%;
            background-color: rgba(0,0,0,0.3);
            border-radius: 20px;
            justify-content: space-around;
            align-items: center;
            ul{
                display: flex;
                flex: 5;
                height: 100%;
                flex-direction: column;
                justify-content: space-around;
                align-items: center;
                li{
                    list-style: none;
                    width: 90%;
                    height: 100%;
                    margin-top: 20px;
                    &:hover{
                        background-color: rgba(255,255,255,0.1);
                    }
                    a{
                        display: flex;
                        text-decoration: none;
                        .newmusicImg{
                            position: relative;
                            flex: 2;
                            height: 79.34px;
                            border-radius: 10px;
                            margin: 7.33px;
                            }
                        }
                        .newmusiccontent{
                            flex: 8;
                            padding: 10px;
                            :first-child{
                                color: #fff;
                                font-size: 18px;
                                font-weight: 500;
                            }
                            :last-child{
                                color: #ddd;
                                font-size: 14px;
                            }
                        }
                    }
                }
            }
    }
    footer{
        height: 50px;
        text-align: center;
        color: #fff;
        font-size: 14px;
    }
</style>