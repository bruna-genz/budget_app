// BUDGET CONTROLLER
const budgetController = (function() {
    
    const Expense = function(id, description, value) {
        this.id = id,
        this.description = description,
        this.value = value
        this.percentage = -1
    }

    Expense.prototype.calcPercentage = function(totalIncome) {
        if (totalIncome > 0) {
            this.percentage = Math.round((this.value / totalIncome) * 100)
        } else {
            this.percentage = -1
        }
    }

    Expense.prototype.getPercentage = function() {
        return this.percentage
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
                newItem = new Income(ID, des, val)
            }

            // push it into our data structure
            data.allItems[type].push(newItem)

            // return the new element
            return newItem
        },

        deleteItem: function(type, id) {
            let ids, index

            ids = data.allItems[type].map(function(cur) {
                return cur.id
            })

            index = ids.indexOf(id)

            if (index !== -1) {
                data.allItems[type].splice(index, 1)
            }

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

        calculatePercentages: function() {
            data.allItems.exp.forEach(function(cur) {
                cur.calcPercentage(data.totals.inc)
            })
        },

        getPercentages: function() {
            let allPerc = data.allItems.exp.map(function(cur) {
                return cur.getPercentage()
            })
            return allPerc
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
        expensesContainer: '.expenses__list',
        budgetLabel: '.budget__value',
        incomeValueLabel: '.budget__income--value',
        expensesValueLabel: '.budget__expenses--value',
        percentageLabel: '.budget__expenses--percentage',
        container: '.container',
        expensesPercLabels: '.item__percentage',
        dateLabel: '.budget__title--month'
    }

    const formatNumber = function(num, type) {
        let numSplit, int, dec

        num = Math.abs(num)
        num = num.toFixed(2)

        numSplit = num.split('.')

        int = numSplit[0]

        if (int.length > 3) {
            int = int.substr(0, int.length - 3) + ',' + int.substr(int.length -3, 3)
        }

        dec = numSplit[1]
        
        return (type === 'inc' ? '+' : '-') + ' ' + int + '.' + dec      
    }

    const nodeListForEach = function(list, callback) {  
        for (i = 0; i < list.length; i++) {
            callback(list[i], i)
        }
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
                HTML = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
            } else if (type === 'exp') {
                element = DOMstrings.expensesContainer
                HTML = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
            }

            // Replace the placeholder text with an actual data
            newHTML = HTML.replace('%id%', obj.id)
            newHTML = newHTML.replace('%description%', obj.description)
            newHTML = newHTML.replace('%value%', formatNumber(obj.value, type))

            // Insert the HTML into the DOM 
            document.querySelector(element).insertAdjacentHTML("beforeend", newHTML)
        },

        deleteListItem: function(selectorID) {
            let el = document.getElementById(selectorID)
            el.parentNode.removeChild(el) 
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

        displayBudget: function(obj) {
            let type
            obj.budget > 0 ? type = 'inc' : 'exp'

            document.querySelector(DOMstrings.budgetLabel).textContent = formatNumber(obj.budget, type)
            document.querySelector(DOMstrings.incomeValueLabel).textContent = formatNumber(obj.totalInc, 'inc')
            document.querySelector(DOMstrings.expensesValueLabel).textContent = formatNumber(obj.totalExp, 'exp')

            if (obj.percentage > 0) {
                document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage + "%"
            } else {
                document.querySelector(DOMstrings.percentageLabel).textContent = "---"
            }
        },

        displayPercentages: function(percentages) {

            fields = document.querySelectorAll(DOMstrings.expensesPercLabels)

            nodeListForEach(fields, function(current, index) {

                if (percentages[index] > 0) {
                    current.textContent = percentages[index] + '%'
                } else {
                    current.textContent = '---'
                }
            })
        },

        displayDate: function() {
            let now, months, month, year

            now = new Date()

            months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
            month = months[now.getMonth(month)]

            year = now.getFullYear()

            document.querySelector(DOMstrings.dateLabel).textContent = month + ' ' + year
        },

        changedType: function() {
            let fields

            fields = document.querySelectorAll(
                    DOMstrings.inputType + ',' +
                    DOMstrings.inputDescription + ',' +
                    DOMstrings.inputValue
            )

            nodeListForEach(fields, function(current) {
                current.classList.toggle('red-focus')
            })

            document.querySelector(DOMstrings.inputBtn).classList.toggle('red')
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

        document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem)

        document.addEventListener('keypress', function(event) {
            if (event.keyCode === 13 || event.which === 13) {
                ctrlAddItem()
            }
        });

        document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem)

        document.querySelector(DOM.inputType).addEventListener('change', UICtrl.changedType)
    }

    const calculateBudget = function() {
        
        // 1. Calculates the budget
        budgetCtrl.calculateBudget()

        // 2. Return budget
        let budget = budgetCtrl.getBudget()

        // 3. Display the budget on the UI
        UICtrl.displayBudget(budget)
    }

    const updatePercentages = function() {

        // 1. Calculate percentages
        budgetCtrl.calculatePercentages()

        // 2. Return percentages
        let percentages = budgetCtrl.getPercentages()

        // 3. Update the UI with the new percentages
        UICtrl.displayPercentages(percentages)
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

            // 6. Update percentages
            updatePercentages()

        }
    }

    const ctrlDeleteItem = function(event) {
        let itemID, splitID, type, ID
        
        itemID = event.target.parentNode.parentNode.parentNode.parentNode.id

        if (itemID) {
            splitID = itemID.split('-')
            type = splitID[0]
            ID = parseInt(splitID[1])
        }

        // 1. Delete the item from the data structure
        budgetCtrl.deleteItem(type, ID)

        // 2. Delete the item from the UI
        UICtrl.deleteListItem(itemID)

        // 3. Update and show the new budget
        calculateBudget()

        // 4. Update percentages
        updatePercentages()
    }

    return {
        init: function() {
           setUpEventListeners() 
           UICtrl.displayBudget({budget: 0,
                                totalInc: 0,
                                totalExp: 0,
                                percentage: -1})
           UICtrl.displayDate()
        } 
    }

})(budgetController, UIController);

controller.init()