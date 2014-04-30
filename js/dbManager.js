app.factory('DBManager', function($window, PhoneGap) {
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
        
        // read: function (phone) {
        // 	PhoneGap.ready(function() {
	       //      db.transaction(function (tx) {
	       //          tx.executeSql("UPDATE friends SET name = ?, phone = ?, email = ?, birthday = ?, isMember = ? where id = ?",
	       //              [friend.name, friend.phone, friend.email, friend.birthday, friend.isMember, friend.id],
	       //              onSuccess,
	       //              onError
	       //          );
	       //      });
        // 	});
        // },
        
        // deleteFriend: function (friend, onSuccess, onError) {
        // 	PhoneGap.ready(function() {
	       //      db.transaction(function(tx) {
	       //          tx.executeSql("delete from friends where id = ?", [friend.id],
	       //          	onSuccess,
	       //              onError
	       //          );
	       //      });
        // 	});
        // },
        
        listMsg: function (phone, callback) {
        	PhoneGap.ready(function() {
        		db.transaction(function(tx) {
        			tx.executeSql("SELECT * FROM chats WHERE sender=? OR receiver=?", [phone, phone],
	        			callback,
        				null
    				);
            	});
            });
        }
    };
});