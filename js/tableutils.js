/**
 * @file js/tableutils.js
 * @description Table utility classes and functions
 * @author csw
 * @module tableutils
 * @version 1.0.0
 */



class TableStyleConfig {
    border = true;
    borderCollapse = true;
    borderStyle = "solid";
    borderWidth = "1px";
    borderColor = "black";
    padding = "1em 1em";
    textAlign = "center";
    userSelect = "none";
    fileds = [
        'id',
        'name',
        'gender'
    ]
}

class Table {
    /**
     * @type {HTMLTableElement}
     */
    #table;
    /**
     * @type {HTMLTableCaptionElement}
     */
    #caption;
    /**
     * @type {HTMLTableSectionElement}
     */
    #thead;
    /**
     * @type {HTMLTableSectionElement}
     */
    #tbody;
    /**
     * @type {HTMLTableSectionElement|null}
     */
    #tfoot;
    constructor(tableId, hasFoot = false) {
        let table = document.createElement("table");
        table.id = tableId;
        let caption = document.createElement("caption");
        caption.id = `${tableId}-caption`
        let thead = document.createElement("thead");
        thead.id = `${tableId}-thead`;
        let tbody = document.createElement("tbody");
        tbody.id = `${tableId}-tbody`;
        let tfoot = null;
        if (hasFoot) {
            tfoot = document.createElement("tfoot");
            tfoot.id = `${tableId}-tfoot`;
            table.appendChild(tfoot)
        }
        table.appendChild(caption);
        table.appendChild(thead);
        table.appendChild(tbody);
        this.#table = table;
        this.#caption = caption;
        this.#thead = thead;
        this.#tbody = tbody;
        this.#tfoot = tfoot;
    }

    /**
     * 
     * @param {{fields:string[]}} config 
     */
    init(config) {
        let thead = this.#thead;
        let tr = document.createElement("tr");
        config.fields.forEach(field => {
            let th = document.createElement("th");
            th.innerText = field;
            tr.appendChild(th);
        });
        thead.appendChild(tr);
    }

    mount(app) {
        app.appendChild(this.#table);
    }

    get table() {
        return this.#table;
    }

}