<template>
	 
		<view>
			<view v-if="!unLogin">
				<view class="flex pd-10 pdl-5 mgb-5 bg-white flex-ai-center">
					<image @click="goHead" class="wh-60 mgr-5 bd-radius-50" :src="pageData.user.user_head+'.100x100.jpg'" />
					<view class="flex-1">
						<view class="f16 cl1 mgb-5">{{pageData.user.nickname}}</view>
						<div class="uhead-rnum flex  flex-ai-center">
							金币
							<text class="cl-money mgl-5 mgr-5">{{pageData.user.gold}}</text>
						
							积分
							<text class="cl-money mgl-5">{{pageData.user.grade}}</text>
						
						</div>
						
					</view>
					<div @click="gourl('../../pages/user/set')" class="flex-center btn-small btn-link iconfont icon-settings"></div>
				</view>
				<view class="main-body">
					
					<div class="row-box mgb-5">
						 
						 <div @click="gourl('../../pagesblog/sblog_blog/my')" class="row-item">
						 	<div class="row-item-icon icon-news  cl-u"></div>
						 	<div class="row-item-title">我的帖子</div>
						 </div>
						<div @click="gourl('../../pagesblog/sblog_blog_comment/my')"  class="row-item">
							<div class="row-item-icon icon-comment  cl-u"></div>
							<div class="row-item-title">我的评论</div>
						</div>
						<div @click="gourl('../../pages/notice/my')"  class="row-item">
							<div class="row-item-icon icon-notice  cl-u"></div>
							<div class="row-item-title">我的消息</div>
						</div>
						<div  @click="gourl('../../pages/follow/index')" class="row-item">
							<div class="row-item-icon icon-friend  cl-u"></div>
							<div class="row-item-title">粉丝关注</div>
						</div>
					</div>	
					<div class="row-box mgb-5">	 
						
						<div  @click="gourl('../../pages/recharge/my')" class="row-item">
							<div class="row-item-icon icon-moneybag  cl-u"></div>
							<div class="row-item-title">支付记录</div>
						</div>
						 
					
						<div @click="gourl('../../pages/kefu/index')" class="row-item">
							<div class="row-item-icon icon-service  cl-u"></div>
							<div class="row-item-title">联系客服</div>
						</div>
						<div @click="gourl('../../pages/html/aboutus')" class="row-item">
							<div class="row-item-icon icon-info  cl-u"></div>
							<div class="row-item-title">关于我们</div>
						</div>
					</div>
					 
				</view>
			</view>
			<view v-else class="bg-fff pd-10">
				<view class="flex flex-center mgb-10 cl2">您还未登录,请先登录</view>
				<view class="flex flex-center">
					<navigator class="btn-small" url="../../pages/login/index">前往登录</navigator>
				</view>
		
			</view>
			<mt-footer tab="user"></mt-footer>
		</view>
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
				pageHide:false,
				unLogin:true
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
							that.unLogin=false;
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
