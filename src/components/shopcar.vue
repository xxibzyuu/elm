<template>
	<div class="shopCar">
		<div class="carContent" @click="toggleCont">
			<div class="contLeft">
				<div class="logo_wrapper">
					<div class="car_logo" :class="{'carHasProd':totalCount > 0}">
						<i class="iconfont iconhtmal5icon29" :class="{'carHasProd':totalCount > 0}"></i>
					</div>
					<div class="car_count" v-show="totalCount>0">{{ totalCount }}</div>
				</div>
				<div class="car_price" :class="{'carHasProd':totalPrice > 0}">
					￥{{ totalPrice }}
				</div>
				<div class="car_description">
					另需配送费￥{{ deliveryPrice }}元
				</div>
			</div>
			<div class="contRight" :class="payClass">{{ startPrice }}</div>
		</div>
		
		<div class="ballContainer">
			<transition name="drop" v-for="(ball,index) in balls" :key="index" 
			@before-enter="beforeEnter" @enter="enter" @after-enter="afterEnter">
				<div class="ball" v-show="ball.show" >
					<div class="inner inner-hook"></div>
				</div>
			</transition>
		</div>
		<transition name="fold">
			<div class="car_popUp" v-show="contShow">
				<div class="car_head">
					<span class="headTitle">购物车</span>
					<span class="headEmpty" @click="hideList">清空</span>
				</div>
				<div class="car_content" ref="carContent">
					<ul>
						<li v-for="food in selectFoods" :key="food.name" class="food">
							<span class="shopName">{{ food.name }}</span>
							<div class="shopPrice">
								<span class="newPrice">￥{{ food.price * food.count }}</span>
							</div>
							<div class="cartcontrol-wrapper">
								<cartcontrol :food="food"></cartcontrol>
							</div>
						</li>
					</ul>
				</div>
			</div>
		</transition>
		
	</div>
</template>

<script>
	import cartcontrol from './cartcontrol.vue'
	import BScroll from 'better-scroll'
	
	export default{
		props:{
			selectFoods:{
				type: Array,
				default() {
					return [
						{
							price:10,
							count:3
						}
					];
				}
			},
			deliveryPrice:{
				type: Number,
				default: 0
			},
			minPrice:{
				type: Number,
				default: 0
			}
		},
		data() {
			return {
				balls: [
					{ show:false },
					{ show:false },
					{ show:false },
					{ show:false },
					{ show:false }
				],
				fold:true,
				dropBalls:[]
			};
		},
		computed: {
			totalPrice() {
				let totalPrice = 0;
				this.selectFoods.forEach((food) => {
					totalPrice += food.price * food.count
				})
				return totalPrice;
			},
			totalCount() {
				let totalCount = 0;
				this.selectFoods.forEach((food) => {
					totalCount += food.count
				})
				return totalCount;
			},
			// 计算起送价：20元起送，没达到是显示“还差{{}}起送”，达到了则显示“去结算”
			startPrice() {
				if (this.totalPrice === 0) {
					return `￥${this.minPrice}元起送`;
				}else if(this.totalPrice < this.minPrice){
					let diff = this.minPrice - this.totalPrice;
					return `还差￥${diff}元起送`;
				}else{
					return '去结算';
				}
			},
			payClass() {
				if (this.totalPrice < this.minPrice) {
					return 'contRight'
				} else{
					return 'settleAccount'
				}
			},
			contShow() {
				if (!this.totalCount) {
					// this.fold = true;
					return false
				}
				let show = !this.fold;
				if (show) {
					this.$nextTick(() => {
						let _this = this;
						if (!_this.scroll) {
							// 初始化
							_this.scroll = new BScroll(this.$refs.carContent,{
								click:true
							})
						}else{
							_this.scroll.refresh();
						}
						
					})
				}
				return show
			}
		},
		methods:{
			drop(el) {
				for (let i = 0;i < this.balls.length;i++) {
					let ball = this.balls[i];
					if (!ball.show) {
						ball.show = true;
						ball.el = el;
						this.dropBalls.push(ball);
						return;
					}
				}
			},
			toggleCont() {
				if (!this.totalCount) {
					return
				}
				this.fold = !this.fold;
			},
			beforeEnter: function (el) {
				/*el是小球;
				遍历所有show为true的小球*/
				// el.style.transform = 'translate(20px,30px)';
				let count = this.balls.length;
				while(count--){
					let ball = this.balls[count];
					if (ball.show) {
						//获取相对于视窗的位置集合
						let rect = ball.el.getBoundingClientRect();    
						// 点击元素的左边距离 - 下面购物车左边的距离，就是小球要运动的X轴距离
						let x = rect.left - 32;
						// 窗口的高度 - 点击元素离窗口的高度 - 购物车底部的padding,margin高度
						let y = -(window.innerHeight - rect.top - 22);
						el.style.display = "";
						el.style.webkitTransform = `translate(0,$(y)px)`;
						el.style.transform = `translate(0,$(y)px)`;
// 						console.log(x);
// 						console.log(y);
// 						el.style.left = x + 'px';
// 						el.style.top = y + 'px';
						let inner = el.getElementsByClassName('inner-hook')[0];
						inner.style.webkitTransform = `translate($(x)px,0)`;
						inner.style.transform = `translate($(x)px,0)`;
						// 获取加号的位置
						
					}
				}
			},
			enter: function (el) {
				let rf = el.offsetHeight;
				//必须重绘，再进行transform才有用
				this.$nextTick(() => {
// 					el.style.webkitTransform = 'translate(0,0)';
// 					el.style.transform = 'translate(0,0)';
// 					el.style.left = 64 + 'px';
// 					el.style.top = 696 + 'px';
					// el.style.transition = "all .4s cubic-bezier(0.5,-0.3,0.8,0.3)";
					// el.style.transition = "all 2s linear"
// 					let inner = el.getElementsByClassName('inner-hook')[0];
// 					inner.style.webkitTransform = 'translate(0,0)';
// 					inner.style.transform = 'translate(0,0)';
				});
			},
			afterEnter: function (el) {
				// 将dropBalls
				
// 				let ball = this.dropBalls.shift();
// 				if (ball) {
// 					ball.show = false;
// 					el.style.display = 'none';
// 				}
			},
			hideList() {
				// this.fold = true
			}
		},
		components:{
			cartcontrol
		}
	}
</script>

<style>
	
</style>
