<template>
	<div id="app">
		<div v-if="pageLoad">
			<div class="sglist">
				<div class="sglist-item" v-for="(item,index) in pageData.list" :key="index">
					<div class="f16">
					{{item.content}}
					
					</div>
					 
					<div class="flex flex-ai-center  mgt-5">
						<div class="f12 flex-1 cl2">{{item.timeago}}</div>
						<div @click="goBlog(item.objectid)" class="btn-small mgr-10">查看</div>
						
						<div class="btn-small btn-danger" @click="del(item.id)">删除</div>
					</div>
				</div>
			</div>
			<div v-if="per_page>0" @click="loadMore" class="loadMore">点我加载更多...</div>
		</div>
	</div>
</template>

<script>
	var tablename = "mod_sblog_blog";
	export default{
		data: function() {
			return {
				pageLoad: false,
				pageData: {},
				per_page:0,
				isFirst:false
			}
		},
		created: function() {
			this.getList();
		},
		methods: {
			goBlog:function(id){
				uni.navigateTo({
					url:"../sblog_blog/show?id="+id
				})
			},
			getList: function() {
				var that = this;
				that.app.get({
					url: that.app.apiHost+"/index.php?m=comment&a=my&tablename=" + tablename + "&ajax=1",
					dataType: "json",
					success: function(res) {
						that.pageLoad = true;
						that.pageData = res.data;
						that.per_page = res.data.per_page;
						that.isFirst = false;
					}
				})
	
			},
			loadMore: function() {
				var that = this;
				if (!that.isFirst && that.per_page == 0) return false;
				that.app.get({
					url: that.app.apiHost+"/index.php?m=comment&a=my&tablename=" + tablename + "&ajax=1",
					data: {
						per_page: that.per_page
					},
					dataType: "json",
					success: function(res) {
						var pageData = that.pageData;
						var list = pageData.list;
						for (var i in res.data.list) {
							list.push(res.data.list[i]);
						}
						that.per_page = res.data.per_page;
						that.pageData = pageData;
					}
				})
	
			},
			del: function(id) {
				var that = this;
				var id = id;
				that.app.get({
					url: that.app.apiHost+"/index.php?m=comment&a=delete&tablename=" + tablename + "&ajax=1&id=" + id,
					dataType: "json",
					success: function(res) {
						var list = that.pageData.list;
						var nlist = [];
						for (var i = 0; i < list.length; i++) {
							if (list[i].id != id) {
								nlist.push(list[i]);
							}
						}
						console.log(list.length);
						var pageData = that.pageData;
						pageData.list = nlist;
						that.pageData = pageData;
					}
				})
	
			}
		}
	}
	
</script>

<style>
</style>
