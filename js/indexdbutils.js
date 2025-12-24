class IndexConfig {
    #name = null
    #unique = false
    constructor(name, unique = false) {
        this.#name = name
        this.#unique = unique
    }

    get name() {
        return this.#name
    }

    get unique() {
        return this.#unique
    }
}

class CanStored {
    static get keyPath() {
        return null
    }

    static get generator() {
        return null
    }

    static get indexes() {
        return null
    }
}

class ObjectStoreConfig {
    #stores = null
    constructor() {
        this.#stores = new Set();
    }

    get stores() {
        return this.#stores
    }

    add(cls) {
        if (cls.prototype instanceof CanStored === false) {
            throw new TypeError("cls must be a subclass of StoreClass")
        }
        this.#stores.add(cls)
        return this
    }
}

let y = null
class IndexedDBClient {
    #name = null
    #version = null
    #config = null
    #db = null
    constructor(name, version, config) {
        this.#name = name;
        this.#version = version;
        this.#config = config;
        const a = getIndexDbInstance(this.#name, this.#version);
        a(config).then(db => {
            console.log("DB opened successfully:", db);
            this.#db = db;
        }).catch(error => {
            console.error("Error opening DB:", error);
        });
    }

    async getDB(config) {
        const a = getIndexDbInstance(this.#name, this.#version);
        return await a(config);
    }
    check(obj) {
        if (obj instanceof CanStored === false) {
            throw new TypeError("obj must be an instance of StoreClass")
        }
    }

    async add(obj) {
        this.check(obj);
        const db = await this.getDB(this.#config);
        db.transaction([obj.constructor.name], "readwrite").objectStore(obj.constructor.name).add(obj);
    }

    async remove(obj) {
        this.check(obj);
        const db = await this.getDB(this.#config);
        const req = db.transaction([obj.constructor.name], "readwrite").objectStore(obj.constructor.name).delete(obj.id);

        return new Promise((resolve, reject) => {
            req.onsuccess = e=>{
                resolve(e.target.result)
            }
            
            req.onerror = e=>{
                reject(e.error)
            }
        });

    }
}

function getIndexDbInstance(name, version) {
    let db = null
    const _getDB = async (config) => {
        if (db) {
            return Promise.resolve(db)
        }

        if (!name || typeof name !== 'string') {
            Promise.reject(new TypeError("DB name must be a non-empty string"));
            return;
        }

        if (!config || config && !(config instanceof ObjectStoreConfig)) {
            Promise.reject(new TypeError("config must be an instance of ObjectStoreConfig"));
            return;
        }

        return new Promise((resolve, reject) => {
            if (!window.indexedDB) {
                reject(new Error("Your brower don\'t support Indexed DB"));
                return;
            }
            
            const req = window.indexedDB.open(name, version);

            req.onsuccess = e => {
                db = e.target.result
                resolve(e.target.result)
            }

            req.onupgradeneeded = e => {
                db = e.target.result
                config.stores.forEach(cls => {
                    const storeName = cls.name;
                    if (!db.objectStoreNames.contains(storeName)) {
                        let store = db.createObjectStore(storeName, {
                            keyPath: cls.keyPath,
                            autoIncrement: cls.generator
                        });
                        if (cls.indexes) {
                            cls.indexes.forEach(index => {
                                store.createIndex(index.name, index.name, { unique: index.unique });
                            });
                        }
                    }
                })
            }
            req.onerror = e => {
                reject(e.target.error);
            }
        });
    }
    return _getDB
}

class Person extends CanStored {
    constructor(name, gender, birthAt) {
        super();
        this.name = name;
        this.gender = gender;
        this.birthAt = birthAt;
    }

    static get keyPath() {
        return "id";
    }

    static get generator() {
        return true
    }

    static get indexes() {
        const nameConfig = new IndexConfig("name", true);
        const birthAtConfig = new IndexConfig("birthAt", false);
        const genderConfig = new IndexConfig("gender", false);
        return [nameConfig, birthAtConfig, genderConfig];
    }
}

class Course extends CanStored {
    constructor(name, description) {
        super();
        this.name = name;
        this.description = description;
    }

    static get keyPath() {
        return "id";
    }

    static get generator() {
        return true;
    }

    static get indexes() {
        const nameConfig = new IndexConfig("name", true);
        const descriptionConfig = new IndexConfig("description", false);
        return [nameConfig, descriptionConfig];
    }
}

const config = new ObjectStoreConfig();
config.add(Person);
config.add(Course);

const client = new IndexedDBClient("test", 1, config);
console.log(client);
client.add(new Person("John Doe", "Male", new Date("1990-01-01")));
client.add(new Course("Mathematics", "Advanced math course"));

