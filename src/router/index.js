import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '@/store'
import ListPostsPage from '@/views/ListPostsPage'
import CreateUserPage from '@/views/CreateUserPage'
import LoginPage from '@/views/LoginPage'
import LatestPosts from '@/components/LatestPosts'
import CreateOrUpdatePostPage from '@/views/CreateOrUpdatePostPage'
import DetailPostPage from '@/views/DetailPostPage'
import DetailUserPage from '@/views/DetailUserPage'
import PreviousPosts from '@/components/PreviousPosts'
import UpdateUserPage from '@/views/UpdateUserPage'

Vue.use(VueRouter)

const routes = [
  // 投稿一覧画面
  {
    path: '/',
    component: ListPostsPage,
    children: [
      {
        path: '',
        component: LatestPosts
      },
    ]
  },
  // ユーザー登録画面
  {
    path: '/users/create',
    component: CreateUserPage
  },
  // ログイン画面
  {
    path: '/login',
    component: LoginPage
  },
  // 投稿登録画面
  {
    path: '/posts/create',
    component: CreateOrUpdatePostPage,
    meta: { requiresAuth: true }
  },
  // 投稿詳細画面
  {
    path: '/posts/:postId',
    name: 'DetailPostPage',
    props: true,
    component: DetailPostPage,
    meta: { requiresAuth: true }
  },
  // 投稿更新画面
  {
    path: '/posts/:postId/update',
    name: 'UpdatePostPage',
    component: CreateOrUpdatePostPage,
    props: true,
    meta: { requiresAuth: true }
  },
  // ユーザー詳細画面
  {
    path: '/users/:userId',
    component: DetailUserPage,
    props: true,
    children: [{
      path: '',
      name: 'DetailUserPage',
      component: PreviousPosts,
      props: true,
    },
    ],
    meta: { requiresAuth: true }
  },
  // ユーザー更新画面
  {
    path: '/update_user',
    component: UpdateUserPage,
    meta: { requiresAuth: true }
  },
  // その他
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
  const isLoggedIn = store.getters['user/isLoggedIn']

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
