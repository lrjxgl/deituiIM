<template>
	<div>
		<div class="main-body">
			<block v-if="indexList.length>0">
			<div v-for="(item,index) in indexList" :key="index" @click="goItem(item)" class="flex pd-10 bg-fff bdb">
				<image class="wh-40 mgr-10" src="../../static/100x100.jpg"></image>
				<div class="flex-1">
					<div class="cl1" v-if="item.gid!=0">{{item.gid}}</div>
					<div class="cl1" v-else>{{item.touid}}</div>
					<div class="cl2 flex" v-html="item.content"></div>
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
	import chatDb from "../../common/chatdb.js"
	export default {
		components:{
			mtFooter
		},
		data() {
			return {
				userList: [],
				groupList:[],
				indexList:[]
			}
		},
		onLoad() {
			this.indexList=chatDb.indexList();
		},
		onShow(){
			this.indexList=chatDb.indexList();
		},
		methods: {
			goItem:function(item){
				if(item.gid!=0 || item.gid!=""){
					uni.navigateTo({
						url:"chat?gid="+item.gid
					})
				}else{
					uni.navigateTo({
						url:"pm?uuid="+item.touid
					})
				}
			}
		}
	}
</script>

<style>
	 
</style>
