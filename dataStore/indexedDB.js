/**
 * 
 * @returns {Map<string, version>}
 */
const db2version = async () => {
    const dbs = await indexedDB.databases();
    const map = new Map();
    for (const dbInfo of dbs) {
        map.set(dbInfo['name'], dbInfo['version']);
    }
    return map;
}

/**
 * 
 * @param {string} name 
 * @returns {Promise<IDBDatabase>}
 */
const getDB = async (name) => {
    const op = await db2version();
    let version = op.get(name);
    version = version === (void 0) ? 1 : version + 1;
    const req = indexedDB.open(name, version);
    return new Promise((resolve, reject) => {
        req.onsuccess = e => {
            /**
             * @type {IDBDatabase}
             */
            const db = e.target.result;
            db.onversionchange = e => {
                db.close();
            }
            resolve(db);
        }

        req.onupgradeneeded = e => {
            /**
             * @type {IDBDatabase}
             */
            const db = e.target.result;
            db.createObjectStore("test", {keyPath:"id", autoIncrement:true});
        }

        req.onblocked = e => {
            console.log("blocked");
            reject(e.target.error);
        }

        req.onerror = e => {
            reject(e.target.error);
        }
    });
}

const test = async () => {
    const db = await getDB("test");
    console.log(db);
}

test()