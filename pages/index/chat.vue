<template>
	<div>
		<div class="main">
			<div class="flex-1">
				<div id="vueApp" class="list pd-10 bg-fff">
					<template v-if="list.length>0">
						<div v-for="(item,index) in list" :key="index">
							<div class="chatbox" v-if="item.isme">
								<div class="flex-1"></div>
								<div class="chatbox-desc-b mgb-5"><chat-msg :content="item.content"></chat-msg></div>
								<div class="chatbox-nick-b">我</div>
							</div>
							<div class="chatbox" v-else>
								<image src="../../static/100x100.jpg" class="wh-40 mgr-10"></image>
								<div class="flex-1">
									<div class="chatbox-nick-a mgb-5">{{item.uid}}</div>
									<div class="chatbox-desc-a">
										<chat-msg class="flex" :content="item.content"></chat-msg>
									</div>
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
						<div @click="send('audio')" class="flex-1 iconfont icon-voicefill f20"></div>
						<div  @click="send('pic')" class="flex-1 iconfont icon-pic f20 sendPic"></div>
						<div @click="send('pic')" class="flex-1 iconfont icon-camera f20 sendPic"></div>
						<div @click="send('video')" class="flex-1 iconfont icon-recordlight f20"></div>
						<div @click="addEmo('emo')" class="flex-1 iconfont icon-emoji f20"></div>
						<div @click="send('file')" class="flex-1 iconfont icon-file f20 "></div>
					</div>

				</div>
				<div id="emoModal" class="modal-group">
					<div class="modal-mask"></div>
					<div class="modal">
						<div class="modal-body">

						</div>
					</div>
				</div>
			</div>

		</div>
	</div>
</template>

<script>
	var gid;
	var uid =  Date.parse(new Date());
	var touid=""
	var ws;
	import chatClass from "../../common/chat.class.js";
	import chatDb from "../../common/chatdb.js"
	import chatMsg from "../../components/chatmsg.vue"; 
	export default {
		components:{
			chatMsg
		},
		data: function() {
			return {
				"list": [],
				content: "",
				wsConn:false
			}
		},
		onLoad:function(ops){
			gid=ops.gid;
			uni.setNavigationBarTitle({
				title:gid
			})
			var list=chatDb.msgList({
				gid:gid
			});
			this.list=list;
			var that=this;
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
			//历史记录
			
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
			wsInit:function(){
				var that=this;
				
				if(this.wsConn){
					ws.close();
				}
				ws=uni.connectSocket({
					url: chatClass.wsHost,
					complete:function(res){
						
					}
				});
				console.log(ws);
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
					console.log("accept:"+e.data); 
					switch (res.type) {
						case "login":
							break;
						case "say":
							var json = {
								gid:gid,
								uid: res.wsclient_from,
								touid:res.wsclient_to,
								content: res.content,
								time: res.time,
								isme: uid == res.wsclient_from ? true : false
							}
							console.log(json);
							that.addMsg(json);
							chatDb.addGroup(json);
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
			addEmo:function(){

				var emoList=chatClass.emoList();
				var s=emoList[Math.floor(Math.random()*emoList.length)];
				s="\\"+s+" ";
				this.content+=s;
			},
			send: function(type) {
				var that = this;
				var content;
				switch (type) {
					case "pic":
						content="[img=../../static/1.jpg]"
						break;
					case "audio":
						content="[audio=../../static/music.mp3]"
						break;
					case "video":
						content="[video=../../static/movie.mp4]"
						break;
					case "file":
						content="[file=img/emo.gif]";
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
				ws.send({
					data:msg
				});
				that.content="";
				console.log(msg)
			}
		}
	}
</script>

<style>
</style>
