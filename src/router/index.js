import {createRouter, createWebHashHistory } from 'vue-router'
import 'nprogress/nprogress.css'
import Nprogress from 'nprogress'
import LayoutPage from "@/views/layout/LayoutPage.vue";
import DashBoard from "@/views/DashBoard/DashBoard.vue";
import LoginPage from "@/views/login/LoginPage.vue";
import DishPage from "@/views/dishes/DishPage.vue";
import PressPage from "@/views/PressPage/PressPage.vue";

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/layout',
      name: 'layout',
      component: LayoutPage,
      children: [
        {
          path: '',
          name: 'DashBoard',
          component: DashBoard,
          meta: {
            title: '瑞吉外卖管理端 | 仪表盘'
          }
        },
        {
          path: '/dish',
          name: 'dish',
          component: DishPage,
          meta: {
            title: '瑞吉外卖管理端 | 菜品管理',
          }
        }
      ],
      meta: {
        title: '瑞吉外卖管理端'
      },
    },
    {
      path: '/login',
      name: 'login',
      component: LoginPage,
      meta: {
        title: '瑞吉外卖管理端 | 登录',
      },
    },
    {
      path: '/',
      name: 'press',
      component: PressPage,
      meta: {
        title: '瑞吉外卖管理端 | 展示'
      }
    }
  ]
})
router.beforeEach(async (to) => {
  if (to.meta.title) {
    document.title = to.meta.title;
  }
  Nprogress.start()
})
router.afterEach(async () => {
  Nprogress.done()
})
export default router
