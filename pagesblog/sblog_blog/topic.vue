<template>
	<view>
		<view class="sglist">
			 
			<view v-for="(item,index) in pageData.list" :key="index" @click="goBlog(item.id)" class="sglist-item">
				
				<view class="sglist-title block" v-html="item.parsecontent"></view>
				<view class="sglist-imglist">
					 
					<img v-for="(img,imgIndex) in item.imgslist" :key="imgIndex" :src="img+'.100x100.jpg'" class="sglist-imglist-img" />
					
				</view>
				<view class="sglist-ft">
					<view class="sglist-ft-love">{{item.love_num}}</view>
					<view class="sglist-ft-cm">{{item.comment_num}}</view>
					<view class="sglist-ft-view">{{item.view_num}}</view>
				</view> 
			</view>
			
		</view>
	</view>
</template>

<script>
	var title;
	export default({
		data:function(){
			return {
				pageData:{},
				pageLoad:false,
				type:""
			}
		},
		onLoad:function(ops){
			title=ops.title;
			this.getPage();
		},
		methods:{
			setType:function(type){
				this.type=type;
				this.getPage();
			},
			goBlog:function(id){
				uni.navigateTo({
					url:"../sblog_blog/show?id="+id
				})
			},
			getPage:function(){
				var that=this;
				this.app.get({
					url:this.app.apiHost+"/module.php?m=sblog_blog&a=topic&ajax=1",
					
					data:{
						title:title
					},
					dataType:"json",
					success:function(res){
						that.pageLoad=true;
						that.pageData=res.data;
					}
				})
			}
		}
	})
</script>

<style>
</style>
