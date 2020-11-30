<template>
	<view id="App" v-if="pageLoad">
		 
		<view class="main-body">
			 
			<view class="videobox" style="z-index:1;">
				 
				<video controls="false" objectFit="cover" autoplay="true"  :style="{width:windowWidth+'px',height:windowHeight+'px'}" class="video" v-if="data.zbstatus==1" id="video" :src="m3u8url"   :x5-video-player-type="data.zbstatus==1?'h5-page':'h5'"   x-webkit-airplay="true" playsinline="" webkit-playsinline=""   ></video> 
				<video controls="false" objectFit="cover" autoplay="true" show-center-play-btn="false"  :style="{width:windowWidth+'px',height:windowHeight+'px'}"  class="video"  v-else-if="data.zbstatus==2" :src="data.mp4url"  id="video"  :x5-video-player-type="data.zbstatus==1?'h5-page':'h5'"   x-webkit-airplay="true" playsinline="" webkit-playsinline="" >
				</video>
				<video controls="false" objectFit="cover" autoplay="true" show-center-play-btn="false"  :style="{width:windowWidth+'px',height:windowHeight+'px'}"  class="video"  v-else  id="video" src="http://dt-ui.deitui.com/test/1.mp4"   :x5-video-player-type="data.zbstatus==1?'h5-page':'h5'"   x-webkit-airplay="true" playsinline="" webkit-playsinline=""   ></video> 
			</view> 
			<!-- #ifndef APP-PLUS -->
			
			
			<view class="ftBox">
				<view class="msgList">
					<view v-for="(item,index) in msgList" :key="index" class="msgList-item">
						<view class="msgList-nick">{{item.nickname}}</view>
						<view class="msgList-desc">{{item.content}}</view>
					</view>
					 
				</view>
				<view class="flex flex-ai-center">
					<view @click="modalGoodsClass='flex-col'" class="iconfont ftBox-goods icon-goodsnewfill"></view>
					<template v-if="data.zbstatus==1">
					<view class="flex-1 pd-5">
						<input v-model="cmContent" placeholder="发布你想了解的信息" class="ftBox-text" type="text" />
					</view>
					<view @click="sendMsg" class="btn-send iconfont icon-fasong"></view>
					</template>
					<template v-else>
						<view class="flex-1 pd-5">
							<input disabled v-model="cmContent" placeholder="直播结束，不能发布消息了" class="ftBox-text" type="text" />
						</view>
					</template>
				</view>
				
				
			</view>
			<view id="modal-group-goods" :class="modalGoodsClass" class="modal-group">
				<view @click="modalGoodsClass=''"  class="modal-mask"></view>
				<view class="modal-goods">
					<view class="modal-header">
						<view class="modal-title">推荐商品</view>
						<view  @click="modalGoodsClass=''"  class="modal-close icon-close"></view>
					</view>
					<view class="modal-body pdb-5">
						<view class="flexlist">
							<view v-for="(item,index) in proList" :key="index" class="flexlist-item">
								<img class="flexlist-img" :src="item.imgurl" />
								<view class="flex-1">
									<view class="flexlist-title">{{item.title}}</view>
									<view class="flex">
										<view>卷后价</view>
										<view class="cl-money mgr-5">￥{{item.price}}</view>
									
										<view class="flex-1"></view>
										<view @click="showQuan(item)" class="btn-small ">领券立省</view>
									</view>
								</view>
							</view>
							 
						</view>
					</view>
					 
					
				</view>
			</view>
			
			<view id="modal-group-share" v-if="productShow" style="z-index:999" class="modal-group flex-col">
				<view class="modal-mask"></view>
				<view class="modal-share">
					 
					<view @click="productShow=false" class="modal-share-close modal-close icon-close" ></view>
					 
					
					<view >
						<img class="wmax" :src="product.imgurl" />
					</view>
					<view class="bg-white pd-5">
						<view class="flex flex-ai-end mgb-10">
							<view class="cl-num">券后</view>
							<view class="cl-money f22">￥{{product.price}}</view>
							<view class="flex-1"></view>
							<view class="btn-quan">券{{product.juan_money}}</view>
						</view>
						<view class="f14 mgb-10">{{product.title}}</view>
						<view class="mline"></view>
						<view class="btn-ma">{{product.juan_pwd}}</view>
						<view class="btn btn-copy" @click="copy(product.juan_pwd)" >一键复制优惠券口令</view>
						<view class="cl3 text-center f12">若复制失败，请长按淘口令手动复制</view>
					</view>
					
				</view>
			</view>
			<!-- #endif -->
			
			 
		</view>
		
	</view>
</template>

<script>
	var room_id;
	// #ifdef H5
	import Vue from 'vue'
	import VueClipboard from "../../common/vue-clipboard-cli.js";
	VueClipboard.config.autoSetContainer = true
	Vue.use(VueClipboard);
	// #endif 
	export default{
		data:function(){
			return {
				pageLoad:false,
				data:{},
				proList:[],
				msgList:[],
				cmContent:"",
				product:{},
				productShow:false,
				m3u8url:"",
				mp4url:"",
				modalGoodsClass:"",
				windowWidth:0,
				windowHeight:0
			}
		},
		onLoad:function(ops){
			room_id=ops.room_id;
			this.getPage();
			// #ifdef APP-PLUS
			this.getMsgList();
			// #endif
			// #ifdef APP-PLUS
			const subNVue = uni.getSubNVueById('zbliveshow');
			subNVue.setStyle({
				"top":"120px"
			})
			subNVue.postMessage({
			    "room_id":room_id,
			    "action":'load'
			})	
			// #endif
			var win=uni.getSystemInfoSync();
			this.windowWidth=win.windowWidth;
			this.windowHeight=win.windowHeight;
		},
		onPullDownRefresh:function(){
			this.getPage();
			uni.stopPullDownRefresh();
		},
		methods:{
			getPage:function(){
	
				var that=this;
				that.app.get({
					url:that.app.apiHost+"/module.php?m=zblive&a=show&ajax=1&id="+room_id,
					dataType:"json",
					success:function(res){
						that.data=res.data.zblive;
						that.getProList();
						that.pageLoad=true;
						that.m3u8url=res.data.m3u8url;
						that.mp4url=res.data.mp4url;
					}
				})
			},
			getMsgList:function(){
				var that=this;
				that.app.get({
					url:that.app.apiHost+"/module.php?m=zblive_msg&a=list&ajax=1&room_id="+room_id,
					dataType:"json",
					success:function(res){
						that.msgList=res.data.list;
					}
				})
			},
			sendMsg:function(){
				var that=this;
				that.app.post({
					url:that.app.apiHost+"/module.php?m=zblive_msg&a=save&ajax=1",
					data:{
						room_id:room_id,
						content:this.cmContent
					},
					success:function(res){
						that.cmContent="";
						that.getMsgList(); 
					}
				})
			},
			getProList:function(){
				var that=this;
				that.app.get({
					url:that.app.apiHost+"/module.php?m=taoke_searchcache&a=listbyids&ajax=1&ids="+that.data.proids,
					dataType:"json",
					success:function(res){
						
						that.proList=res.data.list;
						
					}
				})
			},
			showQuan:function(item){
				var that=this;
				that.app.get({
					url:that.app.apiHost+"/module.php?m=taoke_search&a=getpwd&ajax=1&id="+item.id,
					dataType:"json",
					success:function(res){
						
						if(res.error){
							uni.showToast({
								title:res.message
							})
							return false;
						}
						item.juan_pwd=res.data;
						that.productShow=true;
						that.product=item;
					}
				})
				
			},
			copy: function(msg) {
				var that = this;
				if (msg == '') {
					msg = "内容为空";
				}
				//var msg="aaaa";
				// #ifdef H5
				that.$copyText(msg).then(function(e) {
					uni.showToast({
						title: "复制成功"
					})
				}, function(e) {
					uni.showToast({
						title: "复制失败"
					})
				})
				// #endif
				// #ifndef H5
				uni.setClipboardData({
					data: msg,
					success: function() {
						console.log('success');
						// #ifdef APP-PLUS
						that.goTaobao();
						// #endif
					}
				});
				// #endif
			},
			
			goTaobao: function() {
				// #ifdef APP-PLUS
				if (plus.os.name == "Android") {
					plus.runtime.launchApplication({
							pname: "com.taobao.taobao",
							extra: {
								url: "https://m.taobao.com/#index"
							}
						},
						function(e) {
							uni.showToast({
								title:"打开淘宝失败，请先安装淘宝"
							})
							 
						}
					);
				} else if (plus.os.name == "iOS") {
					plus.runtime.launchApplication({
						action: "taobao://"
					}, function(e) {
						uni.showToast({
							title:"打开淘宝失败，请先安装淘宝"
						})
					});
				}
				// #endif
			}
		}
	}
</script>

<style>
	.videobox {
		position: absolute;
		top: 0;
		bottom: 0;
		left: 0;
		right: 0;
		display: block;
		overflow: hidden;
		background-color:#aaa;
	}
	
	.videoMask {
		position: absolute;
		top: 150px;
		left: 40%;
		z-index: 999;
		font-size: 60px;
		justify-content:center;
		align-items:center;
	}
	
	.video {
		 
	}
	
	.videoTools {
		position: absolute;
		left: 5px;
		right: 5px;
		top: 10px;
		height: 1px;
		background-color: #333;
		display: none;
	}
	
	.videoDot {
		position: absolute;
		width: 10px;
		height: 10px;
		top: -5px;
		background-color: #f30;
		border-radius: 50%;
	}
	
	.ftBox {
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		z-index: 999;
	}
	
	.ftBox-goods {
		font-size: 36px;
		color: #f00;
	
	}
	
	.ftBox-text {
		height: 36px;
		line-height: 36px;
		border: 0;
		border-radius: 5px;
		background-color: #333;
		opacity: 0.6;
		width: 100%;
		color: #fff;
		padding-left: 5px;
	}
	
	.btn-send {
		height: 38px;
		line-height: 38px;
		padding: 0px 8px;
		justify-content: center;
	
		color: #fff;
	}
	
	.msgList {
		height: 160px;
		padding: 5px;
		overflow: auto;
	}
	
	.msgList-item {
		display: flex;
		flex-direction: row;
	}
	
	.msgList-nick {
		margin-right: 10px;
		color: #f60;
		font-size: 12px;
	}
	
	.msgList-desc {
		color: #ff0;
		font-size: 12px;
		flex: 1;
	}
	
	.modal-goods {
		position: fixed;
		bottom: 0px;
		left: 0px;
	
		right: 0px;
		z-index: 999;
		background-color: #fff;
	}
	
	.modal-share {
		position: fixed;
		bottom: 0px;
		left: 30px;
	
		right: 30px;
		z-index: 999;
		background-color: #fff;
	}
	
	.mline {
		margin-bottom: 10px;
		border-bottom: 1px dotted #333;
	}
	
	.btn-quan {
		font-size: 12px;
		color: #f30;
		padding: 3px;
		border: 1px dotted #f30;
	}
	
	.btn-ma {
		width: 160px;
		margin: 0 auto;
		border: 1px dotted #f30;
		line-height: 30px;
		height: 30px;
		font-size: 14px;
		text-align: center;
		margin-bottom: 10px;
		background-color: #fcf6f6;
		border-radius: 5px;
		color: #f30;
	}
	
	.btn-copy {
		background-color: #f30;
		margin-bottom: 10px;
		padding: 10px 20px;
	}
	
	.modal-share-close {
		background-color: #333;
		position: absolute;
		right: -10px;
		width: 30px;
		height: 30px;
		color: #fff;
		border-radius: 50%;
		opacity: 0.9;
		top: -10px;
		align-items: center;
		justify-content: center;
	}
	uni-toast{
		z-index: 9999;
	}
</style>
