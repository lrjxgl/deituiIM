<template>
	<view>
		<view class="gTab">
			<view  @click="setType('city')" :class="{'gTab-active':type=='city'}"  class="gTab-item">同城
				<view v-if="type=='city'" class="gTab-dot"></view>
			</view>
			<view  @click="setType('all')" :class="{'gTab-active':type=='all'}"  class="gTab-item">
				全部
				<view v-if="type=='all'" class="gTab-dot"></view>
			</view>
			<view  @click="setType('follow')" :class="{'gTab-active':type=='follow'}"  class="gTab-item">
				关注
				<view v-if="type=='follow'" class="gTab-dot"></view>
			</view>
			 
		</view>	
		 
		 
		<view v-if="page=='blog'" style="display: none;" :class="'flex-col'" class="sglist">
			<view class="emptyData" v-if="rscount==0" >暂无帖子</view> 
			<view v-for="(item,index) in list" :key="index" class="sglist-item">
				<div @click="goUser(item.userid)" class="flex mgb-5">
					<img  :src="item.user.user_head+'.100x100.jpg'" class="wh-40 bd-radius-50" />
					<div class="flex-1 mgl-5">
						<div class="f14 fw-600 mgb-5">{{item.user.nickname}}</div>
						<div class="flex">
							<div class="f12 cl3">{{item.timeago}}</div>
							
						</div>
					</div>
					 
				</div>
				<view  @click="goBlog(item.id)">
					<view class="sglist-title block" v-html="item.content"></view>
					<list-image :imgslist="item.imgslist"></list-image>
					 
					<view class="sglist-ft">
						<view class="sglist-ft-love">{{item.love_num}}</view>
						<view class="sglist-ft-cm">{{item.comment_num}}</view>
						<view class="sglist-ft-view">{{item.view_num}}</view>
					</view> 
				</view>
			</view>
			<view @click="getList" v-if="per_page>0" class="loadMore">点我加载更多...</view>
		</view>
		 
		<navigator :url="'../sblog_blog/add'" class="fixedAdd">发布</navigator>
		<mt-footer tab="sblog"></mt-footer>
	</view>
</template>

<script>
import mtFooter from "../../components/footer.vue";
import listImage from "../../components/list-image.vue"; 
var isFirst=true;
export default({
	components:{
		mtFooter,
		listImage
	},
	data:function(){
		return {
			list:[],
			pageLoad:false,
			page:"blog",
			type:"city",
			per_page:0,
			tab:"city",
			isFirst:true,
			rscount:0
		}
	},
	onLoad:function(){
		var stype=uni.getStorageSync("sblog-index-type");
		if(stype){
			this.type=stype;
		}
		var spage=uni.getStorageSync("sblog-index-page");
		if(spage){
			this.page=spage;
		}
		this.getPage();
	},
	onReachBottom:function(){
	 
		if(this.page=='blog'){
			this.getList();
		}
		
	},
	methods:{
		gourl:function(url){
			uni.navigateTo({
				url:url
			})
		},
		setType:function(type){
			this.type=type;
			this.per_page=0;
			this.isFirst=true;
			this.getList();
			
		},
		goBlog:function(id){
			uni.navigateTo({
				url:"../sblog_blog/show?id="+id
			})
		},
		goUser:function(userid){
			uni.navigateTo({
				url:"../sblog_home/index?userid="+userid
			})
		},
		goTopic:function(title){
			uni.navigateTo({
				url:"../sblog_blog/topic?title="+encodeURI(title)
			})
		},
		getPage:function(){
			var that=this;
			this.app.get({
				url:that.app.apiHost+"/module.php?m=sblog_blog&a=list&ajax=1",
				data:{
					type:that.type
				},
				dataType:"json",
				success:function(res){
					that.pageLoad=true;
					that.list=res.data.list;
					that.per_page=res.data.per_page;
					that.isFirst=false;
					that.rscount=res.data.rscount;
				}
			})
		},
		getList:function(){
			var that=this;
			if(!that.isFirst && that.per_page==0) return false;
			this.app.get({
				url:that.app.apiHost+"/module.php?m=sblog_blog&a=list&ajax=1",
				data:{
					type:that.type,
					per_page:that.per_page
				},
				dataType:"json",
				success:function(res){
					
					that.per_page=res.data.per_page;
					that.rscount=res.data.rscount;
					if(that.isFirst){
						that.isFirst=false;
						that.list=res.data.list;
					}else{
						 
						for(var i in res.data.list){
							that.list.push(res.data.list[i]);
						}
						 
					}
					
				}
			})
		}
	}
})
</script>

<style>
	@import "../../common/sblog.css";
	.aqBox{
		width:33.3%;
		padding: 5px; 
		box-sizing: border-box;
	}
	.aqBox-img{
		width:100%;
	}
	.aq-img{
		width: 20px;
		height: 20px;
		margin-right: 3px;
	}
	.swiper-container {
		width: 100%;
		padding-bottom: 62.5%;
		height: 0;
		overflow: hidden;
	}
	
	.swiper-wrapper {
		width: 100%;
		flex-direction: row;
	}
	
	.mtt10 {
		margin-top: -10px;
	}
	
	.adBox {
		display: flex;
		flex-direction: row;
	
	}
	
	.adBox-item {
		flex: 1;
		margin: 5px;
	}
	
	.adBox-img {
		width: 100%;
		border-radius: 10px;
	}
	
	.m-navPic-img {
		border-radius: 50%;
	}
	
</style>
