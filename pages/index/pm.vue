<template>
	<view>
		<view class="main">

			<scroll-view :scroll-top="scrollTop" scroll-y="true" @scrolltoupper="scTop" @scroll="scrollY" class="scroll-list pd-10 bg-fff">
				<template v-if="list.length>0">
					<view v-for="(item,index) in list" :key="index">
						<view class="chatbox" v-if="item.isme">
							<view class="flex-1"></view>
							<view class="chatbox-desc-b">
							<chat-msg v-on:call-parent="chatMsgEven" :content="item.content"></chat-msg>
							</view>
							<image :src="user.user_head+'.100x100.jpg'" class="wh-40 mgl-10"></image>
						</view>
						<view class="chatbox" v-else>
							<image :src="touser.user_head+'.100x100.jpg'" class="wh-40 mgr-10"></image>
							<view class="flex-1">
								<view class="chatbox-desc-a">
								<chat-msg :content="item.content"></chat-msg>
								</view>
							</view>
						</view>

					</view>
				</template>
				<template v-else>
					<view class="emptyData">暂无消息</view>
				</template>
			</scroll-view>

			<view class="fixFoot-row"></view>
			<view class="fixFoot bg-fff pdb-5">
				<view class="input-flex">
					<input class="input-flex-text" v-model="content" type="text">
					<view class="input-flex-btn w60" @click="send('content')">发送</view>
				</view>
				<view class="flex flex-center">
					<!-- #ifndef H5 -->
					<view @click="aRecordClass='flex-col'" class="flex-1 iconfont icon-voicefill f20"></view>
					<!-- #endif -->
					<view @click="choiceImg('pic')" class="flex-1 iconfont icon-pic f20 sendPic"></view>
					<!-- #ifndef H5 -->
					<view @click="catchImg('pic')" class="flex-1 iconfont icon-camera f20 sendPic"></view>
					<!-- #endif -->
					<!-- #ifndef H5 -->
					<view @click="videoRecord('video')" class="flex-1 iconfont icon-recordlight f20"></view>
					<!-- #endif -->
					<view @click="emoClass='flex-col'" class="flex-1 iconfont icon-emoji f20"></view>
					<view @click="choiceFile('file')" class="flex-1 iconfont none icon-file f20 "></view>
					<view @click="showGift" class="flex-1 iconfont icon-present f20"></view>
				</view>

			</view>
			<view id="emoModal" :class="emoClass" class="modal-group">
				<view class="modal-mask" @click="emoClass=''"></view>
				<view class="emoFixbox">

					<view class="pd-10">
						<view class="flex flex-wrap">
							<view @click="addEmo(item)" class="imEmo" :class="'imEmo-'+index" v-for="(item,index) in emoList" :key="index"></view>
						</view>
					</view>
				</view>
			</view>
			<el-gift v-if="giftShow" v-on:call-parent="sendGifts" ></el-gift>
			<gift-animate v-on:call-parent="agiftShow=false"  v-if="agiftShow" :gift="agift"></gift-animate>
			<view v-if="isFriend==0" @click="addFriend(touser.userid)" class="add-friend-btn iconfont icon-friend_add_light"></view>
			<view class="modal-group" :class="aRecordClass">
				<view class="modal-mask" @click="aRecordClass=''"></view>

				<view @click="aRecordToggle" class="aRecordBox">
					<view :class="{'aRecord-active':aRecordIng}" class="iconfont icon-voice f36"></view>
					<view v-if="aRecordIng">点击结束</view>
					<view v-else>点击录音</view>
				</view>

			</view>

		</view>
	</view>
</template>

<script>
	import chatDb from "../../common/chatdb.js";
	import chatMsg from "../../components/chatmsg.vue";
	import emo from "../../common/emo.js";
	import elGift from "../../components/gift.vue";
	import giftAnimate from "../../components/gift-animate.vue";
	var ws;
	var gid = 0;
	var uid = "胡歌";
	var touid = "小仙女";
	var inPage = false;
	var lastMsg;
	var audioRecord;
	const aRecordOptions = {
		duration: 10000,
		sampleRate: 44100,
		numberOfChannels: 1,
		encodeBitRate: 192000,
		format: 'mp3',
		frameSize: 50
	}
	export default {
		components: {
			chatMsg,elGift,giftAnimate
		},
		data: function() {
			return {
				"list": [],
				content: "",
				wsConn: false,
				user: {},
				touser: {},
				isFriend: 1,
				emoList: [],
				emoClass: "",
				aRecordClass: "",
				aRecordIng: false,
				per_page: 0,
				sch: 0,
				oldsch: 0,
				scrollTop: 1000,
				loadIng: false,
				giftShow:false,
				agift:{},
				agiftShow:false
			}
		},
		onLoad: function(ops) {
			var that = this;
			this.getPage(ops.uuid);
			this.emoList = emo.emoList();
			
			//#ifndef H5
			audioRecord = wx.getRecorderManager();


			audioRecord.onStop((res) => {
				if (res.tempFilePath) {
					that.recordUpload(res.tempFilePath);
				}

			})

			audioRecord.onError((res) => {
				console.log(e)
			})
			//#endif
		},
		onHide: function() {
			if (inPage) {
				return false;
			}
			ws.close({
				success: function(res) {

				}
			});
		},
		onShow: function() {
			if (inPage) {
				return false;
			}
			var that = this;
			if (this.wsConn) {
				that.wsInit();
			}
		},

		methods: {
			chatMsgEven:function(res){
				switch(res.type){
					case "gift":
						this.acceptGift(res.giftid);
						break;
				}
			},
			acceptGift:function(sendid){
				var that=this;
			 
				that.agiftShow=false;
				that.app.get({
					url:that.app.apiHost+"/module.php?m=im_gift&a=accept&sendid="+sendid,
					success:function(res){
						that.agift=res.data.gift;
						that.agiftShow=true;
					}
				})
			},
			showGift:function(){
				this.giftShow=false;
				var that=this;
				setTimeout(function(){
					that.giftShow=true;
				},10)
				
			},
			sendGifts:function(giftSendId){
				this.send("gift",giftSendId);
				this.giftShow=false;
			},
			addFriend: function(touserid) {
				var that = this;
				that.app.get({
					url: that.app.apiHost + "/index.php?m=friend&a=add&touserid=" + touserid,
					success: function(res) {
						uni.showToast({
							title: res.message
						})
					}
				})
			},
			
			getPage: function(touserid) {
				var that = this;
				that.app.get({
					url: that.app.apiHost + "/module.php?m=im_pm&touserid=" + touserid,
					success: function(res) {
						uid = res.data.ws_uid;
						touid = res.data.ws_touid;
						that.per_page = res.data.per_page;
						/*
						var list=chatDb.msgList({
							uid:uid,
							touid:touid,
							gid:gid
						});
						*/
						that.isFriend = res.data.isFriend;
						that.list = res.data.list;
						that.touser = res.data.touser;
						that.user = res.data.user;
						uni.setNavigationBarTitle({
							title: res.data.touser.nickname
						})

						that.wsInit();
						setTimeout(function() {
							that.wsConn = true;

						}, 300);
						setTimeout(function() {
							that.scrollTop = 10000;
						}, 100)

					}
				})
			},
			scrollY: function(e) {
				this.sch = e.detail.scrollHeight;
			},
			scTop: function(e) {
				if (this.oldsch == 0) {
					this.oldsch = this.sch;
				}

				var that = this;
				that.scrollTop = 0;
				this.getList();


			},
			getList: function() {
				if (this.per_page == 0) return false;
				var that = this;
				that.app.get({
					url: that.app.apiHost + "/module.php?m=im_pm&touserid=" + that.touser.userid,
					data: {
						per_page: that.per_page
					},
					success: function(res) {
						that.per_page = res.data.per_page;
						var list = that.list;
						for (var i in res.data.list) {
							list.unshift(res.data.list[i]);
						}
						that.list = list;
						that.loadIng = true;
						setTimeout(function() {
							that.loadIng = false;
							if (that.oldsch == 0) {
								that.scrollTop = 10000;
							} else {
								that.scrollTop = that.oldsch;
							}

						}, 200)
					}
				})
			},
			wsInit: function() {
				var that = this;

				ws = uni.connectSocket({
					url: that.app.wsHost,
					complete: function(res) {

					},
					fail: function(res) {
						uni.showToast({
							title: "ws error"
						})
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
					uni.showToast({
						title: "ws error"
					})
					if (res == '1') {
						ws.wsInit();
					}


				});
				ws.onMessage(function(e) {

					var res = JSON.parse(e.data);

					switch (res.type) {
						case "login":
							break;
						case "say":
							var json = {
								gid: gid,
								uid: res.wsclient_from,
								touid: res.wsclient_to,
								touserid: that.touser.userid,
								nickname: uid == res.wsclient_from ? that.user.nickname : that.touser.nickname,
								user_head: uid == res.wsclient_from ? that.user.user_head : that.touser.user_head,
								content: res.content,
								time: res.time,
								isme: uid == res.wsclient_from ? true : false
							}

							that.addMsg(json);
							//chatDb.add(json);
							setTimeout(function() {
								that.scrollTop = 1000000;
							}, 100)
							break;
					}
				});
			},
			addMsg: function($msg) {
				var list = this.list;
				list.push($msg);
				this.list = list;

			},
			addEmo: function(s) {
				s = "\\" + s + " ";
				this.content += s;
			},

			send: function(type, fileurl) {
				var that = this;
				var content;
				switch (type) {
					case "pic":
						content = "[img=" + fileurl + "]"
						break;
					case "audio":
						content = "[audio=" + fileurl + "]"
						break;
					case "video":
						content = "[video=" + fileurl + "]"
						break;
					case "file":
						content = fileurl.substring(fileurl.lastIndexOf("\/") + 1) + " [file=" + fileurl + "]";
						break;
					case "gift":
						content = "[gift=" + fileurl + "]"
						break;
					case "content":
						content = that.content;
						if (content == "") {
							return false;
						}
						break;
				}
				var msg = JSON.stringify({
					wsclient_to: touid,
					type: "say",
					gid: gid,
					content: content
				});

				lastMsg = msg;
				ws.send({
					data: msg
				});
				//保存服务器
				that.saveHost(content);
				that.content = "";

			},
			saveHost: function(content) {
				var that = this;
				that.app.post({
					url: that.app.apiHost + "/module.php?m=im_msg&a=save",
					data: {
						touserid: that.touser.userid,
						content: content
					},
					success: function(res) {
						console.log(res)
					}

				})
			},
			choiceImg: function() {
				//选择图片发送
				var that = this;
				inPage = true;
				uni.chooseImage({
					sourceType: ["album"],
					fail: function(e) {
						inPage = false;
					},
					success: function(e) {
						inPage = false;
						uni.uploadFile({
							url: that.app.apiHost + "/index.php?m=upload&a=img&ajax=1&authcode=" + that.app.getAuthCode(), //仅为示例，非真实的接口地址
							filePath: e.tempFilePaths[0],
							name: 'upimg',
							dataType: "json",

							success: (res) => {
								if (!res.data.error) {
									var rs = JSON.parse(res.data);
									if (!rs.error) {
										that.send("pic", rs.data.trueimgurl);
									}
								}
							}
						});
					}
				})
			},
			choiceFile: function() {
				//选择图片发送
				var that = this;
				inPage = true;
				uni.chooseImage({
					fail: function(e) {
						inPage = false;
					},
					success: function(e) {
						inPage = false;
						uni.uploadFile({
							url: that.app.apiHost + "/index.php?m=upload&a=upload&ajax=1&authcode=" + that.app.getAuthCode(), //仅为示例，非真实的接口地址
							filePath: e.tempFilePaths[0],
							name: 'upimg',
							dataType: "json",

							success: (res) => {
								if (!res.error) {
									var rs = JSON.parse(res.data);
									if (!rs.error) {
										that.send("file", rs.trueimgurl);
									}
								}
							}
						});
					}
				})
			},
			catchImg: function() {
				var that = this;
				inPage = true;
				uni.chooseImage({
					fail: function(e) {
						inPage = false;
					},
					sourceType: ["camera"],
					success: function(e) {
						inPage = false;
						uni.uploadFile({
							url: that.app.apiHost + "/index.php?m=upload&a=img&ajax=1&authcode=" + that.app.getAuthCode(), //仅为示例，非真实的接口地址
							filePath: e.tempFilePaths[0],
							name: 'upimg',
							dataType: "json",

							success: (res) => {
								if (!res.data.error) {
									var rs = JSON.parse(res.data);
									if (!rs.data.error) {
										that.send("pic", rs.data.trueimgurl);
									}
								}
							}
						});
					}
				})
			},
			videoRecord: function() {
				var that = this;

				uni.chooseVideo({
					count: 1,
					success: function(e) {
						uni.uploadFile({
							url: that.app.apiHost + "/index.php?m=upload&a=uploadmp4&ajax=1&authcode=" + that.app.getAuthCode(),
							filePath: e.tempFilePath,
							name: 'upimg',
							dataType: "json",

							success: (res) => {
								if (!res.data.error) {
									var rs = JSON.parse(res.data);
									if (!rs.error) {
										that.send("video", rs.trueimgurl);
									}
								}
							}
						});
					}
				})
			},
			recordUpload: function(fileurl) {
				var that = this;
				console.log(fileurl);
				uni.uploadFile({
					url: that.app.apiHost + "/index.php?m=upload&a=uploadmp4&ajax=1&authcode=" + that.app.getAuthCode(),
					filePath: fileurl,
					fileType: "audio",
					name: 'upimg',
					dataType: "json",

					success: (res) => {
						if (!res.data.error) {
							var rs = JSON.parse(res.data);
							if (!rs.error) {
								that.send("audio", rs.trueimgurl);
							}
						}
					}
				});
			},
			aRecordToggle: function() {
				if (this.aRecordIng) {
					console.log("stop")
					audioRecord.stop();
					this.aRecordIng = false;
				} else {
					this.aRecordIng = true;

					audioRecord.start(aRecordOptions);
				}


			}
		}
	}
</script>

<style>
	
	.scroll-list {
		width: 100%;
		box-sizing: border-box;
		position: absolute;
		top: 0px;
		bottom: 80px;
	}

	.add-friend-btn {
		position: fixed;
		bottom: 200px;
		right: 3px;
		background-color: #15ABA5;
		color: #fff;
		width: 30px;
		height: 30px;
		line-height: 30px;
		border-radius: 20px;
		text-align: center;
		display: block;
		cursor: pointer;
	}

	.aRecordBox {
		z-index: 9999;
		width: 100px;
		height: 100px;
		border-radius: 50%;
		background-color: #fff;
		position: fixed;
		bottom: 100px;
		left: 50%;
		margin-left: -50px;
		text-align: center;
		display: block;
	}

	.f36:before {
		font-size: 36px;
	}
	
</style>
