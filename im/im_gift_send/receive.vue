<template>
	<view>
		<div @click="goHome(item.userid)" class="row-box  mgb-5 flex" v-for="(item,index) in list" :key="index">
			<div>
				<image class="wh-40 bd-radius-50 mgr-5" mode="widthFix" :src="item.user.user_head+'.100x100.jpg'" ></image>
				<div class="f12 cl2">{{item.user.nickname}}</div>
			</div>
			<div class="flex-1">送了你一个{{item.gift.title}}</div>
			<div class="mgl-5">
				<image class="wh-60" mode="widthFix" :src="item.gift.imgurl+'.100x100.jpg'" ></image>
			</div>
		</div>
		<div class="loadMore" v-if="per_page>0" @click="getList()">加载更多</div>
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
			goHome:function(userid){
				uni.navigateTo({
					url:"../../pagesblog/sblog_home/index?userid="+userid
				})
			},
			getPage:function() {
				var that=this;
				that.app.get({
					url:that.app.apiHost+"/module.php?m=im_gift_send&a=receive",
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
					url:that.app.apiHost+"/module.php?m=im_gift_send&a=receive",
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
