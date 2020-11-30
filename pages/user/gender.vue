<template>
	<view>
		<view v-if="pageLoad">
			<form @submit="submit">
				<view class="input-flex">
					<view class="input-flex-label">性别</view>
					<div class="flex flex-ai-center flex-1">
						<input class="none" type="text" name="gender" :value="data.gender" />
						<radio-group @change="changeGender">
							<radio :checked="data.gender==1" value="1" class="mgr-10">男</radio>
							<radio :checked="data.gender==2"  value="2">女</radio>
						</radio-group>
						 
						
					</div>
					 
					
				</view>
				<div class="row-box text-center f12 cl-red">性别选择后不可改</div>
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
				title:"性别"
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
			 
			submit:function(e){
				var that=this;
				that.app.post({
					url:that.app.apiHost+"?m=user&a=genderSave&ajax=1",					
					data:e.detail.value,
					success:function(res){
						uni.showToast({
							"title":res.message
						})
						if(!res.error){
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
