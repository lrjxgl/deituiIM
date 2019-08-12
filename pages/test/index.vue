<template>
	<view id="main">
		<page-loading v-if="loadIng"></page-loading> 
		<view >
			 
				
			<view v-for="(item,index) in list" :key="index">
				{{item}}
			</view>
			 
		</view>
	</view>
</template>

<script>
	var $k=0;
	var page=999;
	var windowHeight=0; 
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
			var that=this;
			var sys=uni.getSystemInfoSync()
			windowHeight=sys.windowHeight;
			this.getList(); 
			setTimeout(function(){
				const query = uni.createSelectorQuery().in(that);
				 query.select('#main').boundingClientRect(function(res) {				  
				  console.log("height: " + res.height);
				}).exec();
			},100)
			
		},
		onPullDownRefresh:function(){
			
		},
		onPageScroll:function(e){
			if(e.scrollTop==0){
				this.getList();
			}
			console.log(e.scrollTop)
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
				that.loadIng=true;
				setTimeout(function(){
					that.loadIng=false;
				
					const query = uni.createSelectorQuery().in(that);
					 query.select('#main').boundingClientRect(res => {
						if(that.oldsch==0){
							uni.pageScrollTo({
								scrollTop:100000
							})
						}else{
							var st=res.height-that.oldsch-windowHeight+30;
							uni.pageScrollTo({
								scrollTop:st
							})
						}
						that.oldsch=res.height;
					  console.log("height: " + res.height);
					}).exec();
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
