//Requirements
var mysql = require('mysql');
var inquirer = require('inquirer');
//Variables
var divider = "***---------------------------------***";
var orderTotal = 0;
var newStock = 0;

//variable for connecting to database
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: "flute0207",
    database: "bamazon"
});

//connects to the database
connection.connect(function (err) {
    if (err) throw err;
    console.log(divider);
    console.log("Welcome to Bamazon! Your one stop shop for all your Holiday Shopping. \nPlease browse our available products:")
    displayItems();
});

//Shows Items for sale in a table with item id, product name and price
function displayItems() {
    connection.query("SELECT item_id,product_name,price FROM products", function (err, res) {
        if (err) throw err;
        let data = res;
        console.table(data);
        console.log(divider);
        chooseItem();
    });
}

//allows user to choose an item by id and select quantity for purchase. 
function chooseItem() {
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        inquirer.prompt([{
                name: "choice",
                type: "input",
                message: "Please choose an item to buy by entering its item_id."
            },
            {
                name: "numberToBuy",
                type: "input",
                message: "How many would you like?"
            }
        ]).then(function (answer) {
            //variable for user choice
            var chosenItem = answer.choice - 1;
            //variable for order total
            orderTotal = answer.numberToBuy * res[chosenItem].price;
            //variable for new stock quantity after user purchase
            newStock = res[chosenItem].stock_quantity - answer.numberToBuy;
            //variable for storing previous sales of the item
            prevSales = res[chosenItem].product_sales;
            //variable for storing updated sales of item after user purchase
            var newSales = prevSales + orderTotal;

            //If there is not enough stock to fill the order, user is prompted to choose another item or quantity.
            if (answer.numberToBuy > res[chosenItem].stock_quantity) {
                console.log("Oh, sorry, Santa just came by so we don't have enough of that item to fill your order! \nPlease choose a different item.");
                chooseItem();
            //If there is sufficient stock, user's order is filled and they are shown what they purchased, quantity, and order total.
            } else {
                console.log("Thanks for your purchase of " + answer.numberToBuy + " " + res[chosenItem].product_name + " at Bamazon! Your order total is: $" + orderTotal);
                connection.query(
                    //Updated the database after purchase.
                    "UPDATE products SET ?,? WHERE ?",
                    [{
                            stock_quantity: newStock
                        },
                        {
                            product_sales: newSales
                        },
                        {
                            item_id: answer.choice
                        }

                    ],
                    function (err) {
                        if (err) throw err;
                        connection.end();
                    }
                )

            }
        })
        
    })

}
