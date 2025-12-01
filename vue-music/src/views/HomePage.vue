<script setup lang="ts">
import { useMusicStore } from '@/stores/music';
const MusicStore = useMusicStore()
console.log(MusicStore.nowMusicUser)
</script>

<template>
    <div class="introduce">
        <h1>欢迎来到小杨的音乐网站</h1>
        <p>本音乐网站使用技术<br><span>VUE & TS & SCSS</span></p>
        <div>
            vue框架中主要采用Vue3的语法,数据通过组合式API进行存储,天然兼容TS类型推断,提升开发体验,替代了Vue2的选项式API.
            其中语法包括setup()语法糖、ref、watch、生命周期钩子等等。
        </div>
        <div>
            TS主要是为了为JavaScript增加类型定义,在编译时就可以检查出类型错误。主要运用了一些number、string、boolean等,
            接口(interface)和类型断言等。
        </div>
        <div>
            Sass能提高开发效率,增强可维护性并且兼容CSS,主要使用嵌套,减少重复选择器。
        </div>
        <div class="api">
            <h3>核心功能:</h3>
            <p>1.用户系统:包含登录、注册功能，通过 localStorage 存储用户信息，登录页面前会验证登录状态（未登录时跳转至登录页）。</p>
            <p>2.音乐播放:支持歌曲播放、暂停、切换上/下一首，维护播放列表，可添加喜欢的歌曲到“我的喜欢”列表。</p>
            <p>3.歌单管理:</p>
            <ul>
                <li>- 展示歌单广场，支持查看歌单详情</li>
                <li>- 用户可创建自定义歌单，包含设置歌单名称、上传歌单图片</li>
                <li>- 支持向歌单中添加歌曲</li>
            </ul>
            <p>4.搜索功能:可搜索歌曲并进行相关操作（如添加到播放列表、歌单等）。</p>
            <p>5.MV播放:支持 MV 播放及相关 MV 推荐，可切换不同 MV 观看。</p>
            <p>6.歌词展示:播放歌曲时同步显示歌词，并有高亮当前歌词的效果。</p>
            <p>7.个人中心:包含用户信息展示、我的笔记（可发布和查看）、创建的歌单等内容。</p>
        </div>
    </div>
</template>

<style scoped lang="scss">
    .introduce{
        color: #fff;
        background: linear-gradient(45deg,#0748cd,#3163eb,#5882f8,#84a1f9,#adbffb);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        h1{
        text-align: center;
        margin-top: 20px;
        }
         p{
        text-align: center;
        font-size: 20px;
        margin-top: 20px;
            span{
            font-size: 80px;
            }
        }
        div{
            width: 80%;
            font-size: 20px;
            text-indent: 2em;
            margin: 5% 10%;
            li{
                list-style: none;
            }
        }
        .api{
            font-size: 18px;
            p{
                font-size: 18px;
                text-align: left;
            }
        }
    }
</style>