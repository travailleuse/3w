/**
 * @package indexedDbUtils
 * @description indexedDbUtils for simply use indexedDb
 * @author travailleuse
 * @license Apache-2.0
 * @version 1.0.0
 * @copyright Copyright (c) 2026 travailleuse
 */

class IndexDbManager {
    static #name2db = new Map();

    /**
     * @typedef {{name: string, version:number}} T
     * 
     * @returns {Promise<Array<T>>}
     */
    static showDb() {
        return indexedDB.databases();
    }
    /**
     * 
     * @param {string} name 
     * @param {null} version 
     * @param {*} config 
     * @returns {Promise<IDBDatabase>}
     */
    static async createDbIntance(name, version, config) {
        let db = null;
        const getDb = () => {
            const req = indexedDB.open(name, version);
            return new Promise((resolve, reject) => {
                req.onsuccess = e => {
                    this.#name2db.set(name, e.target.result);
                    db = e.target.result;
                    resolve(db);
                };

                req.onupgradeneeded = e => {
                    db = e.target.result;
                    config.forEach(ele => {
                        db.createObjectStore(ele, { keyPath: 'id', autoIncrement: true });
                    })
                }

                req.onerror = e => reject(e.target.error);
            })
        }
        return getDb();
    }
}