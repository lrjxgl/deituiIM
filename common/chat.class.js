module.exports={
	 
	encode:function(str,type){
		
	},
	
	decode:function(str){
		// #ifdef H5
		str=str.replace(/\.\.\/\.\.\//g,"");
		// #endif
		//解析图片
		str=str.replace(/\[img=(.*)\]/g,'<img class="wmax" src="$1" />');
		//解析音频
		str=str.replace(/\[audio=(.*)\]/g,'<audio class="w150" controls  src="$1" />播放</audio>');
		//解析视频
		str=str.replace(/\[video=(.*)\]/g,'<video class="w150" controls  src="$1" />播放</video>');
		//解析表情
		str=this.decodeEmo(str);
		//文件
		str=str.replace(/\[file=(.*)\]/g,'<a target="_blank" href="$1" />$1</div>');
		return str;
	},
	emoList:function(){
		return ["微笑",'惊讶',"哭泣","蛋糕"];
	},
	decodeEmo:function(str){
		var res=str.match(/(\\[^ ]*) /g);
		if(res!=null){
			for(var i=0;i<res.length;i++){
				str=str.replace(res[i],"<img src='../../static/"+res[i].replace("\\","").replace(" ","")+".gif' />");
			}
		}
		// #ifdef H5
		str=str.replace(/\.\.\/\.\.\//g,"");
		// #endif
		return str;
	}
}
