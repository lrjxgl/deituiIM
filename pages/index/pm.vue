<template>
	<view>
		<view class="main" id="main">
			<page-loading v-if="loadIng"></page-loading>
			<view class=" pd-10 bg-fff">
				<template v-if="list.length>0">
					<view v-for="(item,index) in list"  :id="item.id" :key="item.id">
						<view class="chatbox" v-if="item.isme">
							<view class="flex-1"></view>
							<view class="chatbox-desc-b">
							<chat-msg v-on:call-parent="chatMsgEven" :content="item.content"></chat-msg>
							</view>
							<image @click="goHome(user.userid)" :src="user.user_head+'.100x100.jpg'" class="wh-40 mgl-10 bd-radius-10"></image>
						</view>
						<view class="chatbox" v-else>
							<image @click="goHome(touser.userid)" :src="touser.user_head+'.100x100.jpg'" class="wh-40 mgr-10 bd-radius-10"></image>
							<view class="chatbox-desc-a">
							<chat-msg  v-on:call-parent="chatMsgEven" :content="item.content"></chat-msg>
							</view>
							<view class="flex-1">
								
							</view>
						</view>

					</view>
				</template>
				<template v-else>
					<view class="emptyData">暂无消息</view>
				</template>
			</view>

			<view class="fixFoot-row"></view>
			<view class="fixFoot flex-jc-bettwen bg-fff pdt-5">
				<view class="flex pdl-5 pdr-5">
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
			<el-gift :touserid="touser.userid" v-if="giftShow" v-on:call-parent="sendGifts" ></el-gift>
			<gift-animate v-on:call-parent="agiftShow=false"  v-if="agiftShow" :gift="agift"></gift-animate>
			
			<view class="modal-group" :class="aRecordClass">
				<view class="modal-mask" @click="aRecordClass=''"></view>

				<view @click="aRecordToggle" class="aRecordBox">
					<view :class="{'aRecord-active':aRecordIng}" class="iconfont icon-voice f36"></view>
					<view v-if="aRecordIng">点击结束</view>
					<view v-else>点击录音</view>
				</view>

			</view>
			<!--添加好友-->
			<friend-apply v-if="Object.keys(touser).length>0" :touserid="touser.userid"></friend-apply>
			 
			<view class="modal-group flex-col" v-if="showVideo">
				<view class="modal-mask" @click="showVideo=false"></view>
				<view class="flex-center" style="position: fixed;bottom:100px;left:0;right:0;z-index:999;">
					<video :src="videoUrl" style="width:320px; height:320px;"></video>
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
	import friendApply from "../../components/friend-apply.vue";
	var ws;
	var gid = 0;
	var uuid=0;
	var uid = "胡歌";
	var touid = "小仙女";
	var inPage = false;
	var lastMsg;
	var audioRecord;
	var windowHeight=0;
	var aiusers=[1510,1511];
	var inAjax=false;
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
			chatMsg,elGift,giftAnimate,friendApply
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
				scrollTop: 10000,
				loadIng: false,
				giftShow:false,
				agift:{},
				agiftShow:false,

				time:0,
				showVideo:false,
				videoUrl:""
			}
		},
		onPageScroll:function(e){
			if(e.scrollTop==0 && !inAjax){
				this.getList();
				inAjax=true;
				setTimeout(function(){
					inAjax=false;
				},2000);
			}
			//console.log(e.scrollTop)
		},
		onLoad: function(ops) {
			
			var that = this;
			uuid=ops.uuid;
			this.getPage(ops.uuid);
			this.emoList = emo.emoList();
			var sys=uni.getSystemInfoSync()
			windowHeight=sys.windowHeight;	
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
		onUnload:function(){
			console.log("onUnload")
			if (inPage) {
				return false;
			}
			console.log("关闭WS") 
			ws.close({
				success: function(res) {
			
				}
			});
		},
		
		onShow: function() {
			console.log("onShow")
			if (inPage) {
				return false;
			}
			var that = this;
			if (this.wsConn) {
				that.wsInit();
			}
		},

		methods: {
			goHome:function(userid){
				uni.navigateTo({
					url:"../../pagesblog/sblog_home/index?userid="+userid
				})
			},
			chatMsgEven:function(res){
				switch(res.type){
					case "gift":
						this.acceptGift(res.giftid);
						break;
					case "showVideo":
						this.videoUrl=res.url;
						this.showVideo=true;
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
			
			 
			
			getPage: function(touserid) {
				var that = this;
				that.app.get({
					url: that.app.apiHost + "/module.php?m=im_pm&touserid=" + touserid,
					success: function(res) {
						uid = res.data.ws_uid;
						touid = res.data.ws_touid;
						that.per_page = res.data.per_page;
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
						var it=setTimeout(function(){
							console.log("pageScrollTo")
							uni.pageScrollTo({
								scrollTop:3000,
								duration:30
							})
							
						},300)


					}
				})
			},
			inArray:function(a,b){
				for(var i in b){
					if(a.id==b[i].id) return true;
				}
				return false;
			},
			getList: function() {
				this.time=Date.parse(new Date())/1000;
				if (this.per_page == 0) return false;
				var that = this;
				that.loadIng = true;
				that.app.get({
					url: that.app.apiHost + "/module.php?m=im_pm&touserid=" + that.touser.userid,
					data: {
						per_page: that.per_page
					},
					success: function(res) {
						that.per_page = res.data.per_page;
						var list = that.list;
						for (var i in res.data.list) {
							if(!that.inArray(res.data.list[i],list)){
								list.unshift(res.data.list[i]);
							}
							
						}
						that.list = list;
						setTimeout(function(){
							const query = uni.createSelectorQuery().in(that);
							 query.select('#main').boundingClientRect(res => {
								if(that.oldsch==0){
									uni.pageScrollTo({
										scrollTop:100000
									})
								}else{
									var st=res.height-that.oldsch;
									uni.pageScrollTo({
										scrollTop:st,
										duration:30
									})
								}
								that.oldsch=res.height;
							}).exec();
						},100)
						that.loadIng = false;
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
				//ws.close()
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
					console.log(res)
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
							//保存ai发过来的数据
							if(aiusers.indexOf(that.touser.userid) && uid != res.wsclient_from){
								that.app.post({
									url: that.app.apiHost + "/module.php?m=im_msg&a=saveai",
									data: {
										touserid: that.touser.userid,
										content: res.content
									},
									success: function(res) {
										console.log(res)
									}
								
								})
							}
							setTimeout(function(){
								uni.pageScrollTo({
									scrollTop:100000
								})
							},100)
							
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
