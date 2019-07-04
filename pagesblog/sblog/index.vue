<template>
	<div>
		<div class="tabs-border mgb-5">
			<div @click="setType('')" :class="{'tabs-border-active':type==''}" class="tabs-border-item">推荐</div>
			<div @click="setType('hot')" :class="{'tabs-border-active':type=='hot'}" class="tabs-border-item">最热</div>
			<div @click="setType('new')" :class="{'tabs-border-active':type=='new'}" class="tabs-border-item">最新</div>
			<div @click="setType('topic')" :class="{'tabs-border-active':type=='topic'}"  class="tabs-border-item">话题</div>
			
		</div>
		
		<div v-if="page=='blog'" style="display: none;" :class="'flex-col'" class="sglist">
			 
			<div v-for="(item,index) in pageData.list" :key="index" @click="goBlog(item.id)" class="sglist-item">
				
				<div class="sglist-title block" v-html="item.content"></div>
				<div class="sglist-imglist">
					 
					<img v-for="(img,imgIndex) in item.imgslist" :key="imgIndex" :src="img+'.100x100.jpg'" class="sglist-imglist-img" />
					
				</div>
				<div class="sglist-ft">
					<div class="sglist-ft-love">{{item.love_num}}</div>
					<div class="sglist-ft-cm">{{item.comment_num}}</div>
					<div class="sglist-ft-view">{{item.view_num}}</div>
				</div> 
			</div>
			<div @click="getList" v-if="per_page>0" class="loadMore">点我加载更多...</div>
		</div>
		<div  v-if="page=='topic'" class="blogList">
			<div @click="goTopic(item.title)" class="blogList-item" v-for="(item,index) in pageData.topicList" :key="index">{{item.title}}</div>
			
		</div>
		<mt-footer tab="sblog"></mt-footer>
	</div>
</template>

<script>
import mtFooter from "../../components/footer.vue"; 
var isFirst=true;
export default({
	components:{
		mtFooter
	},
	data:function(){
		return {
			pageData:{},
			pageLoad:false,
			page:"blog",
			type:"",
			per_page:0
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
	methods:{
		gourl:function(url){
			uni.navigateTo({
				url:url
			})
		},
		setType:function(type){
			this.type=type;
			
			uni.setStorageSync("sblog-index-type",type);
			if(type=='topic'){
				this.page="topic";
				uni.setStorageSync("sblog-index-page","topic");
			}else{
				this.page="blog";
				uni.setStorageSync("sblog-index-page","blog");
				this.getPage();
			}
			
		},
		goBlog:function(id){
			uni.navigateTo({
				url:"../sblog_blog/show?id="+id
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
					that.pageData=res.data;
					that.per_page=res.data.per_page;
					isFirst=false;
				}
			})
		},
		getList:function(){
			var that=this;
			if(!isFirst && that.per_page==0) return false;
			this.app.get({
				url:that.app.apiHost+"/module.php?m=sblog_blog&a=list&ajax=1",
				data:{
					type:that.type,
					per_page:that.per_page
				},
				dataType:"json",
				success:function(res){
					
					that.per_page=res.data.per_page;
					
					if(isFirst){
						isFirst=false;
						that.pageData.list=res.data.list;
					}else{
						var pageData=that.pageData;
						var list=pageData.list;
						for(var i in res.data.list){
							list.push(res.data.list[i]);
						}
						that.pageData.list=list;
					}
					
				}
			})
		}
	}
})
</script>

<style>
	@import "../../common/sblog.css";
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
