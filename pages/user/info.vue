<template>
	<view>
		<view v-if="pageLoad">
			<form @submit="submit">
				<view class="input-flex">
					<view class="input-flex-label">昵称</view>
					<input class="input-flex-text" name="nickname"  :value="data.nickname" >
				</view>
				
				<view class="input-flex">
					<view class="input-flex-label">生日</view>
					<picker class="input-flex-text flex flex-ai-center" mode="date" @change="changeDate"><view >{{data.birthday}}</view></picker>
					<input class="none" name="birthday"  :value="data.birthday" >
				</view>
				<view class="input-flex">
					<view class="input-flex-label">自我介绍</view>
					<input class="input-flex-text" name="description" :value="data.description" />
				</view>
				<button form-type="submit" class="btn-row-submit">提交</button>
			</form>
 		</view>
	</view>
</template>

<script>
	 
	export default{
		data:function(){
			return {
				pageLoad:false, 
				data:{}
			}
		},
		onLoad:function(option){
			uni.setNavigationBarTitle({
				title:"用户资料"
			}) 
			this.getPage();
		},
		 
		methods:{
			getPage:function(){
				var that=this;
				that.app.get({
					url:that.app.apiHost+"?m=user&a=info&ajax=1",
					 
					success:function(res){
						if(res.error){
							that.app.goHome();
						}else{
							that.pageLoad=true;
							that.data=res.data.data;
						}
						
						 
					}
				})
			},
			changeGender:function(e){
				this.data.gender=e.detail.value;
			},
			changeDate:function(e){
				this.data.birthday=e.detail.value;
			},
			submit:function(e){
				var that=this;
				uni.request({
					url:that.app.apiHost+"?m=user&a=save&ajax=1&fromapp="+that.app.fromapp()+"&authcode="+that.app.getAuthCode(),
					method:"POST",
					header:{
						"content-type":"application/x-www-form-urlencoded"
					},
					data:e.detail.value,
					success:function(res){
						uni.showToast({
							"title":res.data.message
						})
						if(!res.data.error){
							setTimeout(function(){
								uni.navigateBack()
							},600)
							
						}
						
					}
				})
			}
		},
	}
</script>

<style>
</style>
