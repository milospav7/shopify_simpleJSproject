// Item Controller
const ItemCtrl = (() => {
    // Item Constructor
    class Item {
        constructor(id, name, price) {
            this.id = id;
            this.name = name;
            this.price = price;
        }
    }

    // Data Structure / State
    const data = {
        items: [
            // { id: 0, name: 'Watch', price: 500 },
            // { id: 1, name: 'Bag', price: 200 }
        ],
        currentItem: null,
        totalPrice: 0
    }

    return {
        getItems: () => {
            return data.items;
        },

        addItem: (name, price) => {
            let ID;
            // Create ID
            if(data.items.length > 0) {
                ID = data.items[data.items.length - 1].id + 1;
            } else {
                ID = 0;
            }

            // Price to integer
            price = parseInt(price)

            // Create new item
            newItem = new Item(ID, name, price);

            data.items.push(newItem);

            return newItem;
        },

        getItemByID: (id) => {
            let found = null;
            data.items.forEach((item) => {
                if(item.id === id) {
                    found = item;
                }
            });

            return found;
        },

        updateItem: (name, price) => {
            // Parse price to number    
            price = parseInt(price);

            let found = null;

            data.items.forEach((item) => {
                if(item.id === data.currentItem.id) {
                    item.name = name;
                    item.price = price;

                    found = item;
                }
            });
            return found;
        },

        setCurrentItem: (item) => {
            data.currentItem = item;
        },

        deleteItem: (id) => {
            // Get ids
            const ids = data.items.map((item) => item.id);

            // Get index
            const index = ids.indexOf(id);

            // Remove item
            data.items.splice(index, 1);
        },

        clearAllItems: () => {
            data.items = [];
        },

        getCurrentItem: () => {
            return data.currentItem;
        },

        getTotalPrice: () => {
            let total = 0;

            // Loop through items and sum
            data.items.forEach((item) => {
                total += item.price;
            });

            // Set total price in data structure    
            data.totalPrice = total;

            // Return total
            return data.totalPrice;
        },

        logData: () => {
            return data;
        }
    }
})();

// UI Controller
const UICtrl = (() => {
    // UI selectors
    const UISelectors = {
        itemList: 'item-list',
        addBtn: '.add-btn',
        deleteBtn: '.delete-btn',
        updateBtn: '.update-btn',
        backBtn: '.back-btn',
        clearBtn: '.clear-btn',
        itemNameInput: '#item-name',
        itemPriceInput: '#item-price',
        totalPrice: '.total-price',
        listItems: '#item-list li'
    }

    // Public methods
    return {
        populateItemList: (items) => {
            let html = '';
            items.forEach((item) => {
                html += `
                <li class="list-group-item d-flex justify-content-between align-items-center" id="item-${item.id}">
                    ${item.name}: <em>${item.price} $</em>
                    <a href="#" class="badge badge-info badge-pill ml-auto"><i class="edit-item fas fa-pencil-alt"></i></a>
                </li>
                `;
            })

            // Insert list items
            document.getElementById(UISelectors.itemList).innerHTML = html;
        },

        getItemInput: () => {
            return {
                name: document.querySelector(UISelectors.itemNameInput).value,
                price: document.querySelector(UISelectors.itemPriceInput).value
            }
        },

        addListItem: (item) => {
            // Show list
            document.getElementById(UISelectors.itemList).style.display = 'block';
            // Create li element
            const li = document.createElement('li');
            // Add class
            li.className = 'list-group-item d-flex justify-content-between align-items-center';
            // Add ID
            li.id = `item-${item.id}`;

            // Add HTML
            li.innerHTML = `
                 ${item.name}: <em>${item.price} $</em>
                    <a href="#" class="badge badge-info badge-pill ml-auto"><i class="edit-item fas fa-pencil-alt"></i></a>
            `;

            // Insert item
            document.getElementById(UISelectors.itemList).insertAdjacentElement('beforeend', li);
            
        },

        updateListItem: (item) => {
            let listItems = document.querySelectorAll(UISelectors.listItems);

            // Turn node list into arr  
            listItems = Array.from(listItems);

            listItems.forEach((listItem) => {
                const itemID = listItem .getAttribute('id');

                if(itemID === `item-${item.id}`) {
                    document.querySelector(`#${itemID}`).innerHTML = `
                         ${item.name}: <em>${item.price} $</em>
                    <a href="#" class="badge badge-info badge-pill ml-auto"><i class="edit-item fas fa-pencil-alt"></i></a>
                    `;
                };
            });
            console.log(listItems);
        },

        deleteListItem: (id) => {
            const itemID = `#item-${id}`;
            const item = document.querySelector(itemID);
            item.remove();
        },

        clearInput: () => {
            document.querySelector(UISelectors.itemNameInput).value = '';
            document.querySelector(UISelectors.itemPriceInput).value = '';
        },

        addItemToForm: () => {
            document.querySelector(UISelectors.itemNameInput).value = ItemCtrl.getCurrentItem().name;
            document.querySelector(UISelectors.itemPriceInput).value = ItemCtrl.getCurrentItem().price;
            UICtrl.showEditState();
        },

        hideList: () => {
            document.getElementById(UISelectors.itemList).style.display = 'none';
        },

        showTotalPrice: (total) => {
            document.querySelector(UISelectors.totalPrice).textContent = total;
        },

        clearEditState: () => {
            UICtrl.clearInput();
            document.querySelector(UISelectors.updateBtn).style.display = 'none';
            document.querySelector(UISelectors.deleteBtn).style.display = 'none';
            document.querySelector(UISelectors.backBtn).style.display = 'none';
            document.querySelector(UISelectors.addBtn).style.display = 'inline';
        },

        showEditState: () => {
            document.querySelector(UISelectors.updateBtn).style.display = 'inline';
            document.querySelector(UISelectors.deleteBtn).style.display = 'inline';
            document.querySelector(UISelectors.backBtn).style.display = 'inline';
            document.querySelector(UISelectors.addBtn).style.display = 'none';
        },
        
        getSelectors: () => {
            return UISelectors;
        },

        removeItems: () => {
            let listItems = document.querySelectorAll(UISelectors.listItems);

            // Node to array
            listItems= Array.from(listItems);

            listItems.forEach((item) => {
                item.remove();
            })
        }
    }
})();

// App Controller
const App = ((ItemCtrl, UICtrl) => {
    // Load event listeners 
    const loadEventListeners = () => {
        // First, get selectors
        const UISelectors = UICtrl.getSelectors();

        // Add item event
        document.querySelector(UISelectors.addBtn).addEventListener('click', itemAddSubmit);

        // Disable submit on enter
        document.addEventListener('keypress', (e) => {
            if(e.keyCode === 13) {
                e.preventDefault();

                return false;
            }
        })

        // Edit icon click
        document.getElementById(UISelectors.itemList).addEventListener('click', itemEditClick);

        // Update item event
        document.querySelector(UISelectors.updateBtn).addEventListener('click', itemUpdateSubmit);

        // Delete item event
        document.querySelector(UISelectors.deleteBtn).addEventListener('click', deleteItem);


        // Back / Cancel event 
        document.querySelector(UISelectors.backBtn).addEventListener('click', UICtrl.clearEditState);

        // Clear items event
        document.querySelector(UISelectors.clearBtn).addEventListener('click', clearAll);

    }

    // Add item submit
    const itemAddSubmit = (e) => {
        // Get form input from UI Controller    
        const input = UICtrl.getItemInput();

        // Check for name and price input
        if(input.name !== '' && input.price !== '') {
            // Add item
            const newItem = ItemCtrl.addItem(input.name, input.price);

            // Add item to UI list
            UICtrl.addListItem(newItem);

            // Get total price
            const totalPrice = ItemCtrl.getTotalPrice();

            // Add total price to UI
            UICtrl.showTotalPrice(totalPrice);

            // Clear fields
            UICtrl.clearInput();
        }

        e.preventDefault();
    }

    // Update item 
    const itemEditClick = (e) => {
        if(e.target.classList.contains('edit-item')) {
            // Get the list item id
            const listID = e.target.parentNode.parentNode.id;

            // Break into an array
            const listIDarr = listID.split('-');

            // Get actual ID
            const id = parseInt(listIDarr[1]);

            // Get item
            const itemToEdit = ItemCtrl.getItemByID(id);

            // Set current item
            ItemCtrl.setCurrentItem(itemToEdit);

            // Add item to form
            UICtrl.addItemToForm();
        }

        e.preventDefault();
    }

    const itemUpdateSubmit = (e) => {
        // Get item input
        const input = UICtrl.getItemInput();

        // Update item
        const updatedItem = ItemCtrl.updateItem(input.name, input.price);

        // Update UI
        UICtrl.updateListItem(updatedItem);

        // Get total price
        const totalPrice = ItemCtrl.getTotalPrice();

        // Add total price to UI
        UICtrl.showTotalPrice(totalPrice);

        // Clear fields
        UICtrl.clearEditState();

        e.preventDefault();
    }

    const deleteItem = (e) => {
        // Get current item
        const currItem = ItemCtrl.getCurrentItem();

        // Delete from data structure
        ItemCtrl.deleteItem(currItem.id);

        // Delete from UI
        UICtrl.deleteListItem(currItem.id);

        // Get total price
        const totalPrice = ItemCtrl.getTotalPrice();

        // Add total price to UI
        UICtrl.showTotalPrice(totalPrice);

        // Clear fields
        UICtrl.clearEditState();

        e.preventDefault();
    }

    const clearAll = (e) => {
        // Delete all items from data structure
        ItemCtrl.clearAllItems();

        // Remove from UI
        UICtrl.removeItems();

        // Get total price
        const totalPrice = ItemCtrl.getTotalPrice();

        // Add total price to UI
        UICtrl.showTotalPrice(totalPrice);

        e.preventDefault();
    }

    // Initial state of app
    return {
        init: () => {
            // Clear edit state
            UICtrl.clearEditState();

            // Fetch items from data structure
            const items = ItemCtrl.getItems();

            // Check if any items
            if(items.length === 0) {
                UICtrl.hideList();
            } else {
                // Populate list with items
                UICtrl.populateItemList(items);
            }

            // Get total price
            const totalPrice = ItemCtrl.getTotalPrice();

            // Add total price to UI
            UICtrl.showTotalPrice(totalPrice);

            // Load event listeners
            loadEventListeners();
        }
    }

})(ItemCtrl, UICtrl);

// Initalize defined state
App.init();