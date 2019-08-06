<template>
	<view>
		<view class="footer-row"></view>
		<view class="footer">
			<view @click="goIndex" :class="{'footer-active':tabActive=='index'}" class="footer-item  icon-message_light">消息</view>
			<view @click="goNews" :class="{'footer-active':tabActive=='sblog'}" class="footer-item icon-attention_light">广场</view>
			<view @click="goMatch"  :class="{'footer-active':tabActive=='match'}" class="footer-item icon-emojiflashfill">无聊</view>
			<view @click="goContact" :class="{'footer-active':tabActive=='contact'}"  class="footer-item icon-people_list_light  icon-my_light">通讯录</view>
			<view @click="goUser" :class="{'footer-active':tabActive=='user'}"  class="footer-item icon-my_light">我的</view>
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
			goContact:function(){
				uni.reLaunch({
					url:"../../pages/contact/index"
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
			goMatch:function(){
				uni.reLaunch({
					url:"../../pages/match/index"
				})
			}
		}
	}
</script>

<style>
</style>
