<template>
	<div>
		<div class="main-body">
			
			 
			<block v-if="indexList.length>0">
			<div v-for="(item,index) in indexList" :key="index" @click="goItem(item)" class="flex pd-10 bg-fff bdb">
				<image class="wh-40 mgr-10" :src="item.user_head+'.100x100.jpg'"></image>
				<div class="flex-1">
					<div class="cl1 mgb-5" v-if="item.gid!=0">{{item.gid}}</div>
					<div class="cl1 mgb-5" v-else>{{item.nickname}}</div>
					 
					<chat-msg :content="item.content"></chat-msg>
				</div>
				<div class="cl3">{{item.time}}</div>
			</div>
			</block>
			<block v-else>
				<div class="emptyData">还没消息，快去找人聊聊吧</div>
			</block>
			
			
		</div>
		<mt-footer tab="index"></mt-footer>
	</div>
</template>

<script>
	import uu from "../../common/userlist.js";
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
			if(!this.app.isLogin()){
				uni.reLaunch({
					url:"../login/index"
				});
				return false;
			} 
			this.indexList=chatDb.indexList();
			setTimeout(function(){
				this.isload=true;
			},1000)
			
		},
		onShow(){
			if(this.isLoad){
				this.indexList=chatDb.indexList();
			}
			
		},
		methods: {
			playMusic:function(url){
				audioClass.play(url);
			},
			goItem:function(item){
				if(item.gid!=0 || item.gid!=""){
					uni.navigateTo({
						url:"chat?gid="+item.gid
					})
				}else{
					uni.navigateTo({
						url:"pm?uuid="+item.touserid
					})
				}
			}
		}
	}
</script>

<style>
	 
</style>
