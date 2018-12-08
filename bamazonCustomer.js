var mysql = require('mysql');
var inquirer = require('inquirer');
var divider = "***---------------------------------***";
var orderTotal = 0;
var newStock = 0;

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
  
    // Your username
    user: "root",
  
    // Your password
    password: "flute0207",
    database: "bamazon"
  });
  

connection.connect(function(err) {
    if (err) throw err;
    // console.log("connected as id " + connection.threadId);
    console.log(divider);
    console.log("Welcome to Bamazon! Your one stop shop for all your Holiday Shopping. \nPlease browse our available products:")
    displayItems();
  });

  function displayItems(){
      connection.query("SELECT * FROM products", function(err, res){
          if (err) throw err;
          let data = res;
            console.table(data);
            console.log(divider);
          chooseItem();
      });
  }

function chooseItem() {
    connection.query("SELECT * FROM products", function(err, res) {
        if (err) throw err;
        inquirer.prompt([
            {
                name: "choice",
                type: "input",
                message: "Please choose an item to buy by entering its item_id."
            },
            {
              name: "numberToBuy",
              type: "input",
              message: "How many would you like?"
          }
        ])
        .then(function(answer){
            orderTotal = answer.numberToBuy*res[0].price;
            newStock = res[0].stock_quantity-answer.numberToBuy;
            var chosenItem;
            chosenItem = answer.choice;
            
            if(answer.numberToBuy > res[0].stock_quantity){
                console.log("Oh, sorry, Santa just came by so we don't have enough of that item to fill your order!");
            }else{
                console.log("Thanks for shopping at Bamazon! Your order total is: $"+ orderTotal);
                connection.query(
                    "UPDATE products SET ? WHERE ?",
                    [
                        {
                            stock_quantity: newStock
                        },
                        {
                            item_id: chosenItem
                        }
                    ], 
                    function(err){
                        if (err) throw err;
                    }
                )
                connection.end();
            }
        })
        
    })
}

