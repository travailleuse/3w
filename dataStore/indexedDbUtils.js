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
 * @property {Map<string, IDBObjectStoreParameters>} createdObjectStore
 * @property {Array<string>} deletedObjectStoreNames
 */
class StoreConfig {
    /**
     * @type {Map<string, IDBObjectStoreParameters>}
     * @description createdObjectStore
     */
    #createdObjectStore = new Map();

    /**
     * @type {Set<string>}
     */
    #deletedObjectStoreNames = new Set();

    /**
     *
     * @param {string} name
     * @param {IDBObjectStoreParameters} options
     * @returns
     */
    addObjectStore(name, options) {
        this.#createdObjectStore.set(name, options);
        return this;
    }

    /**
     *
     * @param {string} name
     * @returns {StoreConfig}
     */
    removeAddedObjectStore(name) {
        this.#createdObjectStore.delete(name);
        return this;
    }

    addWillDeletedObjectName(name) {
        this.#deletedObjectStoreNames.push(name);
        return this;
    }

    /**
     * @returns {Set<string>}
     */
    get createdObjectStore() {
        return this.#createdObjectStore;
    }

    /**
     * @returns {Array<string>}
     */
    get deletedObjectStoreNames() {
        return this.#deletedObjectStoreNames;
    }
}


class IndexedDbManager {
    /**
     *
     * @param {string | string[]} a
     * @param {string | string[]} b
     * @returns {boolean}
     */
    static #isEqualKeyPath(a, b) {
        if (a === b) return true;

        if (Array.isArray(a) && Array.isArray(b)) {
            if (a.length !== b.length) return false;
            return a.every((v, i) => v === b[i]);
        }

        return false;
    }

    /**
     *
     * @returns {Promise<Array<IDBDatabaseInfo>>}
     */
    static async showDbs() {
        return await indexedDB.databases();
    }

    /**
     *
     * @param {string} name
     * @returns {IDBOpenDBRequest<void>}
     */
    static async dropDb(name) {
        return indexedDB.deleteDatabase(name);
    }

    /**
     *
     * @param {IDBObjectStore} store
     * @param {Array} indexesConfig
     * @returns {boolean}
     */
    static #checkIndexes(store, indexesConfig) {
        if (store.indexNames.length !== indexesConfig.length) {
            return false;
        }

        for (const indexConfig of indexesConfig) {
            const { name, keyPath, options = {} } = indexConfig;

            if (!store.indexNames.contains(name)) {
                return false;
            }

            const index = store.index(name);

            if (!this.#isEqualKeyPath(index.keyPath, keyPath)) {
                return false;
            }

            if (!!index.unique !== !!options.unique) {
                return false;
            }

            if (!!index.multiEntry !== !!options.multiEntry) {
                return false;
            }
        }

        return true;
    }

    /**
     *
     * @param {string} name
     * @returns {IDBDatabase|null}
     */
    static async showDb(name) {
        const dbs = await this.showDbs();
        console.log(dbs, name);
        let info = dbs.find((db) => db.name === name);
        if (!info) {
            return Promise.resolve(null);
        }
        const {_, version} = info;
        const req = indexedDB.open(name, version);
        
        return new Promise((resolve, reject) => {
            req.onsuccess = (e) => {
                resolve(e.target.result);
            };

            req.onerror = (e) => reject(e.target.error);
        });
    }

    /**
    * @param {IDBDatabase} db
    * @param {StoreConfig} storeConfig
    * @returns {boolean}
    */
    static check(db, storeConfig) {
        const createdStores = storeConfig.createdObjectStore;
        console.log(db.objectStoreNames);
        if (createdStores.size !== db.objectStoreNames.length) {
            return false;
        }

        for (const [name, option] of createdStores) {
            if (!db.objectStoreNames.contains(name)) {
                return false;
            }

            const tx = db.transaction(name, "readonly");
            const store = tx.objectStore(name);

            if (!this.#isEqualKeyPath(store.keyPath, option.keyPath)) {
                return false;
            }

            if (store.autoIncrement !== !!option.autoIncrement) {
                return false;
            }

            if (Array.isArray(option.indexes)) {
                if (!this.#checkIndexes(store, option.indexes)) {
                    return false;
                }
            }
        }

        return true;
    }


    /**
     *
     * @param {string} name
     * @param {null} version
     * @param {StoreConfig} storeConfig
     * @returns {Promise<IDBDatabase>}
     */
    static async createOrUpdateDb(name, version, storeConfig) {
        /**
         * @type {IDBDatabase}
         */
        let db = null;

        const req = indexedDB.open(name, version);
        return new Promise((resolve, reject) => {
            req.onsuccess = (e) => {
                db = e.target.result;
                IndexedDbManager.check(db, storeConfig);
                resolve(db);
            };

            req.onupgradeneeded = (e) => {
                db = e.target.result;
                storeConfig.createdObjectStore.forEach((options, storeName) => {
                });

                storeConfig.deletedObjectStoreNames.forEach((storeName) => {
                    db.deleteObjectStore(storeName);
                });
            };
            req.onerror = (e) => reject(e.target.error);
        });
    }
}



const test = async () => {
    console.log(indexedDB)
    const config = new StoreConfig();
    const db = await IndexedDbManager.createOrUpdateDb("test", 1, config);
    console.log(db);
    console.log(await IndexedDbManager.showDbs());
    console.log(await IndexedDbManager.showDb("tes__t"));
};

test();
