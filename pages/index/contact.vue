<template>
	<div>
		<div class="main-body">
			<div>
			<navigator v-for="(item,index) in userList" :key="index" :url="'pm?uuid='+item" class="flex flex-ai-center pd-10 bg-fff bdb">
				<image class="wh-30 bd-radius-5 mgr-10" src="../../static/100x100.jpg"></image>
				<div class="flex-1 cl2">
					 {{item}} 
					
				</div>
				 
			</navigator>
			</div>
			<div>
			<navigator v-for="(gg,gk) in groupList" :key="gk" :url="'chat?gid='+gg" class="flex flex-ai-center pd-10 bg-fff bdb">
				<image class="wh-30 bd-radius-5 mgr-10" src="../../static/100x100.jpg"></image>
				<div class="flex-1 cl2">
					{{gg}} 
					
				</div>

			</navigator>
			</div>
		</div>
		<mt-footer tab="contact"></mt-footer>
	</div>
</template>

<script>
	import uu from "../../common/userlist.js";
	import mtFooter from "../../components/footer.vue";
	export default {
		components:{
			mtFooter
		},
		data() {
			return {
				userList: [],
				groupList:[]
			}
		},
		onLoad() {
			uu.getUid();
			this.userList=uu.userList;
			this.groupList=uu.groupList;
		},
		methods: {

		}
	}
</script>

<style>
	 
</style>
