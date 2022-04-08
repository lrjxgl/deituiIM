<template>
	<view>
		<view v-if="pageLoad">
			<view class="flex pd-10 pdl-5 mgb-5 bg-white flex-ai-center">
				<image @click="goHead" class="wh-60 mgr-5 bd-radius-50" :src="pageData.user.user_head+'.100x100.jpg'" />
				<view class="flex-1">
					<view class="f16 cl1 mgb-5">{{pageData.user.nickname}}</view>
					<view class="flex flex-ai-center cl2"> 发布信息&nbsp;&nbsp;<text class="cl-num">{{pageData.topic_num}}</text>&nbsp;&nbsp;条</view>
				</view>

			</view>
			<view class="main-body">
				<view class="row-box mgb-5">
					<navigator url="../sblog_blog/my" class="row-item">
						<view class="flex-1">我的帖子</view>
					</navigator>
				 

					<navigator url="../../pages/comment/my?table=mod_sblog_blog" class="row-item">
						<view class="flex-1">我的评论</view>
					</navigator>
				 
				</view>
				<view class="row-box">
					<navigator url="../../pages/user/info" class="row-item">
						<view class="flex-1">账号编辑</view>
					</navigator>
					<navigator url="../../pages/user/password" class="row-item">
						<view class="flex-1">密码修改</view>
					</navigator>
				</view>
				 <view class="btn-row-submit bg-danger" @click="loginOut()">注销</view>
			</view>
		</view>
		<view v-else class="bg-fff pd-10">
			<view class="flex flex-center mgb-10 cl2">您还未登录,请先登录</view>
			<view class="flex flex-center">
				<navigator class="btn-small" url="../../pages/login/index">前往登录</navigator>
			</view>

		</view>
		<view class="footer-row"></view>
		<view class="footer">
			<view class="footer-item icon-home footer-active" @click="gourl('../sblog/index')" >首页</view>
		
			<view class="footer-item footer-add "  @click="gourl('../sblog_blog/add')">
				发布</view>
			
			<view class="footer-item icon-my_light "   @click="gourl('../sblog_user/index')">我的</view>
		</view>
	</view>
</template>

<script>
	 
	export default {
		 
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
					url: that.app.apiHost + "/module.php?m=sblog_user&ajax=1",

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
				that.app.get({
					url:that.app.apiHost+"?m=login&a=logout&ajax=1",
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
