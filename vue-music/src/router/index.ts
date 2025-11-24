import { createRouter, createWebHistory } from 'vue-router'
import Login from '@/views/Login.vue'
import SongListCenter from '@/views/SongListCenter.vue'
import HomePage from '@/views/HomePage.vue'
import MusicLike from '@/views/MusicLike.vue'
import AddMusics from '@/views/AddMusics.vue'
import MusicLrc from '@/components/MusicLrc.vue'
import MusicUser from '@/components/MusicUser.vue'
import MusicVideo from '@/components/MusicVideo.vue'
import MusicSearch from '@/components/MusicSearch.vue'
import MusicListAll from '@/components/MusicListAll.vue'
import MusicListMain from '@/components/MusicListMain.vue'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path:'/',
      redirect:'/homemusic' //重定向指向首页
    },
    {
      path:'/login',
      component:Login
    },
    {
      path:'/homemusic',
      component:HomePage,  //首页
    },
    {
      path: '/songlist',
      component: SongListCenter //歌单主页
    },
    {
      path: '/addmusic',
      component: AddMusics    //歌曲列表
    },
    {
      path: '/musiclike',
      component: MusicLike  //我的喜欢
    },
    {
      path:'/musiclrc',
      component:MusicLrc  //歌词
    },
    {
      path:'/musicuser',
      component:MusicUser   //我的
    },
    {
      path:'/musicvideo',
      component:MusicVideo  //MV
    },
    {
      path:'/musicsearch',
      component:MusicSearch   //歌曲搜索
    },
    {
      path:'/musiclistall',
      component:MusicListAll  //歌单中心
    },
    {
      path:'/musiclistmain',
      component:MusicListMain //歌单主页
    }
  ],
})
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('nowMusicUser')
  // 如果没有token，且不是前往登录页，则跳转到登录页
  if (!token && to.path !== '/login') {
    location.href = '/login'
  } else if(token && to.path === '/login'){
    // next() // 有token或前往登录页，正常跳转
    next('/homemusic')
  }else{
    next()
  }
})
export default router
