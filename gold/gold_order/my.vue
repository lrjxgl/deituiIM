<template>
	<view>
		<div   v-if="pageLoad"  >
			<div class="row-box mgb-5" v-for="(item,index) in list" :key="index">
				<div class="flex bd-mp-5">
					<div class="flex-1 cl2">订单号：{{item.orderno}}</div>
					<div class="cl-primary">{{item.status_name}}</div>
				</div>
				<div @click="goProduct(item.productid)" class="flexlist-item pointer" >
					<img class="flexlist-img" :src="item.imgurl+'.100x100.jpg'">
					<div class="flex-1">
						<div class="flexlist-title">{{item.title}}</div>
						 
						<div class="flex ">
							<div class="flex-1 cl-money">{{item.gold}}</div>
							<div class="cl3">x 1</div>
						</div>
						
					</div>
				</div>
				<div>
					<div class="cl2">联系人：{{item.nickname}}</div>
					<div class="cl3">电话：{{item.telephone}}</div>
					<div class="cl3">地址：{{item.address}}</div>
				</div>
				<div v-if="item.status<3 && item.status>0" class="flex">
					<div class="flex-1"></div>
					<div @click="finish(item)" class="btn-small">收货</div>
				</div>
			</div>
		</div> 
		<div class="footer-row"></div>
		<div class="footer">
			<div  @click="goR('../gold/index')" class="footer-item icon-home">兑换商城</div>
			<div  class="footer-item footer-active icon-order">我的订单</div>
		</div>
	</view>
</template>

<script>
	
	export default{
		data:function(){
			return {
				pageLoad:false,
				list:[],
				per_page:0,
				isFirst:true
			}
		},
		onLoad:function(){
			this.getPage();
		},
		onReachBottom:function(){
			this.getList();
		},
		onPullDownRefresh:function(){
			this.getPage();
			uni.stopPullDownRefresh();
		},
		onShareAppMessage:function(){
			
		},
		onShareTimeline:function(){
			
		},
		methods: {
			goR:function(url){
				uni.redirectTo({
					url:url
				})
			},
			gourl:function(url){
				uni.navigateTo({
					url:url
				})
			},
			goProduct:function(id){
				uni.navigateTo({
					url:"../gold_product/show?id="+id
				})
			},
			getPage:function() {
				var that=this;
				that.app.get({
					url:that.app.apiHost+"/module.php?m=gold_order&a=my",
					success:function(res){
						that.pageLoad=true;
						that.list=res.data.list;
						that.per_page=res.data.per_page;
					}
				})
			},
			getList:function() {
				var that=this;
				if(that.per_page==0 && !that.isFirst){
					return false;
				}
				that.app.get({
					url:that.app.apiHost+"/module.php?m=gold_order&a=my",
					data:{
						per_page:that.per_page
					},
					success:function(res){						 
						that.per_page=res.data.per_page;
						if(that.isFirst){
							that.list=res.data.list;
							that.isFirst=false;
						}else{
							for(var i in res.data.list){
								that.list.push(res.data.list[i]);
							}							
						}
						
					}
				})
			},
			finish:function(item){
				var that=this;
				that.app.post({
					url:that.app.apiHost+"/module.php?m=gold_order&a=finish&ajax=1",
					dataType:"json",
					data:{
						orderid:item.orderid
					},
					success:function(res){
						if(res.error){
							uni.showToast({
								title:res.message,
								icon:"none"
							})
							return false;
						}
						item.status=3; 
						 
					}
				})
			}
		},
		
	}
</script>

<style>
</style>
