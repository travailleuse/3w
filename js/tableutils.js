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

    init(config) {
        // this.#table.style.width = config.width;
        // this.#table.style.border = config.border ? "1px solid black" : "none";
        // this.#table.style.borderCollapse = config.borderCollapse ? "collapse" : "separate";
        // this.#table.style.borderStyle = config.borderStyle;
        // this.#table.style.borderWidth = config.borderWidth;
        // this.#table.style.borderColor = config.borderColor;
        // this.#table.style.padding = config.padding;
        // this.#table.style.textAlign = config.textAlign;
        // this.#table.style.userSelect = config.userSelect;
        // this.#caption.style.textAlign = config.textAlign;
        let thead = this.#thead;
        let tr = document.createElement("tr");
        config.fileds.forEach(field => {
            let th = document.createElement("th");
            th.textContent = field;
            th.style.textAlign = config.textAlign;
            tr.appendChild(th);
        });
        thead.appendChild(tr);
    }

    get table() {
        return this.#table;
    }

}

let app = document.getElementById('app');

const table = new Table("person");
table.init({
    width: "100%",
    backgroundColor: "white",
    border: true,
    borderCollapse: true,
    borderStyle: "solid",
    borderWidth: "1px",
    borderColor: "black",
    padding: "1em 1em",
    textAlign: "center",
    userSelect: "none",
    fileds: [
        'id',
        'name',
        'gender'
    ]

});
console.log(table);

app.append(table.table);