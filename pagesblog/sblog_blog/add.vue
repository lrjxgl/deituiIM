<template>
	<view>
		<view v-if="pageLoad">
			<view class="main-body">
				<form  @submit="formSubmit"  >
					 
					<view class="textarea-flex">
						<textarea name="content" placeholder="请输入内容" placeholder-class="cl2" class="h100 textarea-flex-text"></textarea>
						
					</view>
					<upimg-box></upimg-box>
					<button formType="submit" class="btn-row-submit">提交</button>
				</form>
			</view>
		</view>
	</view>
</template>

<script>
	 
	import upimgBox from "../../components/upimgbox.vue";
	var app = require("../../common/common.js");
	var id;
	export default {
		components:{
		 
			upimgBox
		},
		data:function(){
			return {
				pageLoad:false, 
				pageHide:false,
				pageData:{},
			}
			
		},
		onLoad: function (option) {
			id = option.id;
			this.getPage();
		},
		onReady: function () {
			uni.setNavigationBarTitle({
				title: "发布帖子",
			})
		},
		methods: {
			
			getPage: function () {
				var that = this;
				this.app.get({
					url: that.app.apiHost + "/module.php?m=sblog_blog&ajax=1&a=add&authcode="+app.getAuthCode(),
					success: function (res) {
						if(res.error==1000){
							that.app.goLogin();
							return false;
						}
						that.pageLoad = true;
						that.pageData = res.data;

					}
				})
			},
			
			formSubmit:function(e){
				var that=this;
				that.app.post({
					url:that.app.apiHost+"/module.php?m=sblog_blog&a=save&ajax=1&authcode="+app.getAuthCode(),
					data:e.detail.value,
					success:function(res){
						uni.showToast({
							title: res.message,
							duration: 2000
						});
						if(!res.error){
							setTimeout(function(){
								uni.navigateBack({
									delta: 2
								});
							},1000)
							
						}
					}
				})
			}
		},
	}
</script>

<style>

</style>
