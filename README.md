Bamazon App 

This app is an online marketplace that includes both customer-side and manager-side functionality integrating SQL database using MySQL. It is broken down into 3 files:

bamazonCustomer.js - allows a customer to view items by product name and price, select an item and quantity and displays what they bought with the total purchase price. If there is not enough inventory to support the sale, the user will be notified.

manager.js - allows the user to choose from the following options:
view products for sale
View low inventory
Add to inventory
Add new product

view products for sale displays additional functions to the bamazonCustomer.js file. It shows stock quantity and product sales as well as the department.

view low inventory displays only items with a stock quantity less than 5.

add to inventory allows the user to add quantity to an existing item in the database.

add new product allows the user to add a new product and specify department name, price and stock.

supervisor.js - has two options:
View product sales by department
Add a new department

View product sales by department displays department name, product sales, overhead costs and a special column total profit that is calculated within the program, but not stored in the database.

Add a new department allows the user to create a department name and set overhead costs.