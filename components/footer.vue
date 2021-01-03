<template>
	<view>
		<view class="footer-row"></view>
		<view class="footer">
			<view @click="goIndex" :class="{'footer-active':tabActive=='index'}" class="footer-item  icon-like">缘分</view>
			<view @click="goNews" :class="{'footer-active':tabActive=='sblog'}" class="footer-item icon-attention_light">动态</view>
			<view @click="goZblive"  :class="{'footer-active':tabActive=='zblive'}" class="footer-item icon-video_light">直播</view>
			<view @click="goMsg" :class="{'footer-active':tabActive=='msg'}"  class="footer-item icon-message  icon-notice">消息</view>
			<view @click="goUser" :class="{'footer-active':tabActive=='user'}"  class="footer-item icon-my_light">我</view>
		</view>
	</view>
</template>

<script>
	export default{
		props:{
			tab:""
		},
		data:function(){
			return {
				tabActive:"",
			}
		},
		created:function(){
			this.tabActive=this.tab;
		},
		methods:{
			goIndex:function(){
				uni.reLaunch({
					url:"../../pages/index/index"
				})
			},
			goMsg:function(){
				uni.reLaunch({
					url:"../../pages/index/indexmsg"
				})
			},
			goUser:function(){
				uni.reLaunch({
					url:"../../pages/user/index"
				})
			},
			goNews:function(){
				uni.reLaunch({
					url:"../../pagesblog/sblog/index"
				})
			},
			goZblive:function(){
				uni.reLaunch({
					url:"../../pagezblive/zblive/index"
				})
			}
		}
	}
</script>

<style>
	.footer-item{
		font-size: 12px;
	}
</style>
