<template>
	<view>
		<div class="row-box mgb-5 flex">
			<input v-model="keyword" type="text" class="input-flex-text" />
			<div @click="search" class="input-flex-btn w50">搜</div>
		</div>
		<view class="tabs-border">
			<div @click="setType('recommend')" :class="type=='recommend'?'tabs-border-active':''" class="tabs-border-item">推荐</div>
			<div @click="setType('vip')"  :class="type=='vip'?'tabs-border-active':''"  class="tabs-border-item">Vip</div>
			<div @click="setType('new')"  :class="type=='new'?'tabs-border-active':''"  class="tabs-border-item">新人</div>
			<div @click="setType('all')"  :class="type=='all'?'tabs-border-active':''"  class="tabs-border-item">全部</div>
		</view>
		<div v-if="Object.keys(list).length==0" class="emptyData">暂无</div>
		<div v-for="(item,index) in list" :key="index" class="row-box flex mgb-5">
			<img @click="goUser(item.userid)" class="wh-60 mgr-5" :src="item.user_head+'.100x100.jpg'" />
			<div class="flex-1">
				<div @click="goUser(item.userid)" class="mgb-5">{{item.nickname}}</div>
				<div class="flex mgb-5">
					<div class="mgr-5">关注</div>
					<div class="mgr-5 cl-num">{{item.follow_num}}</div>
					<div class="mgr-5">粉丝</div>
					<div class="cl-num">{{item.followed_num}}</div>
				</div>
				<div class="cl2 f12 pd-5">{{item.description}}</div>
			</div>
			<div>
				<div v-if="item.isfollow" @click="followToggle(item)" class="btn-mini">取消关注</div>
				<div v-else @click="followToggle(item)" class="btn-mini">关注</div>
			</div>
		</div>
		<div @click="getList" v-if="per_page>0" class="loadMore">加载更多</div>
		<mt-footer tab="people"></mt-footer>
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
				list:[],
				pageLoad:false,
				type:"recommend",
				per_page:0,
				isFirst:true,
				keyword:""
			}
		},
		onLoad:function(){
			this.getPage();
		},
		onReachBottom:function(){
			this.getList();
		},
		methods:{
			setType:function(type){
				var that=this;
				this.type=type;
				that.per_page=0;
				that.isFirst=true;
				this.getList();
			},
			search:function(){
				var that=this;
				that.per_page=0;
				that.isFirst=true;
				console.log("search")
				that.getList();
			},
			getPage:function(){
				var that=this;
				that.app.get({
					url:that.app.apiHost+"/module.php?m=sblog_people&a=list&ajax=1",
					data:{
						type:that.type
					},
					dataType:"json",
					success:function(res){
						that.pageLoad=true;
						that.per_page=res.data.per_page;
						that.list=res.data.list;
					}
				})
			},
			getList:function(){
				var that=this;
				if(this.per_page==0 && !this.isFirst){
					return false;
				}
				that.app.get({
					url:that.app.apiHost+"/module.php?m=sblog_people&a=list&ajax=1",
					data:{
						type:that.type,
						per_page:that.per_page,
						keyword:that.keyword
					},
					dataType:"json",
					success:function(res){
						that.pageLoad=true;
						that.per_page=res.data.per_page;
						if(that.isFirst){
							that.list=[];
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
			goUser:function(userid){
				uni.navigateTo({
					url:"../sblog_home/index?userid="+userid
				})
			},
			followToggle:function(item){
				var that=this;
				that.app.get({
					url: that.app.apiHost+"/index.php?m=follow&a=Toggle&ajax=1",
					dataType: "json",
					data: {
						t_userid: item.userid
					},
					success: function(res) {
						if(res.error){
							uni.showToast({
								title:res.message
							});
							return false;
						}
						item.isfollow = res.follow;
				
					}
				});
			}
		}
	}
</script>

<style>
</style>
