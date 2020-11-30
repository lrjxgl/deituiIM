<template>
	<div>
		<view>
			<div class="ftop">
				
				
							
			</div>
			<live-pusher id='livePusher' class="livePusher" ref="livePusher" :url="vurl"
			 :mode="vmode" :muted="false" :enable-camera="true" :auto-focus="true" :beauty="vbeauty" :whiteness="whiteness" aspect="9:16" postition="absolute"
			 @statechange="statechange" @netstatus="netstatus" @error="error"></live-pusher>
			
			<div class="ft-row"></div>
			<div class="ft" >
				<div class="zb-btn" @click="switchCamera"><text class="cl2">切换</text></div>
				 
				<div class="zb-btn" @longpress="stop()" @click="toggleVideo()">
					<text class="cl-red" v-if="liveStatus==0">开始直播</text>
					<text class="cl-red" v-if="liveStatus==1">正在直播</text>
					<text class="cl-red" v-if="liveStatus==2">直播暂停</text>
				</div>
				<div class="zb-btn" @click="toggleConfig" ><text class="cl2">直播设置</text></div>
				 
			</div>
			<div v-if="vconfig" class="modal-group">
				<div class="modal-mask"></div>
				<div class="modal-config">
					
					<div class="flex flex-ai-center">
							<div>清晰度</div>
							<div class="flex-1">
								<slider @change="changeSD" :value="vmode" min="0" max="2"   activeColor="#FFCC33" backgroundColor="#000000" block-color="#8A6DE9" block-size="20" />
							</div>
							<div>{{vmode}}</div>
					</div>
					<div class="flex flex-ai-center">
						<div>美白</div>
						<div class="flex-1">
							<slider @change="changemb" :value="vwhiteness" min="0" max="9" show-value="true"  activeColor="#FFCC33" backgroundColor="#000000" block-color="#8A6DE9" block-size="20" />							
						</div>
					</div>
					<div class="flex flex-ai-center">
						<div>美颜</div> 
						<div class="flex-1">
							<slider @change="changemy" :value="vbeauty" min="0" max="9" show-value="true"  activeColor="#FFCC33" backgroundColor="#000000" block-color="#8A6DE9" block-size="20" />							
						</div>
					</div>
					<div>
						<text class="text-center cl2">直播开始前设置才会生效</text>
					</div>
					
				</div>
			</div> 
		</view>
	</div>
</template>

<script>
	var that;
	import $app from "../../common/common.js";
	export default {
		data: {
			fil: true,
			vurl:"rtmp://rtmp.zblive.deitui.com/deitui/zblive4?auth_key=1578397838-0-0-6039a86253565b38caa7437cafb84dff",
			liveStatus:0,
			vmode:"SD",
			vbeauty:0,
			vwhiteness:0,
			vconfig:false,
			room_id:4
		},
		onLoad(ops) {
			that=this; 
			//this.context = uni.createLivePusherContext("livePusher", this);
			this.room_id=ops.room_id;
			console.log("live.vue");
			that.getPage();
		},
		methods: {
			getPage:function(){
				var that=this;
				console.log(this.vurl)
				 
				$app.get({
					url:$app.apiHost+"/module.php?m=zblive&a=GetRtmp&ajax=1&id="+this.room_id,
					success:function(res){
						console.log(res);
						if(res.error){
							uni.showToast({
								title:res.message
							})
							return false;
						}
						that.vurl=res.data.rtmp;  
						that.pageLoad=true; 
						that.context = uni.createLivePusherContext("livePusher", that);
					}  
				})
				
			},
			statechange(e) {
				console.log("statechange:" + JSON.stringify(e));
			},
			netstatus(e) {
				console.log("netstatus:" + JSON.stringify(e));
			},
			error(e) {
				console.log("error:" + JSON.stringify(e));
			},
			toggleConfig:function(){
				if(this.vconfig){
					this.vconfig=false;
				}else{
					this.vconfig=true;
				}
			},
			changemb:function(e){
				var v=e.detail.value;
				this.vwhiteness=v;
			},
			changemy:function(e){
				var v=e.detail.value;
				this.vbeauty=v;
			},
			changeSD:function(e){
				var v=e.detail.value;
				switch(v){
					case 1:
						this.vmode="HD"
						break;
					case 2:
						this.vmode="FHD"
						break;
					default:
						this.vmode="SD"
						break;
				}
				
			},
			toggleVideo:function(){
				if(this.liveStatus==0 ){
					this.start();
				}else if(this.liveStatus==1){
					this.pause();
				}else if(this.liveStatus==2){
					this.resume();
				}
			},
			start: function() {
				this.context.start({
					success: (a) => {
						that.liveStatus=1;
						console.log("livePusher.start:" + JSON.stringify(a));
					}
				});
			},
			close: function() {
				this.context.close({
					success: (a) => {
						that.liveStatus=0;
						console.log("livePusher.close:" + JSON.stringify(a));
					}
				});
			},
			snapshot: function() {
				this.context.snapshot({
					success: (e) => {
						console.log(JSON.stringify(e));
					}
				});
			},
			resume: function() {
				this.context.resume({
					success: (a) => {
						that.liveStatus=1;
					}
				});
			},
			pause: function() {
				this.context.pause({
					success: (a) => {
						that.liveStatus=2;
					}
				});
			},
			stop: function() {
				this.context.stop({
					success: (a) => {
						that.liveStatus=0;
						 
					}
				});
			},
			switchCamera: function() {
				this.context.switchCamera({
					success: (a) => {
						console.log("livePusher.switchCamera:" + JSON.stringify(a));
					}
				});
			},
			startPreview: function() {
				this.context.startPreview({
					success: (a) => {
						console.log("livePusher.startPreview:" + JSON.stringify(a));
					}
				});
			},
			stopPreview: function() {
				this.context.stopPreview({
					success: (a) => {
						console.log("livePusher.stopPreview:" + JSON.stringify(a));
					}
				});
			}
		}
	}
</script>

<style>
.ftop{
	position: fixed;
	top:0px;
	left: 0;
	right: 0;
	flex-direction: row;
	justify-content: space-between;
	padding: 5px;
}
.ft-row{
	height: 50px;
}
.ft{
	position: fixed;
	bottom:0px;
	left: 0;
	right: 0;
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	padding: 5px;
}
.zb-btn{
	border-radius: 20px;
	padding: 5px 10px;
	border-color: #f30;
	border-width: 1px;
	border-style: solid;
	color: #f30;
}
.modal-config{
	position: fixed;
	bottom:60px;
	left: 0;
	right: 0;
	padding: 10px;
}
</style>
