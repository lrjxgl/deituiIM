<template>
	<view>
		<view class="main">
			<view class="flex-1">
				<view id="vueApp" class="list pd-10 bg-fff">
					<template v-if="list.length>0">
						<view v-for="(item,index) in list" :key="index">
							<view class="chatbox" v-if="item.isme">
								<view class="flex-1"></view>
								<view class="chatbox-desc-b mgb-5"><chat-msg :content="item.content"></chat-msg></view>
								<view class="chatbox-nick-b">我</view>
							</view>
							<view class="chatbox" v-else>
								<image src="../../static/100x100.jpg" class="wh-40 mgr-10"></image>
								<view class="flex-1">
									<view class="chatbox-nick-a mgb-5">{{item.uid}}</view>
									<view class="chatbox-desc-a">
										<chat-msg class="flex" :content="item.content"></chat-msg>
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
				<view class="fixFoot bg-fff pdb-5">
					<view class="input-flex">
						<input class="input-flex-text" v-model="content" type="text">
						<view class="input-flex-btn w60" @click="send('content')">发送</view>
					</view>
					<view class="flex flex-center">
						<!-- #ifndef H5 -->
						<view @click="aRecordClass='flex-col'" class="flex-1 iconfont icon-voicefill f20"></view>
						<!-- #endif -->
						<view  @click="choiceImg('pic')" class="flex-1 iconfont icon-pic f20 sendPic"></view>
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
			</view>

		</view>
	</view>
</template>

<script>
	import chatDb from "../../common/chatdb.js"
	import chatMsg from "../../components/chatmsg.vue"; 
	import emo from "../../common/emo.js";
	var gid;
	var uid =  Date.parse(new Date());
	var touid=""
	var ws;
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
				group:{},
				user:{},
				toUser:{},
				emoList:[],
				emoClass:"",
				aRecordClass:"",
				aRecordIng:false
			}
		},
		onLoad:function(ops){
			var that=this;
			this.emoList=emo.emoList();
			this.getPage(ops.groupid);
			
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
			getPage:function(groupid){
				var that=this;
				
				that.app.get({
					url:that.app.apiHost+"/module.php?m=im_group&a=home&ajax=1&groupid="+groupid,
					success:function(res){
						gid=res.data.ws_gid;
					 
						that.group=res.data.group;
						uni.setNavigationBarTitle({
							title:res.data.group.title
						})
						/*
						var list=chatDb.msgList({
							gid:gid
						});
						*/
						that.list=res.data.list;
						that.wsInit();
						setTimeout(function(){
							that.wsConn=true;
						},600) 
					}
				})
			},
			wsInit:function(){
				var that=this;
				
				if(this.wsConn){
					ws.close();
				}
				ws=uni.connectSocket({
					url: that.app.wsHost,
					complete:function(res){
						
					}
				});
				 
				ws.onOpen(function(res) {
					 
					var msg = JSON.stringify({
						type: "login",
						k: uid,
						gid: gid,
						appGroupId:that.group.groupid,
						content: "login"
					});
					ws.send({
						data:msg
					});
				});
				ws.onError(function(res) {
					 
					
				});
				ws.onMessage(function(e) {
					var res = JSON.parse(e.data);
				 
					switch (res.type) {
						case "login":
							break;
						case "say":
							var json = {
								gid:gid,
								imgurl:that.group.imgurl,
								appGroupId:that.group.groupid,
								appGroupTitle:that.group.title,
								uid: res.wsclient_from,
								touid:res.wsclient_to,
								content: res.content,
								time: res.time,
								isme: uid == res.wsclient_from ? true : false
							}
							 
							that.addMsg(json);
							//chatDb.addGroup(json);
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
				that.saveHost(content);
				that.content="";
				 
			},
			saveHost:function(content){
				var that=this;
				that.app.post({
					url:that.app.apiHost+"/module.php?m=im_group_msg&a=save",
					data:{
						groupid:that.group.groupid,
						content:content
					},
					success:function(res){
						console.log(res)
					}
					
				})
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
