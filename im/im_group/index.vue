<template>
	<view>
		<view v-for="(item,index) in list" :key="index" class="flexlist-item">
			<image class="wh-60 mgr-10 bd-radius-50" @click="goChat(item.groupid)" :src="item.imgurl+'.100x100.jpg'"></image>
			<view class="flex-1">
				<view  @click="goChat(item.groupid)" class="flexlist-title">{{item.title}}</view>
				<view class="flex mgb-5">
					<view class="cl2 mgr-5 f14">
						成员 
					</view>
					<view class="cl-num f14">
						{{item.user_num}}
					</view>
				</view>
				<view class="flexlist-desc">{{item.description}}</view>
			</view>
		</view>
	</view>
</template>

<script>
	
	export default{
		data:function(){
			return {
				pageLoad:false,
				list:[],
				per_page:0,
				isFirst:true
			}
		},
		onLoad:function(){
			this.getPage();
		},
		onReachBottom:function(){
			this.getList();
		},
		onPullDownRefresh:function(){
			this.getPage();
		},
		onShareAppMessage:function(){
			
		},
		methods: {
			goChat:function(groupid){
				 
				uni.navigateTo({
					url:"../../im/im_group/chat?groupid="+groupid
				});
			},
			getPage:function() {
				var that=this;
				that.app.get({
					url:that.app.apiHost+"/module.php?m=im_group",
					success:function(res){
						that.pageLoad=true;
						that.list=res.data.list;
						that.per_page=res.data.per_page;
					}
				})
			},
			getList:function() {
				var that=this;
				if(that.per_page==0 && !that.isFirst){
					return false;
				}
				that.app.get({
					url:that.app.apiHost+"/module.php?m=im_group",
					data:{
						per_page:that.per_page
					},
					success:function(res){						 
						that.per_page=res.data.per_page;
						if(that.isFirst){
							that.list=res.data.list;
							that.isFirst=false;
						}else{
							for(var i in res.data.list){
								that.list.push(res.data.list[i]);
							}							
						}
						
					}
				})
			}
		},
	}
</script>

<style>
</style>
