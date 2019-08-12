<template>
	<view>
		<view class="main-body">
			
			<view class="f16 pd-10">定制/技术咨询 QQ:362606856</view>
			 
			<block v-if="indexList.length>0">
			<view v-for="(item,index) in indexList" :key="index" @click="goItem(item)" class="flex pd-10 bg-fff bdb">
				<block v-if="item.gid==0">
					<image class="wh-40 mgr-10 bd-radius-10" :src="item.user_head+'.100x100.jpg'"></image>
					<view class="flex-1">
						 
						<view class="cl1 mgb-5">{{item.nickname}}</view>
						 
						<chat-msg :content="item.content"></chat-msg>
					</view>
				</block>
				<block v-else>
					<image   class="wh-40 mgr-10 bd-radius-10" :src="item.imgurl+'.100x100.jpg'"></image>
					<view class="flex-1">
						 
						<view class="cl1 mgb-5" >{{item.title}}</view>
						 
						<chat-msg :content="item.content"></chat-msg>
					</view>
				</block>
				
				
				
				<view class="cl3">{{item.time}}</view>
			</view>
			</block>
			<block v-else>
				<view class="emptyData">还没消息，快去找人聊聊吧</view>
			</block>
			
			
		</view>
		<mt-footer tab="index"></mt-footer>
	</view>
</template>

<script>
	 
	import mtFooter from "../../components/footer.vue";
	import chatDb from "../../common/chatdb.js";
	 
	import chatMsg from "../../components/chatmsg.vue";
	export default {
		components:{
			mtFooter,
			chatMsg
		},
		data() {
			return {
				userList: [],
				groupList:[],
				indexList:[],
				isLoad:false 
			}
		},
		onLoad() {
			var that=this;
			if(!this.app.isLogin()){
				uni.reLaunch({
					url:"../login/index"
				});
				return false;
			} 
			//this.indexList=chatDb.indexList();
			this.pmList();
			setTimeout(function(){
				that.isLoad=true;
			},1000)
			
		},
		onShow(){
			if(this.isLoad){
				this.pmList();
			}
			
		},
		methods: {
			playMusic:function(url){
				audioClass.play(url);
			},
			goItem:function(item){
				if(item.gid!=0 || item.gid!=""){
					uni.navigateTo({
						url:"chat?groupid="+item.groupid
					})
				}else{
					uni.navigateTo({
						url:"pm?uuid="+item.touserid
					})
				}
			},
			pmList:function(){
				var that=this;
				that.app.get({
					url:that.app.apiHost+"/module.php?m=im_msg_index",
					success:function(res){
						that.indexList=res.data.list;
					}
				})
			}
		}
	}
</script>

<style>
	 
</style>
