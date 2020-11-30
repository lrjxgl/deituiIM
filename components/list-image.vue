<template>
	<view>
		<block v-if="imgslist==null"></block>
		<block v-else-if="imgslist.length==1">
			<image mode="widthFix" :src="imgslist[0]+'.small.jpg'" class="img-1"></image>
		</block>
		<view class="sglist-imglist" v-else-if="imgslist.length<3">
			<image mode="widthFix" v-for="(img,imgIndex) in  imgslist" :key="imgIndex" :src="img+'.100x100.jpg'" class="img-2" ></image>
		</view>
		<view class="sglist-imglist" v-else>
			<image mode="widthFix" v-for="(img,imgIndex) in  imgslist" :key="imgIndex" :src="img+'.100x100.jpg'" class="sglist-imglist-img" ></image>
		</view>
		
		
	</view>	
</template>

<script>
	export default{
		props:{
			imgslist:{}
		}
	}
</script>

<style>
	.img-1{
		width:200px;
	}
	.img-2{
		flex: 1;
		margin-right: 10px;
	}
</style>
