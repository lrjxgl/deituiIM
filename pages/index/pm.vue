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
						<div @click="send('audio')" class="flex-1 iconfont icon-voicefill f20"></div>
						<!-- #endif -->
						<div  @click="choiceImg('pic')" class="flex-1 iconfont icon-pic f20 sendPic"></div>
						<!-- #ifndef H5 -->
						<div @click="catchImg('pic')" class="flex-1 iconfont icon-camera f20 sendPic"></div>
						<!-- #endif -->
						<!-- #ifndef H5 -->
						<div @click="send('video')" class="flex-1 iconfont icon-recordlight f20"></div>
						<!-- #endif -->
						<div @click="emoClass='flex-col'" class="flex-1 iconfont icon-emoji f20"></div>
						<div @click="choiceFile('file')" class="flex-1 iconfont icon-file f20 "></div>
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

		</div>
	</div>
</template>

<script>
	var ws;
	var gid = 0;
	var uid = "胡歌";
	var touid = "小仙女";
	import uu from "../../common/userlist.js";
	import chatClass from "../../common/chat.class.js";
	import chatDb from "../../common/chatdb.js";
	import chatMsg from "../../components/chatmsg.vue"; 
	import emo from "../../common/emo.js";
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
				toUser:{},
				emoList:[],
				emoClass:""
			}
		},
		onLoad:function(ops){
			this.getPage(ops.uuid);
			this.emoList=emo.emoList();
		},
		onHide:function(){
			ws.close({
				success:function(res) {
					console.log("hide close success")
				}
			});
		},
		onShow:function() {
			var that=this;
			if(this.wsConn){
				setTimeout(function(){
					that.wsInit();
				},600);
				
			}
		},
		methods: {
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
					 
						that.list=list;
						that.toUser=res.data.touser;
						that.user=res.data.user;
						uni.setNavigationBarTitle({
							title:"与"+res.data.touser.nickname+"聊天..."
						})
						uni.closeSocket({
							success:function(res){
								
							}
						})
						setTimeout(function(){
							that.wsInit();
						},600);
						setTimeout(function(){
							this.wsConn=true;
						},600) 
					}
				})
			},
			
			wsInit:function(){
				var that=this;
				
				ws=uni.connectSocket({
					url: chatClass.wsHost,
					complete:function(res){
						
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
								touserid:that.toUser.userid,
								nickname:uid == res.wsclient_from ?that.user.nickname:that.toUser.nickname,
								user_head:uid == res.wsclient_from ?that.user.user_head:that.toUser.user_head,
								content: res.content,
								time: res.time,
								isme: uid == res.wsclient_from ? true : false
							}
							console.log(json);
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
						content="[audio=../../static/music.mp3]"
						break;
					case "video":
						content="[video=../../static/movie.mp4]"
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
				
				console.log("发送")
				ws.send({
					data:msg
				});
				that.content="";
				console.log(msg)
			},
			
			choiceImg:function(){
				//选择图片发送
				var that=this;
				console.log(that.app.apiHost)
				uni.chooseImage({
					success:function(e){
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
				console.log(that.app.apiHost)
				uni.chooseImage({
					success:function(e){
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
			}
		}
	}
</script>

<style>
</style>
