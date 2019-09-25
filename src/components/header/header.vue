<template>
	<div class="header">
		<div class="head_content">
			<div class="shopLogo">
				<img :src="seller.avatar" />
			</div>
			<div class="shopInfo">
				<div class="info_title">
					<span class="brand"><img src="../../../resource/img/brand@2x.png" ></span>
					<span>{{ seller.name }}</span>
				</div>
				<div class="info_way">
					<span>{{ seller.description }} / {{ seller.deliveryTime }}分钟送达</span>
				</div>
				<div v-if="seller.supports" class="info_offer">
					<span class="icon"><img src="../../../resource/img/decrease_1@2x.png" ></span>
					<span class="offer_decrip">{{ seller.supports[0].description }}</span>
				</div>
				<div v-if="seller.supports" class="offer_more" @click="showDetail">
					<span>{{ seller.supports.length }}个</span>
					<i class="iconfont iconjiantou"></i>
				</div>
			</div>
		</div>
		<div class="head_bulletin" @click="showDetail">
			<span class="bulle_icon"><img src="../../../resource/img/bulletin@2x.png" /></span>
			<span class="bulle_cont">{{ seller.bulletin }}</span>
			<span class="iconfont iconjiantou"></span>
		</div>
		<div class="background">
			<img :src="seller.avatar" />
		</div>
		<transition name="fade" v-show="detailShow">
			<div v-show="detailShow" class="seller_detail">
				<div class="det_wrapper">
					<div class="det_main">
						<div class="det_title">{{ seller.name }}</div>
						<div class="det_star"><star :score="seller.score"></star></div>
						<div class="det_offer">
							<div class="offerTit">
								<span class="titleLine"></span>
								<span class="titleName">优惠信息</span>
								<span class="titleLine"></span>
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
						</div>
						<div class="det_bulletin">
							<div class="offerTit">
								<span class="titleLine"></span>
								<span class="titleName">商家公告</span>
								<span class="titleLine"></span>
							</div>
							<div class="det_cont">{{ seller.bulletin }}</div>
						</div>
					</div>
				</div>
				<div class="det_close" @click="closeDetail">
					<i class="iconfont iconguanbi"></i>
				</div>
			</div>
		</transition>
	</div>
	
</template>

<script>
	import star from '../star.vue'
	
	
	export default{
		props: {
			seller: {
				type:Object
			}
		},
		created() {
			this.classMap = ['decrease','discount','special','invoice','guarantee'];
		},
		data(){
			return {
				detailShow:false
			}
		},
		methods: {
			showDetail(){
				this.detailShow = true
			},
			closeDetail(){
				this.detailShow = false
			}
		},
		components: {
			star
		}
		
	}
</script>

<style>
</style>
