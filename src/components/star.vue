<template>
	<div class="star">
		<span class="star-item" :class="itemClass"
			v-for="itemClass in itemClasses" :key="itemClass.name">
		</span>
	</div>
	
</template>

<script>
	const LENGTH = 5;
	const CLS_ON = 'on';
	const CLS_HALF = 'half';
	const CLS_OFF = 'off';
	export default {		
		props:{
			score:{
				type: Number
			}
		},
		computed:{
			itemClasses() {
				let result = [];
				let score = Math.floor(this.score * 2) / 2;
				let hasDecimal = score % 1 !== 0;
				let integer = Math.floor(score);
				for (let i = 0; i < integer; i++) {
					result.push(CLS_ON)
				}
				if (hasDecimal) {
					result.push(CLS_HALF)
				}
				while(result.length < LENGTH){
					result.push(CLS_OFF)
				}
				return result;
			}
		}
	}
</script>

<style>
	.star{
		font-size: 0;
	}
	.star-item{
		display: inline-block;
		background: no-repeat;
		width: 0.5rem;
		height: 0.46rem;
		margin-right: 0.586rem;
		background-size: 0.533rem 0.533rem;
	}
	.star-item:last-child{
		margin-right: 0;
	}
	.star-item.on{
		background: url(../../resource/img/star24_on@2x.png);
	}
	.star-item.half{
		background: url(../../resource/img/star24_half@2x.png);
	}
	.star-item.off{
		background: url(../../resource/img/star24_off@2x.png);
	}
</style>
