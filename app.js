// BUDGET CONTROLLER
const budgetController = (function() {
    //some code
})();


// UI CONTROLLER
const UIController = (function() {
    //some code
})();


// GLOBAL APP CONTROLLER
const controller = (function(budgetCtrl, UICtrl) {

    const ctrlAddItem = function() {
        // lots of action
    };
    
    document.querySelector('.add__btn').addEventListener('click', ctrlAddItem);

    document.addEventListener('keypress', function(event) {
        if (event.keyCode === 13 || event.which === 13) {
            ctrlAddItem();
        }
    });

})(budgetController, UIController);