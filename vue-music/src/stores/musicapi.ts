import { defineStore } from "pinia"
import { ref,onMounted,watch } from 'vue'
import { useRouter } from "vue-router"
import { useSongListStore } from "./songList";
import { useStateMusic } from "./music";
//引入解析lrc歌词的函数
import { parseLrc } from '@/utils/lrcParser'
export const useMusicStore = defineStore('music',() => {
    //引入路由器
    const router = useRouter()
    //引入歌单pinia
    const SongListStore = useSongListStore()
    //引入静态歌曲pinia
    const StateMusic = useStateMusic()
    //定义歌曲的类型
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
    //定义歌曲歌词类型
    interface Lyric {
        time: number,
        text: string
    }
    //定义用户信息类型
    interface personType {
        username: string,
        password: string,
        email: string
    }
    //从本地获取喜欢列表
    const LikeMusicList = ref<musictype[]>(JSON.parse(localStorage.getItem('MusicListLike') || '[]'))
    //定义响应式筛选后歌取列表的变量
    const filterMusicLike = ref(JSON.parse(localStorage.getItem('MusicListLike') || '[]'))
    //从本地获取歌曲列表
    const stepOneMusic = localStorage.getItem('MusicList')
    //定义歌曲列表
    const finallyMusic = ref<musictype[]>(stepOneMusic ? JSON.parse(stepOneMusic) : StateMusic.MusicList)
    //声明播放列表---后续音乐都要根据播放列表变量进行播放
    const playList = ref<Array<musictype>>([])
    //声明喜欢列表
    const MusicListLike = ref<Array<musictype>>([])
    //声明歌曲索引
    const currentIndex = ref(0) 
    //声明歌曲是否播放变量
    let isPlaying = ref(false)
    //创建新的audio对象
    const audio = new Audio()
    //声明歌词数据
    const lyrics = ref<Lyric[]>([])
    //当前歌词索引
    const currentLrcIndex = ref(-1)
    //音频当前播放时间
    const currentAudioTime = ref(0)
    //音频当前播放时间
    let time = ref()
    //声明歌曲是否初始化
    const isinitialization = ref(false)
    //声明最后一首歌的下标
    const finallyMusicIndex = ref(0)
    //声明主题色变量
    const subjectColor = ref('#212121')
    const subjectColorWidth = ref(20)
    //声明主题色切换变量
    let i = 1
    //声明是否显示歌曲列表
    const isShowSongList = ref(false)
    //声明是否登录
    const isLogin = ref(true)
    //当前用户登录的用户信息
    const nowMusicUser = ref<Array<personType>>(JSON.parse(localStorage.getItem('nowMusicUser') || '[]'))
    
    //实现主题色的切换
    const changeColor = () => {
        i++
        if (i % 2 === 0) {
            subjectColor.value = '#fbe8e7'
            subjectColorWidth.value = 40
        } else {
            subjectColor.value = '#212121'
            subjectColorWidth.value = 20
        }
    }
    //获得歌曲歌词
    const setLyrics = (lrcText: string) => {
        lyrics.value = parseLrc(lrcText).filter(lyric => lyric.text)
    }
    //自定义歌曲是否播放
    const handlePlay = () => {
        if (playList.value.length !== 0) {
            isPlaying.value = !isPlaying.value
            setLyrics(playList.value[currentIndex.value]!.lyric) //更新歌词
            if(!isinitialization.value){
                audio.src = playList.value[currentIndex.value]!.src
                isinitialization.value = true
            }
            if (isPlaying.value) {
                audio.play()
            }else{
                audio.pause()
            }
        }
    }
    //封装自动播放下一首
    const switchToNextMusic = () => {
       if(playList.value.length !== 0){
           isPlaying.value = true  //将暂停改为播放
           currentIndex.value = (currentIndex.value + 1) % playList.value.length   //找到下一首歌索引
           audio.src = playList.value[currentIndex.value]!.src //根据索引进行播放
           audio.play()    //播放
           const currentMusic = playList.value[currentIndex.value] //获得下一首歌
           const newLrcText: string = currentMusic!.lyric ?? ''   //获得下一首歌的歌词
           setLyrics(newLrcText)   //更改为新歌词
           currentLrcIndex.value = -1  //重置歌词索引
           currentAudioTime.value = 0  //重置音频时间

       }
    }
    //封装自动播放上一首
    const switchToPreMusic = () => {
        if (playList.value.length !== 0) {
            isPlaying.value = true
            currentIndex.value = (currentIndex.value - 1 + playList.value.length) % playList.value.length
            audio.src = playList.value[currentIndex.value]!.src
            audio.play()
            const currentMusic = playList.value[currentIndex.value]
            const newLrcText: string = currentMusic!.lyric ?? ''
            setLyrics(newLrcText)
            currentLrcIndex.value = -1
            currentAudioTime.value = 0
        }
    }
    //监听音频并获得播放时间
    audio.addEventListener('timeupdate', () => {
        function formatSecondsToMS(totalSeconds: number) {
            // 计算分钟数（补俩位）
            const minutes = Math.floor(totalSeconds / 60)
            // 计算剩余秒数（补两位）
            const seconds = totalSeconds % 60
            const formattedMinutes = String(minutes).padStart(2, '0')
            const formattedSeconds = String(seconds).padStart(2, '0')
            return `${formattedMinutes}:${formattedSeconds}`
        }
        time.value = formatSecondsToMS(Math.floor(audio.currentTime))
    })
    //DOM挂载完成后执行
    onMounted(() => {
        // 1. 解析歌词并存入 Pinia
        const lrcText = playList.value[currentIndex.value]?.lyric ?? ''
        setLyrics(lrcText)
        // 2. 时间更新时同步到 Pinia
        audio.addEventListener('timeupdate', () => {
            updateAudioTime(audio.currentTime)
        })
    })
    //点击歌曲时进行播放当前歌曲
    const playMusicById = (id:number) => {
        //1.更新当前下标
        if(playList.value.length > 0){
            const PlayIndex = playList.value.findIndex(music => music.id === id)//在播放列表中找当歌曲的下标
            currentIndex.value = PlayIndex//将下标赋值给公共歌曲的索引
            finallyMusicIndex.value = playList.value.length - 1//更新最后一首歌的下标
            //2.切换音频源并控制播放
            audio.src = playList.value[PlayIndex]!.src
            isPlaying.value = true
            //先清空之前的事件监听（避免重复监听）
                audio.removeEventListener('canplay', handleCanPlay)
            // 注册 canplay 事件，音频可播放时执行 play
                audio.addEventListener('canplay', handleCanPlay)
                function handleCanPlay() {
                    audio.play()
                    // 播放后移除事件监听
                    audio.removeEventListener('canplay', handleCanPlay)
                }
            // 3. 解析并更新歌词
            const lyricText = playList.value[PlayIndex]!.lyric || ''
            setLyrics(lyricText)
        }else{
            audio.pause()
            audio.currentTime = 0
            isPlaying.value = false
            setLyrics('')
        }
    }
    //更新音频时间并匹配歌词索引
    const updateAudioTime = (time: number) => {
        currentAudioTime.value = time
        // 匹配歌词索引逻辑（移至 Pinia，统一处理）
        const index = lyrics.value.findIndex((item, i) => {
            const nextTime = lyrics.value[i + 1]?.time || Infinity
            return time >= item.time && time < nextTime
        })
        currentLrcIndex.value = index
    }
    //向播放列表中添加歌曲
    const addPlayList = (id: number) => {
        const addMusic = finallyMusic.value.find((music:musictype) => music.id === id)    //想要添加的歌曲
        const repeatMusic = playList.value.find((music:musictype) => music.id === id) //播放列表中的重复歌曲
        if (addMusic && !repeatMusic) {
            playList.value.unshift(addMusic)
            isinitialization.value = true
            playMusicById(id)
        }
    }
    //歌单播放全部并添加到播放列表中
    const addPlayListAll = (songList:musictype[]) => {
        while (playList.value[0]) {
            playList.value.shift()
        }
        for (const item of songList) {
            playList.value.push(item)
        }
        playMusicById(playList.value[0]!.id)
        isinitialization.value = true
        finallyMusicIndex.value = playList.value.length - 1
    }
    //点击查看歌单
    const checkMusicList = (songListID: number) => {
        router.push({
            path: '/musiclistmain',
            query: {
                songListID: songListID
            }
        })
    }
    //添加清除爱心的逻辑
    const switchLikeMusic = (music: musictype) => {
        music.like = !music.like
        if (music.like) {
            addLikeMusicList(music)
        } else {
            clearMusicLike(music)
        }
    }
    //向我的喜欢列表中添加歌曲
    const addLikeMusicList = (music: musictype) => {
        music.like = true
        for (let i = 0; i < SongListStore.songLists.length; i++) {
            const currentSongList = SongListStore.songLists[i]
            for (let j = 0; j < currentSongList!.song.length; j++) {
                if (currentSongList!.song[j]!.id === music.id) {
                    currentSongList!.song[j]!.like = true
                    break
                }
            }
        }
        finallyMusic.value.forEach((item: musictype) => {
            if (item.id === music.id) {
                item.like = true
            }
        })
        const repeatMusic = LikeMusicList.value.some(item => item.id === music.id)
        if (!repeatMusic) {
            LikeMusicList.value.unshift(music)
        }
    }
    //点击清除喜欢的歌曲
    const clearMusicLike = (music: musictype) => {
        music.like = false
        //首先先排除掉去除的那一首歌
        filterMusicLike.value = LikeMusicList.value.filter(item => item.id !== music.id)
        //其次再需要对歌曲列表中的爱心进行取消
        finallyMusic.value.forEach((item:musictype) => {
            if (item.id === music.id) {
                item.like = false
            }
        })
        //对歌单列表中的爱心进行取消
        SongListStore.songLists.forEach(songList => {
            songList.song.forEach((song:musictype) => {
                if (song.id === music.id) {
                    song.like = false
                }
            })
        })
        //将喜欢列表中的值全删除变为空数组，直接赋值为改变响应式
        while (LikeMusicList.value[0]) {
            LikeMusicList.value.shift()
        }
        //再把排除后的歌曲的每一项项喜欢列表中添加，不会改变响应式
        for (const item of filterMusicLike.value) {
            LikeMusicList.value.push(item)
        }
    }
    //对当前用户信息进行监听并存入本地，便于下次不用在进行登录
    watch(nowMusicUser, () => {
        localStorage.setItem('nowMusicUser', JSON.stringify(nowMusicUser.value))
    }, {
        deep: true
    })
    //对喜欢列表进行监听并存入本地  
    watch(
        () => LikeMusicList.value,
        () => {
            localStorage.setItem('MusicListLike', JSON.stringify(LikeMusicList.value))
        }, {
        deep: true
    })
    //对歌曲列表进行监听并存入本地
    watch(
        () => finallyMusic.value,
        () => {
            localStorage.setItem('MusicList', JSON.stringify(finallyMusic.value))
        }, {
        deep: true
    })
        return {
            lyrics, currentLrcIndex, currentAudioTime, currentIndex, isPlaying, time, audio, MusicListLike,
            LikeMusicList, playList, finallyMusic, finallyMusicIndex, subjectColor, subjectColorWidth, isinitialization,
            isShowSongList, isLogin, nowMusicUser, filterMusicLike,
            updateAudioTime, switchToNextMusic, switchToPreMusic, setLyrics, handlePlay, playMusicById, changeColor,
            addPlayList, addPlayListAll, checkMusicList, switchLikeMusic,clearMusicLike
        }
})
