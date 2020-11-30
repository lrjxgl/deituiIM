<template>
	<view>
		<view id="main">
			<view class="pd-10 bg-fff">

				<template v-if="list.length>0">
					<view v-for="(item,index) in list" :key="item.id">
						<view class="chatbox" v-if="item.userid==user.userid">
							<view class="flex-1" :a="index"></view>
							<view class="chatbox-desc-b mgb-5 mgr-5">
								<chat-msg :content="item.content"></chat-msg>
							</view>
							
							<image :src="item.user_head+'.100x100.jpg'" class="wh-40 mgr-10 bd-radius-10"></image>
						</view>
						<view class="chatbox" v-else>
							<image :src="item.user_head+'.100x100.jpg'" class="wh-40 mgr-10 bd-radius-10"></image>
							<view class="flex-1">
								<view class="chatbox-nick-a mgb-5">{{item.nickname}}</view>
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

			<view class="modal-group" :class="aRecordClass">
				<view class="modal-mask" @click="aRecordClass=''"></view>

				<view @click="aRecordToggle" class="aRecordBox">
					<view :class="{'aRecord-active':aRecordIng}" class="iconfont icon-voice f36"></view>
					<view v-if="aRecordIng">点击结束</view>
					<view v-else>点击录音</view>
				</view>

			</view>
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
	import chatDb from "../../common/chatdb.js"
	import chatMsg from "../../components/chatmsg.vue";
	import emo from "../../common/emo.js";
	var gid;
	var groupid;
	var uid = Date.parse(new Date());
	var touid = ""
	var ws;
	var inPage = false;
	var windowHeight=0;
	var lastMsg;
	var audioRecord;
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
			chatMsg
		},
		data: function() {
			return {
				per_page: 0,
				list: [],
				content: "",
				wsConn: false,
				group: {},
				user: {},
				toUser: {},
				emoList: [],
				sch: 0,
				oldsch: 0,
				scrollTop: 10000,
				emoClass: "",
				aRecordClass: "",
				aRecordIng: false,
				time:0,
				showVideo:false,
				videoUrl:"",
				sfTop:210,
			}
		},
		onPageScroll:function(e){
			if(e.scrollTop==0 && !inAjax){
				this.getList();
				inAjax=true;
				setTimeout(function(){
					inAjax=false;
				},1000);
			}
		},
		onLoad: function(ops) {
			var sys=uni.getSystemInfoSync()
			windowHeight=sys.windowHeight;	
			var that = this;
			this.emoList = emo.emoList();
			groupid=ops.groupid;
			this.getPage();
			
			//#ifndef H5
			this.sfTop=160;
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
			if (inPage) {
				return false;
			}
			var that = this;
			if (this.wsConn) {
				that.wsInit();
			}
		},
		methods: {
			inArray:function(a,b){
				for(var i in b){
					if(a.id==b[i].id) return true;
				}
				return false;
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
				this.time=Date.parse(new Date())/1000;
				var that = this;
				if (this.per_page == 0) return false;
				that.app.get({
					url: that.app.apiHost + "/module.php?m=im_group&a=home&ajax=1&groupid=" + groupid,
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
						that.list =list;
						setTimeout(function() {
							that.scrollTop += 10;
						}, 100)
						setTimeout(function(){
							const query = uni.createSelectorQuery().in(that);
							 query.select('#main').boundingClientRect(res => {
								if(that.oldsch==0){
									uni.pageScrollTo({
										scrollTop:100000
									})
								}else{
									var st=res.height-that.oldsch;//res.height-that.oldsch-windowHeight+that.sfTop;
									console.log(st);
									uni.pageScrollTo({
										scrollTop:st
									})
								}
								that.oldsch=res.height;
							}).exec();
						},100)
					}
				})
			},
			getPage: function() {
				var that = this;

				that.app.get({
					url: that.app.apiHost + "/module.php?m=im_group&a=home&ajax=1&groupid=" + groupid,
					success: function(res) {
						gid = res.data.ws_gid;
						that.per_page = res.data.per_page;
						that.group = res.data.group;
						that.user=res.data.user;
						uni.setNavigationBarTitle({
							title: res.data.group.title
						})
						
						that.list = res.data.list;
						that.wsInit();
						setTimeout(function() {
							that.wsConn = true;
						}, 1000)
						var it=setTimeout(function(){

							uni.pageScrollTo({
								scrollTop:3000,
								duration:30
							})
							
						},300)
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
						appGroupId: that.group.groupid,
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
						case "say":
							var json = {
								gid: gid,
								imgurl: that.group.imgurl,
								appGroupId: that.group.groupid,
								appGroupTitle: that.group.title,
								uid: res.wsclient_from,
								touid: res.wsclient_to,
								content: res.content,
								time: res.time,
								user_head:res.user_head,
								nickname:res.nickname,
								userid:res.userid,
								isme: uid == res.wsclient_from ? true : false
							}
								
							that.addMsg(json);
							 
							setTimeout(function() {
								uni.pageScrollTo({
									scrollTop: 1000000
								});
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
					content: content,
					user_head:that.user.user_head,
					nickname:that.user.nickname,
					userid:that.user.userid
				});

				lastMsg = msg;
				ws.send({
					data: msg
				});
				that.saveHost(content);
				that.content = "";

			},
			saveHost: function(content) {
				var that = this;
				that.app.post({
					url: that.app.apiHost + "/module.php?m=im_group_msg&a=save",
					data: {
						groupid: that.group.groupid,
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
