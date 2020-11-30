<template>
	<view>
		<view class="gTab">
			<view @click="tab='hot'" :class="{'gTab-active':tab=='hot'}" class="gTab-item">热门
				<view v-if="tab=='hot'" class="gTab-dot"></view>
			</view>
			<view @click="tab='near'" :class="{'gTab-active':tab=='near'}" class="gTab-item">
				附近
				<view v-if="tab=='near'" class="gTab-dot"></view>
			</view>
			<view @click="tab='follow'" :class="{'gTab-active':tab=='follow'}" class="gTab-item">
				关注
				<view v-if="tab=='follow'" class="gTab-dot"></view>
			</view>
			<view class="flex-1"></view>
			<!-- #ifdef APP-PLUS -->
			<view @click="goLive" class="iconfont mgr-10 f18 icon-recordlight"></view>
			<!-- #endif --> 
			
		</view>
		<view class="row-box">
			<image  class="wone" mode="widthFix" src="../../static/phb.png"></image>
		</view>	
		<view class="row-box">
			<view class="zbList">
				<view class="zbBox">
					<image class="zbBox-img" mode="widthFix" src="../../static/v1.png"></image>
					<view class="zbBox-ft">
						<view class="zbBox-nick">凉凉</view>
						<view class="flex">
							<view class="zbBox-bt">1</view>
							<view class="cl3 f12">福鼎</view>
							<view class="flex-1"></view>
							<view class="cl3 f12">322</view>
						</view>
					</view>
					
				</view>
				<view class="zbBox">
					<image class="zbBox-img" mode="widthFix" src="../../static/v2.png"></image>
					<view class="zbBox-ft">
						<view class="zbBox-nick">凉凉</view>
						<view class="flex">
							<view class="zbBox-bt">1</view>
							<view class="cl3 f12">福鼎</view>
							<view class="flex-1"></view>
							<view class="cl3 f12">322</view>
						</view>
					</view>
				</view>
				<view class="zbBox">
					<image class="zbBox-img" mode="widthFix" src="../../static/v3.png"></image>
					<view class="zbBox-ft">
						<view class="zbBox-nick">凉凉</view>
						<view class="flex">
							<view class="zbBox-bt">1</view>
							<view class="cl3 f12">福鼎</view>
							<view class="flex-1"></view>
							<view class="cl3 f12">322</view>
						</view>
					</view>
				</view>
				<view class="zbBox">
					<image class="zbBox-img" mode="widthFix" src="../../static/v4.png"></image>
					<view class="zbBox-ft">
						<view class="zbBox-nick">凉凉</view>
						<view class="flex">
							<view class="zbBox-bt">1</view>
							<view class="cl3 f12">福鼎</view>
							<view class="flex-1"></view>
							<view class="cl3 f12">322</view>
						</view>
					</view>
				</view>
				<view class="zbBox">
					<image class="zbBox-img" mode="widthFix" src="../../static/v1.png"></image>
					<view class="zbBox-ft">
						<view class="zbBox-nick">凉凉</view>
						<view class="flex">
							<view class="zbBox-bt">1</view>
							<view class="cl3 f12">福鼎</view>
							<view class="flex-1"></view>
							<view class="cl3 f12">322</view>
						</view>
					</view>
				</view>
				<view class="zbBox">
					<image class="zbBox-img" mode="widthFix" src="../../static/v2.png"></image>
					<view class="zbBox-ft">
						<view class="zbBox-nick">凉凉</view>
						<view class="flex">
							<view class="zbBox-bt">1</view>
							<view class="cl3 f12">福鼎</view>
							<view class="flex-1"></view>
							<view class="cl3 f12">322</view>
						</view>
					</view>
				</view>
				<view class="zbBox">
					<image class="zbBox-img" mode="widthFix" src="../../static/v3.png"></image>
					<view class="zbBox-ft">
						<view class="zbBox-nick">凉凉</view>
						<view class="flex">
							<view class="zbBox-bt">1</view>
							<view class="cl3 f12">福鼎</view>
							<view class="flex-1"></view>
							<view class="cl3 f12">322</view>
						</view>
					</view>
				</view>
				<view class="zbBox">
					<image class="zbBox-img" mode="widthFix" src="../../static/v4.png"></image>
					<view class="zbBox-ft">
						<view class="zbBox-nick">凉凉</view>
						<view class="flex">
							<view class="zbBox-bt">1</view>
							<view class="zbBox-ft-c">福鼎</view>
							<view class="flex-1"></view>
							<view class="zbBox-ft-c">322</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<mt-footer tab="zblive"></mt-footer>
	</view>
</template>

<script>
	import mtFooter from "../../components/footer.vue";
	export default{
		components:{
			mtFooter
		},
		data:function(){
			return {
				tab:"hot"
			}
		},
		methods:{
			goLive:function(){
				uni.navigateTo({
					url:"live?room_id=19"
				})
			}
		}
	}
</script>

<style>
	.row-box{
		padding: 5px;
	}
	.wone{
		width: 100%;
	}
	.zbList{
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		margin-right: -1%;
	}
	.zbBox{
		width:49%;
		margin-right: 1%;
		margin-bottom: 5px;
		position: relative;
	}
	.zbBox-img{
		width: 100%;
	}
	.zbBox-nick{
		color: #fff;
		font-size: 14px;
		margin-bottom: 3px; 
		width: 100%;
		overflow: hidden;
	}
	.zbBox-bt{
		background-color: #9c27b0;
		color: #fff;
		padding: 1px 3px;
		font-size: 20rpx;
		margin-right: 5px;
	}
	.zbBox-ft{
		position: absolute;
		bottom:5px;
		left: 5px;
		right: 5px;
	}
	.zbBox-ft-c{
		color: #eee;
		font-size: 12px;
	}
</style>
