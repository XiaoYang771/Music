import { createRouter, createWebHistory } from 'vue-router'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path:'/',
      redirect:'/homemusic' //重定向指向首页
    },
    {
      path:'/login',
      component: () => import('@/views/Login.vue')
    },
    {
      path:'/homemusic',
      component: () => import('@/views/HomePage.vue')
    },
    {
      path: '/songlist',
      component: () => import('@/views/SongListCenter.vue')
    },
    {
      path: '/addmusic',
      component: () => import('@/views/AddMusics.vue')
    },
    {
      path: '/musiclike',
      component: () => import('@/views/MusicLike.vue')
    },
    {
      path:'/musiclrc',
      component: () => import('@/components/MusicLrc.vue')
    },
    {
      path:'/musicuser',
      component: () => import('@/components/MusicUser.vue')
    },
    {
      path:'/musicvideo',
      component: () => import('@/components/MusicVideo.vue')
    },
    {
      path:'/musicsearch',
      component: () => import('@/components/MusicSearch.vue')
    },
    {
      path:'/musiclistall',
      component: () => import('@/components/MusicListAll.vue')
    },
    {
      path:'/musiclistmain',
      component: () => import('@/components/MusicListMain.vue')
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
