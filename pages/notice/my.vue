<template>
	<view v-if="pageLoad" class="bg-a">

		<view v-if="rscount==0">
			<view class="emptyData">暂无消息</view>
		</view>
		<view v-else>
			<view class="row-box pdb-5 mgb-5" v-for="(item,index) in list" :key="index">
				<view class="flex pdb-5 mgb-5 border-bottom">
					<view class="btn-small btn-outline-success">{{item.status_name}}</view>
					<view class="flex-1"></view>
					<view class="time cora pdr-10">{{item.timeago}}</view>
				</view>

				<view class=" cor2">
					<rich-text :nodes="item.content"></rich-text>
				</view>

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
				isFirst:true,
				rscount:0
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
			getPage:function() {
				var that=this;
				that.app.get({
					url:that.app.apiHost+"/index.php?m=notice&a=my",
					success:function(res){
						that.pageLoad=true;
						that.list=res.data.data;
						that.per_page=res.data.per_page;
						that.rscount=res.data.rscount;
					}
				})
			},
			getList:function() {
				var that=this;
				if(that.per_page==0 && !that.isFirst){
					return false;
				}
				that.app.get({
					url:that.app.apiHost+"/index.php?m=notice&a=my",
					data:{
						per_page:that.per_page
					},
					success:function(res){						 
						that.per_page=res.data.per_page;
						if(that.isFirst){
							that.list=res.data.data;
							that.isFirst=false;
						}else{
							for(var i in res.data.data){
								that.list.push(res.data.data[i]);
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
