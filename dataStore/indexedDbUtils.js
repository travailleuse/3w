/**
 * @package indexedDbUtils
 * @description indexedDbUtils for simply use indexedDb
 * @author travailleuse
 * @license Apache-2.0
 * @version 1.0.0
 * @copyright Copyright (c) 2026 travailleuse
 */

/**
 * 
 * @param {string} name 
 * @param {number} version 
 * @param {Array<string>} config 
 * @returns {Promise<IDBDatabase>}
 */
const createDbIntance = async (name, version, config)=> {
    let db = null;
    const getDb = ()=> {
        const req = indexedDB.open(name, version);
        return new Promise((resolve, reject) => {
            req.onsuccess = e => {
                db = e.target.result;
                resolve(db);
            };

            req.onupgradeneeded = e => {
                db = e.target.result;
                console.log(`oldVersion: ${e.oldVersion}, newVersion: ${e.newVersion}`)
                config.forEach(ele => {
                    db.createObjectStore(ele, {keyPath: 'id', autoIncrement: true});
                })
            }

            req.onerror = e => reject(e.target.error);
        })
    }
    return getDb();
}

const showDb = async () => indexedDB.databases();

