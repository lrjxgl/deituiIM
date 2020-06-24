<template>
	<view v-if="pageLoad">
		<!--添加好友-->
		<friend-apply :touserid="pageData.author.userid"></friend-apply>
		<view class="main-body pd-5 mgb-5 bg-fff">
			<d-userbox :user="pageData.author"></d-userbox>
			 
			<rich-text class="d-content" :nodes="pageData.data.content"></rich-text>
			
			<view class="d-content">
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
	import friendApply from "../../components/friend-apply.vue";
	 
	var id;
	export default {
		components: {
			dUserbox,
			cmform,
			friendApply
		},
		data:function(){
			return {
				pageLoad:false, 
				pageHide:false,
				pageData:{},
				isFriend:0
				 
			}
			
		},
		onLoad: function (option) {
			id = option.id;
			this.getPage();
			 
			
		},
		onShareAppMessage:function(){
			
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
						res.data.data.content=that.app.html(res.data.data.content);
						that.pageData = res.data;
						 
					}
				})
			},
			favToggle:function(id){
				var that=this;
				uni.request({
					url:that.app.apiHost+"?fromapp=wxapp&m=fav&a=toggle&ajax=1",
					data:{
						objectid:id,
						authcode:that.app.getAuthCode(),
						tablename:"mod_sblog_blog"  
					},
					success:function(res){
						if(res.data.error==1000){
							that.app.goLogin();
							return false;
						}
						if(res.data.data=='delete'){
							that.pageData.isfav=false;
						}else{
							that.pageData.isfav=true;
						}
						 
					}
				})
			},
			loveToggle:function(id){
				var that=this;
				uni.request({
					url:that.app.apiHost+"?m=love&a=toggle&ajax=1",
					data:{
						
						fromapp:that.app.fromapp(),
						objectid:id,
						authcode:that.app.getAuthCode(),
						tablename:"mod_sblog_blog"
					},
					success:function(res){
						if(res.data.error==1000){
							that.app.goLogin();
							return false;
						}
						if(res.data.data=='delete'){
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
	
</style>

 
