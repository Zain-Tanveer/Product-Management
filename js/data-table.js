import { products } from "../utils/data.js";

console.log(user.products);

class DataTable {
  // constructor
  constructor() {
    this.filteredProducts = user.products;
    this.checkboxProducts = [];
    this.sortDirection = 1; // Sort direction: 1 for ascending, -1 for descending
    this.sortColumn = ""; // Column to sort

    const tableEl = document.getElementById("data-table");
    const tableBody = document.getElementById("table-body");

    this.renderTable();

    let prevSortable;

    // event listeners

    // for data sorting by clicking headers
    tableEl.querySelectorAll("th.sortable").forEach((th) => {
      th.addEventListener("click", (e) => {
        const sortableEl_id = Object.values(th.dataset)[0];
        this.handleSort(sortableEl_id);

        const upArrow = th.querySelector(".arrow-up");
        const downArrow = th.querySelector(".arrow-down");

        if (prevSortable) {
          prevSortable.style.opacity = 0.5;
        }

        if (this.sortDirection === 1) {
          upArrow.style.opacity = 1;
          downArrow.style.opacity = 0.5;
          prevSortable = upArrow;
        } else {
          upArrow.style.opacity = 0.5;
          downArrow.style.opacity = 1;
          prevSortable = downArrow;
        }
      });
    });

    // for select box to select a row
    tableBody.querySelectorAll(".selectBox").forEach((checkbox) => {
      checkbox.addEventListener("change", () => {
        const product_id = checkbox.getAttribute("data-id").split("-")[1];
        console.log(typeof product_id);
        if (checkbox.checked) {
          this.checkboxProducts.push(
            this.filteredProducts.find(
              (product) => product.id === parseInt(product_id)
            )
          );
          console.log(this.checkboxProducts);
          this.renderSelectProducts();
        } else {
          this.checkboxProducts = this.checkboxProducts.filter(
            (product) => product.id !== parseInt(product_id)
          );
          this.renderSelectProducts();
        }
      });
    });

    // for filtering data
    const searchEl = document.getElementById("search-text");
    const filterOptionsEl = document.getElementById("filter-options");
    searchEl.addEventListener("keyup", () => {
      const filterBy = filterOptionsEl.value;
      const searchValue = searchEl.value;

      if (searchValue !== "") {
        const filterProducts = this.filteredProducts.filter((product) => {
          if (typeof product[filterBy] === "string") {
            return product[filterBy]
              .toLowerCase()
              .includes(searchValue.toLowerCase());
          } else {
            return product[filterBy].toString().includes(searchValue);
          }
        });

        this.renderTable(filterProducts);
      } else {
        this.renderTable();
      }
    });

    filterOptionsEl.addEventListener("change", () => {
      searchEl.value = "";
    });

    // for adding custom columns
    const customColumnsButtonEl = document.querySelector(
      ".columns-dropdown-button"
    );
    const customColumnsDropdownEl = document.querySelector(
      ".columns-dropdown-content"
    );

    customColumnsButtonEl.addEventListener("click", () => {
      if (customColumnsDropdownEl.style.display === "none") {
        customColumnsDropdownEl.style.display = "block";
        customColumnsButtonEl.classList.add("columns-dropdown-button-hover");
      } else {
        customColumnsDropdownEl.style.display = "none";
        customColumnsButtonEl.classList.remove("columns-dropdown-button-hover");
      }
    });

    customColumnsDropdownEl.querySelectorAll("p").forEach((p) => {
      p.addEventListener("click", () => {
        DataTable.#addCustomHeader(p.textContent, tableEl, tableBody);

        const successMessageEl = document.getElementById("success-message");
        const successMessageP = document.querySelector("#success-message p");
        successMessageP.innerHTML = `'${p.textContent}' column added!`;
        successMessageEl.style.display = "flex";

        setTimeout(() => {
          successMessageEl.style.display = "none";
        }, 4000);

        customColumnsDropdownEl.style.display = "none";
        customColumnsButtonEl.classList.remove("columns-dropdown-button-hover");
      });
    });

    customColumnsDropdownEl
      .querySelector(".columns-dropdown-submit")
      .addEventListener("click", () => {
        const pattern = /^[A-Za-z\s]+$/;
        const customColumnText =
          customColumnsDropdownEl.querySelector("input").value;

        const customColumnError = customColumnsDropdownEl.querySelector(
          ".custom-column-error"
        );

        if (customColumnText.length === 0) {
          customColumnError.innerHTML = "*please enter a name";
        } else if (!pattern.test(customColumnText)) {
          customColumnError.innerHTML = "*name should only have alphabets";
        } else {
          DataTable.#addCustomHeader(customColumnText, tableEl, tableBody);

          const successMessageEl = document.getElementById("success-message");
          const successMessageP = document.querySelector("#success-message p");
          successMessageP.innerHTML = `'${customColumnText}' column added!`;
          successMessageEl.style.display = "flex";

          setTimeout(() => {
            successMessageEl.style.display = "none";
          }, 4000);

          customColumnError.innerHTML = "";
          customColumnsDropdownEl.style.display = "none";
          customColumnsButtonEl.classList.remove(
            "columns-dropdown-button-hover"
          );
        }
      });

    // for actions modal
    document.querySelectorAll(".dropdown-content a").forEach((a) => {});

    // for success message div
    document
      .getElementById("success-message-cross")
      .addEventListener("click", () => {
        document.getElementById("success-message").style.display = "none";
      });
  }

  // function for rendering table
  renderTable(products = this.filteredProducts) {
    const tbodyEl = document.getElementById("table-body");
    tbodyEl.innerHTML = "";

    for (let [index, product] of products.entries()) {
      const tr = document.createElement("tr");
      const checkboxEl = DataTable.#createCheckbox(product.id);

      tr.appendChild(checkboxEl);

      for (let key in product) {
        const td = document.createElement("td");
        td.textContent = product[key];

        if (key === "title") {
          td.classList.add("title");
        }
        if (key === "description") {
          td.classList.add("description");
        }

        tr.appendChild(td);
      }

      const tableThLength = document.querySelectorAll(
        "#data-table thead tr th"
      ).length;

      const lengthDiff = tableThLength - products.length;

      if (lengthDiff) {
        for (let i = 0; i < lengthDiff; i++) {
          const customTd = DataTable.#createTd("null");
          customTd.style.color = "#0000005c";
          tr.appendChild(customTd);
        }
      }

      let actionsTd;

      if (
        index > this.filteredProducts.length - 4 &&
        this.filteredProducts.length > 6
      ) {
        actionsTd = DataTable.#createActions(true, product);
      } else {
        actionsTd = DataTable.#createActions(false, product);
      }

      tr.appendChild(actionsTd);

      tbodyEl.appendChild(tr);
    }
  }

  renderSelectProducts() {
    const selectedProductsDiv = document.getElementById("selected-products");
    selectedProductsDiv.innerHTML = "";
    this.checkboxProducts.forEach((product) => {
      selectedProductsDiv.innerHTML += `<p class="selected-product">${product.id} , ${product.name} , ${product.title}</p>`;
    });
  }

  // handle sorting
  handleSort(column) {
    if (column === this.sortColumn) {
      this.sortDirection = -this.sortDirection;
    } else {
      this.sortColumn = column;
      this.sortDirection = -1;
    }

    this.filteredProducts.sort((a, b) => {
      let valueA = a[column];
      let valueB = b[column];

      if (typeof valueA === "string") {
        valueA = valueA.toLowerCase();
        valueB = valueB.toLowerCase();
      }

      if (valueA < valueB) {
        return -this.sortDirection;
      }
      if (valueA > valueB) {
        return this.sortDirection;
      }

      return 0;
    });

    this.renderTable();
  }

  // function to add custom table header
  static #addCustomHeader(text, tableEl, tableBody) {
    const tableThs = tableEl.querySelectorAll("thead tr th");
    const lastTh = tableThs[tableThs.length - 1];
    const th = DataTable.#createTh(text);

    lastTh.parentNode.insertBefore(th, lastTh);

    const tbodyTrs = tableBody.querySelectorAll("tr");
    tbodyTrs.forEach((tr) => {
      const tds = tr.querySelectorAll("td");
      const lastTd = tds[tds.length - 1];
      const td = DataTable.#createTd("null");
      td.style.color = "#0000005c";

      lastTd.parentNode.insertBefore(td, lastTd);
    });
  }

  // function to create a table th
  static #createTh(text) {
    const th = document.createElement("th");
    th.textContent = text;

    return th;
  }

  // function to create a table td
  static #createTd(text) {
    const td = document.createElement("td");
    td.textContent = text;

    return td;
  }

  // function for creating the checkbox td
  static #createCheckbox(data_id) {
    const td = document.createElement("td");
    td.classList.add("fixed-column");

    const inputEl = document.createElement("input");
    inputEl.setAttribute("type", "checkbox");
    inputEl.classList.add("selectBox");
    inputEl.setAttribute("data-id", `selectbox-${data_id}`);

    td.appendChild(inputEl);

    return td;
  }

  // function for creating actions dropdown
  static #createActions(bottomEl, product) {
    const td = document.createElement("td");
    td.classList.add("actions");

    const dropdownDiv = document.createElement("div");
    dropdownDiv.classList.add("dropdown");

    const buttonEl = document.createElement("button");
    buttonEl.classList.add("dropdownButton");
    const buttonI = document.createElement("i");
    buttonI.classList.add("fa", "fa-ellipsis-v", "dropIcon");
    buttonEl.appendChild(buttonI);

    const dropdownContentDiv = document.createElement("div");
    dropdownContentDiv.classList.add("dropdown-content");

    const viewAnchor = DataTable.#createActionAnchors(
      "View Product",
      "viewProduct",
      ["fa", "fa-eye"]
    );
    const editAnchor = DataTable.#createActionAnchors(
      "Edit Product",
      "editProduct",
      ["fa", "fa-edit"]
    );
    const deleteAnchor = DataTable.#createActionAnchors(
      "Delete Product",
      "deleteProduct",
      ["fa", "fa-trash"]
    );

    viewAnchor.setAttribute("data-modal", "view-modal");
    editAnchor.setAttribute("data-modal", "edit-modal");
    deleteAnchor.setAttribute("data-modal", "delete-modal");

    // event listeners for anchors
    viewAnchor.addEventListener("click", () => {
      const modalEl = document.getElementById(`${viewAnchor.dataset.modal}`);
      DataTable.#viewModalData(modalEl, product);
      modalEl.showModal();

      const closeButton = modalEl.querySelector("#view-close-button");
      closeButton.addEventListener("click", () => {
        modalEl.close();
      });
    });
    editAnchor.addEventListener("click", () => {
      const modalEl = document.getElementById(`${editAnchor.dataset.modal}`);
      DataTable.#addModalData(modalEl, product);
      modalEl.showModal();

      const formEl = modalEl.querySelector(`#modal-edit-form`);
      formEl.addEventListener("submit", (e) => {
        e.preventDefault();
        modalEl.close();
      });
    });
    deleteAnchor.addEventListener("click", () => {
      const modalEl = document.getElementById(`${deleteAnchor.dataset.modal}`);
      modalEl.showModal();

      const cancelButton = modalEl.querySelector("#delete-cancel-button");
      cancelButton.addEventListener("click", () => {
        modalEl.close();
      });
      const deleteButton = modalEl.querySelector("#delete-delete-button");
      deleteButton.addEventListener("click", () => {
        modalEl.close();
      });
    });

    dropdownContentDiv.appendChild(viewAnchor);
    dropdownContentDiv.appendChild(editAnchor);
    dropdownContentDiv.appendChild(deleteAnchor);

    if (bottomEl) {
      dropdownDiv.classList.add("dropdown-bottom");
      buttonEl.classList.add("dropdownButton-bottom");
      dropdownContentDiv.classList.add("dropdown-content-bottom");
    }

    dropdownDiv.appendChild(buttonEl);
    dropdownDiv.appendChild(dropdownContentDiv);

    td.appendChild(dropdownDiv);
    return td;
  }

  // function for creating anchor elements of dropdown-content
  static #createActionAnchors(text, className, iconClasses = []) {
    const anchorEl = document.createElement("a");
    anchorEl.classList.add(className);
    anchorEl.setAttribute("data-open-modal", true);

    const spanEl = document.createElement("span");
    spanEl.textContent = text;

    const anchorI = document.createElement("i");
    anchorI.classList.add(...iconClasses);

    anchorEl.appendChild(spanEl);
    anchorEl.appendChild(anchorI);

    return anchorEl;
  }

  // function to add modal data in edit modal
  static #addModalData(modalEl, product) {
    modalEl.querySelector("#modal-edit-name").value = product.name;
    modalEl.querySelector("#modal-edit-title").value = product.title;
    modalEl.querySelector("#modal-edit-desc").innerHTML = product.description;
    modalEl.querySelector("#modal-edit-vendor").value = product.vendor;
    modalEl.querySelector("#modal-edit-in-stock").value = product.in_stock;
    modalEl.querySelector("#modal-edit-sale-price").value = product.sale_price;
    modalEl.querySelector("#modal-edit-product-type").value =
      product.product_type;
    modalEl.querySelector("#modal-edit-address").value =
      product.product_location;
    modalEl.querySelector("#modal-edit-buying-price").value =
      product.buying_price;
    modalEl.querySelector("#modal-edit-purchase-quantity").value =
      product.purchase_quantity;
    modalEl.querySelector("#modal-edit-shipping-rates").value =
      product.shipping_rates;
    modalEl.querySelector("#modal-edit-refill-limit").value =
      product.refill_limit;
  }

  // function to add modal data in view modal
  static #viewModalData(modalEl, product) {
    modalEl.querySelector("#modal-view-name p").innerHTML = product.name;
    modalEl.querySelector("#modal-view-title p").innerHTML = product.title;
    modalEl.querySelector("#modal-view-desc p").innerHTML = product.description;
    modalEl.querySelector("#modal-view-vendor p").innerHTML = product.vendor;
    modalEl.querySelector("#modal-view-in-stock p").innerHTML =
      product.in_stock;
    modalEl.querySelector("#modal-view-sale-price p").innerHTML =
      product.sale_price;
    modalEl.querySelector("#modal-view-product-type p").innerHTML =
      product.product_type;
    modalEl.querySelector("#modal-view-address p").innerHTML =
      product.product_location;
    modalEl.querySelector("#modal-view-buying-price p").innerHTML =
      product.buying_price;
    modalEl.querySelector("#modal-view-purchase-quantity p").innerHTML =
      product.purchase_quantity;
    modalEl.querySelector("#modal-view-shipping-rates p").innerHTML =
      product.shipping_rates;
    modalEl.querySelector("#modal-view-refill-limit p").innerHTML =
      product.refill_limit;
  }
}

new DataTable();

const modalClose = document.querySelectorAll(".modal-close");
modalClose.forEach((closeEl) => {
  closeEl.addEventListener("click", () => {
    const modalEl = document.getElementById(`${closeEl.dataset.id}`);
    modalEl.close();
  });
});

document.addEventListener("click", (e) => {
  if (e.target.id !== "columns-dropdown-button") {
    const columnsDropdownButtonEl = document.getElementById(
      "columns-dropdown-button"
    );
    const columnsDropdownEl = document.querySelector(
      ".columns-dropdown-content"
    );
    columnsDropdownEl.style.display = "none";
    columnsDropdownButtonEl.classList.remove("columns-dropdown-button-hover");
  }
});
