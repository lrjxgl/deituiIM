<template>
	<view>
		<div class="main-body">
			<div class="row-box">
			    <div class="stat">
			    		<div class="stat-item">邀请 <span class="stat-n">{{rscount}}</span>人</div>
			    		<div class="stat-item">奖励  <span class="stat-n">{{money}}</span> 元</div>
			    		<div class="stat-item">余额 <span class="stat-n">{{user.money}}</span>元 </div>
			    </div>
				<div class="flex flex-center bdb pdb-5 mgb-5">
					<div>您的邀请码：</div>
					<div class="cl-red">{{invitecode}}</div>
				</div>
			    <div class="hd">邀请奖励</div>
			    <div class="con">
			    	<div>1.邀请一个用户奖励100个金币</div>
			    	<div>2.另外还可以获得邀请用户消费1%的奖励</div>
			    </div>
			    <div class="hd">邀请方法</div>
			    <div class="con">
			    	<div> 
			    		注册的时候让好友输入邀请码即可。
			    		 
			    	</div>
			    	 
			    </div>
		    </div>
		    
		    <div v-if="list && Object.keys(list).length>0" class="row-box">
		    	<div class="hd">邀请列表</div>
		    	<div class="invitelist">
		    		 
		    		<div v-for="(item,index) in list" :key="index" class="invitelist-item">
		    			<img class="invitelist-img" :src="item.user_head+'.100x100.jpg'"  />
		    			<div class="invitelist-nick">{{item.nickname}}</div>
		    		</div>
		    		 
		    	</div>
		    </div>
		    
		</div>
		
		
	</view>
</template>

<script>
	export default{
		data:function(){
			return {
				list:[],
				user:{},
				rscount:0,
				money:0,
				ewm:"",
				invitecode:""
			}
		},
		onLoad:function(){
			this.getPage()
		},
		methods:{
			getPage:function(){
				var that=this;
				that.app.get({
					url:that.app.apiHost+"/index.php?m=invite&a=my&ajax=1",
					success:function(res){
						if(res.error){
							return false;
						}
						that.user=res.data.user;
						that.rscount=res.data.rscount;
						that.money=res.data.money;
						that.list=res.data.list;
						that.ewm=res.data.ewm;
						that.invitecode=res.data.invitecode;
					}
				})
			}
		}
	}
</script>

<style>
	.stat{
		display: flex;
		flex-direction: row;
		line-height: 40px;
		margin-bottom: 10px;
		font-size: 14px;
		border-bottom: 1px solid #eee;
	}
	.stat-item{
		flex-direction: row;
		flex: 1;
	}
	.stat-n{
		padding: 0px 3px;
		color: #f60;
		font-size: 16px;
	}
	.row-box .hd{
		font-size: 16px;
		color: #333;
		margin-bottom: 10px;
		font-weight: bold;
	}
	.row-box .con{
		font-size: 14px;
		color: #555;
		padding-left: 10px;
		margin-bottom: 10px;
	}
	.row-box img{
		text-align: center;
	}
	.invitelist:after{
		clear: both;
		display: block;
		content: ".";
		visibility: hidden;
		height: 0;
	}
	.invitelist-item{
		float: left;
		width: 25%;
		text-align: center;
	}
	.invitelist-img{
		width: 60px;
		display: block;
		margin: 0 auto;
	}
	.invitelist-nick{
		font-size: 12px;
		color: #444;
	}
</style>
