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
    </div>
</template>

<style scoped lang="scss">
    .introduce{
        height: 1000px;
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
        font-size: 30px;
        margin-top: 20px;
            span{
            font-size: 80px;
            }
        }
        div{
            width: 80%;
            font-size: 30px;
            text-indent: 2em;
            margin: 5% 10%;
        }
    }
</style>