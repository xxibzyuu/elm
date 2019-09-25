<template>
	<div class="ratingselect">
		<div class="rating-type">
			<span @click="select(2,$event)" class="all" :class="{'selected1':selectType === 2}">{{ this.decription.all }}<span class="count">{{ ratings.length }}</span></span>
			<span @click="select(0,$event)" class="positive" :class="{'selected1':selectType === 0}">{{ this.decription.positive }}<span class="count">{{ positives.length }}</span></span>
			<span @click="select(1,$event)" class="negative" :class="{'selected2':selectType === 1}">{{ this.decription.negative }}<span class="count">{{ negatives.length }}</span></span>
		</div>
		<div class="switch">
			<span class="iconfont icondui" :class="{'selected3':onlyContent}" @click="toggleContent"></span>
			<span class="switch-text">只看有内容的评价</span>
		</div>
	</div>
</template>

<script>
	const POSITIVE = 0;
	const NEGATIVE = 1;
	const ALL = 2;
	
	export default {
		props:{
			ratings:{
				type:Array,
				default (){
					// 返回空数组，数组类型是对象()
					return []
				}
			}
		},
		data(){
			return {
				selectType:ALL,
				onlyContent:false,
				decription:{
					all: '全部',
					positive: '满意',
					negative: '不满意'
				}
			}	
		},
		computed:{
			positives(){
				return this.ratings.filter((rating) => {
					return rating.rateType === POSITIVE
				})
			},
			negatives(){
				return this.ratings.filter((rating) => {
					return rating.rateType === NEGATIVE
				})
			}
		},
		methods:{
			select(type,event){
				if (!event._constructed) {
					return;
				}
				this.selectType = type
				this.$emit('type-select',type)
			},
			toggleContent(event){
				if (!event._constructed) {
					return;
				}
				this.onlyContent = !this.onlyContent
				this.$emit('cont-toggle',this.onlyContent)
			}
		}
	}
</script>

<style>
	.ratingselect{
		
	}
	.rating-type{
		border-bottom: 0.013rem solid rgba(7,17,27,0.1);
		margin: 0 0.48rem;
	}
	.all,.positive,.negative{
		display: inline-block;
		width: 1.6rem;
		height: 0.853rem;
		line-height: 0.853rem;
		text-align: center;
		font-size: 0.32rem;
		margin: 0.48rem 0.213rem 0.48rem 0;
		border-radius: 0.026rem;
	}
	.all,.positive{
		background: rgba(0,160,220,0.2);
		color: #4d555d;
	}
	.selected1{
		background: rgb(0,160,220);
		color: #fff;
	}
	.negative{
		background: rgba(77,85,93,0.2);
		color: #4d555d;
		display: inline-block;
	}
	.selected2{
		background: rgb(77,85,93);
		color: #fff;
	}
	.count{
		padding-left: 0.106rem;
	}
	.switch{
		color: #93999f;
		margin-top: 0.32rem;
		/* line-height: 0.64rem; */
		padding: 0 0.48rem 0.32rem 0.48rem;
		border-bottom: 0.013rem solid #ccc;
	}
	.switch span{
		display: inline-block;
		vertical-align: middle;
	}
	.iconfont.icondui{
		font-size: 0.64rem;
		margin-right: 0.106rem;
	}
	.selected3{
		color: #00c850;
	}
	.switch-text{
		font-size: 0.32rem;
	}
</style>
