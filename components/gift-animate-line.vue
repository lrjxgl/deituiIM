<template>
	<div  class="giftLine">
		<div class="flex flex-ai-center  animated fadeInLeft">
			<text class="f12 cl-white">{{gift.nickname}}</text> 
			<text class="f12 cl-white">送了</text> 
			<image class="gift-img " :src="gift.imgurl"></image>
			<text class="f12 cl-white">{{gift.title}}</text>
		</div>
	</div>
</template>

<script>
	export default{
		name:"gift-animate",
		props:{
			"gift":{}
		},
		created:function(){
			console.log(this.gift)
			return {
				a:1
			}
		},
		methods: {
			getPage() {
				
			}
		},
	}
</script>

<style>
	@import url("../common/animate.css");
	.gift-img{
		width: 30px;
		height: 30px;
		border-radius: 30px;
	}
	 .giftLine{
		 position: fixed;
		 bottom:340rpx;
		 left: 30rpx;
		 right: 0;
		 opacity: 0.8;
			
		 z-index: 999;
	 }
</style>
