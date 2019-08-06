<template>
	<view>
		<view @click="$emit('call-parent')" class="modal-mask"></view>
		<view class="agiftBox flex-col flex-jc-center">
			<image class="agiftBox-img animated zoomIn" :src="gift.imgurl"></image>
			<view class="agiftBox-content">{{gift.description}}</view>
		</view>
		
	</view>
</template>

<script>
	export default{
		name:"gift-animate",
		props:{
			"gift":{}
		},
		created:function(){
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
	.agiftBox{	
		position: fixed;
		z-index: 999;
		left: 50%;
		top: 50%;
		width: 200px;
		height: 200px;
		margin-top: -100px;
		margin-left: -100px;
		background-color: #fff;
		padding: 10px;
		box-sizing: border-box;
		border-radius: 20px;
		
	}
	.agiftBox-img{
		width: 100px;
		height: 100px;
		margin: 0 auto;
		border-radius: 10px;
		margin-bottom: 10px;
	}
	.agiftBox-content{
		text-align: center;
	}
</style>
