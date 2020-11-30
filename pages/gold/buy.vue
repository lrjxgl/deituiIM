<template>
	<view>
		<view class="row-box">
			<view style="width: 100%;">
				<view class="row-item-text" v-for="(item,index) in goldList" :key="index">
					<view @click="goldid=item.id" class="row-item-title flex flex-ai-center">
						<view class="cl-num">{{item.gold}}</view>
						<view>金币</view> 
						<view class="cl-num">￥{{item.price}}</view>
						<view class="flex-1"></view>
						<view v-if="goldid==item.id" class="yes f16"></view>
					</view>
				</view>
				<view @click="buyGold" class="btn-row-submit">立即购买</view>
			</view>
			
		</view>
	</view>
</template>

<script>
	import dtPay from "../../common/dtpay.js";
	export default{
		data:function(){
			return {
				goldList:[],
				goldModalClass:"",
				goldid:0,
			}
			
		},
		onLoad:function(){
			this.getPage();
		},
		methods:{
			getPage(){
				var that=this;
				that.app.get({
					url: that.app.apiHost + "/module.php?m=im_gold",
					success: function(res) {
						that.goldList = res.data.list;
					}
				})
			},
			buyGold:function(){
				var that=this;
				if(that.goldid==0){
					return false;
				}
				that.app.get({
					url:that.app.apiHost+"/module.php?m=im_gold&a=buy&id="+this.goldid,
					success:function(res){
						if(res.error){
							uni.showToast({
								title:res.message
							})
							return false;
						}
						if(res.data.action=='pay'){
							dtPay.paytype=that.paytype;
							dtPay.pay({
								payurl:res.data.payurl,
								orderno:res.data.orderno
							});						
						}
					}
				})
			},
		}
	}
</script>

<style>
	.giftItem {
		width: 25%;
		margin: 5px;
		padding: 5px;
		box-sizing: border-box;
		cursor: pointer;
	}
	
	.giftItem-img {
		width: 50px;
		height: 50px;
		border-radius: 50%;
		margin-bottom: 5px;
	}
	
	.giftItem-title {
		color: #333;
		font-size: 12px;
		margin-bottom: 5px;
	}
	
	.giftItem-price {
		color: #f60;
		font-size: 14px;
	}
</style>
