<template>
	<div class="goods">
		<div class="menu-wrapper" ref="menuWrapper">
			<ul>
				<li v-for="(item,index) in goods" :key="item.name" class="menu-item" 
					:class="{'current':currentIndex === index}" 
					@click="selectMenu(index,$event)">
					<span v-show="item.type>0" class="offer_icon" :class="classMap[item.type]" ></span>
					<span class="menu-name">{{ item.name }}</span>
				</li>
			</ul>
		</div>
		<div class="foods-wrapper" ref="foodsWrapper">
			<ul>
				<li v-for="item in goods" :key="item.name" class="food-item food-item-hook" >
					<h1 class="item-name">{{ item.name }}</h1>
					<ul>
						<li v-for="food in item.foods" :key="food.name" class="food-list" 
							@click="chooseFood(food,$event)">
							<div class="food-icon">
								<img :src="food.icon" />
							</div>
							<div class="food-content">
								<h1 class="foodName">{{ food.name }}</h1>
								<p class="foodDesc">{{ food.description }}</p>
								<div class="foodExtra">
									<span>月售{{ food.sellCount }}份</span>
									<span>好评率{{ food.rating }}%</span>
								</div>
								<div class="foodPrice">
									<span class="newPrice">￥{{ food.price }}</span>
									<span v-show="food.oldPrice" class="oldPrice">￥{{ food.oldPrice }}</span>
								</div>
								<div class="cart-wrapper">
									<cartcontrol :food="food" @cart-add="cartAdd"></cartcontrol>
								</div>
							</div>
						</li>
					</ul>
				</li>
			</ul>
		</div>
		<shopcar ref="shopcar" :deliveryPrice="seller.deliveryPrice" 
			:minPrice="seller.minPrice"
			:selectFoods="selectFood">
		</shopcar>
		<food :food="chosenFood" ref="food"></food>
	</div>
</template>

<script>
	import BScroll from 'better-scroll'
	import shopcar from '../shopcar.vue'
	import cartcontrol from '../cartcontrol.vue'
	import food from './food.vue'
	
	const ERR_OK = 0
	export default {
		props: {
			seller: {
				type: Object
			}
		},
		data() {
			return {
				goods: [],
				listHeight: [],
				scrollY: 0,
				chosenFood: {}
			}
		},
		computed:{
			currentIndex() {
				for (let i = 0; i < this.listHeight.length; i++) {
					// 高亮在height1和height2之间时显示
					let height1 = this.listHeight[i];
					let height2 = this.listHeight[i+1];
					// 最后一个没有height2
					if (!height2 || (this.scrollY >= height1 && this.scrollY < height2)) {
						return i
					}
				}
				return 0
			},
			selectFood() {
				let foods = [];
				this.goods.forEach((good) => {
					good.foods.forEach((list) => {
						if (list.count) {
							foods.push(list)
						}
					})
				})
				return foods
			}
		},
		created() {
			this.$http.get('/api/goods').then((response) => {
				response = response.body;
				if (response.errno === ERR_OK) {
					this.goods = response.data;
					this.$nextTick(() => {
						this._calHeight();
						this._initScroll();
					})
					
				}
			});
			this.classMap = ['decrease','discount','special','invoice','guarantee'];
			
		},
		methods:{
			// 定义一个变量接口ref，用this.$ref方法获取DOM，用$nextTick回调函数，方法在里面才能进行计算操作原生DOM
			_initScroll() {
				this.menuScroll = new BScroll(this.$refs.menuWrapper,{
					click:true
				});
				this.foodsScroll = new BScroll(this.$refs.foodsWrapper,{
					// 探针的效果，实时获取Y轴位置
					click:true,
					probeType:3
// 					probeType: 1 滚动的时候会派发scroll事件，会截流。（左边栏不会跟着动）
// 					2滚动的时候实时派发scroll事件，不会截流。 （滑动右边时左边跟着动，点击左边则不动）
// 					3除了实时派发scroll事件，在swipe的情况下仍然能实时派发scroll事件
				});
				this.foodsScroll.on('scroll',(pos) => {
					// 获取到的位置实时赋予scrollY
					this.scrollY = Math.abs(Math.round(pos.y)) 
				})
			},
			_calHeight() {
				let foodItem = this.$refs.foodsWrapper.getElementsByClassName('food-item-hook');
				let height= 0;
				this.listHeight.push(height);
				for (let i = 0; i < foodItem.length; i++) {
					let item = foodItem[i];
					height+= item.clientHeight;
					this.listHeight.push(height);
				}
			},
			selectMenu(index,event) {
				//如果不存在这个属性,则为原生点击事件，不执行下面的函数
				if (!event._constructed) {
					return;
				}
				let foodItem = this.$refs.foodsWrapper.getElementsByClassName('food-item-hook');
				let el = foodItem[index];
				this.foodsScroll.scrollToElement(el,300);
				// console.log(index)
			},
			
			_drop(target) {
				this.$nextTick(() => {
					this.$refs.shopcar.drop(target)
				})
			},
			// 获取子组件cartcontrol传来的事件，调用_drop方法(shopcar里的drop)，将target传入
			cartAdd(target) {
				this._drop(target)
			},
			chooseFood(food,event) {
				if (!event._constructed) {
					return;
				}
				this.chosenFood = food;
				// 调用子组件的方法
				this.$refs.food.show();
			}
		},
		components: {
			shopcar,
			cartcontrol,
			food
		}
	}
</script>

<style>
</style>
