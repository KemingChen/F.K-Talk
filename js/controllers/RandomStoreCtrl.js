app.controller('RandomStoreCtrl', function(){
	var storeList = getStore({
		max: 9,
		type: "all",
		longitude: 10,
		latitude: 10,
	});
	
	function getStore(options){
		console.log(JSON.stringify(options));
		var list = [];
		var datas = ["楊記大餛飩", "銀記", "炒泡麵", "素還真", "六教美而美", "鬆餅鋪", "高家涼麵", "八方雲集", "咖哩飯", "壞嘴斗", "隱藏版滷肉飯"];
		var id = 1;
		for(var i in datas){
			var name = datas[i];
			list.push({
				id: id,
				name: name,
			});
			if(id == 9)
				break;
			id++;
		}
		return list;
	}
});