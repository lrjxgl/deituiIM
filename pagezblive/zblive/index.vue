<template>
	<view>
		<view class="gTab mgb-5">
			<view @click="setTab('hot')" :class="{'gTab-active':tab=='hot'}" class="gTab-item">热门
				<view v-if="tab=='hot'" class="gTab-dot"></view>
			</view>
			<view @click="setTab('near')" :class="{'gTab-active':tab=='near'}" class="gTab-item">
				附近
				<view v-if="tab=='near'" class="gTab-dot"></view>
			</view>
			<view @click="setTab('follow')" :class="{'gTab-active':tab=='follow'}" class="gTab-item">
				关注
				<view v-if="tab=='follow'" class="gTab-dot"></view>
			</view>
			<view class="flex-1"></view>
			<!-- #ifdef APP-PLUS -->
			<view @click="goLive" class="iconfont mgr-10 f18 icon-recordlight"></view>
			<!-- #endif --> 
			
		</view>
		<swiper :style="{height:swiperHeight+'px'}"  :indicator-dots="true" :autoplay="true" :interval="3000" :duration="1000">
			<swiper-item v-for="(item,key) in  flashList" :key="key">
				<view class="swiper-item">
					<image @click="gourl(item.link1)" :src="item.imgurl" style="width:100%" mode="widthFix"></image>
				</view>
			</swiper-item>
		 
		</swiper> 
		<view class="row-box">
			<view v-if="!list || Object.keys(list).length==0" class="emptyData">暂无直播</view>
			<view class="zbList">
				<view @click="goDetail(item.id)" v-for="(item,index) in list" :key="index" class="zbBox">
					<image class="zbBox-img" mode="widthFix" :src="item.imgurl+'.100x100.jpg'"></image>
					<view class="zbBox-ft">
						<view class="zbBox-nick">{{item.nickname}}</view>
						<view class="flex">
							 
							<view class="cl3 f12">{{item.city}}</view>
							<view class="flex-1"></view>
							<view class="cl3 f12">{{item.view_num}}</view>
						</view>
					</view>
					
				</view>
				 
			</view>
		</view>
		<mt-footer tab="zblive"></mt-footer>
	</view>
</template>

<script>
	import mtFooter from "../../components/footer.vue";
	export default{
		components:{
			mtFooter
		},
		data:function(){
			return {
				tab:"hot",
				list:[],
				isFirst:true,
				per_page:0,
				flashList:[],
				swiperHeight:220
			}
		},
		onLoad:function(){
			const res = uni.getSystemInfoSync();
			var winWidth=res.windowWidth;
			this.swiperHeight=winWidth/3;
			this.getPage();
		},
		onReachBottom:function(){
			this.getList();
		},
		onPullDownRefresh:function(){
			this.getPage();
			uni.stopPullDownRefresh();
		},
		methods:{
			gourl:function(url){
				uni.navigateTo({
					url:url
				})
			},
			setTab:function(t){
				this.tab=t;
				this.isFirst=true;
				this.per_page=0;
				this.getList();
			},
			goLive:function(){
				uni.navigateTo({
					url:"live?room_id=19"
				})
			},
			goDetail:function(id){
				uni.navigateTo({
					url:"show?id="+id
				})
			},
			getPage:function(){
				var that=this;
				that.app.get({
					url:that.app.apiHost+"/module.php?m=zblive&type=doing",
					success:function(res){
						if(res.error){
							return false;
						}
						that.flashList=res.data.flashList;
						that.per_page=res.data.per_page;
						that.list=res.data.list;
					}
				})
			},
			getList:function(){
				var that=this;
				if(that.per_page==0 && !that.isFirst){
					return false;
				}
				that.app.get({
					url:that.app.apiHost+"/module.php?m=zblive&type=doing",
					data:{
						tab:this.tab,
						per_page:this.per_page
					},
					success:function(res){
						if(res.error){
							return false;
						}
						if(that.isFirst){
							that.list=res.data.list;
							that.isFirst=false;
						}else{
							for(var i in res.data.list){
								that.list.push(res.data.list[i]);
							}
						}
						that.per_page=res.data.per_page;
					}
				})
			}
		}
	}
</script>

<style>
	.row-box{
		padding: 5px;
	}
	.wone{
		width: 100%;
	}
	.zbList{
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		margin-right: -1%;
	}
	.zbBox{
		width:49%;
		margin-right: 1%;
		margin-bottom: 5px;
		position: relative;
	}
	.zbBox-img{
		width: 100%;
	}
	.zbBox-nick{
		color: #fff;
		font-size: 14px;
		margin-bottom: 3px; 
		width: 100%;
		overflow: hidden;
	}
	.zbBox-bt{
		background-color: #9c27b0;
		color: #fff;
		padding: 1px 3px;
		font-size: 20rpx;
		margin-right: 5px;
	}
	.zbBox-ft{
		position: absolute;
		bottom:5px;
		left: 5px;
		right: 5px;
	}
	.zbBox-ft-c{
		color: #eee;
		font-size: 12px;
	}
</style>
