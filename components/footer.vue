<template>
	<div>
		<div class="footer-row"></div>
		<div class="footer">
			<div @click="goIndex" :class="{'footer-active':tabActive=='index'}" class="footer-item  icon-message_light">消息</div>
			<div @click="goNews" :class="{'footer-active':tabActive=='sblog'}" class="footer-item icon-attention_light">广场</div>
			<div @click="goMatch"  :class="{'footer-active':tabActive=='match'}" class="footer-item icon-emojiflashfill">无聊</div>
			<div @click="goContact" :class="{'footer-active':tabActive=='contact'}"  class="footer-item icon-people_list_light  icon-my_light">通讯录</div>
			<div @click="goUser" :class="{'footer-active':tabActive=='user'}"  class="footer-item icon-my_light">我的</div>
		</div>
	</div>
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
