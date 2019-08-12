<template>
	<view>
		<view id="pusher" style="width:100%;height:300px;background-color:#000000;margin:auto"></view>
		<button @click="startPusher()">开始</button>
		<button @click="snapshotPusher()">快照</button>
	</view>
</template>

<script>
	var pusher;
	export default{
		onLoad:function(){
			const currentWebview = this.$mp.page.$getAppWebview()  
			pusher = plus.video.createLivePusher("", {    			   
				top:'100px',    
				left:'0px',    
				width: '100%',    
				height: '300px',    
				position: 'static'    
			});
			setTimeout(function(){
					pusher.preview();
			},1000)
			
			currentWebview.append(pusher);  
		},
		methods:{
			startPusher:function(){
				pusher.start();
			},
			snapshotPusher:function() {
				pusher.snapshot(function(e){
					plus.nativeUI.alert("snapshot success: "+JSON.stringify(e));
				}, function(e) {
					plus.nativeUI.alert("snapshot error: "+JSON.stringify(e));
				});
			}
		}
	}
	
</script>

<style>
</style>
