<template>
	<view>
		<view class="main-body">
			<view >
				<view @click="gourl('../friend_apply/index')" class="row-item bg-white">
					<view class="iconfont icon-friend_add_light mgr-5"></view>
					<view class="row-item-title">新朋友</view>
					<view v-if="newNum>0" class="cl-red">{{newNum}}</view>
				</view>
				<view v-for="(item,name,index) in list" :key="index">
					<view :id="'zms'+name" class="f16 pd-10 zms">{{name}}</view>
					<view class="ubox">
						<block  v-for="(cc,cckey) in item.child" :key="cckey">
							<view  @click="goPm(cc.userid)" class="row-item-text">
								<image :src="cc.user_head+'.100x100.jpg'" class="wh-30 bd-radius-5 mgr-5"></image>
								<div class="row-item-title">{{cc.nickname}}</div>
							</view>
						</block>
					</view>
				</view>
			</view>
			<view class="pBox">			
				<view @click="setZm(name)" v-for="(item,name,index) in list" :key="index" :class="zm==name?'pBox-active':''" class="pBox-item">{{name}}</view>				
			</view>
			
		</view>
		 
	</view>
</template>

<script>
	var query
	import mtFooter from "../../components/footer.vue";
	export default {
		components:{
			mtFooter
		},
		data() {
			return {
				users: [],
				groups:[],
				list:{},
				zm:"A",
				zms:{},
				newNum:0
			}
		},
		onLoad() {
			this.getPage();
			this.getNewNum(); 
			query = uni.createSelectorQuery().in(this);
		},
		onPageScroll: function(e) {
			var that = this;
			//e.scrollTop
			var y=e.scrollTop;
			var zms=this.zms;
			for(var el in zms){
				if(zms[el]>y){
					that.zm=el;
					break;
				}
			}
		},
		methods: {
			gourl:function(url){
				uni.navigateTo({
					url:url
				})
			},
			goPm:function(uid){
				uni.navigateTo({
					url:"../index/pm?uuid="+uid
				});
			},
			setZm:function(zm){
				this.zm=zm;
				
				var y=this.zms[zm];
				uni.pageScrollTo({
					scrollTop:y
				})
			},
			getZmsy:function(){
				var that=this;
				var zms=this.zms;
				// #ifdef H5
				for(var el in zms){					
					zms[el] = document.getElementById("zms"+el).offsetTop;
				}
				this.zms=zms;
				console.log(zms);
				// #endif	
				// #ifndef H5
				wx.createSelectorQuery().selectAll('.zms').boundingClientRect(function(rects){
					rects.forEach(function(rect){
						zms[rect.id.replace("zms","")] = rect.top;
					})
					console.log(zms);
				}).exec();
				
				// #endif
				
				
			},
			getPage:function(){
				var that=this;
				that.app.get({
					url:that.app.apiHost+"/index.php?m=friend&a=zm",
					success:function(res){
						that.list=res.data.list;
						var zms=Array();
						for(var i in that.list){
							zms[i]=0;
						}
						that.zms=zms;
						setTimeout(function(){
							that.getZmsy();
						},300)
					}
				})
			},
			getNewNum:function(){
				var that=this;
				that.app.get({
					url:that.app.apiHost+"/index.php?m=friend_apply&a=newnum",
					success:function(res){
						that.newNum=res.data; 
					}
				})
			}
		}
	}
</script>

<style>
	.ubox{
		background-color: #fff;
		padding-left: 10px;
	}
	 .pBox{
	 	position: fixed;
	 	top: 90px;
	 	right: 0px;
	 	background-color: #fff;
	 	padding: 5px;
	 }
	 /* #ifdef H5 */
	 .pBox{
	 	top:120px
	 }
	 /* #endif */
	 .pBox-item{
	  
	 	text-align: center;
	 	width: 36rpx;
	 	height: 36rpx;
	 	line-height: 36rpx;
	 	font-size: 20rpx;
		margin-bottom: 2px;
	 	
	 }
	 .pBox-active{
	 	background-color: #eee;
	 	border-radius: 36rpx;
	 }
</style>
