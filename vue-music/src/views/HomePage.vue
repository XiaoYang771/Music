<script setup lang="ts">

</script>

<template>
    <div class="introduce">
        <h1>欢迎来到小杨的音乐网站</h1>
        <div class="technology">
            <div class="ts">
                <h2>TypeScript</h2>
                <p>
                    TS主要是为了为JavaScript增加类型定义,在编译时就可以检查出类型错误。主要运用了一些number、string、boolean等,
                    接口(interface)和类型断言等。
                </p>
            </div>
            <div class="vue">
                <h2>Vue</h2>
                <p>
                    vue框架中主要采用Vue3的语法,数据通过组合式API进行存储,天然兼容TS类型推断,提升开发体验,替代了Vue2的选项式API.
                    其中语法包括setup()语法糖、ref、watch、生命周期钩子等等。
                </p>
            </div>
            <div class="scss">
                <h2>Scss</h2>
                <p>
                    Sass能提高开发效率,增强可维护性并且兼容CSS,主要使用嵌套,减少重复选择器。
                </p>
            </div>
        </div>
        <div class="important">
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
        <p>
        <img src="/images/musicbg1.png" class="bg1" alt="">
        <img src="/images/musicbg2.png" class="bg2" alt="">
        </p>
    </div>
</template>

<style scoped lang="scss">
 @keyframes typing {
    from{
        left: 0;
    }
    to{
        left: 100%;
    }
}
@keyframes blink {
    from,to{
        background: transparent;
    }
    50%{
        background-color: #fff;
    }
}
        .introduce{
            display: flex;
            height: 130vh;
            justify-content: center;
            align-items: center;
            flex-direction: column;
            font-family: monospace;
            color: var(--font-color);
            h1{
                position: relative;
                top: -100px;
                font-size: 50px;
            }
            h1:before,h1:after {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
            }
            h1:before {
                background-color: #222;
                animation: typing var(--typeSpeed) steps(var(--strLength)) forwards;
            }
            h1:after {
                width: 2px;
                background-color: var(--font-color);
                animation: typing var(--typeSpeed) steps(var(--strLength)) forwards,
                blink 500ms steps(var(--strLength)) infinite;
            }
            .technology{
                display: flex;
                justify-content:space-around;
                align-items:center;
                width: 900px;
                height: 250px;
                text-align: center;
                div{
                    flex: 1;
                    height: 100%;
                    font-size: 20px;
                    border-radius: 20px;
                    margin-left: 10px;
                    p{
                        width: 280px;
                        height: 330px;
                        margin: 10px;
                        text-align: left;
                        text-indent: 2em;
                    }
                }
                .ts{
                    background-color: #61AFEF;
                }
                .vue{
                    background-color: #42B883;
                }
                .scss{
                    background-color: #CF649A;
                }
            }
            .important {
                width: 900px;
                margin: 50px;
                margin-top: 20px;
                font-size: 20px;
                li{
                    list-style: none;
                }
            }
            img{
                width: 200px;
                height: 200px;
                position: absolute;

            }
            .bg1{
                top: 50px;
                left: 50px;
            }
            .bg2{
                width: 150px;
                height: 150px;
                top: 60px;
                right: 70px;
            }
        }
</style>