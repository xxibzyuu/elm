// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import VueRouter from 'vue-router'
import VueResource from 'vue-resource'

import goods from './components/goods/goods.vue'
import ratings from './components/ratings/ratings.vue'
import seller from './components/seller/seller.vue'

import './common/stylus/css.styl'
import './assets/sell-icon/iconfont.css'

Vue.use(VueRouter)
Vue.use(VueResource)
Vue.config.productionTip = false
// 定义路由
const routes = [
	{ path:'/',redirect: '/goods' },
	{ path:'/goods',component: goods },
	{ path:'/ratings',component: ratings },
	{ path:'/seller',component: seller }
]
// 创建路由器实例，并且传入`routes`变量作为路由。
const routers = new VueRouter({
	routes:routes,
	linkActiveClass: 'active'
})

/* eslint-disable no-new */
// 创建和挂载跟实例
new Vue({
	el: '#app',
	//将上面声明的路由器传递到根Vue实例
	router:routers,
	components: { App },
	template: '<App></App>',
}).$mount('#app')



