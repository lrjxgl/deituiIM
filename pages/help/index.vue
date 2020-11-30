<template>
	<view >
		<div class="tabs-toggle-group">
			<view class="tabs-toggle" v-for="(item,index) in list" :key="index">
				<div @click="toggleItem(item)" :class="item.isActive?'tabs-toggle-hd-active':''" class="tabs-toggle-hd">{{item.title}}</div>
				<div class="tabs-toggle-box" :class="item.isActive?'tabs-toggle-active':''" >
					<rich-text class="d-content" :nodes="item.content"></rich-text>
				</div>
			</view>
		</div>
	</view>
</template>

<script>
	export default{
		data:function (){
			return {
				list:[]
			}
		},
		onLoad:function(){
			this.getPage();
		},
		methods:{
			getPage:function(){
				var that=this;
				that.app.get({
					url:that.app.apiHost+"/index.php?m=help&ajax=1",
					success:function(res){
						that.list=res.data.list;
					}
				})
			},
			toggleItem:function(item){
				var that=this;
				for(var i in that.list){
					if(item.id!=that.list[i].id){
						that.list[i].isActive=0;
					}
					
				}
				if(item.isActive){
					item.isActive=0;
				}else{
					item.isActive=1;
				}
			}
		}
	}
</script>

<style>
</style>
