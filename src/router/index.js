import Vue from 'vue'
import VueRouter from 'vue-router'
import LoginPage from '@/views/LoginPage'
import store from '@/store'
import HomePage from '@/views/HomePage'
import LatestPosts from '@/components/LatestPosts'
import CreatePosts from '@/views/CreatePosts'
import SignUpPage from '@/views/SignUpPage'
import DetailPostPage from '@/views/DetailPostPage'
import UpdatePost from '@/views/UpdatePost'
import DetailUserPage from '@/views/DetailUserPage'
import UpdateUser from '@/views/UpdateUser'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    component: HomePage,
    children: [
      {
        path: '',
        name: 'latest',
        component: LatestPosts
      },
    ]
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
    name: 'DetailPostPage',
    props: true,
    component: DetailPostPage,
    meta: { requiresAuth: true }
  },
  {
    path: '/posts/:postId/update',
    name: 'UpdatePost',
    component: UpdatePost,
    meta: { requiresAuth: true }
  },
  {
    path: '/users/:userId',
    component: DetailUserPage,
    props: true,
    children: [{
      path: '',
      name: 'DetailUserPage',
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
