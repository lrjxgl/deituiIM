<template>
	<view :style="{height:windowHeight+'px'}" style="position:relative;background-color: #000000;" id="App" v-if="pageLoad">

		<view class="main-body">

			<view v-if="zblive.zbstatus==1 || (zblive.zbstatus==2 && zblive.isback==1)" class="videobox" style="z-index:1;">

				<video show-fullscreen-btn="true" @loadedmetadata="loadMedia" controls="false" objectFit="contain" autoplay="true" 
				 class="video" v-if="zblive.zbstatus==1"  id="video" :src="m3u8url" :style="{height:videoHeight+'px',width:videoWidth+'px'}" :x5-video-player-type="zblive.zbstatus==1?'h5-page':'h5'"
				 x-webkit-airplay="true" playsinline="" webkit-playsinline=""></video>
				<video show-fullscreen-btn="true"  controls="false" objectFit="contain" autoplay="true" show-center-play-btn="false" :style="{height:videoHeight+'px',width:videoWidth+'px'}"
				 class="video" v-else-if="zblive.zbstatus==2" :src="zblive.mp4url" id="video" :x5-video-player-type="zblive.zbstatus==1?'h5-page':'h5'"
				 x-webkit-airplay="true" playsinline="" webkit-playsinline="">
				</video>
				<div v-else>请等待回放</div>
			</view>
			<div v-else-if="zblive.status==0" class="row-box">
				<div class="flex flex-center cl-red">即将开始直播</div>
			</div>
			<div v-else class="row-box">
				<div class="flex flex-center cl-red">直播已经结束，稍后可看回放。</div>
			</div>
			<!-- #ifndef APP-PLUS -->
			<view class="ftBox">
				<scroll-view :scroll-top="scrollTop" scroll-y="true" class="msgList">
					<view v-for="(item,index) in msgList" :key="index" class="msgList-item">
						<view class="msgList-nick">{{item.nickname}}</view>
						<view class="msgList-desc">{{item.content}}</view>
					</view>

				</scroll-view>
				 
				<view class="ftBtns flex flex-ai-center">
					<view @click="showGift" class="mgr-5 mgl-5 pointer iconfont icon-present cl3 f20"></view>
					<template v-if="zblive.zbstatus==1">
						<view class="flex-1 pd-5">
							<input v-model="cmContent" placeholder="发布你想了解的信息" class="ftBox-text" type="text" />
						</view>
						<view @click="sendMsg" class="btn-send iconfont icon-fasong"></view>
					</template>
					<template v-else>
						<view class="flex-1 pd-5">
							<input disabled v-model="cmContent" placeholder="直播结束，不能发布消息了" class="ftBox-text" type="text" />
						</view>
					</template>
				</view>


			</view>
			<el-gift v-if="giftShow" @call-parent="sendGifts"></el-gift>
			<gift-animate @call-parent="agiftShow=false" v-if="agiftShow" :gift="agift"></gift-animate>
			<!-- #endif -->

		</view>

	</view>
</template>

<script>
	var room_id;
	// #ifdef H5
	import Vue from 'vue'
	import VueClipboard from "../../common/vue-clipboard-cli.js";
	VueClipboard.config.autoSetContainer = true
	Vue.use(VueClipboard);
	// #endif 
	import elGift from "../../components/gift.vue";
	import giftAnimate from "../../components/gift-animate-line.vue";
	var timer=0;
	var gid="zblive";
	 
	var uid = Date.parse(new Date());
	var touid = ""
	var ws;
	var inPage = false;
	var windowHeight=0;
	var lastMsg;
	var audioRecord;
	var inAjax=false;
	var agift_timer=0;
	export default {
		components: {
			elGift,
			giftAnimate
		},
		data: function() {
			return {
				pageLoad: false,
				zblive: {},
				 
				msgList: [],
				cmContent: "",
				 
				m3u8url: "",
				mp4url: "",
				ssuser:{}, 
				windowWidth: 0,
				windowHeight: 0,
				videoHeight:"600",
				videoWidth:"600",
				giftShow: false,
				agift: {},
				agiftShow: false,
				scrollTop:10000

			}
		},
		onLoad: function(ops) {
			room_id = ops.id;
			gid="zblive"+ops.id;
			this.getPage();
			this.getMsgList();
			var win = uni.getSystemInfoSync();
			this.windowWidth = win.windowWidth;
			this.videoWidth=this.windowWidth;
			this.videoHeight=this.windowHeight = win.windowHeight;
			 
			console.log(win.windowWidth) 
		},
		onPullDownRefresh: function() {
			this.getPage();
			uni.stopPullDownRefresh();
		},
		methods: {
			loadMedia:function(e){
				this.videoHeight=e.detail.height*winWidth/e.detail.width;
				console.log("loadMedia",e)
			},
			getPage: function() {

				var that = this;
				that.app.get({
					url: that.app.apiHost + "/module.php?m=zblive&a=show&ajax=1&id=" + room_id,
					dataType: "json",
					success: function(res) {
						console.log(res.data)
						that.zblive = res.data.zblive;
					 
						that.pageLoad = true;
					 
						that.m3u8url = res.data.m3u8url;
						that.mp4url = res.data.mp4url;
						that.ssuser=res.data.ssuser;
						that.wsInit();
					}
				})
			},
			getMsgList: function() {
				var that = this;
				that.app.get({
					url: that.app.apiHost + "/module.php?m=zblive_msg&a=list&ajax=1&room_id=" + room_id,
					dataType: "json",
					success: function(res) {
						that.msgList = res.data.list;
					}
				})
			},
			 
			 
			showGift: function() {
				this.giftShow = false;
				var that = this;
				setTimeout(function() {
					that.giftShow = true;
				}, 10)

			},
			sendGifts: function(gift) {
				var that=this;
				that.giftShow=false;
				gift.nickname=that.ssuser.nickname;
				var msg = JSON.stringify({
					 
					type: "gift",
					gid: gid,
					gift:gift,
					content: "送礼物",
					user_head:that.ssuser.user_head,
					nickname:that.ssuser.nickname,
					userid:that.ssuser.userid
				});
				ws.send({
					data: msg
				});
			}, 
			sendMsg:function(){
				var that=this;
				if(this.cmContent==''){
					uni.showToast({
						title:"请输入内容"
					})
					return false;
				}
				var content=this.cmContent;
				that.app.post({
					url:that.app.apiHost+"/module.php?m=zblive_msg&a=save&ajax=1",
					data:{
						room_id:room_id,
						content:this.cmContent
					},
					success:function(res){
						that.cmContent="";
						var msg = JSON.stringify({
							 
							type: "say",
							gid: gid,
							content: content,
							user_head:that.ssuser.user_head,
							nickname:that.ssuser.nickname,
							userid:that.ssuser.userid
						});
						
						lastMsg = msg;
						ws.send({
							data: msg
						});
						 
						 
					}
				})
			},
			wsInit: function() {
				var that = this;
			
				if (this.wsConn) {
					ws.close();
				}
				ws = uni.connectSocket({
					url: that.app.wsHost,
					complete: function(res) {
			
					}
				});
			
				ws.onOpen(function(res) {
			
					var msg = JSON.stringify({
						type: "login",
						k: uid,
						gid: gid,
						
						content: "login"
					});
					ws.send({
						data: msg
					});
				});
				ws.onError(function(res) {
					console.log(res)			 
					if (Object.keys(res).length>1) {
						ws.wsInit();
					}
				
				});
				ws.onMessage(function(e) {
					var res = JSON.parse(e.data);
					console.log(res);
					switch (res.type) {
						case "login":
							break;
						case "gift":
							that.agift=res.gift;
							that.agiftShow=true;
							
							clearTimeout(agift_timer);
							agift_timer=setTimeout(function(){
								that.agiftShow=false;
							},2000)
							break;
						case "say":
							var json = {
								gid: gid,
								
								uid: res.wsclient_from,
								touid: res.wsclient_to,
								content: res.content,
								time: res.time,
								user_head:res.user_head,
								nickname:res.nickname,
								userid:res.userid,
								isme: uid == res.wsclient_from ? true : false
							}
								
							that.msgList.push(json);
							that.scrollTop=9990; 
							setTimeout(function(){
								that.scrollTop=10000; 
							},60)
							
							 
							break;
					}
				});
			},
		}
	}
</script>

<style>
	.videobox {
		position: absolute;
		top: 0;
		bottom: 0;
		left: 0;
		right: 0;
		display: block;
		overflow: hidden;
		background-color: #aaa;
	}

	.videoMask {
		position: absolute;
		top: 300rpx;
		left: 40%;
		z-index: 999;
		font-size: 120rpx;
		justify-content: center;
		align-items: center;
	}

	.video {
		
	}

	.videoTools {
		position: absolute;
		left: 10rpx;
		right: 10rpx;
		top: 20rpx;
		height: 1px;
		background-color: #333;
		display: none;
	}

	.videoDot {
		position: absolute;
		width: 20rpx;
		height: 20rpx;
		top: -10rpx;
		background-color: #f30;
		border-radius: 50%;
	}

	.ftBox-mask {
		position: fixed;
		bottom: 0;
		top:0;
		left: 0;
		right: 0;
		z-index: 999;
		 
	}
	.ftBox {
		position: fixed;
		bottom: 0;
		height:600rpx;
		left: 0;
		right: 0;
		z-index: 999;
		flex-direction: column;
		display: flex;
	}
	.ftBox-goods {
		font-size: 72rpx;
		color: #f00;

	}

	.ftBox-text {
		height: 72rpx;
		line-height: 72rpx;
		border: 0;
		border-radius: 10rpx;
		background-color: #333;
		opacity: 0.8;
		width: 100%;
		color: #fff;
		padding-left: 10rpx;
	}
	.ftBtns{
		background-color: #000;
		opacity: 0.6;
	}
	.btn-send {
		height: 76rpx;
		line-height: 76rpx;
		padding: 0rpx 16rpx;
		justify-content: center;

		color: #fff;
	}

	.msgList {
		height: 320rpx;
		padding: 10rpx;
		overflow: auto;
		flex: 1;
	}

	.msgList-item {
		display: flex;
		flex-direction: row;
		padding: 20rpx 40rpx;
		background-color: #000;
		opacity: 0.5;
		margin: 10px;
		border-radius: 10px;
	}

	.msgList-nick {
		margin-right: 20rpx;
		color: #fff;
		font-size: 24rpx;
	}

	.msgList-desc {
		color: #fff;
		font-size: 24rpx;
		flex: 1;
	}

	.modal-goods {
		position: fixed;
		bottom: 0rpx;
		left: 0rpx;

		right: 0rpx;
		z-index: 999;
		background-color: #fff;
	}

	.modal-share {
		position: fixed;
		bottom: 0rpx;
		left: 60rpx;

		right: 60rpx;
		z-index: 999;
		background-color: #fff;
	}

	.mline {
		margin-bottom: 20rpx;
		border-bottom: 1px dotted #333;
	}

	.btn-quan {
		font-size: 24rpx;
		color: #f30;
		padding: 6rpx;
		border: 1px dotted #f30;
	}

	.btn-ma {
		width: 320rpx;
		margin: 0 auto;
		border: 1px dotted #f30;
		line-height: 60rpx;
		height: 60rpx;
		font-size: 28rpx;
		text-align: center;
		margin-bottom: 20rpx;
		background-color: #fcf6f6;
		border-radius: 10rpx;
		color: #f30;
	}

	.btn-copy {
		background-color: #f30;
		margin-bottom: 20rpx;
		padding: 20rpx 40rpx;
	}

	.modal-share-close {
		background-color: #333;
		position: absolute;
		right: -20rpx;
		width: 60rpx;
		height: 60rpx;
		color: #fff;
		border-radius: 50%;
		opacity: 0.9;
		top: -20rpx;
		align-items: center;
		justify-content: center;
	}

	uni-toast {
		z-index: 9999;
	}
</style>
