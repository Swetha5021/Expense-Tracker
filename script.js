var budgetController = (function () {
  function Expenses(id, description, value) {
    this.id = id;
    this.desc = description;
    this.val = value;
    this.percentage = -1;
  }
  Expenses.prototype.calcPercentage = function (totalIncome) {
    if (totalIncome > 0) {
      this.percentage = Math.round((this.val / totalIncome) * 100);
    } else {
      this.percentage = -1;
    }

  }
  Expenses.prototype.getPercentage = function () {
    return this.percentage;
  }

  function Incomes(id, description, value) {
    this.id = id;
    this.desc = description;
    this.val = value;
  }
  var data = {
    allIncExp: {
      inc: [],
      exp: []
    },
    totals: {
      inc: 0,
      exp: 0
    },

    budget: 0,
    percentage: -1
  };

  function calculateTotal(type) {
    var sum = 0
    data.allIncExp[type].forEach(function (val) {
      sum += val.val;
    });
    data.totals[type] = sum;
  }

  return {
    generateItem: function (type, desc, val) {

      var addItem, ID;

      if (data.allIncExp[type].length > 0) {
        ID = data.allIncExp[type][data.allIncExp[type].length - 1].id + 1;
      } else {
        ID = 0;

      }


      if (type === 'inc') {

        addItem = new Incomes(ID, desc, val)

      } else if (type === 'exp') {

        addItem = new Expenses(ID, desc, val);
      }

      data.allIncExp[type].push(addItem);
      return addItem;

    },

    deleteItem: function (type, id) {
      var index;
      var ids = data.allIncExp[type].map(function (curr) {
        return curr.id;
      });

      index = ids.indexOf(id);
      if (index != -1) {
        data.allIncExp[type].splice(index, 1);
      }



    },

    calculatePercentages: function () {

      data.allIncExp.exp.forEach(function (curr) {
        curr.calcPercentage(data.totals.inc);
      });
    },

    getPercentages: function () {
      var allPerc = data.allIncExp.exp.map(function (curr) {
        return curr.getPercentage();
      });
      return allPerc;
    },

    calculateBudget: function () {

      calculateTotal('inc');
      calculateTotal('exp');

      data.budget = data.totals.inc - data.totals.exp;

      if (data.totals.inc > 0) {
        data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
      } else {
        data.percentage = -1
      }
    },

    getBudget: function () {
      return {
        actualBudget: data.budget,
        totalIncome: data.totals.inc,
        totalExpense: data.totals.exp,
        percentage: data.percentage
      }
    },
  }

})();
var UIController = (function () {

  var getDataClasses = {
    type: ".select-box",
    description: ".des-box",
    value: ".value-box",
    addBtn: ".add-btn",
    incomeContainer: '.income-container',
    expenseContainer: '.expense-container',
    moneyLeft: '.money-left',
    totalIncome: '.total-income',
    totalExpense: '.total-expense',
    totalExpPer: '.total-exp-per',
    mainContainer: '.main-container',
    smallPerShow: '.small-percentage-show',
    date: '.date'
  };

  return {
    inputData: function () {
      return {
        type: document.querySelector(getDataClasses.type).value,
        description: document.querySelector(getDataClasses.description).value,
        value: parseFloat(document.querySelector(getDataClasses.value).value)
      }; 

    },


    dataClasses: function () {
      return getDataClasses;
    },
    addListItems: function (obj, type) {

      var html, htmlElement;
      if (type === 'inc') {
        htmlElement = getDataClasses.incomeContainer;
        html =
          `<div class="ie-bar magictime boingInUp" id = "inc-${obj.id}">
        <span class="ie-sno">${obj.id + 1}.</span>
        <h3 class="ie-bar-des">${obj.desc}</h3>
        <h4 class="ie-value">${obj.val}</h4>
        <span class="ie-cross-btn"><i class="fa fa-times-circle" style="padding: 2px;"></i></span>
        </div>`;

      } else if (type === 'exp') {
        htmlElement = getDataClasses.expenseContainer;
        html =
          `<div class="ie-bar magictime boingInUp expense-only" id ="exp-${obj.id}">
            <span class="ie-sno">${obj.id + 1}.</span>
            <h3 class="ie-bar-des">${obj.desc}</h3>
            <span class="small-percentage-show">20%</span>
            <h4 class="ie-value">${obj.val}</h4>
            <span class="ie-cross-btn"><i class="fa fa-times-circle" style="padding: 2px;"></i></span>
          </div>`;
      }
      document.querySelector(htmlElement).insertAdjacentHTML('beforeend', html);

      var fieldData = document.querySelectorAll(`${getDataClasses.description},${getDataClasses.value}`);

      fieldData.forEach(element => {
        element.value = '';
      });
      fieldData[0].focus();
    },



    displayBudget: function (obj) {
      document.querySelector(getDataClasses.moneyLeft).textContent = obj.actualBudget;
      document.querySelector(getDataClasses.totalIncome).textContent = "+ " + obj.totalIncome;
      document.querySelector(getDataClasses.totalExpense).textContent = "- " + obj.totalExpense;
      if (obj.percentage > 0) {
        document.querySelector(getDataClasses.totalExpPer).textContent = obj.percentage + " %";
      } else {
        document.querySelector(getDataClasses.totalExpPer).textContent = "--";
      }
    },

    displayPercentages: function (percArr) { 

      var perTags = document.querySelectorAll(getDataClasses.smallPerShow);


      var nodeForEach = function (list, callback) {
        for (var i = 0; i < list.length; i++) {
          callback(list[i], i);
        }
      }

      nodeForEach(perTags, function (current, index) {
        if (percArr[index] > 0) {
          current.innerHTML = percArr[index] + " %";

        } else {
          current.innerHTML = "---";
        }

      });

    },

    delListItem: function (selectorID) {

      var el = document.getElementById(selectorID);
      el.parentNode.removeChild(el);

    },
    displayDate: function () {
      var dateElement = document.querySelector(getDataClasses.date);
      var allMonths = ['January', 'February', 'March', 'April', 'May', 'June',
       'July', 'August', 'September', 'October', 'November','December'];
      var date = new Date();
      var month = date.getMonth();
      month = allMonths[month];
      var year = date.getFullYear();
      dateElement.textContent = `${month}, ${year}`;
    }
  };
})();

var trigger = (function (budgetCtrl, UICtrl) {

  var eventHandler = function () {
    var dataCl = UICtrl.dataClasses();

    document.querySelector(dataCl.addBtn)
      .addEventListener("click", triggerCtrl);

    document.addEventListener("keypress", function (e) {
      if (e.keyCode === 13 || e.which === 13) {
        triggerCtrl();
      }
    });

    document.querySelector(dataCl.mainContainer).addEventListener('click', ctrlDeleteItem)
  };
  function updateBudget() {
    budgetCtrl.calculateBudget();
    var budget = budgetCtrl.getBudget();
    UICtrl.displayBudget(budget);

  }

  function updatePercentages() {
    budgetCtrl.calculatePercentages();
    var percArr = budgetCtrl.getPercentages();
    UICtrl.displayPercentages(percArr);
  }


  function ctrlDeleteItem(event) {
    var getElemetID = event.target.parentNode.parentNode.id;
    var splittedID = getElemetID.split('-');
    var type = splittedID[0];
    var ID = parseInt(splittedID[1]);
    budgetCtrl.deleteItem(type, ID);

    UICtrl.delListItem(getElemetID);
    updateBudget();
    updatePercentages();
  }

  var triggerCtrl = function () {
    var inputValues = UICtrl.inputData();
    if (inputValues.description != "" && !isNaN(inputValues.value) && inputValues.value > 0) {
      var newItem = budgetCtrl.
      generateItem(inputValues.type, inputValues.description, inputValues.value);
      UICtrl.addListItems(newItem, inputValues.type);
      updateBudget();
      updatePercentages();
    }
  };
  return {
    init: function () {
      UICtrl.displayDate();
      eventHandler();
    }
  }
})(budgetController, UIController);
trigger.init();