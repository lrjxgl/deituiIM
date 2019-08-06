<template>
	<view>
		<view class="main-body">
			<view >
				<view v-for="(item,name,index) in list" :key="index">
					<view :id="'zms'+name" class="f16 pd-10 zms">{{name}}</view>
					<view class="row-box">
						<block  v-for="(cc,cckey) in item.child" :key="cckey">
							<view  @click="goPm(cc.userid)" class="row-item-text">
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
		<mt-footer tab="contact"></mt-footer>
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
			}
		},
		onLoad() {
			this.getPage(); 
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
			}
		}
	}
</script>

<style>
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
	 	width: 18px;
	 	height: 18px;
	 	line-height: 18px;
	 	font-size: 12px;
	 	
	 }
	 .pBox-active{
	 	background-color: #eee;
	 	border-radius: 20px;
	 }
</style>
