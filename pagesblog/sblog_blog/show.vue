<template>
	<view v-if="pageLoad">
		 
		<view class="main-body pd-5 bg-fff">
			<d-userbox :user="pageData.author"></d-userbox>
			<view class="d-title">{{pageData.data.title}}</view>
			<view class="d-tools">
				<view class="mgr-10 cl2">作者：{{pageData.author.nickname}}</view>
				<view class="cl2">{{pageData.data.timeago}}</view>
			</view>
			<view class="d-content">
				<image class="wmax mgb-5" mode="widthFix" v-for="(item,key) in pageData.imgslist" :key="key" :src="item"></image> 
			</view>
			<rich-text class="d-content" :nodes="pageData.data.content">
				 
			</rich-text>

			<view class="flex flex-center mgb-10">
				<view class="btn-love  mgr-10" @click="loveToggle(pageData.data.id)" v-bind:class="pageData.islove?'btn-love-active':''">
					喜欢
				</view>
				 
				<view class="btn-fav mgr-10" @click="favToggle(pageData.data.id)" v-bind:class="pageData.isfav?'btn-fav-active':''">收藏</view>

			</view>
		</view>
		<view class="comment-hd">跟帖列表</view>
		<!--评论-->
		
		<cmform tablename="mod_sblog_blog" :objectid="pageData.data.id"></cmform>
	</view>
</template>

<script>
	import dUserbox from "../../components/d-userbox.vue";
	import cmform from "../../components/cmform.vue";
	var app = require("../../common/common.js");
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
				pageData:{},
			}
			
		},
		onLoad: function (option) {
			id = option.id;
			this.getPage();
			this.addClick();
			
		},
		onShareAppMessage:function(){
			
		},
		onPullDownRefresh:function(){
			this.refresh();
		} ,
		methods: {
			refresh:function(){
				this.getPage();
				setTimeout(function(){
					uni.stopPullDownRefresh();
				},1000)
			},
			addClick:function(){
				this.app.get({
					url: this.app.apiHost + "/module.php?m=sblog_blog&ajax=1&a=addclick&id=" + id,
					success: function (res) {
					}
				})
			},
			getPage: function () {
				var that = this;
				this.app.get({
					url: app.apiHost + "/module.php?m=sblog_blog&ajax=1&a=show&id=" + id,
					data:{
						authcode:this.app.getAuthCode()
					},
					success: function (res) {
						that.pageLoad = true;
						res.data.data.content=app.html(res.data.data.content);
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
						tablename:"mod_sblog"  
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
						tablename:"mod_sblog"
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

 
