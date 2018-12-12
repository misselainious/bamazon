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
    console.log("Hey there, you Super Supervisor! \nLet me pull up some stats for you...");
    profit();
  });

  function profit(){
    connection.query("SELECT departments.department_id, products.department_name, products.product_sales, departments.over_head_costs, departments.total_profit FROM products INNER JOIN departments ON products.department_name=departments.department_name GROUP BY department_name ORDER BY SUM(product_sales) DESC", function (err, res) {
        if (err) throw err;

        console.table(res);
        console.log(divider);
        connection.end();
    });
  }