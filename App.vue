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
	@import "./common/emo.css"; 
	 
.input-flex-btn{
	z-index: 2;
}
.header,.header-row{
		display: none;
}
 
.uni-tabbar,.uni-picker-view-wrapper{
	flex-direction: row !important;
}
.uni-swiper-dots{
	flex-direction: row;
}
 .gTab{
	 display: flex;
	 flex-direction: row;
	 background-color: #fff;
	 padding-top: 10px;
	 padding-bottom: 10px;
	 padding-left: 10px;
	 align-items: center;
 }
 .gTab-item{
	 font-size: 14px;
	 margin-right: 30px;
	 position: relative;
 }
 .gTab-active{
	 font-size: 16px;
	 font-weight: bold;
 }
 .gTab-dot{
	 position: absolute;
	 bottom:-5px;
	 width:5px;
	 left: 50%;
	 margin-left: -5px;
	 height: 3px;
	 background-color: #333;
	 border-radius: 5px;
 }
 .flexlist-img{
	 border-radius: 10px;
 }
 .cl-love{
	 color: #faa1cc;
 }
 .flexlist-mline{
	 height: 10px;
	 background-color: #969696;
	 width: 1px;
	 margin: 0px 8px;
 }
 .g-notice{
	 position: relative;
 }
 .g-notice-num{
	 position: absolute;
	 top: -2px;
	 right: -5px;
	 padding: 2px 4px;
	 background-color: #FF0000;
	 color: #fff;
	 font-size: 12rpx;
	 line-height: 1;
	 border-radius: 50%;
 }
</style>
