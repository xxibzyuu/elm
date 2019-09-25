<template>
	<transition name="slide">
		<div class="foodDetail-wrapper" v-show="showDetail" ref="food">
			<div class="foodContent">
				<div class="imageHeader">
					<img :src="food.image" />
					<div class="back" @click="backIndex">
						<i class="iconfont iconarrow_lift"></i>
					</div>
				</div>
				<div class="foodDetail">
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
					<div class="cartcontrol-wrapper">
						<cartcontrol :food="food"></cartcontrol>
					</div>
					<div @click="addFirst" class="addCart" v-show="!food.count || food.count === 0">加入购物车</div>
				</div>
				<spilt></spilt>
				<div class="foodIntro">
					<h1 class="introduction">商品介绍</h1>
					<p class="infomation">{{ food.info }}</p>
				</div>
				<spilt></spilt>
				<div class="foodRating">
					<h1 class="introduction">商品评价</h1>
					<ratingselect :select-type="selectType" :only-content="onlyContent" 
						:decription="description" :ratings="food.ratings" 
						@type-select="typeSelect" @cont-toggle="contToggle"></ratingselect>
					<div class="rating-wrapper">
						<ul v-show="food.ratings && food.ratings.length">
							<li v-for="rating in food.ratings" :key="rating.item" 
								class="rating-item" v-show="needShow(rating.rateType,rating.text)">
								<div class="user">
									<span class="username">{{ rating.username }}</span>
									<img :src="rating.avatar" />
								</div>
								<div class="time">{{ rating.rateTime | formatDate }}</div>
								<p class="text">
									<span class="iconfont" :class="{'iconzan1':rating.rateType===0,'iconthumbdown':rating.rateType===1}"></span><span class="usertext">{{ rating.text }}</span>
								</p>
							</li>
						</ul>
						<div class="no-ratings" v-show="!food.ratings || !food.ratings.length">
							暂无评价
						</div>
					</div>
				</div>
			</div>
		</div>
	</transition>
</template>

<script>
	import Vue from 'vue'
	import BScroll from 'better-scroll'
	import cartcontrol from '../cartcontrol.vue'
	import spilt from '../spilt.vue'
	import ratingselect from '../ratings/ratingselect.vue'
	import {formatDate} from '../../../static/js/date.js'
	// 用花括号可引入多个function
	
	const POSITIVE = 0;
	const NEGATIVE = 1;
	const ALL = 2;
	
	export default {
		props: {
			food:{
				type:Object
			}
		},
		data() {
			return {
				showDetail:false,
				selectType:ALL,
				onlyContent:true,
				description:{
					all: '全部',
					positive: '推荐',
					negative: '吐槽'
				}
			}
		},
		methods: {
			show(){
				this.showDetail = true;
				// 避免DOM结构未渲染完成从而造成子元素bscroll-container高度计算不准确
				this.$nextTick(() => {
					if (!this.scroll) {
						this.scroll = new BScroll(this.$refs.food,{
							click:true
						});
					} else{
						// 重新调用来计算高度确保滚轮正常效果
						this.scroll.refresh();
					}
				});
			},
			backIndex(){
				this.showDetail = false;
			},
			addFirst(event){
				if (!event._constructed) {
					return;
				}
				Vue.set(this.food,'count',1)
			},
			//ratingselect取决于type的值，switch取决于text的值 
			needShow(type,text){
				if (this.onlyContent && !text) {
					return false;
				}
				if (this.selectType === ALL) {
					return true;
				} else{
					return type === this.selectType
				}
			},
			typeSelect(type){
				this.selectType = type
			},
			contToggle(onlyContent){
				this.onlyContent = onlyContent
			}
		},
		filters:{
			formatDate(time){
				let date = new Date(time)
				return formatDate(date,'yyyy-MM-dd hh:mm')
			}
		},
		components:{
			cartcontrol,
			spilt,
			ratingselect
		}
	}
</script>

<style>
	.foodDetail-wrapper{
		position: fixed;
		width: 100%;
		left: 0;
		top: 0;
		bottom: 1.3rem;
		z-index: 30;
		overflow: hidden;
		font-size: 0;
	}
	.slide-enter,.slide-leave-to{
		transform: translateX(100%);
	}
	.slide-enter-active,.slide-leave-active{
		transition: all 0.4s linear;
	}
	.imageHeader{
		position: relative;
		width: 100%;
		height: 0;
		padding-top: 100%;
	}
	.imageHeader img{
		width: 100%;
		height: 100%;
		position: absolute;
		top: 0;
		left: 0;
	}
	.back{
		position: absolute;
		top: 0.133rem;
		left: 0;
	}
	.iconfont.iconarrow_lift{
		display: block;
		padding: 0.266rem;
		font-size: 0.32rem;
		color: #FFFFFF;
	}
	.foodDetail,.foodIntro{
		background: #FFFFFF;
		padding: 0.48rem;
	}
	.foodDetail{
		position: relative;
	}
	.foodDetail .cartcontrol-wrapper{
		position: absolute;
		right: 0.48rem;
		bottom: 0.48rem;
	}
	.addCart{
		position: absolute;
		right: 0.48rem;
		bottom: 0.48rem;
		width: 1.973rem;
		height: 0.64rem;
		line-height: 0.64rem;
		background: rgb(0,160,220);
		color: #FFFFFF;
		box-sizing: border-box;
		border-radius: 0.32rem;
		font-size: 0.266rem;
		text-align: center;
	}
	.foodIntro{
		border: 0.013rem solid rgba(7,17,27,0.1);
		border-left: transparent;
		border-right: transparent;
	}
	.introduction{
		font-size: 0.373rem;
		font-weight: 200;
		margin: 0;
	}
	.infomation{
		font-size: 0.32rem;
		color: rgb(77,85,93);
		padding: 0.16rem 0.213rem;
	}
	.foodRating{
		background: #FFFFFF;
		padding-top: 0.48rem;
	}
	.foodRating .introduction{
		margin-left: 0.48rem;
	}
	.rating-item{
		position: relative;
		margin: 0.426rem 0.48rem;
		border-bottom: 0.013rem solid rgba(7,17,27,0.1);
	}
	.user{
		position: absolute;
		top: 0;
		right: 0;
	}
	.username{
		font-size: 0.266rem;
		color: rgb(147,153,159);
		padding-right: 0.16rem;
		display: inline-block;
		vertical-align: middle;
	}
	.user img{
		width: 0.32rem;
		height: 0.32rem;
		display: inline-block;
		vertical-align: middle;
	}
	.time{
		font-size: 0.266rem;
		color: rgb(147,153,159);
	}
	.text{
		font-size: 0.32rem;
		padding-top: 0.16rem;
		margin-bottom: 0.426rem;
	}
	.iconfont.iconzan1{
		color: rgb(0,160,220);
	}
	.iconfont.iconthumbdown{
		color: rgb(147,153,159);
	}
	.usertext{
		color: rgb(7,17,27);
		margin-left: 0.106rem;
	}
	.no-ratings{
		padding: 0.48rem;
		font-size: 0.32rem;
		color: rgb(147,153,159);
	}
</style>
