<script setup lang="ts">
import { RouterLink,useRouter } from 'vue-router';
import { useMusicStore } from '@/stores/music';
import { ref } from 'vue'
//引入路由器
const router = useRouter()
//声明搜索框获得的文本
const musicName = ref('')
//引入歌曲pinia的数据
const MusicStore = useMusicStore()
//实现搜索歌曲跳转功能
const musicSearch = () => {
    if(musicName.value.length !== 0){
        router.push({
            path:'/musicsearch',
            query:{
                 name:musicName.value
            }
        })
        musicName.value = ''
    }
}
</script>

<template>
    <nav>
        <div class="search">
            <a href="#">
                <input v-model="musicName" @keyup.enter="musicSearch" type="text">
                <img @click="musicSearch" src="../assets/icon/sousuo.png" alt="">
            </a>
        </div>
        <div class="btn-grow">
            <span href="#">
                <div @click="MusicStore.changeColor" :style="{width:`${MusicStore.subjectColorWidth}px`}"></div>
            </span>
            <a href="#">
                <img src="/images/headImg.jpg" alt="">
            </a>
            <router-link to="/musiclistall">
                歌单
            </router-link>
             <router-link to="/musicuser">
                用户
            </router-link>
        </div>
    </nav>
</template>

<style scoped lang="scss">
nav{
    display: flex;
    height: 50px;
    background-color: rgba(0, 0, 0,0.2);
    border-radius: 0 20px 20px 0;
    justify-content: space-between;
    align-items: center;
    div.search {
        position: relative;
        width: 30%;
        height: 30px;
        margin-left: 200px;
        border-radius: 10px;
        background-color: rgba(0,0,0,0.5);
        a{
            width: 100%;
            height: 100%;
            display: block;
            input {
                position: absolute;
                width: 90%;
                height: 28px;
                border: 0;
                top: 1px;
                left: 1px;
                color: #fff;
                font-size: 16px;
                background-color: rgba(0, 0, 0,0.5);
                &:focus {
                    outline: 1px solid rgba(0,0,0,0.5);
                }
            }
            img{
                position: absolute;
                right: 5px;
                width: 20px;
                height: 20px;
                margin-top: 5px;
            }
        }
    }
    div.btn-grow {
        display: flex;
        justify-content: center;
        align-items: center;
        color: #fff;
        span{
            width: 40px;
            height: 20px;
            border-radius: 20px;
            background-color: black;
            margin-right: 10px;
            div{
                height: 20px;
                border-radius: 20px;
                background-color: #fbe8e7;
                cursor: pointer;
                transition: all 0.5s ease;
            }
        }
        a{
            margin-right: 20px;
            text-decoration: none;
            color: #fff;
            img{
                width: 30px;
                height: 30px;
                border-radius: 50%;
            }
        }
    }
}
</style>