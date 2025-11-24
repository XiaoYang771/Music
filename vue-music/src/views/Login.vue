<script setup lang="ts">
import { ref,watch } from 'vue'
import { useRouter } from 'vue-router'
import { useMusicStore } from '@/stores/music'
const MusicStore = useMusicStore()
const router = useRouter()
const toggleLoginflag = ref(false)
const toggleLogin = () => {
    toggleLoginflag.value = !toggleLoginflag.value
}
interface personType {
    username:string,
    password:string,
    email:string
}
const personOne = localStorage.getItem('musicUser')
const personTwo = personOne ? JSON.parse(personOne) : []
const person= ref<Array<personType>>(personTwo)
const username = ref('')
const password = ref()
const email = ref('')
const confirmPassword = ref()
const errorUserName = ref('')
const errorPassWord = ref('')
const errorEmail = ref('')
const errorConfirmPassWord = ref('')
const errorForm = ref('')
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
const checkConfirmPassword = () => {
    if(!(confirmPassword.value === password.value)){
        errorConfirmPassWord.value = '输入的密码不一致'
        return false
    }else{
        errorConfirmPassWord.value = ''
        return true
    }
}
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
const Login = () =>{
    const nowPerson = person.value.find(item => item.username === username.value && item.password === password.value)
    // console.log(nowPerson)
    if(nowPerson){
        router.push('/homemusic')
        MusicStore.isLogin = false
        MusicStore.nowMusicUser?.push(nowPerson)
    }else{
        errorForm.value = '该用户尚不存在'
    }
}
watch(person.value,() => {
    localStorage.setItem('musicUser',JSON.stringify(person.value))
})
</script>

<template>
    <div id="box">
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
        <div v-else class="Sign">
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
                    <span>
                        <img src="../assets/icon/mima.svg" alt="">
                    </span>
                    <input @blur="checkConfirmPassword" v-model="confirmPassword" type="password" placeholder="confirm password">
                    <p>{{ errorConfirmPassWord }}</p>
                </div>
                <div>
                    <input @click="Login" type="button" value="Login">
                    <p class="errorForm">{{ errorForm }}</p>
                </div>
            </form>
            <p>Already a member?<a href="#" @click="toggleLogin">Sign up</a></p>
        </div>
    </div>
</template>

<style scoped lang="scss">
    #box{
        position: relative;
        width: 100%;
        height: 100%;
        background-color: #02375a;
        .Sign{
            position: absolute;
            top: 150px;
            left: 580px;
            width: 300px;
            height: 400px;
            background-color: #005691;//#005691  355c7d
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
                        // width: 200px;
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