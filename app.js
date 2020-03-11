// BUDGET CONTROLLER
const budgetController = (function() {
    
    const Expense = function(id, description, value) {
        this.id = id,
        this.description = description,
        this.value = value
    }

    const Income = function(id, description, value) {
        this.id = id,
        this.description = description,
        this.value = value
    }

    let data = {
        allItems: {
            exp: [],
            inc: []
        },
        totals: {
            exp: 0,
            inc: 0
        }
    }

    return {
        addItem: function(type, des, val) {
            let newItem, ID 

            // create new ID
            if (data.allItems[type].length > 0) {
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1
            } else {
                ID = 0
            }

            // create new item based on 'exp' or 'inc' type
            if (type === 'exp') {
                newItem = new Expense(ID, des, val)
            } else if (type === 'inc') {
                newItem = new Expense(ID, des, val)
            }

            // push it into our data structure
            data.allItems[type].push(newItem)

            // return the new element
            return newItem
        },

        testing: function() {
            console.log(data)
        }
    }
})();

// UI CONTROLLER
const UIController = (function() {

    let DOMstrings = {
        inputType: '.add__type', 
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn'
    }
    
    return {
        getInput: function() {
            return {
                type: document.querySelector(DOMstrings.inputType).value, // will be either 'exp' or 'inc'
                description: document.querySelector(DOMstrings.inputDescription).value,
                value: document.querySelector(DOMstrings.inputValue).value
            }
        }, 

        getDOMstrings: function() {
            return DOMstrings
        }
    }
})();


// GLOBAL APP CONTROLLER
const controller = (function(budgetCtrl, UICtrl) {

    const setUpEventListeners = function() {
        let DOM = UICtrl.getDOMstrings()

        document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);

        document.addEventListener('keypress', function(event) {
            if (event.keyCode === 13 || event.which === 13) {
                ctrlAddItem();
            }
        });
    }

    const ctrlAddItem = function() {
        let input, newItem

        // 1. Get the input field data
        input = UICtrl.getInput()

        // 2. Add the item to the budget controller
        newItem = budgetCtrl.addItem(input.type, input.description, input.value)
        
        // 3. Add the item to the UI

        // 4. Calculates the budget

        // 5. Display the budget on the UI
    };

    return {
        init: function() {
           setUpEventListeners() 
           console.log("The app has started")
        } 
    }

})(budgetController, UIController);

controller.init()