var mysql = require('mysql');
var inquirer = require('inquirer');
var divider = "***---------------------------------***";


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
    console.log("Hey there, Mr/Ms Manager...")
    inquire();
  });

  function inquire(){
  inquirer.prompt([{
      type: 'list',
      message: 'What do you need to do today?',
      name: 'command',
      choices: ['View products for sale', 'View low inventory', 'Add to invnetory', 'Add new product'],
      validate: function(answer){
          if(answer.length<1){
              return 'You must choose an option, you are at work after all...'
          }
          return true;
          }
      }
  ])
  .then(answer=>{
      switch(answer.command){
          case 'View products for sale':
          displayItems();
          break;

          case 'View low inventory':
          viewLow();
          break;

          case 'Add to invnetory':
          addInventory();
          break;

          case 'Add new product':
          newProduct();
          break;
      }
  })
  }
  function displayItems(){
      connection.query("SELECT * FROM products", function(err, res){
          if (err) throw err;
            console.table(res);
            console.log(divider);
            connection.end();
      });
  }


  function viewLow(){
    connection.query("SELECT * FROM products", function(err, res){
        var lowItems = [];
        if (err) throw err;
        // console.log(res);
        // console.log(res[0].stock_quantity);
        // console.log(res.length);
      for (i=0; i<res.length; i++){
          if (res[i].stock_quantity < 5) {
            lowItems.push(res[i]);
          }

      }
      if(lowItems.length>0){
      console.log("Looks like you're low on the following items:")
      console.table(lowItems);
      connection.end();
      }
        else{
              console.log("Looks like you have a good supply of everything!")
              connection.end();
          }
  });
  }


  function addInventory(){
    displayItems();
    console.log("Please select an item_id to add inventory for");
    connection.query("SELECT * FROM products", function(err, res) {
        if (err) throw err;
        inquirer.prompt([
            {
                name: "choice",
                type: "input",
                message: "Please choose an item to buy by entering its item_id."
            },
            {
              name: "numberToAdd",
              type: "input",
              message: "How many would you like to add?"
          }
        ])
        .then(function(answer){
            existingStock = res[answer.choice-1].stock_quantity;
            numAdd = parseInt(answer.numberToAdd);
            newStock = existingStock + numAdd;
            var chosenItem;
            chosenItem = parseInt(answer.choice);
            console.log(existingStock, numAdd, newStock, chosenItem);
        
                connection.query(
                    "UPDATE products SET ? WHERE ?",
                    
                        {
                            stock_quantity: newStock
                        },
                        {
                            item_id: chosenItem
                        },
                    
                    function(err){
                        if (err) throw err;
                    }
                )          
        })     
    })
    // connection.end();
  };

  function newProduct(){
    inquirer.prompt([
        {
            name: 'item',
            type: 'input',
            message: 'Enter new item name'
        },
        {
            name: 'department',
            type: 'list',
            message: 'Please choose a department',
            choices: ['Grocery', 'Clothing', 'Toys', 'Electronics', 'Garden', 'Home'],
            validate: function(answer){
                if(answer.length<1){
                    return 'You must choose a department'
                }
                return true;
                }
        },
        {
            name: 'price',
            type: 'input',
            message: 'What is the price of your item?'
        },
        {
            name: 'quantity',
            type: 'input',
            message: 'How many of this item do you want to add to stock?'
        }
    ])
    .then(function(answer){
        connection.query(
            "INSERT INTO products SET ?",
            {
                product_name: answer.item,
                department_name: answer.department,
                price: answer.price,
                stock_quantity: answer.quantity

            },
            function(err){
                if (err) throw err;
                console.log("Your item was added successfully!")
                connection.end();
            }
        )
    })
  }
