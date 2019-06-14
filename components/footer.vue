<template>
	<div>
		<div class="footer-row"></div>
		<div class="footer">
			<div @click="goIndex" :class="{'footer-active':tabActive=='index'}" class="footer-item  icon-message_light">消息</div>
		
			<div @click="goContact" :class="{'footer-active':tabActive=='contact'}"  class="footer-item icon-people_list_light  icon-my_light">通讯录</div>
		
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
					url:"index"
				})
			},
			goContact:function(){
				uni.reLaunch({
					url:"contact"
				})
			}
		}
	}
</script>

<style>
</style>
