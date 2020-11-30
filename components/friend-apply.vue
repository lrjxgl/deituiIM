<template>
	<view>
	 
		<view  @click="friendBoxClass='flex-col'" class="add-friend-btn iconfont icon-friend_add_light"></view> 
		<view class="modal-group" :class="friendBoxClass">
			<view class="modal-mask" @click="friendBoxClass=''"></view>
			<view class="modal" style="margin-top: -50px;">
				<view class="modal-header">
					<view class="modal-title">申请成为好友</view>
					<view class="modal-close icon-close" @click="friendBoxClass=''"></view>
				</view>
				<view class="input-flex">
					 
					<input type="text" v-model="applyContent" placeholder="申请好友说明" />
				</view>
				<view class="btn-row-submit" @click="addFriend()">申请好友</view>
			</view>
		</view>
	</view>
</template>

<script>
	var that;
	export default{
		props:{
			touserid:0
		},
		data:function(){
			return {
				
				friendBoxClass:"",
				applyContent:""
			}
		},
		created:function(){
			that=this;
			this.getPage();
		},
		methods:{
			getPage:function(){
				that.app.get({
					url:that.app.apiHost+"/index.php?m=friend&a=isfriend&ajax=1",
					data:{
						touserid:this.touserid
					},
					success:function(res){
						if(res.error){
							return false;
						}
						if(res.data==0){
							that.isFriend=0;
						}
					}
				})
			},
			addFriend: function() {
				var that = this;
				that.app.post({
					url: that.app.apiHost + "/index.php?m=friend_apply&a=apply",
					data:{
						touserid:that.touserid,
						description:that.applyContent
					},
					success: function(res) {
						uni.showToast({
							title: res.message
						})
						that.friendBoxClass="";
					}
				})
			},
		}
	}
</script>

<style>
	.add-friend-btn {
		position: fixed;
		z-index: 999;
		top: 100px;
		right: 3px;
		background-color: #15ABA5;
		color: #fff;
		width: 30px;
		height: 30px;
		line-height: 30px;
		border-radius: 20px;
		text-align: center;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center; 
		cursor: pointer;
	}
</style>
