<template>
	<view>
		<view class="flexlist-item" v-for="(item,index) in list" :key="index">
			<image :src="item.user_head+'.100x100.jpg'" mode="widthFix" class="flexlist-img"></image>
			<view class="flex-1">
				<view class="flexlist-title">{{item.nickname}}</view>
				<view class="flexlist-desc">{{item.description}}</view>
			</view>
			<view class="flex-jc-center">
				<block v-if="item.status==0">
					<view @click="pass(item.id)" class="btn-mini mgb-5">接受</view>
					<view @click="forbid(item.id)" class="btn-mini">拒绝</view>
				</block>
				<view v-else-if="item.status==1">
					已接受
				</view>
				<view v-else>
					已禁止
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default{
		data:function(){
			return {
				list:[]
			}
		},
		onLoad:function(){
			this.getPage();
		},
		methods:{
			pass:function(id){
				var that=this;
				var id=id;
				that.app.get({
					url:that.app.apiHost+"/index.php?m=friend_apply&a=pass",
					data:{
						id:id
					},
					success:function(res){
						for(var i in that.list){
							if(that.list[i].id==id){
								that.list[i].status=1;
							}
						}
					}
				})
			},
			forbid:function(id){
				var that=this;
				that.app.get({
					url:that.app.apiHost+"/index.php?m=friend_apply&a=forbid",
					data:{
						id:id
					},
					success:function(res){
						for(var i in that.list){
							if(that.list[i].id==id){
								that.list[i].status=4;
							}
						}
					}
				})
			},
			getPage:function(){
				var that=this;
				that.app.get({
					url:that.app.apiHost+"/index.php?m=friend_apply",
					success:function(res){
						that.list=res.data.list;
					}
				})
			}
		}
	}
</script>

<style>
</style>
