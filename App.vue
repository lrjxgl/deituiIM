<script>
	export default {
		onLaunch: function() {
			console.log('App Launch')
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style>
	/*每个页面公共css */
	@import "./common/iconfont.css";
	@import "./common/dt-ui-uni.css";
	@import "./common/chat.css";
	uni-input div{
	width: 100%;
}
.input-flex-btn{
	z-index: 2;
}
.header,.header-row{
		display: none;
}
uni-page-head .uni-page-head-hd{
	flex-direction: row;
}
.uni-tabbar,.uni-picker-view-wrapper{
	flex-direction: row !important;
}
.uni-swiper-dots{
	flex-direction: row;
}
</style>
