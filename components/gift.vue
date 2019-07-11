<template>
	<div id="giftModal" :class="giftModalClass" class="modal-group">
		<div class="modal-mask" @click="giftModalClass=''"></div>
		<div class="giftFixbox">
			<div @click="sendGift(item)" v-for="(item,index) in giftList" :key="index" class="giftItem">
				<image mode="widthFix" :src="item.imgurl+'.100x100.jpg'" class="giftItem-img"></image>
				<div class="giftItem-title">{{item.title}}</div>
				<div class="giftItem-price">￥{{item.price}}</div>
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		data: function() {
			return {
				giftList: [],
				giftModalClass:"flex-col"
			}
		},
		created: function() {
			this.getGiftList();
		},
		methods: {
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
						that.$emit("call-parent",res.data.sendid);
					}
				})
				
			}
		},
	}
</script>

<style>
	.giftFixbox {
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
