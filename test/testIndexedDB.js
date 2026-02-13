
const getDB = (name, version) => {
    const req = indexedDB.open(name, version);
    return new Promise((resolve, reject) => {
        req.onsuccess = (e) => {
            resolve(e.target.result);
        };

        req.onupgradeneeded = (e) => {
            /**
             * @type {IDBDatabase}
             */
            const db = e.target.result;
            db.onversionchange = async (e) => {
                db.close();
            };
        };
        req.onerror = (e) => reject(e.target.error);

        req.onblocked = e => {
            reject(e.target.error);
        }
    });
}



const testIndexDB = async () => { 
    const db = await getDB("test", 1);
    getDB("test", 2).catch(e=>{
        console.log(e);
    });
}

testIndexDB();