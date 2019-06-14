<template>
	<div>
		<div  v-for="(item,index) in nodes" :key="index">
			<div v-if="item.type=='audio'" @click="playMusic(item.src)"><div class="iconfont f20 icon-video_light"></div></div>
			<div v-if="item.type=='video'">
				<video show-fullscreen-btn="true" controls="true"  class="w2-1"   :src="item.src"></video>
			</div>
			<div v-if="item.type=='img'">
				<image :src="item.src" mode="widthFix" class="w100"></image>
			</div>
			<div v-if="item.type=='file'">
				<div @click="downFile(item.src)" class="iconfont icon-file f20"></div>
			</div>
			<div v-else >
				<rich-text class="flex" :nodes="item.content"></rich-text>
			</div>
			
		</div>
	</div>
</template>

<script>
	import chatClass from "../common/chat.class.js";
	import audioClass from "../common/audio.class.js";
	export default{
		props:{
			content:""
		},
		data:function(){
			return {
				nodes:[]
			}
		},
		created:function(){
			var con=this.content;
			
			var res;
			//匹配音乐
			var patt = new RegExp(/\[([^=]*)=([^\]]*)\]/g,"g");
			res=patt.exec(con);
			console.log(res) 
			if(res){
				con=res[2];
				// #ifdef H5
				con=con.replace(/\.\.\/\.\.\//g,"./");
				// #endif
				// #ifdef APP-PLUS
				con=con.replace(/\.\.\/\.\.\//g,"/");
				// #endif
				// #ifdef MP-WEIXIN
				con=con.replace(/\.\.\/\.\.\//g,"/");
				// #endif
				
				this.nodes=[{
					type:res[1],
					src:con,
					content:""
					
				}]
			}else{
				this.nodes=[{
					type:"text",
					content:chatClass.decodeEmo(this.content)
				}]
			}
			
		},
		methods:{
			playMusic:function(url){
				console.log(url)
				audioClass.play(url);
			},
			downFile:function(url){
				uni.downloadFile({
					url: url, //仅为示例，并非真实的资源
					success: (res) => {
						if (res.statusCode === 200) {
							console.log('下载成功');
						}
					}
				});
			}
		}
	}
</script>

<style>
	.w2-1{
		width: 160px;
		height: 100px;
	}
</style>
