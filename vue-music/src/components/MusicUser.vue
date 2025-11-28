<script setup lang="ts">
import { onMounted, ref,watch } from 'vue'
import { useRouter } from 'vue-router';
import { useMusicStore } from '@/stores/music';
import { useSongListStore } from '@/stores/songList';
const SongListStore = useSongListStore()
const MusicStore = useMusicStore()
const router = useRouter()
const isShowNotes = ref(false)
const note = ref('')
const isCreateSongList = ref(false)
let isAllowCreate = false
const SongListTitle = ref('')
const SongListImg = ref<string[]>([])
const talkOne = localStorage.getItem('notes')
const talkTwo = talkOne ? JSON.parse(talkOne) : []
const talks = ref<Array<string>>(talkTwo)
const createTalk = (talk:string) => {
    const div = document.createElement('div')
    div.innerHTML = talk
    div.style.width = '870px'
    div.style.height = '100px'
    div.style.marginLeft = '40px'
    div.style.marginTop = '20px'
    div.style.backgroundColor = 'rgba(0,0,0,0.3)'
    div.style.borderRadius = '20px'
    div.style.fontSize = '18px'
    div.style.textIndent = '2em'
    const createTalkBox = document.querySelector('.createTalk')
    createTalkBox?.appendChild(div)
    note.value = ''
} 
function getnotes () {
    talks.value.forEach(item => {
        createTalk(item)
    })
}  

const clearUser = () => {
    localStorage.removeItem('nowMusicUser')
    location.href = '/login'
}
const checkMusicList = (songListID:number) => {
        router.push({
            path:'/musiclistmain',
            query:{
                songListID:songListID
            }
    })
}
const createSongList = () => {
    if(isAllowCreate) {
        SongListStore.createSongList.push(
        {
            id: +new Date(),
            songListImg:SongListImg.value[0]!,
            title:SongListTitle.value || '默认歌单',
            song:[],
            isDelete:true
        }
    )
    }
    
    isAllowCreate = false
    // SongListStore.createSongList.forEach(item => {
    //     SongListStore.songLists.push(item)
    // })
    // console.log(SongListStore.songLists)
    
    SongListTitle.value = ''
    SongListImg.value = []
    isCreateSongList.value = false
}
watch(talks,() => {
    localStorage.setItem('notes',JSON.stringify(talks.value))
},{
    deep:true
})
watch(SongListStore.createSongList,() => {
    localStorage.setItem('MySongList',JSON.stringify(SongListStore.createSongList))
},{
    deep:true
})
const clickNote = () => {
    isShowNotes.value = true  // 会把 视图更新 放入微队列
    Promise.resolve().then(getnotes)
}

const publishNote = (note:string) => {
    talks.value!.push(note)
    createTalk(note)
}
const getSongListImg = (e:Event ) => {
    isAllowCreate = false
    const target = e.target as HTMLInputElement
     const flie = target.files![0] as File
     const Max = 0.25 * 1024 * 1024
     if(flie.size > Max){
        alert('图片大小不能超过500KB')
        target.files = null
        isAllowCreate = false
        return
     }
        const reader = new FileReader()
        reader.onload = (event) => {
            const result = event.target?.result as string
            if(event.target){
                SongListImg.value.push(result)
            }
        }
        reader.readAsDataURL(flie)
        isAllowCreate = true
}
</script>

<template>
    <div class="content">
        <header>
            <div class="userInfo">
                <h1>{{ MusicStore.nowMusicUser[0]?.username }} <span>Lv.8</span> <button @click="clearUser">退出登录</button></h1>
                <hr>
                <ul>
                    <li @click="clickNote">
                        <span>笔记</span>
                        <span>{{ talks.length }}</span>
                    </li>
                    <li>
                        <span>关注</span>
                        <span>1</span>
                    </li>
                    <li>
                        <span>粉丝</span>
                        <span>1</span>
                    </li>
                </ul>
                <p>所在地区:四川省-德阳市</p>
            </div>
        </header>
        <div v-if="!isShowNotes" id="UserMain">
            <nav>
                <ul>
                    <li>歌单</li>
                </ul>
            </nav>
            <div class="UserMain">
                <h3>我创建的歌单<span @click="isCreateSongList = true">添加歌单</span></h3>
                <ul >
                    <li v-for="(SongList,index) in SongListStore.createSongList" @click="checkMusicList(SongList.id)"><img :src="`${SongList.songListImg}`" alt=""></li>
                </ul>
            </div>
        </div>
        <div v-else id="notes">
            <h2>我的笔记</h2>
            <textarea @keyup.enter="publishNote(note)" v-model="note" cols="140" rows="10" class="noresize"></textarea>
            <button @click="publishNote(note)">发布</button>
            <div class="createTalk">

            </div>
        </div>
        <div v-if="isCreateSongList" class="createBg">
            <div class="create">
                <h2>歌单信息</h2>
                <p><span>歌单名称</span><input v-model="SongListTitle" type="text"></p>
                <p><span>歌单图片</span><input @change="getSongListImg" type="file"></p>
                <button @click="createSongList">添加</button>
                <button @click="isCreateSongList = false">取消</button>
            </div>
        </div>
    </div>
   
</template>

<style scoped lang="scss">
    .content{
        width: 99%;
        height: 100%;
        color: #fff;
        position: relative;
        header{
            width: 100%;
            height: 30%;
            .userInfo{
                padding-top: 50px;
                margin-left: 50px;
                h1{
                    margin-bottom: 20px;
                    span{
                        display: inline-block;
                        width: 40px;
                        height: 20px;
                        text-align: center;
                        line-height: 20px;
                        border: 1px solid rgb(196, 33, 33);
                        border-radius: 10px;
                        font-size: 15px;
                        color: rgb(196, 33, 33);
                        margin-left: 30px;
                    }
                    button{
                        float: right;
                        width: 80px;
                        height: 30px;
                        margin-top: 15px;
                        background-color: rgba(255, 0, 43, 0.8);
                        color: #fff;
                        border: 0;
                        cursor: pointer;
                    }
                }
                ul{
                    width: 200px;
                    height: 60px;
                    display: flex;
                    margin-top: 10px;
                    li{
                        display: flex;
                        width: 100%;
                        height: 100%;
                        flex-direction: column;
                        list-style: none;
                        cursor: pointer;
                    }
                }
                p{
                    font-size: 12px;
                }
            }
        }
        #UserMain{
            nav{
                margin-top: 20px;
                width: 100%;
                height: 50px;
                ul{
                    display: flex;
                    li{
                        width: 100px;
                        height: 50px;
                        line-height: 50px;
                        text-align: center;
                        list-style: none;
                    }
                }
            }
            .UserMain{
                width: 100%;
                height: 100%;
                h3{
                    padding-left: 30px;
                    span{
                        float: right;
                        cursor: pointer;
                    }
                }
                ul{
                    // display: flex;
                    // word-wrap: break-word;
                    margin: 20px 50px;
                    li{
                        width: 200px;
                        height: 200px;
                        display: inline-block;
                        margin: 10px;
                        border-radius: 20px;
                        list-style: none;
                        cursor: pointer;
                        img{
                            width: 100%;
                            height: 100%;
                            border-radius: 20px;
                        }
                    }
                }
            }
        }
        #notes{
            margin-top: 50px;
            h2{
                margin-left: 40px;
            }
            textarea{
                background-color: rgba(0,0,0,0.5);
                margin-left: 40px;
                color: #fff;
                resize: none;
                &:focus{
                    outline: none;
                }
            }
            button{
                width: 100px;
                height: 30px;
                margin-left: 450px;
                margin-top: 20px;
                border: 0;
                background-color: rgba(0,0,0,0.6);
                color: #fff;
                cursor: pointer;
            }
            .createTalk{
                width: 95%;
                // background-color: rgba(0,0,0,0.5);
                margin-top: 80px;
                margin: 80px 0 0 4%;
                border-radius: 50px;
                overflow: hidden;
                word-wrap: break-word;
            }
        }
        .createBg {
            position: absolute;
            width: 100%;
            height: 100%;
            background-color: rgba(0,0,0,0.5);
            top: 0;
            .create{
                width: 300px;
                height: 350px;
                background-color: rgba(186, 180, 180, 0.5);
                margin: 200px auto;
                border-radius: 50px;
                text-align: center;
                p{
                    margin-top: 30px;
                    span{
                        font-size: 18px;
                        float: left;
                        margin-left: 25px;
                    }
                    input{
                        width: 250px;
                        height: 30px;
                        margin-top: 20px;
                        &:focus{
                            outline: none;
                        }
                    }
                }
                button{
                    width: 100px;
                    height: 30px;
                    margin: 30px 20px;
                    border: 0;
                    background-color:rgba(0,255,0,0.5);
                    cursor: pointer;
                    color: #fff;
                }
            }
        }
    }
</style>