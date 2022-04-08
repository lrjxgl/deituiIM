<template>
	<view>
		<div class="row-box mgb-5">
			<img :src="data.imgurl" class="d-img mgb-5" />
			<div class="d-title">{{data.title}}</div>
			<div class="flex flex-center">
				<div class="cl2 mgr-10">金币</div>
				<div class="cl-money f16">{{data.gold}}</div>
				<div class="mgl-5 f14 cl2">个</div>
				<div class="flex-1"></div>
				<div class="cl3">库存 {{data.total_num}}</div>
			</div>
			 
		</div>
		<div v-if="data.gold<=user.gold && data.total_num>0" class="btn-row-submit" @click="showAddr()">我要兑换</div>
		<div class="flex-center cl-warning pd-10">
			您的金币不足， 你有{{user.gold}}个金币
		</div>
		<div class="d-content bg-white pd-10" v-html="data.content"></div>
		<div class="modal-group" :class="addrModalClass">
			<div class="modal-mask" @click="hideAddr()"></div>
			<div class="modal">
				<div class="modal-header">
					<div class="modal-title">确认收货地址</div>
					<div class="modal-close icon-close" @click="hideAddr()"></div>
				</div>
				<div class="modal-body">
					<div class="input-flex">
						<div class="input-flex-label">联系人</div>
						<input type="text" class="input-flex-text" v-model="addr.nickname" />
					</div>
					<div class="input-flex">
						<div class="input-flex-label">电话</div>
						<input type="text" class="input-flex-text" v-model="addr.telephone" />
					</div>
					<div class="input-flex">
						<div class="input-flex-label">地址</div>
						<input type="text" class="input-flex-text"  v-model="addr.address" />
					</div>
					<div class="btn-row-submit" @click="order()">确认兑换</div>
				</div>
			</div>
		</div>
	</view>
</template>

<script>
	
	export default{
		data:function(){
			return {
				pageLoad:false,
				data:{},
				id:0,
				addrModalClass:"",
				addr:{},
				user:{}
			}
		},
		onLoad:function(ops){
			this.id=ops.id;
			this.getPage();
		},
		 
		onShareAppMessage:function(){
			
		},
		methods: {
			gourl:function(url){
				uni.navigateTo({
					url:url
				})
			},
			getPage:function() {
				var that=this;
				that.app.get({
					url:that.app.apiHost+"/module.php?m=gold_product&a=show&id="+this.id,
					success:function(res){
						
						that.data=res.data.data;
						that.addr=res.data.addr;
						that.user=res.data.user;
						that.pageLoad=true;
					}
				})
			},
			order:function(){
				var that=this;
				that.app.post({
					url:that.app.apiHost+"/module.php?m=gold_order&a=order&ajax=1",
					data:{
						id:this.id,
						address:this.addr.address,
						telephone:this.addr.telephone,
						nickname:this.addr.nickname
					},
					success:function(res){
						uni.showToast({
							title:res.message,
							icon:"none"
						})
						if(!res.error){
							that.getPage();
							that.addrModalClass="";
						}
						
					}
				})
			},
			showAddr:function(){
				this.addrModalClass="flex-col";
			},
			hideAddr:function(){
				this.addrModalClass="";
			}
		},
	}
</script>

<style>
</style>
