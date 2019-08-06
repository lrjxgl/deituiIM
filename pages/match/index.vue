<template>
	<view>
		<view>
			<view v-for="(item,index) in groupList" :key="index" class="flexlist-item">
				<img :src="item.imgurl" class="flexlist-img" />
				<view class="flex-1">
					<view class="cl1 mgb-5">{{item.title}}</view>
					<view class="cl2">{{item.description}}</view>
				</view>
				
				<view class="flex-jc-center" >
					<view  @click="goChat(item.groupid)" class="btn-mini">聊聊</view>
					 
				</view>
			</view>
		</view>
		<view>
			
			
			<view v-for="(item,index) in userList" :key="index" class="flexlist-item">
				<img :src="item.user_head+'.100x100.jpg'" class="flexlist-img" />
				<view class="flex-1">
					<view class="cl1 mgb-5">{{item.nickname}}</view>
					<view class="cl2">{{item.description}}</view>
				</view>
				
				<view class="flex-jc-center" >
					<view  @click="goPm(item.userid)" class="btn-mini">聊聊</view>
					 
				</view>
			</view>
		</view>
		<mt-footer tab="match"></mt-footer>
	</view>
</template>

<script>
	export default{
		data:function(){
			return {
				userList:{},
				groupList:{}
			}
		},
		onLoad:function(){
			this.getPage();
		},
		methods:{
			goPm:function(uid){
				uni.navigateTo({
					url:"../index/pm?uuid="+uid
				});
			},
			goChat:function(groupid){
				uni.navigateTo({
					url:"../index/chat?groupid="+groupid
				});
			},
			getPage:function(){
				var that=this;
				that.app.get({
					url:that.app.apiHost+"/module.php?m=im_bored",
					success:function(res){
						that.userList=res.data.userList;
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
			}
		}
	}
</script>

<style>
</style>
