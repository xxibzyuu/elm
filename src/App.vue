<template>
  <div id="app">
		<v-header :seller="seller"></v-header>
		<div class="tab">
			<div class="tab-item">
				<!-- exact是否激活，只有才此路径下才会被激活 -->
				<router-link :to="'/goods'" active-class="active" exact>商品</router-link>
			</div>
			<div class="tab-item">
				<router-link :to="'/ratings'" active-class="active" exact>评价</router-link>
			</div>
			<div class="tab-item">
				<router-link :to="'/seller'" active-class="active" exact>商家</router-link>
			</div>
		</div>
		<keep-alive>
			<router-view :seller="seller" />
		</keep-alive>
  </div>
</template>

<script>
	import header from './components/header/header.vue'
	
	const ERR_OK = 0;
	
	export default {
		name: 'App',
		data() {
			return {
				seller: {}
			};
		},
		created() {
			this.$http.get('/api/seller').then((response) => {
				response = response.body;
				if (response.errno === ERR_OK) {
					this.seller = response.data;
					console.log(this.seller);
				}
			});
		},
		components: {
			'v-header': header
		}
	}
</script>

<style>

</style>
