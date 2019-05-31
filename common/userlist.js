module.exports={
	userList:["胡歌","刘亦菲","小仙女","吴京","金沙","刘诗诗","刘德华","赵丽颖","周星驰"],
	groupList:["胡歌粉丝团","刘亦菲粉丝团","小仙女粉丝团","赵丽颖粉丝团"],
	getUid:function(){
		var ssuuid=uni.getStorageSync("ssuuid");
		if(!ssuuid){
			ssuuid=this.userList[Math.floor(Math.random()*this.userList.length)];
			uni.setStorageSync("ssuuid",ssuuid);
		}
		return ssuuid;
		
	}
}