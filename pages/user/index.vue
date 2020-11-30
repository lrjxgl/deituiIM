<template>
	<view class="">
		<view class="row-box flex mgb-5">
			<image @click="gourl('user_head')" class="uhead-img" :src="user.user_head+'.100x100.jpg'"></image>
			<view class="flex-1">
				<view class="cl1 f14 mgb-5">{{user.nickname}}</view>
				<view class="cl2 f12 mgb-5">uid:{{user.userid}}</view>
				<view class="flex flex-ai-center">
					<view class="cl2 f12">好友 {{user.friend_num}}</view>
					<view class="uline"></view>
					<view class="cl2 f12">关注 {{user.follow_num}}</view>
					<view class="uline"></view>
					<view class="cl2 f12">粉丝 {{user.followed_num}}</view>

				</view>
			</view>
			<view class="flex">
				<view @click="gourl('../../pages/user/set')" class="iconfont icon-right"></view>
			</view>

		</view>
		<!--
		<view class="aBox">
			<view class="aBox-item">
				<image mode="widthFix" class="aBox-img" src="../../static/my_01.png"></image>
				<view class="aBox-title">守护</view>
			</view>
			 
			<view class="aBox-item">
				<image mode="widthFix"  class="aBox-img" src="../../static/my_03.png"></image>
				<view class="aBox-title">收益</view>
			</view>
			<view @click="gourl('../gold/buy')" class="aBox-item">
				<image mode="widthFix"  class="aBox-img" src="../../static/my_04.png"></image>
				<view class="aBox-title">充值</view>
			</view>
		</view>
		-->
		<view class="bg-white mgb-5">
			<!--
			<view class="row-item">
				<image mode="widthFix" class="row-item-img" src="../../static/my_01.png"></image>
				<view class="row-item-title">我的守护</view>
			</view>
			-->
			<view @click="gourl('../../pages/invite/my')" class="row-item">
				<image src="../../static/my_n1.png" class="row-item-img"></image>
				<view class="row-item-title">邀请好友赚钱</view>
			</view>
			<!--<view @click="gourl('../../pages/invite/my')" class="row-item">
			<image src="../../static/my_n2.png" class="row-item-img"></image>
			<view class="row-item-title">任务中心</view>
		</view>
		-->
			<view @click="gourl('../../pagesblog/sblog_blog/my')" class="row-item">
				<image src="../../static/my_n3.png" class="row-item-img"></image>
				<view class="row-item-title">我的动态</view>
			</view>
			<view @click="gourl('../../im/im_gift_send/receive')" class="row-item">
				<image mode="widthFix" class="row-item-img" src="../../static/my_01.png"></image>
				<view class="row-item-title">收到的礼物</view>
			</view>
			<!--
			<view class="row-item">
				<image src="../../static/my_n4.png" class="row-item-img"></image>
				<view class="row-item-title">座驾</view>
			</view>
			-->
		</view>
		<view class="bg-white mgb-5">
			
			<view @click="gourl('../../pages/gold_log/my')" class="row-item">
				<image src="../../static/my_n5.png" class="row-item-img"></image>
				<view class="row-item-title">消费记录</view>
			</view>
			<view @click="gourl('../../pages/help/index')" class="row-item">
				<image src="../../static/my_n6.png" class="row-item-img"></image>
				<view class="row-item-title">帮助与反馈</view>
			</view>
			<view @click="gourl('../user/set')" class="row-item bdb-0">
				<image src="../../static/my_n7.png" class="row-item-img"></image>
				<view class="row-item-title">设置</view>
			</view>
		</view>
		<mt-footer tab="user"></mt-footer>
	</view>
</template>

<script>
	import mtFooter from "../../components/footer.vue";
	export default {
		components: {
			mtFooter
		},
		data: function() {
			return {
				user: {},
				pageLoad: false,
				pageHide: false,
				unLogin: true
			}
		},
		onLoad: function() {
			this.getPage();
		},
		methods: {
			gourl: function(url) {
				uni.navigateTo({
					url: url
				})
			},
			getPage: function() {
				var that = this;
				that.app.get({
					url: that.app.apiHost + "/module.php?m=sblog_user&ajax=1&authcode=" + that.app.getAuthCode(),
					unLogin: true,
					success: function(res) {
						if (res.error == 1000) {

						} else {
							that.unLogin = false;
							that.pageLoad = true;
							that.user = res.data.user;
						}
					}
				})
			}
		}
	}
</script>

<style>
	.uhead-img {
		width: 60px;
		height: 60px;
		border-radius: 10px;
		margin-right: 10px;
	}

	.uline {
		height: 10px;
		width: 1px;
		margin: 0px 5px;
		background-color: #efefef;
	}

	.aBox {

		display: flex;
		flex-direction: row;
		padding-top: 10px;
		padding-bottom: 10px;
		border-bottom: 1px solid #eee;

	}

	.aBox-item {
		flex: 1;
		justify-items: center;
		align-items: center;
	}

	.aBox-img {
		width: 50%;

	}

	.aBox-title {
		font-size: 12px;
		color: #666;
	}

	.row-item-img {
		width: 20px;
		height: 20px;
		margin-right: 10px;
	}
</style>
