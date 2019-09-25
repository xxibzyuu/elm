<template>
	<div class="sellers" ref="sellers">
		<div class="seller-content">
			<div class="sellerHeader">
				<h1 class="sellerTit">{{ seller.name }}</h1>
				<div class="sellerLevel">
					<star :score="seller.score"></star>
					<span class="sellerMonth">月售{{ seller.sellCount }}单</span>
				</div>
				<div class="collection" @click="collected">
					<span class="iconfont iconxihuan" :class="{'collected':xihuan}"></span>
					<span class="collectText">{{ xihuanText }}</span>
				</div>
			</div>
			<div class="takeInfo">
				<div class="module">
					<span class="infoName">起送价</span>
					<span class="infoPrice">{{ seller.minPrice }}<span>元</span></span>
				</div>
				<div class="module">
					<span class="infoName">商家配送</span>
					<span class="infoPrice">{{ seller.deliveryPrice }}<span>元</span></span>
				</div>
				<div class="module">
					<span class="infoName">平均配送时间</span>
					<span class="infoPrice">{{ seller.deliveryTime }}<span>元</span></span>
				</div>
			</div>
			<spilt></spilt>
			<div class="bulletin">
				<div class="sellerTit">公告与活动</div>
				<div class="bulle-cont">{{ seller.bulletin }}</div>
			</div>
			<div class="offerInfo">
				<ul v-if="seller.supports" class="supports">
					<li class="supports-item" 
						v-for="(item,index) in seller.supports" :key="item.type">
						<span class="offer_icon" :class="classMap[seller.supports[index].type]"></span>
						<span class="offer_decrip">{{ seller.supports[index].description }}</span>
					</li>
				</ul>
			</div>
			<spilt></spilt>
			<div class="sellerScene">
				<div class="sellerTit">商家实景</div>
				<div class="pic-wrapper" ref="picwrapper">
					<ul class="pic-list" ref="piclist">
						<li class="pic-item" v-for="pic in seller.pics" :key="pic.index">
							<img :src="pic" />
						</li>
					</ul>
				</div>
			</div>
			<spilt></spilt>
			<div class="sellerInfo">
				<div class="sellerTit">商家信息</div>
				<div class="sellerInfos">
					<ul v-if="seller.infos" class="infos">
						<li class="infos-item" 
							v-for="item in seller.infos" :key="item.type">
							{{ item }}
						</li>
					</ul>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import BScroll from 'better-scroll'
	import {saveToLocal,loadFromLocal} from '../../../static/js/store.js'
	import star from '../star.vue'
	import spilt from '../spilt.vue'
	
	export default {
		props:{
			seller:{
				type:Object
			}
		},
		data(){
			return {
				xihuan:(() => {
					return loadFromLocal(this.seller.id,'xihuan',false)
				})()
			}
		},
		computed:{
			xihuanText(){
				return this.xihuan ? '已收藏' : '收藏'
			}
		},
		created() {
			this.classMap = ['decrease','discount','special','invoice','guarantee'];
			this.$nextTick(function(){
				this._initScroll()
				this._initPics()
			})
		},
		watch:{
			seller:function(){
				this._initScroll()
				this._initPics()
			}
		},
		// 先执行watch里的，执行_initScroll方法后跳到else，重新计算高度，被撑开后能执行mounted
		mounted:function(){
			this.$nextTick(function(){
				this._initScroll()
				this._initPics()
			})
		},
		methods:{
			collected(event){
				if (!event._constructed) {
					return
				}
				this.xihuan = !this.xihuan
				saveToLocal(this.seller.id,'xihuan',this.xihuan)
			},
			_initScroll(){
				if (!this.scroll) {
					this.scroll = new BScroll(this.$refs.sellers,{
						click:true
					})
				}else{
					this.scroll.refresh()
				}
			},
			_initPics(){
				if (this.seller.pics) {
					let picWidth = 240;
					let margin = 12;
					let width = (picWidth + margin) * this.seller.pics.length - margin;
					this.$refs.piclist.style.width = width + 'px';
					this.$nextTick(() => {
						if (!this.picScroll) {
							this.picScroll = new BScroll(this.$refs.picwrapper,{
								scrollX : true,
								eventPassthrough : 'vertical'
							})
						} else{
							this.picScroll.refresh()
						}
					})
				}
			}
		},
		components:{
			star,
			spilt
		}
	}
</script>

<style>
	.sellers{
		width: 100%;
		overflow: hidden;
		position: absolute;
		left: 0;
		top: 5.026rem;
		bottom: 0;
	}
	.seller-content{
		font-size: 0;
	}
	.sellerHeader{
		margin: 0.48rem;
		position: relative;
	}
	.sellerTit{
		font-size: 0.373rem;
		padding-bottom: 0.213rem;
	}
	.sellerLevel{
		padding-bottom: 0.48rem;
		display: flex;
		border-bottom: 0.013rem solid rgb(7,17,27,0.1);
	}
	.sellerLevel .star-item{
		margin-right: 0.16rem;
	}
	.sellerMonth,.collectText{
		font-size: 0.266rem;
		color: rgb(77,85.93);
	}
	.collection{
		display: flex;
		flex-direction: column;
		position: absolute;
		top: 0;
		right: 0;
		text-align: center;
	}
	.iconfont.iconxihuan{
		font-size: 0.64rem;
		color: #d4d6d9;
	}
	.iconfont.iconxihuan.collected{
		color: rgb(240,20,20);
	}
	.takeInfo{
		display: flex;
		justify-content: space-around;
		margin: 0.48rem;
		text-align: center;
	}
	.module{
		display: flex;
		flex: 1;
		flex-direction: column;
		border-right: 0.013rem solid rgba(7,17,27,0.1);
	}
	.module:last-child{
		border-right: none;
	}
	.infoName{
		font-size: 0.266rem;
		color: rgb(147,153,159);
	}
	.infoPrice{
		font-size: 0.64rem;
		color: rgb(7,17,27);
	}
	.infoPrice span{
		font-size: 0.266rem;
	}
	.bulletin{
		margin: 0.48rem 0.48rem 0.426rem 0.48rem;
	}
	.bulle-cont{
		font-size: 0.32rem;
		color: rgb(240,20,20);
		line-height: 0.64rem;
		padding: 0 0.32rem;
	}
	.seller-content .supports-item{
		border-top: 0.013rem solid rgba(7,17,27,0.1);
		padding: 0.426rem 0.32rem;
	}
	.seller-content .supports-item .offer_icon{
		width: 0.426rem;
		height: 0.426rem;
		background-size: 0.426rem;
	}
	.offer_icon.decrease{
		background: url(../../../static/img/decrease_1@2x.png);
	}
	.offer_icon.discount{
		background: url(../../../static/img/discount_1@2x.png);
	}
	.offer_icon.special{
		background: url(../../../static/img/special_1@2x.png);
	}
	.offer_icon.guarantee{
		background: url(../../../static/img/guarantee_1@2x.png);
	}
	.offer_icon.invoice{
		background: url(../../../static/img/invoice_1@2x.png);
	}
	.seller-content .supports-item .offer_decrip{
		font-size: 0.32rem;
	}
	.sellerScene,.sellerInfo{
		margin: 0.48rem;
	}
	.pic-wrapper{
		width: 100%;
		overflow: hidden;
		white-space: nowrap;
	}
	.pic-list{
		font-size: 0;
	}
	.pic-item{
		display: inline-block;
		margin-right: 0.16rem;
	}
	.pic-item img{
		width: 3.2rem;
		height: 2.4rem;
	}
	.infos-item{
		font-size: 0.32rem;
		color: rgb(7,17,27);
		border-top: 0.013rem solid rgba(7,17,27,0.1);
		padding: 0.426rem 0.32rem;
	}
</style>
