<template>
	<div class="cartControl">
		<div class="cart_decrease iconfont iconjian" v-show="food.count>0" @click.stop.prevent="decreaseCount"></div>
		<div class="cart_count" v-show="food.count>0">{{ food.count }}</div>
		<div class="cart_increase iconfont iconjia" @click.stop.prevent="addCount"></div>
	</div>
</template>

<script>
	import Vue from 'vue';
	
	export default{
		props:{
			food:{
				type:Object
			}
		},
		created() {
			// console.log(this.food)
		},
		methods:{
			addCount(event){
				if (!event._constructed) {
					return;
				}
				if (!this.food.count) {
					Vue.set(this.food,'count',1);
				} else{
					this.food.count++;
				}
				this.$emit('cart-add',event.target);
			},
			decreaseCount(event){
				if (!event._constructed) {
					return;
				}
				if (this.food.count) {
					this.food.count--;
				}
			}
		}
	}
</script>

<style>
	.cart_decrease,.cart_increase{
		font-size: 0.64rem;
		color: #00a0dc;
		display: inline-block;
		vertical-align: middle;
	}
	.cartControl .cart_count{
		font-size: 0.266rem;
		display: inline-block;
		color: #93999f;
		padding: 0 0.16rem;
		vertical-align: middle;
	}
</style>
