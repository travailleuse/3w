/**
 * @package indexedDbUtils
 * @description indexedDbUtils for simply use indexedDb
 * @author travailleuse
 * @license Apache-2.0
 * @version 1.0.0
 * @copyright Copyright (c) 2026 travailleuse
 */


/**
 * @class StoreConfig
 * @description storeConfig for create or delete object store
 */
class StoreConfig {
    /**
     * @type {Map<string, IDBObjectStoreParameters>}
     * @description createdObjectStore
     * @property {string} name
     * @property {IDBObjectStoreParameters} options
     */
    #createdObjectStore = new Map();

    /**
     * @type {Array<string>}
     */
    #deletedObjectStoreNames = [];

    addObjectStore(name, options) {
        this.#createdObjectStore.set(name, options);
        return this;
    }

    removeAddedObjectStore(name) {
        this.#createdObjectStore.delete(name);
        return this;
    }

    deleteONeObjectStore(name) {
        this.#deletedObjectStoreNames.push(name);
        return this;
    }

    getStoreConfig() {
        return {
            createdObjectStore: this.#createdObjectStore,
            deletedObjectStoreNames: this.#deletedObjectStoreNames
        }
    }
}

class IndexDbManager {
    constructor() {
        throw new Error('IndexDbManager is a static class');
    }

    /**
     * @type {Map<string, IDBDatabase>}
     * @private
     * @description name2db
     */
    static #name2db = new Map();

    /**
     * @typedef {{name: string, version:number}} T
     * 
     * @returns {Promise<Array<T>>}
     */
    static async showDbs() {
        return await indexedDB.databases();
    }

    /**
     * 
     * @param {string} name 
     * @returns {Promise<void>}
     */
    static async dropDb(name) {
        return indexedDB.deleteDatabase(name);
    }

    /**
     * 
     * @param {string} name 
     * @returns {}
     */
    static async getDb(name) {
        return this.#name2db.get(name);
    }

    /**
     * 
     * @param {string} name 
     * @param {null} version 
     * @param {StoreConfig} storeConfig 
     * @returns {Promise<IDBDatabase>}
     */
    static async use(name, version, storeConfig) {
        /**
         * @type {IDBDatabase}
         */
        let db = null;

        /**
         * first check if db exist, by name and version. if yes, return it.
         */
        if(this.#name2db.has(name)) {
            db = this.#name2db.get(name);
            if (currentDb.version === version) {
                return Promise.resolve(currentDb);
            }
        }

        const req = indexedDB.open(name, version);
        return new Promise((resolve, reject) => {
            req.onsuccess = e => {
                this.#name2db.set(name, e.target.result);
                db = e.target.result;
                resolve(db);
            };

            req.onupgradeneeded = e => {
                db = e.target.result;
                storeConfig.getStoreConfig().createdObjectStore.forEach((options, name) => {
                    const store = db.createObjectStore(name, options);
                });

                storeConfig.getStoreConfig().deletedObjectStoreNames.forEach(name => {
                    db.deleteObjectStore(name);
                });
            }

            req.onerror = e => reject(e.target.error);
        })
    }
}