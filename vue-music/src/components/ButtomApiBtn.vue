<script setup lang="ts">
    import { useMusicStore } from '@/stores/music'
    import { ref,watch } from 'vue'
    import { useRouter } from 'vue-router'
    //引入路由器
    const router = useRouter()
    //引入歌曲pinia的数据
    const musicStore = useMusicStore()
//数据
    //声明是否下拉隐藏播放按钮变量
    const ishidden = ref(true)
    //声明是否显示音量条
    const isShowSoundProgress = ref(false)
    //声明clientY相反的音量变量
    const sound = ref(0)
    //声明是否静音的变量
    const ismuted = ref(false)
    //声明真实的音量变量
    const realsound = ref(0)
    //声明音量高度
    let soundHeight = ref(50)
    // //声明是否显示歌曲列表
    // const isShowSongList = ref(false)
    //声明音乐时间的位置的变量
    const MusicTimePosition = ref(0)
    //声明默认情况下进度条前进的长度的变量
    const goprogress = ref(0)
    //声明播放的循环方式的数组对象
    const loopsrc = [
        {src:'/images/shunxubofang.svg',alt:'正常播放'},
        {src:'/images/24gl-repeat2.png',alt:'列表循环'},
        {src:'/images/danquxunhuan.svg',alt:'单曲循环'}
    ]
    //声明默认情况下循环的方式变量
    const loopIndex = ref(0)
//方法
    //定义隐藏播放按钮函数
    const hiddenbuttom = () => {
        const buttomY = 70 //下滑的高度
        const buttom  = document.querySelector('.buttomNavApi') as HTMLDivElement
        if(ishidden.value) {
              buttom.style.transform = `translateY(${buttomY}px)`
              setTimeout(() => {
                ishidden.value = false
              },1000)
              musicStore.isShowSongList = false
        }else{
              buttom.style.transform = `translateY(0px)`
               ishidden.value = true
        }
    }
    //点击前往歌词页
    const goMusicLrc = () => {
        router.push('/musiclrc')
    }
    //选择是否静音
    const SwitchMuted = () =>{
        ismuted.value = !ismuted.value
        if(ismuted.value){
            musicStore.audio.muted = true
            soundHeight.value = 0
        }else{
            musicStore.audio.muted = false
            soundHeight.value = 50
        }
    }
    //显示音量条
    const showSoundProgress = () => {
         isShowSoundProgress.value = true
    }
    //隐藏音量条
     const hiddenSoundProgress = () => {
        isShowSoundProgress.value = false
    }
    //获得音量高度
    const getSoundHeight = (event:MouseEvent) => {
        sound.value = event.clientY - 595
        realsound.value = (100 - sound.value) / 100
    }
    //实现控制音量的函数
    const handleSound = () => {
        musicStore.audio.volume = realsound.value
        soundHeight.value = 100 - sound.value
    }
    //是否展示播放列表
    const switchSongList = () => {
        musicStore.isShowSongList = !musicStore.isShowSongList
    }
    //默认情况下进度条前进的长度的函数
    function getMusictime () {
        musicStore.audio.addEventListener('timeupdate',() => {
            goprogress.value = (musicStore.audio.currentTime / musicStore.audio.duration) * 400
        })
    }
    getMusictime()
    //获得音乐时间位置的函数
    const getMusicTimePosition = (event:MouseEvent) => {
        const left = 495.9921875
        MusicTimePosition.value = event.clientX - left
    }
    //点击实现自定义歌曲时间
    const goMusicProgress = () => {
        if(musicStore.playList.length !== 0){
            const realtime = MusicTimePosition.value / 400 * musicStore.audio.duration
            musicStore.audio.currentTime = realtime
        }
    }
   //一进页面就默认采取正常播放
    function getLoopOne () {
        if(loopIndex.value === 0){
            musicStore.audio.loop = false
                musicStore.audio.onended = () => {
                    if(musicStore.currentIndex === musicStore.finallyMusicIndex) {
                        musicStore.audio.pause()
                        musicStore.isPlaying = false
                    }
                    else{
                       musicStore.switchToNextMusic()
                    }
                }
        }
    }
    getLoopOne()
    //实现切换播放方式
    const switchloop = () => {
        if(musicStore.playList.length !== 0) {
            loopIndex.value = (loopIndex.value + 1) % loopsrc.length 
            if(loopIndex.value === 0){
                musicStore.audio.loop = false
                musicStore.audio.onended = () => {
                    if(musicStore.currentIndex === musicStore.finallyMusicIndex) {
                        musicStore.audio.pause()
                        musicStore.isPlaying = false
                    }
                    else{
                       musicStore.switchToNextMusic()
                    }
                }
            }
            if(loopIndex.value === 1){
                musicStore.audio.loop = false
                musicStore.isPlaying = true
                musicStore.audio.play()
                musicStore.audio.onended = () => {
                    musicStore.switchToNextMusic()
                }
            }
            if(loopIndex.value === 2){
                musicStore.audio.loop = true
                musicStore.audio.onended = null
            }
        }
    }
    //实现点击爱心向列表中添加歌曲
    const addLikeMusic = (id:number) => {
        if(musicStore.playList.length !== 0){
            const filterMusic = ref(musicStore.MusicList.find(item => item.id === id))   //点击爱心找到那一首歌
            filterMusic.value!.like = true    //将那首歌的like 变为true 方便后面更改爱心图片
            //判断是否能找到那一首歌 排除null的情况 一旦有null存在 就无法unshift
            if (filterMusic) {
                //some检测数组中是否重复，返回布尔值-------------------------------------为掌握
                const isclude = musicStore.LikeMusicList.some(item => item.id === filterMusic.value!.id)
                //如果不重复，就向数组里面添加
                if (!isclude) {
                    musicStore.LikeMusicList.unshift(filterMusic.value!)
                } 
            }
        }
    }
    //清空播放列表
    const clearPlayList = () => {
        musicStore.playList = []
        musicStore.playMusicById(0)
    }
    //点击播放列表中的歌曲进行播放
    const playMusic = (id:number) => {
        musicStore.playMusicById(id)        
    }
    //删除播放列表中单个歌曲
    const spliceMusic = (id:number) => {
        if(musicStore.playList.length !== 0){
            //定义要删除歌曲的下标
            const spliceMusicIndex = musicStore.playList.findIndex(music => music.id === id)
            //删除后重新渲染播放列表
            musicStore.playList = musicStore.playList.filter(music =>  music.id !== id)
            //对删除歌曲的索引与播放索引进行判断
            if (spliceMusicIndex < musicStore.currentIndex) {   //删除的是当前播放歌曲“上方”的歌曲---所有歌曲的索引都必须减1
                musicStore.currentIndex = musicStore.currentIndex - 1
            }else if (spliceMusicIndex === musicStore.currentIndex) {   //删除的是当前播放的歌曲
                let newPlayIndex = spliceMusicIndex
                if (newPlayIndex >= musicStore.playList.length) {   //若是删除的歌曲是最后一首，则将重第一首开始播放
                    if (musicStore.playList.length === 0) {
                        clearPlayList()
                        return;
                    }
                    newPlayIndex = 0
                }
            musicStore.currentIndex = newPlayIndex  //更新索引
            musicStore.playMusicById(musicStore.playList[newPlayIndex]!.id) //进行传值播放
            
            }
        }
    }
    //监听并存入本地
    watch(
        musicStore.LikeMusicList,
        () => {
        localStorage.setItem('MusicListLike',JSON.stringify(musicStore.LikeMusicList))
    },{
        deep: true
    })  
    watch(
        musicStore.playList,
        () => {
            localStorage.setItem('playList',JSON.stringify(musicStore.playList))
        },{
            deep:true
        }
    )
</script>

<template>
    <div class="buttomNavApi">
        <div class="musicword">
            <a @click="goMusicLrc">
                <img 
                :src="`${musicStore.playList[musicStore.currentIndex]?.img || '/images/guangdie1.webp'}`" 
                :class="{ 'rotating': musicStore.isPlaying }"
                alt="歌曲专辑"
                >
                <span 
                v-for="(item, index) in musicStore.lyrics" 
                :key="index"  
                :class="{ 'active': musicStore.currentLrcIndex === index, 'lyric-item': true }"
                >
                {{ item.text }}
                </span>
            </a> 
        </div>
        <div class="progress">
            <div class="progerssApi">
            <a>
                <img 
                @click="addLikeMusic(musicStore.playList[musicStore.currentIndex]?.id as number)" 
                :src="`${musicStore.playList[musicStore.currentIndex]?.like || false ? '/images/hongaixin.svg':'/images/aixin.png'}`" 
                alt="喜欢"
                >
            </a>
            <a>
                <img @click="musicStore.switchToPreMusic" src="../assets/icon/shangyishou.png" alt="上一首">
            </a>
            <a>
                <img @click="hiddenbuttom" :src="`${ishidden === false ? '/images/shangla.svg':'/images/xiala.svg'}`" alt="">
                <img 
                @click="musicStore.handlePlay" 
                :src="`${musicStore.isPlaying === false ? '/images/zanting_o.svg' : '/images/zanting.svg'}`" 
                alt="暂停开始"
                >
            </a>
            <a>
                <img @click="musicStore.switchToNextMusic" src="../assets/icon/xiayishou.png" alt="下一首">
            </a>
            <a>
                <img @click="switchloop" :src="`${loopsrc[loopIndex]?.src}`" alt="列表循环">
            </a>
            </div>
            <div @click="goMusicProgress" @mousemove="getMusicTimePosition" class="backprogress">
                <div :style="`width:${ goprogress }px`" class="faceprogress">
                    <span class="startTime">{{ musicStore.playList.length ? musicStore.time : null }}</span>
                    <span class="endTime">{{musicStore.playList[musicStore.currentIndex]?.time }}</span>
                </div>
            </div>
        </div>
        <div class="musicbtn">
            <a v-if="ishidden" @mouseleave="hiddenSoundProgress" class="musicSound">
                <div v-if="isShowSoundProgress" class="controlSound">
                    <div 
                    @mousemove="getSoundHeight" 
                    @click="handleSound" 
                    class="SoundProgress"
                    >
                    <div :style="`height:${soundHeight}px`" class="sound"></div>
                    </div>
                </div>
                <img 
                @mousemove="showSoundProgress"
                @click="SwitchMuted" 
                :src="`${ismuted === false ? '/images/yinliang.png':'/images/jingyin-L.png'}`"
                alt=""
                >
            </a>
            <a @click="goMusicLrc">
                <img src="../assets/icon/geci.svg" alt="">
            </a>
            <a>
                <img @click="switchSongList" src="../assets/icon/liebiao.png" alt="">
            </a>
        </div>
    </div>
    <div v-if="musicStore.isShowSongList" class="songlist">
        <div class="songlistbox">
        <img src="/images/songlistbg.png" alt="" class="bg">
        <p>
            <span>播放列表</span>
            <span>{{ musicStore.playList.length }}</span>
            <a @click="clearPlayList" href="#">清空</a>
        </p>
        <ul>
            <li 
            v-for="(music,index) in musicStore.playList" 
            :key="music.id" 
            >
                <div
                 @click="playMusic(music.id)" 
                >
                    <img :src="`${music.img}`" alt="">
                </div>
                <div>
                    <p>
                        {{ music.name }}
                        <span>{{ music.time }}</span>
                    </p>
                    <p>
                        {{ music.singers }}
                        <span>
                            <img @click="spliceMusic(music.id)" src="/images/shanchubeifen2.png" alt="">
                        </span>
                    </p>
                </div>
            </li>
        </ul>
        </div>
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
//定义从右到左的动画
@keyframes scrollFromRight {
  0% {
    transform: translateX(50%); 
  }
  100% {
    transform: translateX(0%);
  }
}
.active {
  opacity: 1 !important;    //显示当前歌词
  animation: scrollFromRight 5s linear;
}
.lyric-item {
  opacity: 0;  //隐藏未激活的歌词(只显示当前句)
  position: absolute; //所有歌词重叠在同一位置
  transition: opacity 0.3s;
}
    .buttomNavApi{
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 96%;
        height: 70px;
        padding: 0 2%;
        background-color: #cadefc;
        transition: all 1s ease;
        div.musicword{
            align-items: center;
                a{
                    display: flex;
                    justify-content: space-between;
                    text-decoration: none;
                    color: black;
                    cursor: pointer;
                        img{
                            width: 50px;
                            height: 50px;
                            border-radius: 50%;
                        }
                        span{
                            width: 200px;
                            height: 50px;
                            line-height: 50px;
                            margin-left: 90px;
                        }
                }
        }
        div.progress{
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            align-items: center;
                .progerssApi{
                    display: flex;
                    justify-content: center;
                    align-items: center;
                   a:nth-child(3) img:last-child {
                        width: 50px;
                        height: 50px;
                        background-color: rgb(243, 78, 161);
                        border-radius: 50%;
                   }
                   a:nth-child(3) img:first-child{
                        width: 80px;
                        height: 20px;
                        position: fixed;
                        bottom:70px;
                        left: 645px;
                        background-color: rgba(0,0,0,0.7);
                        border-radius: 10px 10px 0 0;
                   }
                    a{
                        margin-right: 40px;
                        cursor: pointer;
                        img{
                            width: 30px;
                            height: 30px;
                        }
                    }
                }
                .backprogress{
                    position: relative;
                    width:400px;
                    height: 10px;
                    background-color: rgba(0,0,0,0.8);
                    border-radius: 10px;
                    cursor: pointer;
                    .faceprogress{
                        position: absolute;
                        height: 10px;
                        background-color: red;
                        border-radius: 10px;
                        transition: all 0.5 ease;
                        :first-child{
                            position: fixed;
                            left: 460px;
                            bottom: 0;
                            cursor:auto;
                        }
                        :last-child{
                            position: fixed;
                            left: 910px;
                            bottom: 0;
                            cursor:auto;
                        }
                    }
                }
        }
        div.musicbtn{
            display: flex;
            justify-content: space-around;
            align-items: center;
            a{
                margin-right: 20px;
                cursor: pointer;
                img{
                    width: 20px;
                    height: 20px;
                }
            }
            .musicSound {
                width: 26px;
                height: 150px;
                background-color: rgba(0,0,0,0);
                margin-bottom: 30px;
                position: fixed;
                bottom: -5px;
                right: 110px;
                cursor: auto;
                .controlSound{
                    width: 20px;
                    height: 100px;
                    background-color: rgba(0,0,0,0.7);
                    margin: 5px 5px 0 5px;
                    border-radius: 5px 5px 0 0 ;
                    cursor: pointer;
                    .SoundProgress {
                        position: relative;
                        width: 10px;
                        height: 96px;
                        margin: 2px 5px;
                        border-radius: 10px;
                        background-color: #fff;
                        cursor: pointer;
                        .sound {
                            position: absolute;
                            width: 10px;
                            height: 50px;
                            bottom: 0;
                            border-radius: 10px;
                            background-color: red;
                            transition: all 0.5s ease;
                        }
                    }
                }
            img{
                position: absolute;
                bottom: 0px;
                width: 26px;
                height: 26px;
                cursor: pointer;
            }
            }
        }
    }
    .songlist{
        position:fixed;
        width: 300px;
        height: 400px;
        background-color: rgba(0,0,0,0.4);
        right:0;
        bottom:70px;
        border-radius: 20px 0 0 0 ;
        .songlistbox{
            position: fixed;
            width: 300px;
            height: 400px;
            overflow-y: scroll;
            z-index: -90;
        }
        .songlistbox::-webkit-scrollbar {
                display: none;
            }
        .bg{
            position: fixed;
            width: 200px;
            height: 300px;
            opacity: 0.4;
            right: 50px;
            bottom: 120px;
            border-radius: 10px;
            z-index: -100;
        }
        p{
            position: relative;
            width: 100%;
            height: 50px;
            line-height: 50px;
            color: #fff;
            :first-child {
                font-weight: 800;
                font-size: 20px;
                margin-left: 20px;
            }
            :nth-child(2) {
                position: absolute;
                top: -10px;
                bottom: 430px;
                font-size: 14px;
            }
            :last-child {
                float: right;
                margin-right: 20px;
                font-size: 14px;
                color: #fff;
                text-decoration: none;
            }
        }
        ul{
            li{
                display: flex;
                width: 100%;
                height: 80px;
                list-style: none;
                margin: 1px 0 0 0 ;
                background-color: rgba(0,0,0,0.5);
                &:hover{
                    background-color: rgba(255,255,255,0.1);
                }
                :first-child{
                    flex: 3;
                    position: relative;
                    :first-child{
                        width: 70px;
                        height: 70px;
                        margin: 5px 10px;
                        cursor: pointer;
                    }
                }
                :last-child{
                    flex: 7;
                    :first-child{
                        width: 100%;
                        height: 40px;
                        font-size: 17px;
                        font-weight: 600;
                        span{
                            width: 30px !important;
                        }
                    }
                     :last-child{
                        width: 100%;
                        height: 30px;
                        font-size: 12px;
                        span{
                            width: 30px;
                            color: red;
                            margin-right: 0;
                        }
                    }
                }
            }
       }
    }
</style>