/**
 * @abstract
 */
class CanStore {
    /**
     * returns the keyPath for the object store
     * 
     * @throws {Error} if not implemented by subclass
     * @returns {string}
     */
    static keyPath() {
        throw new Error("This is an abstract method and must be implemented by subclasses.");
    }

    /**
     * returns whether the keyPath is autoIncrement
     * 
     * @throws {Error} if not implemented by subclass
     * @returns {boolean}
     */
    static autoIncrement() {
        throw new Error("This is an abstract method and must be implemented by subclasses.");
    }

    /**
     * returns the indices for the object store
     * 
     * @throws {Error} if not implemented by subclass
     * @returns {Iterable<IndexedDBIndexConfig>}
     */
    static indices() {
        throw new Error("This is an abstract method and must be implemented by subclasses.");
    }
}

/**
 * @class IndexedDBConfig
 * @description Configuration class for IndexedDB setup
 */
class IndexedDBConfig {
    /**
     * @type {Set<new(...args:any[]) => CanStore>} store classes to be used in the IndexedDB
     */
    #storeClass;
    constructor() {
        this.#storeClass = new Set();
    }

    /**
     * add a store class to the config
     * @param {...(new(...args:any[]) => CanStore)} storeClass storeClass 
     * @returns {IndexedDBConfig} for chaining calls
     */
    add(...storeClass) {
        storeClass.forEach(cls => {
            if (!(cls.prototype instanceof CanStore)) {
                throw new Error("storeClass must be a subclass of CanStore");
            }
            this.#storeClass.add(cls)
            return this;
        });
    }

    /**
     * @return {Set<new(...args:any[]) => CanStore>} get the store classes
     */
    get classes() {
        return this.#storeClass;
    }
}

/**
 * @class IndexDbIndexConfig
 * @description Configuration class for IndexedDB index
 */
class IndexDbIndexConfig {
    /**
     * @param {string} name 
     * @param {boolean} unique 
     */
    constructor(name, unique) {
        this.name = name;
        this.unique = unique;
    }
}

/**
 * Creates a function that returns a singleton IndexedDB instance.
 * 
 * @param {string} dbName 
 * @param {number} version
 * @param {IndexedDBConfig} config
 * @returns {() => Promise<IDBDatabase>} an IndexedDB instance
 */
const createDbFunction = (dbName, version, config) => {
    /**
     * @type {IDBDatabase|null}
     */
    let db = null;
    const getIndexDbInstance = () => {
        if (db) {
            return Promise.resolve(db);
        }
        const req = indexedDB.open(dbName, version);
        return new Promise((resolve, reject) => {
            req.onsuccess = e => {
                db = e.target.result;
                resolve(db)
            };

            req.onupgradeneeded = e => {
                db = e.target.result;
                config.classes.forEach(cls => {
                    const storeName = cls.name;
                    const keyPath = cls.keyPath();
                    const autoIncrement = cls.autoIncrement();
                    const indices = cls.indices();
                    const store = db.createObjectStore(storeName, { keyPath, autoIncrement });
                    indices.forEach(index => {
                        store.createIndex(index.name, index.name, { unique: index.unique });
                    })
                })
            }

            req.onerror = e => {
                reject(e.target.error);
            };
        })
    }
    return getIndexDbInstance;
}

/**
 * @class IndexDbClient
 * @description Client class for IndexedDB
 */
class IndexDbClient {
    #dbName;
    /**
     * @type {number}
     */
    #version;
    /**
     * @type {IndexedDBConfig}
     */
    #config;
    /**
     * @type {IDBDatabase|null}
     */
    #db;
    /**
     * 
     * @param {string} dbName the name of the IndexedDB
     * @param {string} version the version of the IndexedDB
     * @param {IndexedDBConfig} config the configuration for the IndexedDB, which contains the store classes
     */
    constructor(dbName, version, config) {
        this.#dbName = dbName;
        this.#version = version;
        this.#config = config;
        createDbFunction(dbName, version, config)().then(db => {
            this.#db = db;
        });
    }

    /**
     * 
     * @param {any} obj
     * @returns {} the checked object 
     */
    check(obj) {
        if (!(obj instanceof CanStore)) {
            throw new Error("obj must be an instance of CanStore");
        }
    }
    /**
     * 
     * @param  {...CanStore} objs 
     * @returns {Promise<Iterable<CanStore>>}
     */
    async add(...objs) {
        if (this.#db) {
            this.add = async (...objs) => {
                return Promise.all(objs.map(obj => {
                    this.check(obj);
                    const storeName = obj.constructor.name;
                    const tx = this.#db.transaction(storeName, "readwrite");
                    const store = tx.objectStore(storeName);
                    const req = store.add(obj);
                    return new Promise((resolve, reject) => {
                        req.onsuccess = e => {
                            resolve(e.target.result);
                        }

                        req.onerror = e => {
                            reject(e.target.error);
                        };

                        tx.oncomplete = () => {
                            resolve(obj);
                        }
                    })
                }))
            }
            this.add(...objs);
        } else {
            await createDbFunction(this.#dbName, this.#version, this.#config)().then(db => {
                this.#db = db;
            });
            return this.add(...objs);
        }
    }

    /**
     * returns all instances of a class
     * 
     * @param {new(...args:any[]) => CanStore} cls 
     * @returns {AsyncGenerator<CanStore, void, unknown>} a generator that yields all instances of the class
     */
    async *getAll(cls) {
        if (!(cls.prototype instanceof CanStore)) {
            throw new Error("cls must be a subclass of CanStore");
        }

        if (!this.#db) {
            this.#db = await createDbFunction(
                this.#dbName,
                this.#version,
                this.#config
            )();
        }

        const storeName = cls.name;
        const tx = this.#db.transaction(storeName, "readonly");
        const store = tx.objectStore(storeName);

        let request = store.openCursor();

        while (true) {
            const cursor = await new Promise((resolve, reject) => {
                request.onsuccess = e => resolve(e.target.result);
                request.onerror = e => reject(e.target.error);
            });

            if (!cursor) {
                break;
            }
            yield cursor.value;
            cursor.continue();
        }
    }
}
