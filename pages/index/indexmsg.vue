<template>
	<view>
		<view class="main-body">

			 
			<view>
				<view @click="gourl('../contact/index')" class="msItem">
					<image class="msItem-img" mode="widthFix" src="../../static/msg-friend.png"></image>
					<view class="pd-5">
						<view class="cl1 f14 mgb-5">我的好友</view>
						<view class="cl2 f12">亲密的人都在这里</view>
					</view>
				</view>
				<!--
				<view class="msItem">
					<image class="msItem-img" mode="widthFix" src="../../static/msg-group.png"></image>
					<view class="pd-5">
						<view class="cl1 f14 mgb-5">家族</view>
						<view class="cl2 f12">有家族不孤单</view>
					</view>
				</view>
				<view class="msItem">
					<image class="msItem-img" mode="widthFix" src="../../static/msg-chat.png"></image>
					<view class="pd-5">
						<view class="cl1 f14 mgb-5">聊天广场</view>
						<view class="cl2 f12">已有9999人在这里嗨</view>
					</view>
				</view>
				-->
			</view>
			<block v-if="indexList.length>0" v-for="(item,index) in indexList" :key="index">
				<view v-if="item.gid==0" @click="goItem(item)" class="msItem">

					<image class="msItem-img" :src="item.user_head+'.100x100.jpg'"></image>
					<view class="pd-5">

						<view class="cl1 mgb-5">{{item.nickname}}</view>

						<chat-msg :content="item.content"></chat-msg>
					</view>
					<view class="flex-1"></view>
					<view class="cl3 f12">{{item.time}}</view>

				</view>
			</block>
			<block v-else>
				<view class="emptyData">还没消息，快去找人聊聊吧</view>
			</block>


		</view>
		<mt-footer tab="msg"></mt-footer>
	</view>
</template>

<script>
	import mtFooter from "../../components/footer.vue";
	import chatDb from "../../common/chatdb.js";

	import chatMsg from "../../components/chatmsg.vue";
	export default {
		components: {
			mtFooter,
			chatMsg
		},
		data() {
			return {
				userList: [],
				groupList: [],
				indexList: [],
				isLoad: false
			}
		},
		onLoad() {
			var that = this;
			if (!this.app.isLogin()) {
				uni.reLaunch({
					url: "../login/index"
				});
				return false;
			}
			//this.indexList=chatDb.indexList();
			this.pmList();
			setTimeout(function() {
				that.isLoad = true;
			}, 1000)

		},
		onShow() {
			if (this.isLoad) {
				this.pmList();
			}

		},
		methods: {
			gourl:function(url){
				uni.navigateTo({
					url:url
				})
			},
			playMusic: function(url) {
				audioClass.play(url);
			},
			goItem: function(item) {
				if (item.gid != 0 || item.gid != "") {
					uni.navigateTo({
						url: "chat?groupid=" + item.groupid
					})
				} else {
					uni.navigateTo({
						url: "pm?uuid=" + item.touserid
					})
				}
			},
			pmList: function() {
				var that = this;
				that.app.get({
					url: that.app.apiHost + "/module.php?m=im_msg_index",
					success: function(res) {
						that.indexList = res.data.list;
					}
				})
			}
		}
	}
</script>

<style>
	.msItem{
		display: flex;
		flex-direction: row;
		background-color: #fff;
		padding: 5px;
		border-bottom: 1px solid #eee;
	}
	.msItem-img{
		width: 50px;
		height: 50px;
		border-radius: 10px;
		margin-right: 5px;
	}
</style>
