<script setup lang="ts">
import { RouterLink } from 'vue-router';
</script>

<template>
    <div class="aside">
        <div class="headshot">
            <img src="/images/headImg.jpg" alt="">
        </div>
        <ul>
            <li><RouterLink to="/songlist">歌单主页</RouterLink></li>
            <li><RouterLink to="/musiclike">我的喜欢</RouterLink></li>
            <li><RouterLink to="/addmusic">歌曲列表</RouterLink></li>
        </ul>
    </div>
</template>

<style scoped lang="scss">
    .aside{
        width: 20%;
        height: 96%;
        background-color: rgba(0,0,0,0.5);
        border-radius: 20px 0 0 20px;
        margin: 1% 0 1% 1%;
        .headshot{
            width:230px;
            height: 230px;
            margin: 20px auto;
            border-bottom: 3px solid black;
            img{
                width:230px;
                height: 230px;
                border-radius: 50%;
            }
        }
        ul{
            margin-top: 50px;
            li{
            width: 100%;
            height: 50px;
            list-style: none;
            line-height: 50px;
            text-align: center;
                a{
                display: block;
                width: 90%;
                height: 50px;
                color: #fff;
                margin-left: 5%;
                border-radius: 20px;
                text-decoration: none;
                }
            }
        }
    }
    .router-link-active{
        background-color: rgb(247, 42, 42);
    }
</style>