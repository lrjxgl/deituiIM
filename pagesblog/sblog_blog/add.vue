<template>
	<view>
		<view v-if="pageLoad">
			<view class="main-body">
				<form  @submit="formSubmit"  >
					 
					<view class="textarea-flex">
						<textarea maxlength="1024" name="content" placeholder="请输入内容" placeholder-class="cl2" style="width:100%;height:150px;" ></textarea>
						
					</view>
					<div class="tabs-border">
						<div :class="tab==''?'tabs-border-active':''" @click="tab=''" class="tabs-border-item">图片</div>
						<div @click="tab='video'"  :class="tab=='video'?'tabs-border-active':''"   class="tabs-border-item">视频</div>
					</div>
					<div :class="tab=='video'?'none':''">
						<input maxlength="-1" type="text" class="none" name="imgsdata" :value="imgsData" />
						<upimg-box @call-parent="callImgsData" name="imgsdata"></upimg-box>
					</div>
					<div  :class="tab==''?'none':''">
						<input  maxlength="-1" type="text" class="none" name="mp4url" :value="mp4url" />
						<up-video @call-parent="callMp4url" dTrueMp4url="" dMp4url=""></up-video>
					</div>
					<button formType="submit" class="btn-row-submit">提交</button>
				</form>
			</view>
		</view>
	</view>
</template>

<script>
	 
	import upimgBox from "../../components/upimgbox.vue";
	import upVideo from "../../components/up-video.vue";
	var app = require("../../common/common.js");
	var id;
	export default {
		
		components:{
			upVideo,
			upimgBox
		},
		data:function(){
			return {
				pageLoad:false, 
				pageHide:false,
				pageData:{},
				tab:"",
				mp4url:"",
				imgsData:""
			}
			
		},
		onLoad: function (option) {
			id = option.id;
			this.getPage();
		},
		onReady: function () {
			uni.setNavigationBarTitle({
				title: "发布帖子",
			})
		},
		methods: {
			callImgsData:function(e){
				this.imgsData=e;
			},
			callMp4url:function(e){
				this.mp4url=e;
			}, 
			getPage: function () {
				var that = this;
				this.app.get({
					url: that.app.apiHost + "/module.php?m=sblog_blog&ajax=1&a=add&authcode="+app.getAuthCode(),
					success: function (res) {
						if(res.error==1000){
							that.app.goLogin();
							return false;
						}
						that.pageLoad = true;
						that.pageData = res.data;

					}
				})
			},
			
			formSubmit:function(e){
				var that=this;
				that.app.post({
					url:that.app.apiHost+"/module.php?m=sblog_blog&a=save&ajax=1&authcode="+app.getAuthCode(),
					data:e.detail.value,
					success:function(res){
						uni.showToast({
							title: res.message,
							duration: 2000
						});
						if(!res.error){
							setTimeout(function(){
								uni.navigateBack({
									delta: 2
								});
							},1000)
							
						}
					}
				})
			}
		},
	}
</script>

<style>

</style>
