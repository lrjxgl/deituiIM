<template>
	<div>
		<div>
			<div v-for="(item,index) in userList" :key="index" class="flexlist-item">
				<img :src="item.user_head+'.100x100.jpg'" class="flexlist-img" />
				<div class="flex-1">
					<div class="cl1 mgb-5">{{item.nickname}}</div>
					<div class="cl2">{{item.description}}</div>
				</div>
				<div class="flex-jc-center" ><div @click="addFriend(item.userid)" class="btn-mini">加好友</div></div>
			</div>
		</div>
		<mt-footer tab="match"></mt-footer>
	</div>
</template>

<script>
	export default{
		data:function(){
			return {
				userList:{}
			}
		},
		onLoad:function(){
			this.getPage();
		},
		methods:{
			getPage:function(){
				var that=this;
				that.app.get({
					url:that.app.apiHost+"/module.php?m=im_bored",
					success:function(res){
						that.userList=res.data.userList;
					}
				})
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
