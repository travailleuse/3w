
const getDB = (name, version) => {
    const req = indexedDB.open("test", version);
    return new Promise((resolve, reject) => {
        req.onsuccess = (e) => {
            console.log("onsuccess");
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
    });
}



const testIndexDB = async () => { 
    const db = await getDB("test", 1);
    console.log(db);
    console.log(db);
    const db_ = await getDB("test", 2);
    console.log(db_);

}

testIndexDB();