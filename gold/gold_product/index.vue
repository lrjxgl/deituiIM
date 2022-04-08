<template>
	<view>
		<div class="flexlist">
			<div class="flexlist-item flex-ai-center" v-for="(item,index) in list" :key="index">
				<image class="flexlist-img" :src="item.imgurl+'.small.jpg'" mode="widthFix" ></image>
				<div class="flex-1">
					<div class="flexlist-title">{{item.title}}</div>
					<div class="flex flex-ai-end">
						<div class="cl2 mgr-10">金币</div>
						<div class="cl-money f22">{{item.gold}}</div>
						<div class="mgl-5 f14 cl2">个</div>
					</div>
				</div>
				<div @click="goDetail(item.id)" class="btn-small">去兑换</div>
			</div>
		</div>
		
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
			uni.stopPullDownRefresh();
		},
		onShareAppMessage:function(){
			
		},
		onShareTimeline:function(){
			
		},
		methods: {
			gourl:function(url){
				uni.navigateTo({
					url:url
				})
			},
			goDetail:function(id){
				uni.navigateTo({
					url:"../gold_product/show?id="+id
				})
			},
			getPage:function() {
				var that=this;
				that.app.get({
					url:that.app.apiHost+"/module.php?m=gold",
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
					url:that.app.apiHost+"/module.php?m=gold",
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
