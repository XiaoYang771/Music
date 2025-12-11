<script setup lang="ts">
import { ref,watch } from 'vue'
import { useRouter } from 'vue-router'
import { useMusicStore } from '@/stores/musicapi'
//引入歌曲 pinia 的的数据
const MusicStore = useMusicStore()
//引入路由器
const router = useRouter()
//定义切换登录注册的开关变量
const toggleLoginflag = ref(false)
//进行用户信息的持久化存储，默认从本地去读取数据
const person = ref<Array<personType>>(JSON.parse(localStorage.getItem('musicUser') || '[]'))
//定义用户用户名
const username = ref('')
//定义用户密码
const password = ref()
//定义用户邮箱
const email = ref('')
//定义用户再次输入密码
const confirmPassword = ref()
//定义用户名错误的消息
const errorUserName = ref('')
//定义密码错误的消息
const errorPassWord = ref('')
//定义邮箱错误的消息
const errorEmail = ref('')
//定义再次输入密码错误的消息
const errorConfirmPassWord = ref('')
//定义有无该用户的消息
const errorForm = ref('')
//定义用户信息的类型
interface personType {
    username:string,
    password:string,
    email:string
}
//对用户名进行校验
const checkUserName = () => {
    const reg =/^[a-zA-Z0-9_]{4,16}$/
    if(!reg.test(username.value)){
        errorUserName.value = '用户名不满足4-16位'
        return false
    }else{
        errorUserName.value = ''
        return true
    }
}
//对密码进行校验
const checkPassWord = () => {
    const reg =/^[0-9]{6,16}$/
    if(!reg.test(password.value)){
        errorPassWord.value = '密码不满足6-16位'
        return false
    }else{
        errorPassWord.value = ''
        return true
    }
}
//对再次输入密码进行校验
const checkConfirmPassword = () => {
    if(!(confirmPassword.value === password.value)){
        errorConfirmPassWord.value = '输入的密码不一致'
        return false
    }else{
        errorConfirmPassWord.value = ''
        return true
    }
}
//对邮箱进行校验
const checkEmail = () => {
     const reg = /^[A-Za-z0-9]+([-_.][A-Za-z0-9]+)*@([A-Za-z0-9]+[-.])+[A-Za-z0-9]{2,4}$/
     if(!reg.test(email.value)) {
        errorEmail.value = '请输入正确的邮箱格式'
        return false
     }else{
        errorEmail.value = ''
        return true
     }
}
//进行提交 注册 用户的信息
const submitForm = () => {
    if(checkUserName() && checkPassWord() && checkConfirmPassword() && checkEmail()){
        person.value.push({username:username.value,password:password.value,email:email.value})
        username.value = ''
        password.value = ''
        confirmPassword.value = ''
        email.value = ''
        errorForm.value = ''
        toggleLoginflag.value = false
    }else{
        errorForm.value = '请输入表单信息'
    }
}
//切换登录注册
const toggleLogin = () => {
    toggleLoginflag.value = !toggleLoginflag.value
    username.value = ''
    password.value= ''
    email.value = ''
    confirmPassword.value = ''
    errorUserName.value = ''
    errorPassWord.value = ''
    errorEmail.value = ''
    errorConfirmPassWord.value = ''
    errorForm.value =''
}
//登录
const Login = () =>{
    const nowPerson = person.value.find(item => item.username === username.value && item.password === password.value)
    if(nowPerson){
        router.push('/homemusic')
        MusicStore.isLogin = false
        MusicStore.nowMusicUser?.push(nowPerson)
    }else{
        errorForm.value = '该用户尚不存在'
    }
}
//对用户信息列表进行监听并存入本地
watch(person.value,() => {
    localStorage.setItem('musicUser',JSON.stringify(person.value))
})
</script>

<template>
    <div id="box">
        <div class="disappear">
            <span>欢</span>
            <span>迎</span>
            <span>来</span>
            <span>到</span>
            <br>
            <span>小</span>
            <span>杨</span>
            <span>的</span>
            <span>音</span>
            <span>乐</span>
            <span>网</span>
            <span>站</span>
        </div>
        <div v-if="toggleLoginflag" class="Sign">
            <h2>Sign up</h2>
            <form action="">
                <div>
                    <span>
                        <img src="../assets/icon/yonghuming.svg" alt="">
                    </span>
                    <input @blur="checkUserName" v-model="username" type="text" placeholder="username">
                    <p>{{ errorUserName }}</p>
                </div>
                <div>
                    <span>
                        <img src="../assets/icon/youjian.svg" alt="">
                    </span>
                    <input @blur="checkEmail" v-model="email" type="email" placeholder="email address">
                    <p>{{ errorEmail }}</p>
                </div>
                <div>
                    <span>
                        <img src="../assets/icon/mima.svg" alt="">
                    </span>
                    <input @blur="checkPassWord" v-model="password" type="password" placeholder="password">
                    <p>{{ errorPassWord }}</p>
                </div>
                <div>
                    <span>
                        <img src="../assets/icon/mima.svg" alt="">
                    </span>
                    <input @blur="checkConfirmPassword" v-model="confirmPassword" type="password" placeholder="confirm password">
                    <p>{{ errorConfirmPassWord }}</p>
                </div>
                <div>
                    <input @click="submitForm" type="button" value="Create Account">
                    <p class="errorForm">{{ errorForm }}</p>
                </div>
            </form>
            <p>Already a member?<a href="#" @click="toggleLogin"> Log in</a></p>
        </div>
        <div v-if="!toggleLoginflag" class="Sign">
            <h2>Login</h2>
            <form action="">
                <div>
                    <span>
                        <img src="../assets/icon/yonghuming.svg" alt="">
                    </span>
                    <input @blur="checkUserName" v-model="username" type="text" placeholder="username">
                    <p>{{ errorUserName }}</p>
                </div>
                <div>
                    <span>
                        <img src="../assets/icon/mima.svg" alt="">
                    </span>
                    <input @blur="checkPassWord" v-model="password" type="password" placeholder="password">
                    <p>{{ errorPassWord }}</p>
                </div>
                <div>
                    <input @click="Login" type="button" value="Login">
                    <p class="errorForm">{{ errorForm }}</p>
                </div>
            </form>
            <p>Not a member?<a href="#" @click="toggleLogin"> Sign up</a></p>
        </div>
    </div>
</template>

<style scoped lang="scss">
@keyframes an-1 {
    50%{
        transform: skew(-50deg) translateY(100%);
        text-shadow: 0px 0px 50px;
        opacity: 0;
    }
}
    #box{
        position: relative;
        width: 100%;
        height: 100%;
        background: #ffa17f;
        background: linear-gradient(to right,#00223e,#ffa17f);
        overflow: hidden;
        .disappear{
            position: absolute;
            width: 500px;
            height: 100px;
            left: 0;
            top: 300px;
            text-align: center;
            transform: translate(10%,10%);
            span{
                font-size: 50px;
                color: #fff;
                display: inline-block;
                color: transparent;
                text-shadow: 0px 0px 0px rgb(145, 240, 240);
                animation: an-1 3s linear infinite;
            }
        }
        .Sign{
            position: absolute;
            top: 150px;
            left: 580px;
            width: 300px;
            height: 400px;
            background-color: #005691;
            border: 5px solid #005691;
            box-shadow: 5px 5px 5px #0371c5 inset,5px 5px 5px #048bf1;
            text-align: center;
            color: #fff;
            h2{
                color: #fff;
                text-align: center;
                margin-top: 10px;
            }
            form{
                div{
                    position: relative;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 250px;
                    height: 30px;
                    border-radius: 40px;
                    margin: 30px 25px;
                    span{
                        display: block;
                        height: 30px;
                        flex: 1.5;
                        border-right: 2px solid aqua;
                        border-radius: 20px 0 0 20px;
                        background-color: #048bf1;
                        img{
                            width: 25px;
                            height: 25px;
                            margin: 2.5px;
                        }
                    }
                    input{
                        height: 30px;
                        flex: 8.5;
                        border: 0;
                        border-radius: 0 20px 20px 0;
                        background-color: #048bf1;
                        color: #fff;
                        font-size: 18px;
                        &:focus{
                            outline: #fff;
                        }
                    }
                    input[type=button]{
                        border-radius: 20px;
                        background-color: aqua;
                        cursor: pointer;
                        font-size: 18px;
                        font-weight: 600;
                    }
                    p{
                        position: absolute;
                        bottom: -25px;
                        left: 30px;
                        color: red;
                    }
                    .errorForm{
                        position: absolute;
                        bottom: -25px;
                        left: 80px;
                    }
                }
        }
         p{
            font-size: 14px;
            color: #ccc;
            a{
                color: #fff;
                text-decoration: none;
            }
        }
     }
    }
     
</style>