import Vue from 'vue'
import VueRouter from 'vue-router'
import LoginPage from '@/views/LoginPage'
import store from '@/store'
import Top from '@/views/Top'
import CreatePosts from '@/views/CreatePosts'
import SignUpPage from '@/views/SignUpPage'
import DetailPost from '@/views/DetailPost'
import UpdatePost from '@/views/UpdatePost'
// import DetailUser from '@/views/DetailUser'
import DetailUserPage from '@/views/DetailUserPage'
import UpdateUser from '@/views/UpdateUser'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Top',
    component: Top
  },
  {
    path: '/login',
    component: LoginPage
  },
  {
    path: '/posts/create',
    name: 'CreatePosts',
    component: CreatePosts,
    meta: { requiresAuth: true }
  },
  {
    path: '/signup',
    component: SignUpPage
  },
  {
    path: '/posts/:postId',
    name: 'DetailPost',
    component: DetailPost,
    meta: { requiresAuth: true }
  },
  {
    path: '/posts/:postId/update',
    name: 'UpdatePost',
    component: UpdatePost,
    meta: { requiresAuth: true }
  },
  // {
  //   path: '/users/:userId',
  //   name: 'DetailUser',
  //   component: DetailUser,
  //   meta: { requiresAuth: true }
  // },
  {
    path: '/users/:userId',
    component: DetailUserPage,
    props: true,
    children: [{
      path: '',
      name: 'DetailUser', // TODO DetailUserPageに変更
      // component: PreviousPosts,
      props: true,
    },],
    meta: { requiresAuth: true }
  },
  {
    path: '/users/:userId/update',
    name: 'UpdateUser',
    component: UpdateUser,
    meta: { requiresAuth: true }
  },
  {
    path: '*',
    redirect: '/'
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { x: 0, y: 0 }
    }
  }
})

router.beforeEach((to, from, next) => {
  const isLoggedIn = store.getters['auth/isLoggedIn']

  // ログインが必要な画面に遷移しようとした場合
  if (to.matched.some(record => record.meta.requiresAuth)) {

    // ログインしている状態の場合
    if (isLoggedIn) {
      next()

    } else {
      next({
        path: '/login',
        // 遷移先のURLはクエリ文字列として付加
        query: {
          next: to.fullPath
        }
      })
    }

  } else {
    // ログインが不要な画面であればそのまま次へ
    next()
  }
})

export default router
