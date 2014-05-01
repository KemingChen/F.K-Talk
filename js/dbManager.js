app.factory('DBManager', function($window, PhoneGap, FriendManager) {
	var db = null;
    PhoneGap.ready(function() {
        db = $window.sqlitePlugin.openDatabase({name: "FKTalk"});
        db.transaction(function(tx) {
            tx.executeSql("CREATE TABLE IF NOT EXISTS chats(messageId INTEGER PRIMARY KEY ASC, sender TEXT, receiver TEXT, message TEXT, timestamp INTEGER)", []);
        });
    });
    
    return {
        addMsg: function (messageId, sender, receiver, message, timestamp, callback) {
        	PhoneGap.ready(function() {
	            db.transaction(function(tx) {
	                tx.executeSql("INSERT INTO chats(messageId, sender, receiver, message, timestamp) VALUES (?, ?, ?, ?, ?)",
	                    [messageId, sender, receiver, message, timestamp],
	                    function(tx, res) {
	                		callback();
	                    }, function (e) {
	                        console.log('新增訊息失敗，原因: ' + e.message);
	    	            	console.log(JSON.stringify([messageId, sender, receiver, message, timestamp]));
	                    }
	                );
	            });
        	});
        },
        
        listMsg: function (phone, callback) {
        	PhoneGap.ready(function() {
        		db.transaction(function(tx) {
        			tx.executeSql("SELECT * FROM chats WHERE sender=? OR receiver=?", 
                        [phone, phone],
	        			function(tx, res) {
                            var friend = FriendManager.friends[phone];
                            var maxSenderMsgId = -1;
                            if(friend != undefined){
                                if(friend.chats === undefined)
                                    friend.chats = {};
                                for (var i = 0, max = res.rows.length; i < max; i++) {
                                    var mid = res.rows.item(i).messageId;
                                    friend.chats[mid] = res.rows.item(i);
                                    if(friend.chats[mid].sender == phone && mid > maxSenderMsgId)
                                        maxSenderMsgId = mid;
                                }
                            }
                            callback(maxSenderMsgId);
                        },
        				null
    				);
            	});
            });
        }
    };
});