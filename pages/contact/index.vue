<template>
	<div>
		<div class="main-body">
			<div>
			<div v-for="(item,index) in users.list" :key="index" @click="goPm(item.userid)" class="flex flex-ai-center pd-10 bg-fff bdb">
				<image class="wh-30 bd-radius-5 mgr-10" :src="item.user_head+'.100x100.jpg'"></image>
				<div class="flex-1 cl2">
					 {{item.nickname}} 
					
				</div>
				 
			</div>
			</div>
			
		</div>
		<mt-footer tab="contact"></mt-footer>
	</div>
</template>

<script>
 
	import mtFooter from "../../components/footer.vue";
	export default {
		components:{
			mtFooter
		},
		data() {
			return {
				users: [],
				groups:[]
			}
		},
		onLoad() {
			this.getPage(); 
		},
		methods: {
			goPm:function(uid){
				uni.navigateTo({
					url:"../index/pm?uuid="+uid
				});
			},
			getPage:function(){
				var that=this;
				that.app.get({
					url:that.app.apiHost+"/index.php?m=friend",
					success:function(res){
						that.users=res.data;
					}
				})
			}
		}
	}
</script>

<style>
	 
</style>
