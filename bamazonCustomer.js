var mysql = require('mysql');
var inquirer = require('inquirer');

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
    console.log("Welcome to Bamazon! Your one stop shop for all your Holiday Shopping.")
    displayItems();
  });

  function displayItems(){
      connection.query("SELECT * FROM products", function(err, res){
          if (err) throw err;
          console.log(res);
          chooseItem();
      });
  }

  function chooseItem(){
      inquirer.prompt([
          {
              name: "choice",
              type: "input",
              message: "Please choose an item by entering its item_id."
          },
          {
            name: "numberToBuy",
            type: "input",
            message: "How many would you like?"
        }
      ])
      .then(function(answer){
          connection.query("SELECT * FROM products WHERE ?", {item_id: answer.choice}, function(err, res){
            console.log(
                "Item: " + res[0].product_name+ "\nPrice: $"+ res[0].price 
            );
          
          console.log(answer);
          connection.end();
      });
  });
}