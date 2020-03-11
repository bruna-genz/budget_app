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
        allItems = {
            exp = [],
            inc = []
        },
        totals = {
            exp = 0,
            inc = 0
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
                type: document.querySelector(DOMstrings.inputType).value,
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
        
        // 1. Get the input field data
        let input = UICtrl.getInput
        console.log(input)
    };

    return {
        init: function() {
           setUpEventListeners() 
           console.log("The app has started")
        } 
    }

})(budgetController, UIController);

controller.init()