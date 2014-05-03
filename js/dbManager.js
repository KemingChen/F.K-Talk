app.factory('DBManager', function($window, PhoneGap, FriendManager) {
	var db = null;
    PhoneGap.ready(function() {
        db = $window.sqlitePlugin.openDatabase({name: "FKTalk"});
        db.transaction(function(tx) {
            tx.executeSql("CREATE TABLE IF NOT EXISTS chats(messageId INTEGER PRIMARY KEY, sender2 TEXT, receiver TEXT, message TEXT, timestamp INTEGER)", []);
        });
    });
    
    return {
        addMsg: function (messageId, sender, receiver, message, timestamp, callback) {
        	PhoneGap.ready(function() {
	            db.transaction(function(tx) {
	                tx.executeSql("INSERT INTO chats(messageId, sender2, receiver, message, timestamp) VALUES (?, ?, ?, ?, ?)",
	                    [messageId, sender, receiver, message, timestamp],
	                    function(tx, res) {
                            console.log(JSON.stringify(res));
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
            console.log("listMsg " + phone);
        	PhoneGap.ready(function() {
        		db.transaction(function(tx) {
        			tx.executeSql("SELECT * FROM chats WHERE receiver = ? OR sender2 = ?", 
                        [phone, phone],
	        			function(tx, res) {
                            var friend = FriendManager.friends[phone];
                            var maxSenderMsgId = -1;
                            console.log(JSON.stringify(res));
                            console.log(phone + ", chats length: " + res.rows.length);
                            console.log("hasReadMsgId: "+ friend.hasReadMsgId);
                            if(friend != undefined){
                                if(friend.chats === undefined)
                                    friend.chats = {};
                                for (var i = 0, max = res.rows.length; i < max; i++) {
                                    var chat = res.rows.item(i);
                                    chat.sender = chat.sender2;
                                    var messageId = chat.messageId;
                                    friend.chats[messageId] = chat;
                                    FriendManager.setChatHasRead(phone, chat);
                                    if(chat.sender == phone && messageId > maxSenderMsgId)
                                        maxSenderMsgId = messageId;
                                }
                            }
                            callback(maxSenderMsgId);
                        },
        				null
    				);
            	});
            });
        },

        showAll: function () {
            console.log("showAll");
            PhoneGap.ready(function() {
                db.transaction(function(tx) {
                    tx.executeSql("SELECT * FROM chats", 
                        [],
                        function(tx, res) {
                            console.log("showAll ----");
                            for (var i = 0, max = res.rows.length; i < max; i++) {
                                var chat = res.rows.item(i);
                                console.log(JSON.stringify(chat));
                            }
                            console.log("showAll ---- END");
                        },
                        null
                    );
                });
            });
        }
    };
});