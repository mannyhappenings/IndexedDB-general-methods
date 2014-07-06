function openDb(dbName, dbVersion, storeParams, indices) {
	var database = this;
	dbVersion = dbVersion? dbVersion: 1;
	storeParams = storeParams? storeParams: { name: "store-1", attributes: { keyPath: 'name', autoIncrement: true }};
	indices = indices? indices: ['name', '', { unique: false }];
    var indexedDB = (window.indexedDB)? window.indexedDB: window.mozIndexedDB;
    var req = indexedDB.open(dbName, dbVersion);
    req.onsuccess = function (event) {
        database.db = this.result;
        console.log('Database opened.');
    };
    
    req.onerror = function (event) {
        console.error("openDb: ", evt.target.errorCode);
    };
    
    req.onupgradeneeded = function (event) {
        console.log('upgradeneeded for ' + this.result.name);        
        var store = evt.currentTarget.result.createObjectStore(storeParams);
        store.createIndex(indices[0], indices[1], indices[2]);
    };
	return database;
}
//Reading and write fuctions
openDb.prototype = {
	readStore: function (name, key, successCb, errorCb) {
		var request = (((this.db.transaction(name, 'readonly')).objectStore(name)).get(key)); 
		request.onsuccess = function(event){
			if(succesCb) successCb(event.target.result);
			else console.log(event.target.result);
		};
		request.onerror = function (event){
			if(errorCb) errorCb(event);
			else console.error('Read Error', event);
		}
	},

	writeStore: function (name, data, successCb, errorCb) {
		var request = (((db.transaction(name, 'readwrite')).objectStore(name)).add(data)); 
		request.onsuccess = function(event){
			if(succesCb) successCb(event);
			else console.log(event.target.result);
		};
		request.onerror = function (event){
			if(errorCb) errorCb(event);
			else console.error('Write Error', event);
		}
	},
	deleteStoreEntry: function (name, key, successCb, errorCb) {
		var request = ((db.transaction(name, 'readwrite')).objectStore(name)).delete(key); 
		request.onsuccess = function(event){
			if(succesCb) successCb(event);
			else console.log(event.target.result);
		};
		request.onerror = function (event){
			if(errorCb) errorCb(event);
			else  console.error('Delete error', event);
		}
	},
	countStore: function (name, key, successCb, errorCb) {
		var request = (key)?(((db.transaction(name, 'readonly')).objectStore(name)).count(key)):
							(((db.transaction(name, 'readonly')).objectStore(name)).count()); 
		request.onsuccess = function(event){
			if(succesCb) successCb(event.target.result);
			else console.log(event.target.result);
		};
		request.onerror = function (event){
			if(errorCb) errorCb(event);
			else console.error('count error in store "' + name + '"', event);
		}
	}
};