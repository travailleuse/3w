
const getDB = (name, version) => {
    const req = indexedDB.open(name, version);
    return new Promise((resolve, reject) => {
        req.onsuccess = (e) => {
            console.log("onsuccess");
            console.log(e.target.result);
            resolve(e.target.result);
        };

        req.onupgradeneeded = (e) => {
            /**
             * @type {IDBDatabase}
             */
            const db = e.target.result;
            db.onversionchange = async (e) => {
                console.log("onversionchange")
                console.log(`old version: ${e.oldVersion}, new version: ${e.newVersion}`);
                db.close();
            };
            console.log("onupgradeneeded");
        };
        req.onerror = (e) => reject(e.target.error);

        req.onblocked = e => {
            console.log("blocked");
            console.log(e.target)
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