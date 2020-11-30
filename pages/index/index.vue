<template>
	<view>
		<view class="aBox">
			<view @click="match('yuan')" class="aBox-item">
				<image src="../../static/top-video.png" mode="widthFix" class="aBox-img"></image>
				<view class="aBox-title">缘分匹配</view>
				
			</view>
			<!--
			<view @click="match('music')"  class="aBox-item">
				<image src="../../static/top-music.png" mode="widthFix" class="aBox-img"></image>
				<view class="aBox-title">语音速配</view>
				
			</view>
			
			<view class="aBox-item">
				<image src="../../static/top-city.png" mode="widthFix" class="aBox-img"></image>
				<view class="aBox-title">同城广播</view>
				
			</view>
			-->
			<view @click="goChat()" class="aBox-item">
				<image src="../../static/top-blog.png" mode="widthFix" class="aBox-img"></image>
				<view class="aBox-title">聊天广场</view>
				
			</view>
			 
		</view>
		<view class="gTab">
			<view  @click="setType('city')" :class="{'gTab-active':type=='city'}"  class="gTab-item">同城
				<view v-if="type=='city'" class="gTab-dot"></view>
			</view>
			<view   @click="setType('near')"  :class="{'gTab-active':type=='near'}"  class="gTab-item">附近
				<view v-if="type=='near'" class="gTab-dot"></view>
			</view>
			<view   @click="setType('all')"  :class="{'gTab-active':type=='all'}"  class="gTab-item">全国
				<view v-if="type=='all'" class="gTab-dot"></view>
			</view>
			 
		</view>	
		 
		<view>
			<div class="row-box none">
				<div class="cl-red f12">同城广播消息来...</div>
			</div>
			
			<view v-if="userList.length==0" class="emptyData">暂无数据</view>
			<view @click="goUser(item.userid)"  v-for="(item,index) in userList" :key="index" class="flexlist-item">
				<image mode="widthFix" :src="item.user_head+'.100x100.jpg'" class="flexlist-img" ></image>
				<view class="flex-1">
					<view @click="goUser(item.userid)" class="cl1 mgb-5">{{item.nickname}}</view>
					<view class="flex flex-ai-center mgb-5">
						<view class="cl3 f12">{{item.city}}</view>
						<view class="flexlist-mline"></view>
						<view class="cl3 f12">{{item.age}} 岁</view>
						<view class="flexlist-mline"></view>
						<view v-if="item.gender==1" class="cl3 f12">男</view>
						<view v-else class="cl3 f12">女</view>
					</view>
					<view class="cl2">{{item.description}}</view>
				</view>
				
				<view class="flex-jc-center" >
					<view  @click="goPm(item.userid)" class="iconfont icon-like cl-love"></view>
					 
				</view>
			</view>
		</view>
		<div v-if="matchModal">
			<div class="modal-mask" @click="matchClear()"></div>
			<div class="modalMatch flex-col flex-center" >
				<div v-if="matchDoing==true" class="match-doing animated infinite flash">匹配中......</div>
				<div @click="goMatch(matchUser.userid)" v-else>
					<image class="wh-40 mgb-5 bd-radius-50" :src="matchUser.user_head+'.100x100.jpg'"></image>
					<div class="f14 cl2 mgb-10">{{matchUser.nickname}}</div>
					<div class="f12 cl-red">缘分指数 {{matchUser.yuanfen}} 分</div>
				</div>
			</div>
			
		</div>
		<mt-footer tab="index"></mt-footer>	
	</view>
</template>

<script>
	export default{
		data:function(){
			return {
				userList:{},
				groupList:{},
				type:"city",
				per_page:0,
				isFirst:true,
				matchUser:{},
				matchModal:false,
				matchDoing:true,
				matchTimer:0
			}
		},
		onLoad:function(){
			this.getPage();
		 
		},
		methods:{
			setType:function(type){
				this.type=type;
				this.isFirst=true;
				this.per_page=0;
				this.getList();
			},
			goPm:function(uid){
				uni.navigateTo({
					url:"../index/pm?uuid="+uid
				});
			},
			goUser:function(userid){
				uni.navigateTo({
					url:"../../pagesblog/sblog_home/index?userid="+userid
				})
			},
			goChat:function(groupid){
				groupid=1;
				uni.navigateTo({
					url:"../index/chat?groupid="+groupid
				});
			},
			getPage:function(){
				var that=this;
				that.app.get({
					url:that.app.apiHost+"/module.php?m=im_bored",
					data:{
						type:that.type
					},
					success:function(res){
						if(res.error){
							return false;
						}
						that.userList=res.data.userList;
						that.per_page=res.data.per_page;
						that.isFirst=false;
					}
				});
				that.app.get({
					url:that.app.apiHost+"/module.php?m=im_group",
					 
					success:function(res){
						if(res.error){
							return false;
						}
						that.groupList=res.data.groupList;
						
					}
				}); 
			},
			getList:function(){
				var that=this;
				if(that.per_page==0 && !that.isFirst){
					return false;
				}
				that.app.get({
					url:that.app.apiHost+"/module.php?m=im_bored",
					data:{
						type:that.type
					},
					success:function(res){
						if(res.error){
							return false;
						}
						if(that.isFirst){
							that.userList=res.data.userList;
							that.isFirst=false;
						}else{
							for(var i in res.data.userList){
								that.userList.push(res.data.userList[i]);
							}
						}
						that.per_page=res.data.per_page;
					}
				});
				that.app.get({
					url:that.app.apiHost+"/module.php?m=im_group",
					success:function(res){
						that.groupList=res.data.list;
					}
				});
			},
			addFriend:function(touserid){
				var that=this;
				that.app.get({
					url:that.app.apiHost+"/index.php?m=friend&a=add&touserid="+touserid,
					success:function(res){
						uni.showToast({
							title:res.message
						})
					}
				})
			},
			match:function(type){
				//缘分匹配
				var that=this;
				that.matchModal=true;
				that.matchDoing=true;
				that.app.get({
					url:that.app.apiHost+"/module.php?m=im_match",
					data:{
						type:type
					},
					success:function(res){
						if(res.error){
							that.matchTimer=setTimeout(function(){
								that.match();
							},3000)
							
							return false;
						}
						that.matchDoing=false;
						that.matchUser=res.data.user;
						if(that.matchTimer){
							clearTimeout(that.matchTimer);
						}
						console.log(that.matchUser)
					}
				})
				
			},
			matchClear:function(){
				this.matchModal=false;
				if(this.matchTimer){
					clearTimeout(this.matchTimer);
				}
			},
			goMatch:function(userid){
				this.goPm(userid)
				this.matchClear();
			}
		}
	}
</script>

<style>
	@import url("../../common/animate.css");
	.aBox{
		background-color: #fff;
		display: flex;
		flex-direction: row;
		padding-top: 10px;
		padding-bottom: 10px;
		margin-bottom: 1px;
	}
	.aBox-item{
		flex: 1;
		justify-items: center;
		align-items: center;
	}
	.aBox-img{
		width: 50%;
		margin-bottom: 3px; 
	}
	.aBox-title{
		font-size: 12px;
		color: #666;
	}
	.modalMatch{
		width:200px;
		height: 200px;
		margin-left: -100px;
		margin-top: -100px;
		position: fixed;
		top:50%;
		left:50%;
		background-color: #fff;
		z-index: 999;
	}
	.match-doing{
		position: absolute;
		top:80px;
		text-align: center;
		width:100%;
	}
</style>
