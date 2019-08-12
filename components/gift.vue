<template>
	<view>
		<view id="giftModal" :class="giftModalClass" class="modal-group">
			<view class="modal-mask" @click="giftModalClass=''"></view>
			<view class="giftFixbox">
				<view @click="goGold()" style="position: absolute; right: 10px; color: #007AFF; cursor: pointer; font-size: 12px;">充金币</view>
				<view @click="sendGift(item)" v-for="(item,index) in giftList" :key="index" class="giftItem">
					<image mode="widthFix" :src="item.imgurl+'.100x100.jpg'" class="giftItem-img"></image>
					<view class="giftItem-title">{{item.title}}</view>
					
					<view class="giftItem-price">{{item.price}}币 </view>
					<view class="f12 cl2">{{item.description}}</view>
				</view>
			</view>
		</view>
		<view  :class="goldModalClass" class="modal-group">
			<view @click="goldModalClass=''" class="modal-mask"></view>
			<view class="goldBox">
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
	</view>
</template>

<script>
	import dtPay from "../common/dtpay.js";
	export default {
		data: function() {
			return {
				giftList: [],
				giftModalClass:"flex-col",
				goldList:[],
				goldModalClass:"",
				goldid:0,
			}
		},
		created: function() {
			this.getGiftList();
			this.getGoldList();
		},
		methods: {
			buyGold:function(){
				var that=this;
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
			goGold:function(){
				this.goldModalClass='flex-col'
				this.giftModalClass=''
			},
			getGoldList(){
				var that=this;
				that.app.get({
					url: that.app.apiHost + "/module.php?m=im_gold",
					success: function(res) {
						that.goldList = res.data.list;
					}
				})
			},
			getGiftList() {
				var that = this;
				that.app.get({
					url: that.app.apiHost + "/module.php?m=im_gift",
					success: function(res) {
						that.giftList = res.data.list;
					}
				})
			},
			sendGift:function(item){
				var that=this;
				that.app.get({
					url:that.app.apiHost+"/module.php?m=im_gift&a=send&giftid="+item.giftid,
					success:function(res){
						if(res.error){
							uni.showToast({
								title:res.message
							})
						}else{
							that.$emit("call-parent",res.data.sendid);
						}
						
					}
				})
				
			}
		},
	}
</script>

<style>
	.giftFixbox,.goldBox {
		position: fixed;
		left: 0;
		right: 0;
		bottom: 60px;
		z-index: 999;
		background-color: #fff;
		border-radius: 20px;
		padding: 10px;
		margin: 10px;
		display: flex;
		flex-direction: row;
	}

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
