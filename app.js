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

    const calculateTotal = function(type) {
        let sum = 0
        data.allItems[type].forEach(function(cur) {
            sum += cur.value
        })
        data.totals[type] = sum
    }

    let data = {
        allItems: {
            exp: [],
            inc: []
        },
        totals: {
            exp: 0,
            inc: 0
        },
        budget: 0,
        percentage: -1
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

        calculateBudget: function() {
            
            // 1. Calculate totals inc and exp
            calculateTotal('inc')
            calculateTotal('exp')

            // 2. Calculate budget: inc - exp
            data.budget = data.totals.inc - data.totals.exp

            // 3. Calculate percentage of income that was spent
            if (data.totals.inc > 0) {
                data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100)
            } else {
                data.percentage = -1
            }
        },

        getBudget: function() {
            return {
                budget: data.budget,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
                percentage: data.percentage
            }
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
        inputBtn: '.add__btn',
        incomeContainer: '.income__list',
        expensesContainer: '.expenses__list'
    }
    
    return {
        getInput: function() {
            return {
                type: document.querySelector(DOMstrings.inputType).value, // will be either 'exp' or 'inc'
                description: document.querySelector(DOMstrings.inputDescription).value,
                value: parseFloat(document.querySelector(DOMstrings.inputValue).value)
            }
        }, 

        addListItem: function(obj, type) {
            let HTML, newHTML, element

            // Create and HTML string with a placehorder text
            if (type === 'inc') {
                element = DOMstrings.incomeContainer
                HTML = '<div class="item clearfix" id="income-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
            } else if (type === 'exp') {
                element = DOMstrings.expensesContainer
                HTML = '<div class="item clearfix" id="expense-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
            }

            // Replace the placeholder text with an actual data
            newHTML = HTML.replace('%id%', obj.id)
            newHTML = newHTML.replace('%description%', obj.description)
            newHTML = newHTML.replace('%value%', obj.value)

            // Insert the HTML into the DOM 
            document.querySelector(element).insertAdjacentHTML("beforeend", newHTML)
        },

        clearField: function() {
            let fields, fieldsArr

            fields = document.querySelectorAll(DOMstrings.inputDescription + "," + DOMstrings.inputValue)
            fieldsArr = Array.prototype.slice.call(fields)

            fieldsArr.forEach(function(current) {
                current.value = ""
            })

            fieldsArr[0].focus()
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

    const calculateBudget = function() {
        
        // 1. Calculates the budget
        budgetCtrl.calculateBudget()

        // 2. Return budget
        let budget = budgetCtrl.getBudget()

        // 3. Display the budget on the UI
        console.log(budget)
    }

    const ctrlAddItem = function() {
        let input, newItem

        // 1. Get the input field data
        input = UICtrl.getInput()

        if (input.description !== "" && !isNaN(input.value) && input.value > 0) {

            // 2. Add the item to the budget controller
            newItem = budgetCtrl.addItem(input.type, input.description, input.value)
            
            // 3. Add the item to the UI
            UICtrl.addListItem(newItem, input.type)

            // 4. Clear the input fields
            UICtrl.clearField()

            // 5. Calculate and return budget
            calculateBudget()

        }
    };

    return {
        init: function() {
           setUpEventListeners() 
           console.log("The app has started")
        } 
    }

})(budgetController, UIController);

controller.init()