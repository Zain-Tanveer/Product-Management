import { products } from "../utils/data.js";

let newProduct_id = user.products[user.products.length - 1]?.id + 1 || 1;

class DataTable {
  // constructor
  constructor() {
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
            user.products.find((product) => product.id === parseInt(product_id))
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
        const filterProducts = user.products.filter((product) => {
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

        DataTable.toggleSuccessMessage(`'${p.textContent}' column added!`);

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

          DataTable.toggleSuccessMessage(`'${customColumnText}' column added!`);

          customColumnError.innerHTML = "";
          customColumnsDropdownEl.style.display = "none";
          customColumnsButtonEl.classList.remove(
            "columns-dropdown-button-hover"
          );
        }
      });

    // for view modal
    const addProductModal = document.getElementById("add-modal");
    const formEl = document.getElementById("modal-add-form");

    document
      .querySelector("#add-product-toolbar")
      .addEventListener("click", () => {
        addProductModal.showModal();
      });

    formEl.addEventListener("submit", (e) => {
      e.preventDefault();
      const isError = DataTable.validateFormInputs(formEl);
      if (!isError) {
        this.addProduct(formEl);
        addProductModal.close();
        this.renderTable();
      } else {
        addProductModal.scrollTop = 0;
      }
    });
  }

  // function for rendering table
  renderTable(products = user.products) {
    const tbodyEl = document.getElementById("table-body");
    tbodyEl.innerHTML = "";

    const tableContainer = document.querySelector(".table-container");
    // const actionsTh = tableContainer.querySelector(
    //   "#data-table thead tr th.actionsTH"
    // );

    const noProductsEl = document.querySelector(".no-products");
    if (products.length === 0) {
      tableContainer.style.overflow = "hidden";
      // actionsTh.style.position = "relative";
      noProductsEl.style.display = "flex";
    } else {
      noProductsEl.style.display = "none";
      tableContainer.style.overflow = "auto";
      // actionsTh.style.position = "sticky";
    }

    for (let [index, product] of products.entries()) {
      let tr = document.createElement("tr");
      const checkboxEl = DataTable.#createCheckbox(product.id);

      tr.appendChild(checkboxEl);

      DataTable.#getTableHeaders().forEach((tableTh) => {
        const td = document.createElement("td");
        td.textContent = product[tableTh];

        if (tableTh === "title") {
          td.classList.add("title");
        }
        if (tableTh === "description") {
          td.classList.add("description");
        }

        tr.appendChild(td);
      });

      const tableThLength = document.querySelectorAll(
        "#data-table thead tr th"
      ).length;

      const lengthDiff = tableThLength - (Object.keys(product).length + 2);

      if (lengthDiff) {
        for (let i = 0; i < lengthDiff; i++) {
          const customTd = DataTable.#createTd("null");
          customTd.style.color = "#0000005c";
          tr.appendChild(customTd);
        }
      }

      let actionsTd;

      if (index > user.products.length - 4 && user.products.length > 6) {
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

    user.products.sort((a, b) => {
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

  // function to add a product
  addProduct(formEl) {
    const newProduct = {};
    newProduct.id = newProduct_id;
    newProduct.name = formEl.querySelector("#modal-add-name").value || "";
    newProduct.title = formEl.querySelector("#modal-add-title").value || "";
    newProduct.vendor = formEl.querySelector("#modal-add-vendor").value || "";
    newProduct.description =
      formEl.querySelector("#modal-add-desc").value || "";
    newProduct.in_stock =
      parseInt(formEl.querySelector("#modal-add-in-stock").value) || 0;
    newProduct.sale_price =
      parseInt(formEl.querySelector("#modal-add-sale-price").value) || 0;
    newProduct.product_type =
      formEl.querySelector("#modal-add-product-type").value || "";
    newProduct.product_location =
      formEl.querySelector("#modal-add-address").value || "";
    newProduct.buying_price =
      parseInt(formEl.querySelector("#modal-add-buying-price").value) || 0;
    newProduct.purchase_quantity =
      parseInt(formEl.querySelector("#modal-add-purchase-quantity").value) || 0;
    newProduct.shipping_rates =
      parseInt(formEl.querySelector("#modal-add-shipping-rates").value) || 0;
    newProduct.refill_limit =
      parseInt(formEl.querySelector("#modal-add-refill-limit").value) || 0;

    user.products.push(newProduct);

    DataTable.updateLoggedInUser();
    DataTable.updateUsers();
    DataTable.#emptyAddProducts(formEl);
    DataTable.toggleSuccessMessage("Product added successfully!");
    newProduct_id++;
  }

  static editProduct(formEl, product_id) {
    const editedProduct = {};
    editedProduct.id = parseInt(product_id);
    editedProduct.name = formEl.querySelector("#modal-edit-name").value || "";
    editedProduct.title = formEl.querySelector("#modal-edit-title").value || "";
    editedProduct.vendor =
      formEl.querySelector("#modal-edit-vendor").value || "";
    editedProduct.description =
      formEl.querySelector("#modal-edit-desc").value || "";
    editedProduct.in_stock =
      parseInt(formEl.querySelector("#modal-edit-in-stock").value) || 0;
    editedProduct.sale_price =
      parseInt(formEl.querySelector("#modal-edit-sale-price").value) || 0;
    editedProduct.product_type =
      formEl.querySelector("#modal-edit-product-type").value || "";
    editedProduct.product_location =
      formEl.querySelector("#modal-edit-address").value || "";
    editedProduct.buying_price =
      parseInt(formEl.querySelector("#modal-edit-buying-price").value) || 0;
    editedProduct.purchase_quantity =
      parseInt(formEl.querySelector("#modal-edit-purchase-quantity").value) ||
      0;
    editedProduct.shipping_rates =
      parseInt(formEl.querySelector("#modal-edit-shipping-rates").value) || 0;
    editedProduct.refill_limit =
      parseInt(formEl.querySelector("#modal-edit-refill-limit").value) || 0;

    DataTable.#updateUserProducts(editedProduct);
    DataTable.updateLoggedInUser();
    DataTable.updateUsers();
    DataTable.toggleSuccessMessage("Product updated successfully!");
  }

  static deleteProduct(product_id) {
    const updatedProducts = user.products.filter(
      (prod) => prod.id !== product_id
    );
    user.products = updatedProducts;

    DataTable.updateLoggedInUser();
    DataTable.updateUsers();
    DataTable.toggleSuccessMessage("Product deleted successfully!");
  }

  static #emptyAddProducts(formEl) {
    formEl.querySelector("#modal-add-name").value = "";
    formEl.querySelector("#modal-add-title").value = "";
    formEl.querySelector("#modal-add-vendor").value = "";
    formEl.querySelector("#modal-add-desc").value = "";
    formEl.querySelector("#modal-add-in-stock").value = "";
    formEl.querySelector("#modal-add-sale-price").value = "";
    formEl.querySelector("#modal-add-product-type").value = "";
    formEl.querySelector("#modal-add-address").value = "";
    formEl.querySelector("#modal-add-buying-price").value = "";
    formEl.querySelector("#modal-add-purchase-quantity").value = "";
    formEl.querySelector("#modal-add-shipping-rates").value = "";
    formEl.querySelector("#modal-add-refill-limit").value = "";
  }

  // function to update logged in user in local storage
  static updateLoggedInUser() {
    localStorage.setItem("user-logged-in", JSON.stringify(user));
  }

  // function to update users in local storage
  static updateUsers() {
    const users = JSON.parse(localStorage.getItem("users"));
    const updatedUsers = users.map((usr) => {
      if (usr.email === user.email) {
        usr = { ...user };
      }
      return usr;
    });
    localStorage.setItem("users", JSON.stringify(updatedUsers));
  }

  // function to update products of user
  static #updateUserProducts(product) {
    const updatedProducts = user.products.map((prod) => {
      if (prod.id === product.id) {
        return product;
      }
      return prod;
    });

    user.products = updatedProducts;
  }

  // function to get all table headers
  static #getTableHeaders() {
    let tableHeaders = Array.from(
      document.querySelectorAll("#data-table thead tr th")
    );
    tableHeaders = tableHeaders.map((th) => th.dataset.id);
    tableHeaders = tableHeaders.slice(1, -1);

    return tableHeaders;
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
    const viewModalEl = document.getElementById(`${viewAnchor.dataset.modal}`);
    const editModalEl = document.getElementById(`${editAnchor.dataset.modal}`);
    const deleteModalEl = document.getElementById(
      `${deleteAnchor.dataset.modal}`
    );

    viewAnchor.addEventListener("click", () => {
      DataTable.#viewModalData(viewModalEl, product);
      viewModalEl.showModal();
    });

    editAnchor.addEventListener("click", () => {
      DataTable.#addModalData(editModalEl, product);
      editModalEl.setAttribute("data-product-id", product.id);
      editModalEl.showModal();
    });

    deleteAnchor.addEventListener("click", () => {
      deleteModalEl.setAttribute("data-product-id", product.id);
      deleteModalEl.showModal();
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
    modalEl.querySelector("#modal-edit-desc").value = product.description;
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

  // function to validate form inputs
  static validateFormInputs(formEl) {
    const nameErr = formEl.querySelector('[id^="modal-"][id$="-name-error"]');
    const titleErr = formEl.querySelector('[id^="modal-"][id$="-title-error"]');
    const descErr = formEl.querySelector('[id^="modal-"][id$="-desc-error"]');
    const vendorErr = formEl.querySelector(
      '[id^="modal-"][id$="-vendor-error"]'
    );
    const productTypeErr = formEl.querySelector(
      '[id^="modal-"][id$="-product-type-error"]'
    );
    const addressErr = formEl.querySelector(
      '[id^="modal-"][id$="-address-error"]'
    );

    nameErr.textContent = "";
    titleErr.textContent = "";
    descErr.textContent = "";
    vendorErr.textContent = "";
    productTypeErr.textContent = "";
    addressErr.textContent = "";

    let isError = false;

    const name = formEl.querySelector('[id^="modal-"][id$="-name"]').value;
    if (name.length < 3) {
      nameErr.textContent = "Name should have at least 3 characters";
      isError = true;
    }

    const title = formEl.querySelector('[id^="modal-"][id$="-title"]').value;
    if (title.length < 3) {
      titleErr.textContent = "Title should have at least 3 characters";
      isError = true;
    }

    const description = formEl.querySelector(
      '[id^="modal-"][id$="-desc"]'
    ).value;
    if (description.length < 3) {
      descErr.textContent = "Description should have at least 3 characters";
      isError = true;
    }

    const vendor = formEl.querySelector('[id^="modal-"][id$="-vendor"]').value;
    if (vendor.length < 3) {
      vendorErr.textContent = "Vendor should have at least 3 characters";
      isError = true;
    }

    const product_type = formEl.querySelector(
      '[id^="modal-"][id$="-product-type"]'
    ).value;
    if (product_type.length < 3) {
      productTypeErr.textContent =
        "Product type should have at least 3 characters";
      isError = true;
    }

    const address = formEl.querySelector(
      '[id^="modal-"][id$="-address"]'
    ).value;
    if (address.length < 3) {
      addressErr.textContent = "Address should have at least 3 characters";
      isError = true;
    }

    return isError;
  }

  // function toggle success message
  static toggleSuccessMessage(message, duration = 3500) {
    const successMessageEl = document.getElementById("success-message");
    const successMessageP = document.querySelector("#success-message p");
    const progressBarEl = document.getElementById("progressBar");
    successMessageP.innerHTML = message;
    successMessageEl.style.display = "flex";

    const startTime = new Date().getTime();

    const id = setInterval(frame, 10);
    function frame() {
      const currentTime = new Date().getTime();
      const elapsedTime = currentTime - startTime;
      const progress = (elapsedTime / duration) * 100;

      if (progress >= 100) {
        clearInterval(id);
      } else {
        progressBarEl.style.width = progress + "%";
      }
    }

    setTimeout(() => {
      successMessageEl.style.display = "none";
    }, duration + 500);
  }
}

const table = new DataTable();

const modalClose = document.querySelectorAll(".modal-close");
modalClose.forEach((closeEl) => {
  closeEl.addEventListener("click", () => {
    const modalEl = document.getElementById(`${closeEl.dataset.id}`);
    modalEl.close();
  });
});

const viewModalEl = document.getElementById(`view-modal`);
const editModalEl = document.getElementById(`edit-modal`);
const deleteModalEl = document.getElementById(`delete-modal`);

const viewCloseButton = viewModalEl.querySelector("#view-close-button");
viewCloseButton.addEventListener("click", () => {
  viewModalEl.close();
});

const editFormEl = editModalEl.querySelector(`#modal-edit-form`);
editFormEl.addEventListener("submit", (e) => {
  e.preventDefault();

  const isError = DataTable.validateFormInputs(editFormEl);
  if (!isError) {
    DataTable.editProduct(editFormEl, editModalEl.dataset.productId);
    table.renderTable();
    editModalEl.close();
  } else {
    addProductModal.scrollTop = 0;
  }
});

const deleteCancelButton = deleteModalEl.querySelector("#delete-cancel-button");
deleteCancelButton.addEventListener("click", () => {
  deleteModalEl.close();
});

const deleteDeleteButton = deleteModalEl.querySelector("#delete-delete-button");
deleteDeleteButton.addEventListener("click", () => {
  DataTable.deleteProduct(parseInt(deleteModalEl.dataset.productId));
  table.renderTable();
  deleteModalEl.close();
});

// for dummy product
document.getElementById("add-dummy-product").addEventListener("click", (e) => {
  user.products.push(products[0]);
  table.renderTable();
  DataTable.updateLoggedInUser();
  DataTable.updateUsers();
  DataTable.toggleSuccessMessage("Product added successfully!");
});

// for success message div
document
  .getElementById("success-message-cross")
  .addEventListener("click", () => {
    document.getElementById("success-message").style.display = "none";
  });

// document.addEventListener("click", (e) => {
//   if (e.target.id !== "columns-dropdown-button") {
//     const columnsDropdownButtonEl = document.getElementById(
//       "columns-dropdown-button"
//     );
//     const columnsDropdownEl = document.querySelector(
//       ".columns-dropdown-content"
//     );
//     columnsDropdownEl.style.display = "none";
//     columnsDropdownButtonEl.classList.remove("columns-dropdown-button-hover");
//   }
// });

const logoutEl = document.getElementById("logout");

logoutEl.addEventListener("click", () => {
  DataTable.toggleSuccessMessage("Logout Successful", 1500);
  localStorage.removeItem("user-logged-in");
  setTimeout(() => {
    window.location.href = "/";
  }, 1500);
});
