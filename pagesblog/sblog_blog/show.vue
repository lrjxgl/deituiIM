<template>
	<view v-if="pageLoad">
		 
		<view class="main-body pd-5 mgb-5 bg-fff">
			<d-userbox :user="pageData.author"></d-userbox>
			<view class="d-title">{{pageData.data.title}}</view>
			<view class="d-tools">
				<view class="mgr-10 cl2">作者：{{pageData.author.nickname}}</view>
				<view class="cl2">{{pageData.data.timeago}}</view>
			</view>
			<rich-text class="d-content" :nodes="pageData.data.content"></rich-text>
			
			<view class="row-box">
				<video class="video" v-if="pageData.data.mp4url!=''" :src="pageData.data.mp4url"></video>
				<view v-else class="flex-center" >
					
				
				<image @click="showPic(pageData.imgslist,key)" mode="widthFix" @load="loadImg(item)"  class="wmax mgb-5" v-for="(item,key) in pageData.imgslist" :key="key" :src="item+'.small.jpg'"></image> 
				</view>
			</view>
			
			<view class="flex flex-center mgb-10">
				<view class="btn-love  mgr-10" @click="loveToggle(pageData.data.id)" v-bind:class="pageData.islove?'btn-love-active':''">
					喜欢
				</view>
				 
				<view class="btn-fav mgr-10" @click="favToggle(pageData.data.id)" v-bind:class="pageData.isfav?'btn-fav-active':''">收藏</view>

			</view>
		</view>
		
		<!--评论-->
		
		<cmform tablename="mod_sblog_blog" :objectid="pageData.data.id"></cmform>
	</view>
</template>

<script>
	import dUserbox from "../../components/d-userbox.vue";
	import cmform from "../../components/cmform.vue";
	 
	var id;
	export default {
		components: {
			dUserbox,
			cmform
		},
		data:function(){
			return {
				pageLoad:false, 
				pageHide:false,
				pageData:{}
				 
			}
			
		},
		onLoad: function (option) {
			id = option.id;
			this.getPage();
			 
			
		},
		onShareAppMessage:function(){
			
		},
		onShareTimeline:function(){
			
		},
		onPullDownRefresh:function(){
			this.refresh();
		} ,
		methods: {
			showPic:function(imgs,index){
				uni.previewImage({
					urls:imgs,
					current:index,
					indicator:"default"
				})
			},
			loadImg:function(e,t){
				console.log(e,t)
			},
			refresh:function(){
				this.getPage();
				setTimeout(function(){
					uni.stopPullDownRefresh();
				},1000)
			},
			 
			getPage: function () {
				var that = this;
				this.app.get({
					url: that.app.apiHost + "/module.php?m=sblog_blog&ajax=1&a=show&id=" + id,
					 
					success: function (res) {
						that.pageLoad = true;
						 
						that.pageData = res.data;
						 
					}
				})
			},
			favToggle:function(id){
				var that=this;
				that.app.get({
					url:that.app.apiHost+"?m=fav&a=toggle&ajax=1",
					data:{
						objectid:id,
						tablename:"mod_sblog_blog"  
					},
					success:function(res){
						if(res.data=='delete'){
							that.pageData.isfav=false;
						}else{
							that.pageData.isfav=true;
						}
						 
					}
				})
			},
			loveToggle:function(id){
				var that=this;
				that.app.get({
					url:that.app.apiHost+"?m=love&a=toggle&ajax=1",
					data:{
						objectid:id,
						tablename:"mod_sblog_blog"
					},
					success:function(res){
		 
						if(res.data=='delete'){
							that.pageData.islove=false;
						}else{
							that.pageData.islove=true;
						}
						
					}
				})
			}
			
		},
	}
</script>
<style>
	.video{
		width:100%;
		margin-bottom: 10px;
	}
	.wmax{
		width: 100%;
		height: auto;
	}
</style>

 
