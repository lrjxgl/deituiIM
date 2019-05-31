<template>
	<div>
		<div class="footer-row"></div>
		<div class="footer">
			<navigator url="index" :class="{'footer-active':tabActive=='index'}" class="footer-item  icon-message_light">消息</navigator>
		
			<navigator url="contact" :class="{'footer-active':tabActive=='contact'}"  class="footer-item icon-people_list_light  icon-my_light">通讯录</navigator>
		
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
		}
	}
</script>

<style>
</style>
