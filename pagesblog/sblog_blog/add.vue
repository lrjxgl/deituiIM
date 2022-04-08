<template>
	<view>
		<view v-if="pageLoad">
			<view v-if="!unLogin">
				<form  @submit="formSubmit"  >
					<div class="none">
						<input class="none" type="text" name="topicid" v-model="topicid" />
					</div>
					<div class="pd-10 cl-primary" v-if="Object.keys(topic).length>0">
						话题：{{topic.title}}
					</div> 
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
	 
	var id;
	export default {
		
		components:{
			upVideo,
			upimgBox
		},
		data:function(){
			return {
				pageLoad:false, 
				unLogin:true,
				pageHide:false,
				topic:{},
				tab:"",
				mp4url:"",
				imgsData:"",
				topicid:0
			}
			
		},
		onLoad: function (ops) {
			id = ops.id;
			if(ops.topicid!=undefined){
				this.topicid=ops.topicid;
			}
			
			this.getPage();
		},
		onReady: function () {
			uni.setNavigationBarTitle({
				title: "发布帖子",
			})
		},
		onShow:function(){
			if(this.pageLoad){
				this.getPage();
			}
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
					url: that.app.apiHost + "/module.php?m=sblog_blog&ajax=1&a=add",
					 
					data:{
						topicid:this.topicid
					},
					success: function (res) {
						if(res.error==1000){
							that.pageLoad = true;
							that.app.goLogin();
							return false;
						}else{
							that.pageLoad = true;
							 
							if(res.data.topic){
								that.topic = res.data.topic;
							}
							
							that.unLogin=false;
						}
						

					}
				})
			},
			
			formSubmit:function(e){
				var that=this;
				that.app.post({
					url:that.app.apiHost+"/module.php?m=sblog_blog&a=save&ajax=1",
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
