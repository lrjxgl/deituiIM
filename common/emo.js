module.exports={
	emoList:function(){
		var arr=new Array();
		for(var i=0;i<48;i++){
			arr.push("emo"+i);
		}
		return arr;
		//return ["微笑",'惊讶',"哭泣","蛋糕","傻笑"];
	},
	emoIndex:function(word){
		word= word.replace(/\s*/g,"");
		var emlist=this.emoList();
		for(var i=0;i<emlist.length;i++){
			console.log(emlist[i]+'=='+word)
			console.log(typeof(word));
			if(emlist[i]==word){
				console.log(i);
				return i;
			}
		}
		return -1;
	},
	decodeEmo:function(str){
		var res=str.match(/(\\[^ ]*) /g);
		
		if(res!=null){
			for(var i=0;i<res.length;i++){
				var w=res[i].replace("\\","");
				w=res[i].replace("\\","");				
				var index=this.emoIndex(w);				
				if(index>=0){
					str=str.replace(res[i],'<div class="imEmo-'+index+'"></div>');
				}
			}
		}
		console.log(str);
		return str;
	}
}