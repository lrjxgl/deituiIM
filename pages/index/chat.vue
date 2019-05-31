<template>
	<div>
		<div class="main">
			<div class="flex-1">
				<div id="vueApp" class="list pd-10 bg-fff">
					<template v-if="list.length>0">
						<div v-for="(item,index) in list" :key="index">
							<div class="chatbox" v-if="item.isme">
								<div class="flex-1"></div>
								<div class="chatbox-desc-b mgb-5" v-html="item.content"></div>
								<div class="chatbox-nick-b">我</div>
							</div>
							<div class="chatbox" v-else>
								<image src="../../static/100x100.jpg" class="wh-40 mgr-10"></image>
								<div class="flex-1">
									<div class="chatbox-nick-a mgb-5">{{item.uid}}</div>
									<div class="chatbox-desc-a" v-html="item.content"></div>
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
	
	import chatClass from "../../common/chat.class.js";
	import chatDb from "../../common/chatdb.js"
	export default {
		data: function() {
			return {
				"list": [],
				content: ""
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
			uni.connectSocket({
				url: 'wss://wss.deituicms.com:8282'
			});
			uni.onSocketOpen(function(res) {
				var msg = JSON.stringify({
					type: "login",
					k: uid,
					gid: gid,
					content: "login"
				});
				uni.sendSocketMessage({
					data:msg
				});
			});
			uni.onSocketError(function(res) {
				console.log('WebSocket连接打开失败，请检查！');
			});
			uni.onSocketMessage(function(e) {
				var res = JSON.parse(e.data);
				switch (res.type) {
					case "login":
						break;
					case "say":
						var json = {
							uid: res.wsclient_from,
							content: chatClass.decode(res.content),
							time: res.time,
							isme: uid == res.wsclient_from ? true : false,
							gid:gid
						}
						that.addMsg(json);
						//保存记录
						chatDb.add(json);
						setTimeout(function() {
							uni.pageScrollTo({
								scrollTop: 1000000
							});
						}, 100)
						break;
				}
			});
			//历史记录
			
		},
		methods: {
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
				uni.sendSocketMessage({
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
