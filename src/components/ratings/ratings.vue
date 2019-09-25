<template>
	<div class="ratings" ref="ratings">
		<div class="ratings-content">
			<div class="overview">
				<div class="overview-left">
					<h1 class="ratingCount">{{ seller.score }}</h1>
					<span class="overallRating">综合评分</span>
					<span class="compare">高于周边商家{{ seller.rankRate }}%</span>
				</div>
				<div class="overview-right">
					<div class="score-wrapper">
						<span>服务态度</span>
						<star :score="seller.serviceScore"></star>
						<span class="sellerScore">{{ seller.serviceScore }}</span>
					</div>
					<div class="score-wrapper">
						<span>商品评价</span>
						<star :score="seller.foodScore"></star>
						<span class="sellerScore">{{ seller.foodScore }}</span>
					</div>
					<div class="score-wrapper">
						<span>送达时间</span>
						<span class="deliveryTime">{{ seller.deliveryTime }}分钟</span>
					</div>
				</div>
			</div>
			<spilt></spilt>
			<ratingselect :select-type="selectType" :only-content="onlyContent" 
				:decription="description" :ratings="ratings"
				@type-select="typeSelect" @cont-toggle="contToggle"></ratingselect>
			<div class="rating-list">
				<ul>
					<li class="raingItem" v-for="rating in ratings" :key="rating.index" v-show="needShow(rating.rateType,rating.text)">
						<div class="rating-avatar">
							<img :src="rating.avatar" />
						</div>
						<div class="rating-info">
							<span class="rating-name">{{ rating.username }}</span>
							<div class="second">
								<star :score="rating.score"></star>
								<span class="rating-delivtime">{{ rating.deliveryTime }}分钟送达</span>
							</div>
							<span class="rating-cont">{{ rating.text }}</span>
							<div class="fourth">
								<span class="rating-level iconfont" :class="{'iconzan1':rating.rateType===0,'iconthumbdown':rating.rateType===1}"></span>
								<div class="rating-recom">
									<ul>
										<li v-for="recommend in rating.recommend" :key="recommend.index" class="recom-item">{{ recommend }}</li>
									</ul>
								</div>
							</div>
							<div class="time">{{ rating.rateTime | formatDate }}</div>
						</div>
					</li>
				</ul>
			</div>
		</div>
	</div>
</template>

<script>
	import BScroll from 'better-scroll'
	import spilt from '../spilt.vue'
	import star from '../star.vue'
	import ratingselect from './ratingselect.vue'
	import {formatDate} from '../../../static/js/date.js'
	
	const POSITIVE = 0;
	const NEGATIVE = 1;
	const ALL = 2;
	const ERR_OK = 0;
	
	export default{
		props:{
			seller:{
				type:Object
			},
			
		},
		data(){
			return {
				ratings:[],
				selectType:ALL,
				onlyContent:true,
				description:{
					all: '全部',
					positive: '推荐',
					negative: '吐槽'
				}
			}
		},
		created() {
			this.$http.get('/api/ratings').then((response) => {
				response = response.body;
				if(response.errno === ERR_OK){
					this.ratings = response.data
					this.$nextTick(() => {
						if (!this.scroll) {
							this.scroll = new BScroll(this.$refs.ratings,{
								click:true
							});
						} else{
							// 重新调用来计算高度确保滚轮正常效果
							this.scroll.refresh();
						}
					})
				}
			})
		},
		filters:{
			formatDate(time){
				let date = new Date(time)
				return formatDate(date,'yyyy-MM-dd hh:mm')
			}
		},
		methods:{
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
		components:{
			spilt,
			star,
			ratingselect
		}
	}
</script>

<style>
	.ratings{
		position: absolute;
		top: 5.026rem;
		left: 0;
		bottom: 0;
		width: 100%;
		overflow: hidden;
		font-size: 0;
	}
	.overview{
		margin: 0.466rem 0;
		display: flex;
	}
	.overview-left{
		text-align: center;
		/* margin: 0 auto; */
		border-right: 0.013rem solid #ccc;
		display: flex;
		flex-direction: column;
		flex: 0 0 3.4rem;
	}
	.ratingCount{
		color: rgb(255,153,0);
		font-size: 0.64rem;
		margin-bottom: 0.16rem;
	}
	.overallRating{
		display: inline-block;
		font-size: 0.32rem;
		color: rgb(7,17,27);
		margin-bottom: 0.213rem;
	}
	.compare{
		display: inline-block;
		font-size: 0.266rem;
		color: #93999f;
	}
	.overview-right{
		font-size: 0.32rem;
		padding: 0 0.426rem;
	}
	.score-wrapper{
		display: flex;
		align-items: center;
		padding-bottom: 0.213rem;
	}
	.score-wrapper .star{
		margin-left: 0.32rem;
		margin-right: 0.16rem;
	}
	.score-wrapper .star-item{
		margin-right: 0.16rem;
		
	}
	.sellerScore{
		color: rgb(255,153,0);
	}
	.deliveryTime{
		color: rgb(147,153,159);
		margin-left: 0.32rem;
	}
	.rating-list{
		font-size: 0.266rem;
		color: rgb(7,17,27);
		
	}
	.raingItem{
		margin: 0.48rem;
		padding-bottom: 0.48rem;
		border-bottom: 0.013rem solid rgba(7,17,27,0.1);
		display: flex;
		position: relative;
	}
	.rating-avatar{
		margin-right: 0.32rem;
	}
	.rating-avatar img{
		width: 0.746rem;
		height: 0.746rem;
		border-radius: 50%;
	}
	.rating-name{
		padding-bottom: 0.106rem;
	}
	.second{
		display: flex;
		align-items: center;
		margin-top: 0.16rem;
		padding-bottom: 0.213rem;
	}
	.second .star-item{
		margin-right: 0.16rem;
	}
	.rating-delivtime{
		color: rgb(147,153,159);
		margin-left: 0.16rem;
	}
	.rating-cont{
		display: block;
		font-size: 0.32rem;
	}
	.fourth{
		display: flex;
	}
	.rating-level{
		margin-top: 0.213rem;
	}
	.iconfont.iconzan1{
		color: rgb(0,160,220);
	}
	.iconfont.iconthumbdown{
		color: rgb(147,153,159);
	}
	.recom-item{
		display: inline-block;
		border: 0.013rem solid rgba(7,17,27,0.1);
		border-radius: 0.026rem;
		padding: 0 0.16rem;
		margin-left: 0.213rem;
		margin-top: 0.213rem;
		width: 1.2rem;
		height: 0.4rem;
		line-height: 0.4rem;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		font-size: 0.24rem;
		color: rgb(147,153,159);
	}
	.rating-info .time{
		position: absolute;
		top: 0;
		right: 0;
		color: rgb(147,153,159);
	}
</style>
