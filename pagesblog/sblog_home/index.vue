<template>
	<div class="main-body" v-if="pageLoad">
		<friend-apply :touserid="user.userid"></friend-apply>
		<div class="uBox">
			<div class="flex flex-center">
				<img class="uBox-head" :src="user.user_head+'.100x100.jpg'"> 
			</div>
			<div class="flex flex-center">
				<div class="uBox-nick">{{user.nickname}}</div>
			</div>
			<view class="flex mgb-10 flex-center">
				<view class="mgr-5 cl-white">粉丝</view>
				<text class="mgr-10  cl-white">{{user.followed_num}}</text> 
				<view class="mgr-5  cl-white">关注</view>
				<text class="cl-white">{{user.follow_num}}</text>
				<view class="btn-pm  cl-white" @click="goPm(user.userid)">聊聊</view>
			</view>
			<view v-if="user.description==''" class="uBox-desc">该用户一句话也没留下</view>
			<view v-else class="uBox-desc">{{user.description}}</view>
		</div>
		<div class="emptyData" v-if="!list || list.length==0">暂无数据</div>
		<div v-for="(item,index) in list" :key="index" @click="goBlog(item.id)" class="sglist-item">
			
			<div class="sglist-title flex" v-html="item.content"></div>
			<div class="sglist-imglist">
				 
				<img v-for="(img,imgIndex) in item.imgslist" :key="imgIndex" :src="img+'.100x100.jpg'" class="sglist-imglist-img" />
				
			</div>
			<div class="sglist-ft">
				<div class="sglist-ft-love">{{item.love_num}}</div>
				<div class="sglist-ft-cm">{{item.comment_num}}</div>
				<div class="sglist-ft-view">{{item.view_num}}</div>
			</div> 
		</div>
	</div>
</template>

<script>
	var userid=0;
	import dUserbox from "../../components/d-userbox.vue";
	import friendApply from "../../components/friend-apply.vue";
	export default{
		components:{
			dUserbox,
			friendApply
		}, 
		data:function(){
			return {
				list:[],
				pageLoad:false,
				isFirst:true,
				per_page:0,
				user:{}
			}
		},
		onLoad:function(ops){
			userid=ops.userid;
			this.getPage();
		},
		onReachBottom:function(){
			this.getList();
		},
		onShareAppMessage:function(){
			
		},
		methods:{
			goPm:function(userid){
				uni.navigateTo({
					url:"../../pages/index/pm?uuid="+userid
				})
				 
			}, 
			goBlog:function(id){
				uni.navigateTo({
					url:"../sblog_blog/show?id="+id
				})
				 
			},
			getPage:function(){
				var that=this;
				that.app.get({
					url:that.app.apiHost+"/module.php?m=sblog_home&a=api&ajax=1",
					data:{
						userid:userid
					},
					dataType:"json",
					success:function(res){
						that.pageLoad=true;
						that.list=res.data.list;
						that.user=res.data.user;
						that.per_page=res.data.per_page;
						that.isFirst=false;
						that.pageLoad=true;
					}
				})
			},
			getList:function(){
				var that=this;
				if(that.per_page==0 && !that.isFirst){
					return false;
				}
				that.app.get({
					url:that.app.apiHost+"/module.php?m=sblog_home&a=api&ajax=1",
					data:{
						userid:userid,
						per_page:this.per_page
					},
					dataType:"json",
					success:function(res){
						that.per_page=res.data.per_page;
						that.pageLoad=true;
						for(var i in res.data.list){
							that.list.push(res.data.list[i]);
						}
						
						that.user=res.data.user;
					}
				})
			},
			followToggle:function(userid){
				var that=this;
				that.app.get({
					url: that.app.apiHost+"/index.php?m=follow&a=Toggle&ajax=1",
					dataType: "json",
					data: {
						t_userid: userid
					},
					success: function(res) {
						if(res.error){
							uni.showToast({
								title:res.message
							})
							return false;
						}
						var user=that.user;
						user.isfollow=res.follow;
						that.user=user;
					}
				});
			}
		}
	}
</script>

<style>
	.uBox{
		position: relative;
		width: 100%;
		height: 200px;
		background-color: #009688;
		
	}
	.uBox-follow{
		border-radius: 5px;
		border: 1px solid #fff;
		color: #fff;
		padding: 6px 10px;
		width:60px;
		font-size: 14px;
		text-align: center;
		position: absolute;
		right:10px;
		top:10px;
	}
	.uBox-nick{
		color: #fff;
		font-size: 14px;
		margin-bottom: 20px;
	}
	.uBox-head{
		width:50px;
		height: 50px;
		border-radius: 5px;
		margin-top: 10px;
		margin-bottom: 10px;
	}
	.uBox-desc{
		position: absolute;
		bottom:10px;
		right: 0;
		left:0;
		text-align: right;
		padding-left: 10px;
		 
		padding-right: 10px;
		color: #eee;
		font-size: 14px;
	}
	.btn-pm{
		padding:3px 5px;
		line-height: 1;
		border: 1px solid #fff;
		font-size: 12px;
		color: #fff;
		border-radius: 5px;
		margin-left: 20px;
	}
</style>
