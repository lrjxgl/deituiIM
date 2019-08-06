<template>
	<view>
		<page-loading v-if="loadIng"></page-loading> 
		<scroll-view :scroll-top="scrollTop" scroll-y="true" @scrolltoupper="scTop" @scroll="scrollY" class="scroll">
			 
				
			<view v-for="(item,index) in list" :key="index">
				{{item}}
			</view>
			 
		</scroll-view>
	</view>
</template>

<script>
	var $k=0;
	var page=999;
	export default{
		data:function(){
			return{
				list:new Array(),
				sch:0,
				oldsch:0,
				scrollTop:1000,
				loadIng:false
			}
			
		},
		onLoad:function(){
			this.getList();
			
		},
		onPullDownRefresh:function(){
			
		},
		methods:{
			scrollY:function(e){
				this.sch=e.detail.scrollHeight;
			},
			scTop:function(e){
				if(this.oldsch==0){
					this.oldsch=this.sch;
				}
				
				var that=this;
				that.scrollTop=0;
				 this.getList();
				
				
			},
			getList:function(){
				var that=this;
				for(var i=0;i<30;i++){
					$k++;
					this.list.unshift("这是第"+$k+"条信息了");
				}
				that.loadIng=true;z
				setTimeout(function(){
					that.loadIng=false;
					if(that.oldsch==0){
						that.scrollTop=10000;
					}else{
						that.scrollTop=that.oldsch;
					}
					 
				},200)
			}
		}
	}
</script>

<style>
	.scroll{
		width: 100%;
		height: 500px;
	}
</style>
