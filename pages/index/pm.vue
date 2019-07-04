<template>
	<div>
		<div class="main">
			<div class="flex-1">
				<div id="vueApp" class="list pd-10 bg-fff">
					<template v-if="list.length>0">
						<div v-for="(item,index) in list" :key="index">
							<div class="chatbox" v-if="item.isme">
								<div class="flex-1"></div>
								<chat-msg :content="item.content"></chat-msg>
								
								<image :src="user.user_head+'.100x100.jpg'" class="wh-40 mgl-10"></image>
							</div>
							<div class="chatbox" v-else>
								<image :src="touser.user_head+'.100x100.jpg'" class="wh-40 mgr-10"></image>
								<div class="flex-1">
									 
									<chat-msg :content="item.content"></chat-msg>
								</div>
							</div>

						</div>
					</template>
					<template v-else>
						<div class="emptyData">暂无消息</div>
					</template>
				</div>

				<div class="fixFoot-row"></div>
				<div class="fixFoot bg-fff pdb-5">
					<div class="input-flex">
						<input class="input-flex-text" v-model="content" type="text">
						<div class="input-flex-btn w60" @click="send('content')">发送</div>
					</div>
					<div class="flex flex-center">
						<!-- #ifndef H5 -->
						<div @click="aRecordClass='flex-col'" class="flex-1 iconfont icon-voicefill f20"></div>
						<!-- #endif -->
						<div  @click="choiceImg('pic')" class="flex-1 iconfont icon-pic f20 sendPic"></div>
						<!-- #ifndef H5 -->
						<div @click="catchImg('pic')" class="flex-1 iconfont icon-camera f20 sendPic"></div>
						<!-- #endif -->
						<!-- #ifndef H5 -->
						<div @click="videoRecord('video')" class="flex-1 iconfont icon-recordlight f20"></div>
						<!-- #endif -->
						<div @click="emoClass='flex-col'" class="flex-1 iconfont icon-emoji f20"></div>
						<div @click="choiceFile('file')" class="flex-1 iconfont none icon-file f20 "></div>
					</div>

				</div>
				<div id="emoModal" :class="emoClass" class="modal-group">
					<div class="modal-mask" @click="emoClass=''"></div>
					<div class="emoFixbox">
				 
						<div class="pd-10">
							<div class="flex flex-wrap">
								<div @click="addEmo(item)" class="imEmo" :class="'imEmo-'+index" v-for="(item,index) in emoList" :key="index"></div>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div v-if="isFriend==0" @click="addFriend(touser.userid)" class="add-friend-btn iconfont icon-friend_add_light"></div>
			<div class="modal-group" :class="aRecordClass">
				<div class="modal-mask" @click="aRecordClass=''"></div>
			 
				<div @click="aRecordToggle" class="aRecordBox">
					<div :class="{'aRecord-active':aRecordIng}" class="iconfont icon-voice f36"></div>
					<div v-if="aRecordIng">点击结束</div>
					<div v-else>点击录音</div>
				</div>
				 
			</div>
			
		</div>
	</div>
</template>

<script>
	import chatDb from "../../common/chatdb.js";
	import chatMsg from "../../components/chatmsg.vue"; 
	import emo from "../../common/emo.js";
	var ws;
	var gid = 0;
	var uid = "胡歌";
	var touid = "小仙女";
	var inPage=false;
	var lastMsg;
	var  audioRecord;
	const aRecordOptions = {
	  duration: 10000,
	  sampleRate: 44100,
	  numberOfChannels: 1,
	  encodeBitRate: 192000,
	  format: 'mp3',
	  frameSize: 50
	}
	export default {
		components:{
			chatMsg
		},
		data: function() {
			return {
				"list": [],
				content: "",
				wsConn:false,
				user:{},
				touser:{},
				isFriend:1,
				emoList:[],
				emoClass:"",
				aRecordClass:"",
				aRecordIng:false
			}
		},
		onLoad:function(ops){
			var that=this;
			this.getPage(ops.uuid);
			this.emoList=emo.emoList();
			//#ifndef H5
			audioRecord =  wx.getRecorderManager();
			
			 
			audioRecord.onStop((res) => {
			  if(res.tempFilePath){
			  	that.recordUpload(res.tempFilePath);
			  }
			   
			})
			 
			audioRecord.onError((res) => {
				console.log(e)
			})
			//#endif
		},
		onHide:function(){
			if(inPage){
				return false;
			} 
			ws.close({
				success:function(res) {
					 
				}
			}); 
		},
		onShow:function() {
			if(inPage){				
				return false;
			} 
			var that=this;
			if(this.wsConn){
				that.wsInit();
			} 
		},
		methods: {
			addFriend:function(touserid){
				var that=this;
				that.app.get({
					url:that.app.apiHost+"/index.php?m=friend&a=add&touserid="+touserid,
					success:function(res){
						uni.showToast({
							title:res.message
						})
					}
				})
			}, 
			getPage:function(touserid){
				var that=this;
				that.app.get({
					url:that.app.apiHost+"/module.php?m=im_pm&touserid="+touserid,
					success:function(res){
						uid=res.data.ws_uid;
						touid=res.data.ws_touid;
						var list=chatDb.msgList({
							uid:uid,
							touid:touid,
							gid:gid
						});
						that.isFriend=res.data.isFriend;
						that.list=list;
						that.touser=res.data.touser;
						that.user=res.data.user;
						uni.setNavigationBarTitle({
							title:res.data.touser.nickname
						})
						 
						that.wsInit(); 
						setTimeout(function(){
							that.wsConn=true;
							
						},300);
						
					}
				})
			},
			
			wsInit:function(){
				var that=this;
				
				ws=uni.connectSocket({
					url: that.app.wsHost,
					complete:function(res){
						 
					},
					fail:function(res){
						uni.showToast({
							title:"ws error"
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
						data:msg
					});
				});
				ws.onError(function(res) {
					uni.showToast({
						title:"ws error"
					})
					if(res=='1'){
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
								gid:gid,
								uid: res.wsclient_from,
								touid:res.wsclient_to,
								touserid:that.touser.userid,
								nickname:uid == res.wsclient_from ?that.user.nickname:that.touser.nickname,
								user_head:uid == res.wsclient_from ?that.user.user_head:that.touser.user_head,
								content: res.content,
								time: res.time,
								isme: uid == res.wsclient_from ? true : false
							}
							 
							that.addMsg(json);
							chatDb.add(json);
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
			addEmo:function(s){
				s="\\"+s+" ";
				this.content+=s;
			},
			
			send: function(type,fileurl) {
				var that = this;
				var content;
				switch (type) {
					case "pic":
						content="[img="+fileurl+"]"
						break;
					case "audio":
						content="[audio="+fileurl+"]"
						break;
					case "video":
						content="[video="+fileurl+"]"
						break;
					case "file":
						content=fileurl.substring(fileurl.lastIndexOf("\/")+1) +" [file="+fileurl+"]";
						break;
					case "content":
						content=that.content;
						if(content==""){
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
				
				lastMsg=msg; 
				ws.send({
					data:msg
				});
				that.content="";
				 
			},
			
			choiceImg:function(){
				//选择图片发送
				var that=this;
				inPage=true; 
				uni.chooseImage({
					sourceType:["album"],
					fail:function(e){
						inPage=false;
					},
					success:function(e){
						inPage=false;
						uni.uploadFile({
							url: that.app.apiHost+"/index.php?m=upload&a=img&ajax=1&authcode="+that.app.getAuthCode(), //仅为示例，非真实的接口地址
							filePath: e.tempFilePaths[0],
							name: 'upimg',
							dataType:"json",
						
							success: (res) => {
								if(!res.data.error){
									var rs=JSON.parse(res.data);
									if(!rs.error){
										that.send("pic",rs.data.trueimgurl);
									}
								}
							}
						});
					}
				})
			},
			choiceFile:function(){
				//选择图片发送
				var that=this;
				inPage=true;  
				uni.chooseImage({
					fail:function(e){
						inPage=false;
					},
					success:function(e){
						inPage=false;
						uni.uploadFile({
							url: that.app.apiHost+"/index.php?m=upload&a=upload&ajax=1&authcode="+that.app.getAuthCode(), //仅为示例，非真实的接口地址
							filePath: e.tempFilePaths[0],
							name: 'upimg',
							dataType:"json",
						
							success: (res) => {
								if(!res.error){
									var rs=JSON.parse(res.data);
									if(!rs.error){
										that.send("file",rs.trueimgurl);
									}
								}
							}
						});
					}
				})
			},
			catchImg:function(){
				var that=this;
				inPage=true;  
				uni.chooseImage({
					fail:function(e){
						inPage=false;
					},
					sourceType:["camera"],
					success:function(e){
						inPage=false;
						uni.uploadFile({
							url: that.app.apiHost+"/index.php?m=upload&a=img&ajax=1&authcode="+that.app.getAuthCode(), //仅为示例，非真实的接口地址
							filePath: e.tempFilePaths[0],
							name: 'upimg',
							dataType:"json",
						
							success: (res) => {
								if(!res.data.error){
									var rs=JSON.parse(res.data);
									if(!rs.data.error){
										that.send("pic",rs.data.trueimgurl);
									}
								}
							}
						});
					}
				})
			},
			videoRecord:function(){
				var that=this;
				 
				uni.chooseVideo({
					count: 1,
					success:function(e){
						uni.uploadFile({
							url: that.app.apiHost+"/index.php?m=upload&a=uploadmp4&ajax=1&authcode="+that.app.getAuthCode(), 
							filePath: e.tempFilePath,
							name: 'upimg',
							dataType:"json",
						
							success: (res) => {
								if(!res.data.error){
									var rs=JSON.parse(res.data);
									if(!rs.error){
										that.send("video",rs.trueimgurl);
									}
								}
							}
						});
					}
				})
			},
			recordUpload:function(fileurl){
				var that=this;
				console.log(fileurl);
				uni.uploadFile({
					url: that.app.apiHost+"/index.php?m=upload&a=uploadmp4&ajax=1&authcode="+that.app.getAuthCode(), 
					filePath: fileurl,
					fileType:"audio",
					name: 'upimg',
					dataType:"json",
				
					success: (res) => {
						if(!res.data.error){
							var rs=JSON.parse(res.data);
							if(!rs.error){
								that.send("audio",rs.trueimgurl);
							}
						}
					}
				});
			},
			aRecordToggle:function(){
				if(this.aRecordIng){
					console.log("stop")
					audioRecord.stop();
					this.aRecordIng=false;
				}else{
					this.aRecordIng=true;
					
					audioRecord.start(aRecordOptions);
				}
				
				
			}
		}
	}
</script>

<style>
	.add-friend-btn{
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
	.aRecordBox{
		z-index:9999;
		width: 100px;
		height: 100px;
		border-radius: 50%;
		background-color: #fff;
		position: fixed;
		bottom: 100px;
		left:50%;
		margin-left: -50px;
		text-align: center;
		display: block;
	}
	.f36:before{
		font-size: 36px;
	}
</style>
