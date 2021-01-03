<template>
	<view>
		<form>
			<div class="textarea-flex">
				<div class="textarea-flex-label">介绍一下自己</div>
				<textarea v-model="content" class="textarea-flex-text"></textarea>
			</div>
			<div @click="submit" class="btn-row-submit">提交申请</div>
		</form>
	</view>
</template>

<script>
	
	export default{
		data:function(){
			return {
				pageLoad:false,
				content:""
			}
		},
		onLoad:function(){
			this.getPage();
		},
 
		onShareAppMessage:function(){
			
		},
		methods: {
			getPage() {
				var that=this;
				that.app.get({
					url:that.app.apiHost+"/module.php?m=zblive_hoster_apply&ajax=1",
					success:function(res){
						that.pageLoad=true;
					}
				})
			},
			submit:function(){
				var that=this;
				that.app.post({
					url:that.app.apiHost+"/module.php?m=zblive_hoster_apply&a=save&ajax=1",
					data:{
						content:that.content
					},
					success:function(res){
						uni.showToast({
							title:res.message
						});
						if(res.error){
							
							return false;
						}
						uni.navigateBack()
					}
				})
			}
		},
	}
</script>

<style>
</style>
