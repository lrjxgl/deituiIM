<template>
	<view>
		<view  v-for="(item,index) in nodes" :key="index">
			<view v-if="item.type=='audio'" @click="playMusic(item.src)"><view class="iconfont f20 icon-video_light"></view></view>
			<view v-if="item.type=='video'">
				<video show-fullscreen-btn="true" controls="true"  class="w2-1"   :src="item.src"></video>
			</view>
			<view v-if="item.type=='img'">
				<image :src="item.src" mode="widthFix" class="w100"></image>
			</view>
			<view v-if="item.type=='file'">
				<view @click="downFile(item.src)" class="iconfont icon-file f20"></view>
			</view>
			<view v-if="item.type=='gift'">
				<view @click="getGift(item.src)" class="flex flex-ai-center">收到神秘礼物&nbsp;<text class="iconfont animated animated-rotateIn slower infinite cl-red icon-present f20"></text></view>
			</view>
			<view v-else >
				<rich-text class="flex" :nodes="item.content"></rich-text>
			</view>
			
		</view>
	</view>
</template>

<script>
	import emo from "../common/emo.js";
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
			 
			if(res){
				con=res[2];
				
				this.nodes=[{
					type:res[1],
					src:con,
					content:""
					
				}]
			}else{
				this.nodes=[{
					type:"text",
					content:emo.decodeEmo(this.content)
				}]
			}
			
		},
		methods:{
			playMusic:function(url){
				 
				audioClass.play(url);
			},
			downFile:function(url){
				uni.downloadFile({
					url: url, 
					success: (res) => {
						if (res.statusCode === 200) {
							//console.log('下载成功');
						}
					}
				});
			},
			getGift:function(giftid){
				this.$emit("call-parent",{type:"gift",giftid:giftid})
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
