var budgetController = (function () {

    var Expense = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };
    var Income = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };
    
    var calculateTotal = function(type) {
        
        var sum = 0;
        
        for(var i= 0; i<data.allItems[type].length;i++) {
            sum +=data.allItems[type][i].value;    
        }
        data.totals[type] = sum;
        
    };
    
    var data = {

        allItems : {
            exp : [],
            inc : []
        },
        totals : {
            exp : 0,
            inc : 0
        },
        budget : 0,
        persentage : -1,
    };

    return { 

        addItem : function (type, des, val) {
            var newItem, ID;

            if (data.allItems[type].length > 0) {
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
            } else {
                ID = 0 ;
            } 
            
            if (type === "exp") {
                newItem = new Expense(ID , des , val);
            } 

            else if (type === "inc") {
                newItem = new Income(ID , des , val);
            }

            data.allItems[type].push(newItem);
            return newItem;            
        } , 
        
        calculateBudget: function () {
            calculateTotal("exp");
            calculateTotal("inc");
            data.budget = data.totals.inc - data.totals.exp;
            data.persentage = Math.round((data.totals.exp / data.totals.inc) *100);
        },
        
        getBudget: function () {
            return {
                budget: data.budget,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
                percentage: data.persentage,
            };
        },
    };
})();

////////////////////////////////////////////////////////////////////////////////////////////////////

var UIController = (function () {


    var DOMstrings = {
        inputType: ".add__type",
        inputDescription: ".add__description",
        inputValue: ".add__value",
        inputBtn: ".add__btn" , 
        incomeContainer : ".income__list", 
        expensesContainer : ".expenses__list", 
        budgetLabel: ".budget__value",
        incomeLable: ".budget__income__value",
        incomeLable: ".budget__espenses__value",
        incomeLable: ".budget__espenses__percentage",

    }

    return {

        getinput: function () {
            return {
                type: document.querySelector(DOMstrings.inputType).value,
                description: document.querySelector(DOMstrings.inputDescription).value,
                value: parseFloat(document.querySelector(DOMstrings.inputValue).value),
            };
        },

        addListItem : function(obj, type) {

            var html, newHtml, element;
            // Create HTML string with placeholder text
            
            if (type === 'inc') {

                element = DOMstrings.incomeContainer;
                
                html = '<div class="item clearfix" id="income-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            } else if (type === 'exp') {
                element = DOMstrings.expensesContainer;
                
                html = '<div class="item clearfix" id="expense-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }

            newHtml = html.replace("%id%", obj.id);
            newHtml = newHtml.replace("%description%" , obj.description);
            newHtml = newHtml.replace("%value%" , obj.value);

            document.querySelector(element).insertAdjacentHTML('beforeend' , newHtml);

        } , 

        clearFiealds : function() {

            var fields , fieldsArr;

             fields = document.querySelectorAll(DOMstrings.inputValue + "," + DOMstrings.inputDescription);
             fieldsArr = Array.prototype.slice.call(fields);
             
            fieldsArr.forEach(function (element , index , array) {
                element.value = "";
            });
            fieldsArr[0].focus();

        },
        displayBudget: function(obj) {
            
            document.querySelector(DOMstrings.budgetLabel).textContent = obj.budget;
            document.querySelector(DOMstrings.incomeLabel).textContent = obj.totalInc;
            document.querySelector(DOMstrings.expensesLabel).textContent = obj.totalExp;
            document.querySelector(DOMstrings.percentageLabel).textContent = obj.persentage;            
            
        },
        
        getDOMstrings: function () {
            return DOMstrings;
        } 
    };

})();

//////////////////////////////////////////////////////////////////////////////////////////////////////////

var controller = (function (budgetCtrl, UICtrl) {

    var DOM = UICtrl.getDOMstrings();

    var updateBudget = function () {
        budgetCtrl.calculateBudget();
        var budget  = budgetCtrl.getBudget();
        console.log(budget);
        UICtrl.displayBudget(budget);
    };
    
    var ctrlAddItem = function () {

        var  input , newItem ;

        input = UICtrl.getinput();
        
        if (input.description !== "" && !isNaN(input.value) && input.value > 0) {
            
            newItem = budgetCtrl.addItem(input.type , input.description , input.value);
            UICtrl.addListItem(newItem , input.type);
            UICtrl.clearFiealds();
            
            updateBudget();
        }
        
        
    };

    var setupEventListennrs = function () {
        document.querySelector(DOM.inputBtn).addEventListener("click", function () {
            ctrlAddItem();
            
        });

        document.addEventListener("keypress", function (e) {
            if (e.keyCode === 13 || e.which === 13) {
                ctrlAddItem();
                
            }
        });
    }

    return {
        init: function () {
            /*UICtrl.displayBudget({
                budget: 0,
                totalExp: 0,
                totalInc: 0,
                percentage: -1
            });*/
            setupEventListennrs();
            
        }
    };

})(budgetController, UIController);

controller.init();
