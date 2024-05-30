import {createRouter, createWebHashHistory } from 'vue-router'
import 'nprogress/nprogress.css'
import Nprogress from 'nprogress'
import LayoutPage from "@/views/layout/LayoutPage.vue";
import DashBoard from "@/views/DashBoard/DashBoard.vue";
import LoginPage from "@/views/login/LoginPage.vue";
import DishPage from "@/views/dishes/DishPage.vue";
import PressPage from "@/views/PressPage/PressPage.vue";
import SetMeal from "@/views/SetMeals/SetMeal.vue";
import EmployeePage from "@/views/employee/EmployeePage.vue";
import OrderPage from "@/views/OrderManage/OrderPage.vue";
import CategoryPage from "@/views/CategoryPage/CategoryPage.vue";
import NoFoundPage from "@/views/404/NoFoundPage.vue";

//路由名单
const allRoutes = [
    '/',
    '/login',
    '/cat',
    '/dish',
    '/set',
    '/employee',
    '/order',
    '/layout',
    '/404'
]


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
        },
        {
          path: '/set',
          name: 'SetMeal',
          component: SetMeal,
          meta: {
            title: '瑞吉外卖管理端 | 套餐管理',
          },
        },
        {
          path: '/employee',
          name: 'employee',
          component: EmployeePage,
          meta: {
            title: '瑞吉外卖管理端 | 员工管理',
          },
        },
        {
          path: '/order',
          name: 'order',
          component: OrderPage,
          meta: {
            title: '瑞吉外卖管理端 | 订单管理'
          },
        },
        {
          path: '/cat',
          name: 'category',
          component: CategoryPage,
          meta: {
            title: '瑞吉外卖管理端 | 分类管理',
          },
        },
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
    },
    {
      path: '/404',
      name: '404',
      component: NoFoundPage,
      meta: {
        title: '瑞吉外卖管理端 | 页面走失了'
      },
    }
  ]
})
router.beforeEach(async (to) => {
  if (to.meta.title) {
    document.title = to.meta.title;
  }
  if (!allRoutes.includes(to.fullPath)) {
    await router.replace('/404')
  }
  Nprogress.start()
})
router.afterEach(async () => {
  Nprogress.done()
})
export default router
