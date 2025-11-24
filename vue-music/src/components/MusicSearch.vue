<script setup lang="ts">
    import { useMusicStore } from '@/stores/music'
    import { watch,ref,onBeforeUpdate } from 'vue'
    import { useRouter } from 'vue-router'
    import { useRoute } from 'vue-router'
//数据
    //引入路由
    const route = useRoute() 
    //引入路由器
    const router = useRouter()
    //引入歌曲pinia的数据
    const MusicStore = useMusicStore()
    //声明搜索列表（搜索的歌曲都应该存在歌曲列表中）
    const MusicSearch = ref<musictype[]>([])
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
    //校验搜索内容与歌曲进行匹配
    const initView = () => {
        // 从路由查询参数中获取关键词，并转义正则特殊字符
        const keyword = route.query.name as string || ''
        const escapedKeyword = keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
        // 构建模糊匹配的正则（忽略大小写）
        const regex = new RegExp(escapedKeyword, 'i')
        MusicSearch.value = MusicStore.MusicList.filter(music => regex.test(music.name))
    }
    initView()
    //生命周期钩子，一旦数据进行改变就重新开始校验
    onBeforeUpdate(() => {
        initView()
    })
    //向播放列表中进行添加歌曲
    const addPlayList = (id:number) => {
      const addMusic = MusicStore.MusicList.find(music => music.id === id)    //想要添加的歌曲
        const repeatMusic =  MusicStore.playList.find(music => music.id === id) //播放列表中的重复歌曲
        if(addMusic && !repeatMusic){
            MusicStore.playList.unshift(addMusic)
            MusicStore.playMusicByIndex(id)
        }
    }
    //向喜欢列表中进行添加歌曲
    const addLikeMusicList = (music:musictype) =>{
        music.like = true
        const repeatMusic = MusicStore.LikeMusicList.some(item => item.id === music.id)
        if(repeatMusic){
            return
        }else{
            MusicStore.LikeMusicList.unshift(music)
        }
    }
    //前往MV
    const goVideo = () => {
        router.push('/musicvideo')
    }
    //对歌曲列表进行监听并存入本地
    watch(
        MusicStore.finallyMusic,
        () => {
            localStorage.setItem('MusicList',JSON.stringify(MusicStore.finallyMusic))
        },{
        deep:true
    })
</script>

<template>
    <div class="content">
        <table v-if="MusicSearch.length !== 0">
            <tr 
            v-for="(music,index) in MusicSearch" 
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
                <td><img @click="goVideo" src="/images/MV.png" alt=""></td>
                <td><img src="../assets/icon/ai03.png" alt=""></td>
                <td><img src="../assets/icon/ai03.png" alt=""></td>
            </tr>
        </table>
        <div v-else class="nothingMusic">
            <h2>没有该歌曲哦~</h2>
            <img src="/images/hashiqi.png" alt="">
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
</style>