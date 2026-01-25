/**
 * @package indexedDbUtils
 * @description indexedDbUtils for simply use indexedDb
 * @author travailleuse
 * @license Apache-2.0
 * @version 1.0.0
 * @copyright Copyright (c) 2026 travailleuse
 * 
 * @typedef {string | string[]} KeyPathType
 * @typedef {{option?: IDBObjectStoreParameters, indexes?: Map<string, {keyPath:KeyPathType, options?:IDBIndexParameters?}>}} StoreConfig
 * @typedef {Map<string, StoreConfig>} IDBConfig
 */

/**
 * @typedef {{op: "create"}} C
 * @typedef {{"op":"update", mode:"merge"| "replace"}} U
 * @typedef {{op : "delete"}} D
 * @typedef {C | U | D} IDBCtxOpType
 * @typedef {"create" | "delete"} DeleteType
 */
class IDBOPCtx {
    /**
     * @type {boolean}
     */
    #hasFinished = false;
    /**
     * @type {string}
     */
    #name;
    /**
     * @type {number}
     */
    #version;
    /**
     * @type {IDBDatabase|null}
     */
    #currDB;

    /**
     * @type {IDBConfig}
     */
    #createStores = new Map();

    /**
     * @type {Set<string>}
     */
    #deleteObjectStoreNames = new Set();

    /**
     * @type {IDBConfig}
     */
    #updateStores = new Map();
    constructor(name, version, currDB) {
        this.#name = name;
        this.#version = version;
        this.#currDB = currDB;
        console.log(this.getCurDBconfig());
    }

    /**
     * @returns {boolean}
     */
    get hasFinished() {
        return this.#hasFinished;
    }


    /**
     * 
     * @returns {IDBConfig}
     */
    getCurDBconfig() {
        return IDBManager.getDBConfig(this.#currDB);
    }

    /**
     * 
     * @param {string} name 
     * @param {IDBCtxOpType} opType 
     * @param {IDBObjectStoreParameters?} option 
     */
    createStore(name, opType, option) {
        let currConfig = this.getCurDBconfig();
        if (currConfig && currConfig.has(name)) {
            throw new Error("this store already exists.");
        }
        if (opType.op === "create") {
            this.#createStores.set(name, { option, });
            this.#deleteObjectStoreNames.delete(name);
            return this;
        }

        if (opType.op === "delete") {
            this.#createStores.delete(name);
            return this;
        }
        if (opType.op !== "update") {
            throw new Error("invalid opType");
        }
        switch (opType.mode) {
            case "replace":
                this.#createStores.set(name, { option, });
                this.#deleteObjectStoreNames.delete(name);
                break;
            case "merge":
                if (!option) {
                    option = {};
                } else {
                    let config = currConfig.get(name).option;
                    if (!option.hasOwnProperty("keyPath")) {
                        option["keyPath"] = config.keyPath;
                    }
                    if (!option.hasOwnProperty("autoIncrement")) {
                        option["autoIncrement"] = !!config.autoIncrement;
                    }
                }
                this.#createStores.set(name, { option, });
                break;
            default:
                throw new Error("invalid mode");
        }
    }


    /**
     * 
     * @param {string} name 
     * @param {IDBCtxOpType} opType 
     * @param {IDBObjectStoreParameters?} option 
     */
    updateStore(name, opType, option) {
        let currConfig = this.getCurDBconfig();
        if (!currConfig || !currConfig.has(name) || this.#updateStores.has(name)) {
            throw new Error("this store doesn't exist.");
        }

        if (opType.op === "create") {
            this.#updateStores.set(name, { option, });
            this.#deleteObjectStoreNames.delete(name);
        }

        if (opType.op === "delete") {
            this.#updateStores.delete(name);
        }

        if (opType.op !== "update") {
            throw new Error("invalid opType");
        }

        switch (opType.mode) {
            case "replace":
                this.#updateStores.set(name, { option, });
                this.#deleteObjectStoreNames.delete(name);
                break;
            case "merge":
                if (!option) {
                    option = {};
                } else {
                    let config = currConfig.get(name).option;
                    if (!option.hasOwnProperty("keyPath")) {
                        option["keyPath"] = config.keyPath;
                    }
                    if (!option.hasOwnProperty("autoIncrement")) {
                        option["autoIncrement"] = !!config.autoIncrement;
                    }
                }
                this.#updateStores.set(name, { option, });
                break;
            default:
                throw new Error("invalid mode");
        }
    }

    /**
     * 
     * @param {string} name 
     * @param {DeleteType} opType 
     * @returns 
     */
    deleteStore(name, opType) {
        let currConfig = this.getCurDBconfig();
        if (!currConfig || !currConfig.has(name)) {
            throw new Error("this store doesn't exist.");
        }

        if (opType === "create") {
            this.#deleteObjectStoreNames.add(name);
            this.#updateStores.delete(name);
            this.#createStores.delete(name);
            return this;
        }
        if (opType === "delete") {
            this.#deleteObjectStoreNames.delete(name);
            return this;
        }
        throw new Error("invalid opType");

    }


    #clearCtx() {
        this.#hasFinished = true;
        this.#createStores.clear();
        this.#deleteObjectStoreNames.clear();
        this.#updateStores.clear();
    }

    /**
     * 
     * @returns {IDBDatabase}
     */
    async build() {
        if (this.#currDB) {
            await this.#currDB?.close();
        }

        return new Promise((resolve, reject) => {
            /**
             * @type {IDBDatabase|null}
             */
            let db = null;

            // if not change
            if (this.#currDB && !this.#deleteObjectStoreNames.size && !this.#createStores.size && !this.#updateStores.size) {
                resolve(this.#currDB);
                return;
            }

            const req = indexedDB.open(this.#name, this.#version);
            req.onsuccess = e => {
                this.#clearCtx();
                db = e.target.result;
                resolve(db);
            };

            req.onupgradeneeded = e => {
                db = e.target.result;  

                this.#createStores.forEach(({ option, indexes }, name) => {
                    const store = db.createObjectStore(name, option);
                    console.log("create store: " + name);
                });


                this.#deleteObjectStoreNames.forEach(name => {
                    console.log("delete store: " + name);
                    db.deleteObjectStore(name);
                });
            };


            req.onerror = e => {
                console.error("Error opening the database:", e.target.error);
                reject(e.target.error); 
            };
        });
    }
}


class IDBManager {

    /**
     *
     * 
     * @param {IDBDatabase|null} currDB 
     * @returns {IDBConfig}
     */
    static getDBConfig(currDB) {
        if (!currDB) {
            return null;
        }
        const res = new Map();
        for (const name of currDB.objectStoreNames) {
            const store = currDB.transaction(name, "readonly").objectStore(name);
            res.set(name, {
                option: {
                    keyPath: store.keyPath,
                    autoIncrement: store.autoIncrement,
                },
                indexes: Array.from(store.indexNames).map(name => {
                    const index = store.index(name);
                    const map = new Map();
                    map.set(index.name, {
                        keyPath: index.keyPath,
                        options: {
                            unique: index.unique,
                            multiEntry: index.multiEntry,
                        },
                    });
                    return map;
                }),
            });
        }

        return res;
    }
    /**
     *
     * @returns {Promise<Array<IDBDatabaseInfo>>}
     */
    static getDBs() {
        return indexedDB.databases();
    }

    /**
     * @param {string} name
     * @returns {IDBOpenDBRequest<void>}
     */
    static async dropDB(name) {
        return indexedDB.deleteDatabase(name);
    }

    /**
     *
     * @param {string} name
     * @returns {IDBDatabase|null}
     */
    static async getDB(name) {
        const dbs = await this.getDBs();
        let info = dbs.find((db) => db.name === name);
        if (!info) {
            return Promise.resolve(null);
        }
        const { _, version } = info;
        const req = indexedDB.open(name, version);
        return new Promise((resolve, reject) => {
            req.onsuccess = e => {
                resolve(e.target.result);
            };

            req.onerror = e => reject(e.target.error);
        });
    }


    /**
     * 
     * @param {string} name 
     * @returns {IDBOPCtx}
     */
    static async createIDBOpCtx(name) {
        /**
         * @type {IDBDatabase}
         * check the db whose name is is dbName exists or not.
         */
        const db = await IDBManager.getDB(name);
        const version = db ? db.version + 1 : 1;
        return new IDBOPCtx(name, version, db);
    }
}



const test = async () => {
    const dbOpCtx = await IDBManager.createIDBOpCtx("test");
    dbOpCtx.deleteStore("class", "create");
    const t = await dbOpCtx.getCurDBconfig();
    console.log(t);
    const db = await dbOpCtx.build();
    console.log(db);
};

test();
