<template>
	<div>
		<div v-if="pageLoad">
			<div class="flex pd-10 pdl-5 mgb-5 bg-white flex-ai-center">
				<image @click="goHead" class="wh-60 mgr-5 bd-radius-50" :src="pageData.user.user_head+'.100x100.jpg'" />
				<div class="flex-1">
					<div class="f16 cl1 mgb-5">{{pageData.user.nickname}}</div>
					<div class="flex flex-ai-center cl2"> {{pageData.user.info}}</div>
				</div>

			</div>
			<div class="main-body">
				<div class="row-box mgb-5">
					<navigator url="../../pagesblog/sblog_blog/my" class="row-item">
						<div class="flex-1">我的帖子</div>
					</navigator>
				 

					<navigator url="../../pages/comment/my?table=mod_sblog_blog" class="row-item">
						<div class="flex-1">我的评论</div>
					</navigator>
				 
				</div>
				<div class="row-box">
					<navigator url="../../pages/user/info" class="row-item">
						<div class="flex-1">账号编辑</div>
					</navigator>
					<navigator url="../../pages/user/password" class="row-item">
						<div class="flex-1">密码修改</div>
					</navigator>
				</div>
				 <view class="btn-row-submit bg-danger" @click="loginOut()">注销</view>
			</div>
		</div>
		<div v-else class="bg-fff pd-10">
			<div class="flex flex-center mgb-10 cl2">您还未登录,请先登录</div>
			<div class="flex flex-center">
				<navigator class="btn-small" url="../../pages/login/index">前往登录</navigator>
			</div>

		</div>
	 
		<mt-footer tab="user"></mt-footer>
	</div>
</template>

<script>
	 
	import mtFooter from "../../components/footer.vue";
	export default {
		components:{
			mtFooter
		},
		 
		data: function() {
			return {
				pageData: {},
				pageLoad: false,
				pageHide:false
			}
		},
		onReady:function(){
			uni.setNavigationBarTitle({
				title:"个人中心"
			})
		},
		onLoad: function() {
			this.getPage();
		},
		onShow: function () {
			console.log("pageShow");
			if (this.pageHide) {
				this.pageHide = false;
				this.getPage();
			}
		},
		onHide: function () {
			this.pageHide = true;
			console.log("pageHide");
		},
		methods: {
			gourl:function(url){
				uni.navigateTo({
					url:url
				})
			},
			goHead: function() {
				uni.navigateTo({
					url: "../../pages/user/user_head"
				})
			},
			getPage: function() {
				var that = this;
				that.app.get({
					url: that.app.apiHost + "/module.php?m=sblog_user&ajax=1&authcode=" + that.app.getAuthCode(),

					success: function(res) {
						if (res.error == 1000) {
							/*
							uni.navigateTo({
								url: "../login/index",
							})
							*/
						} else {
							that.pageLoad = true;
							that.pageData = res.data;
						}
					}
				})
			},
			loginOut:function(){
				var that=this; 
				uni.request({
					url:that.app.apiHost+"?m=login&a=logout&ajax=1",
					data:{
						"authcode":that.app.getAuthCode(),
						"fromapp":that.app.fromapp()
					},
					success:function(res){
						that.app.setAuthCode("");
						that.app.setAuthCodeLong("");
						that.app.goHome();	
					}
				})
			} 
		}
	} 
</script>

<style>
</style>
