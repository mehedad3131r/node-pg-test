const express = require('express')
const app = express()
const port = 3000
const { Pool, Client } = require("pg");
const pool = new Pool({
user: "objectrocket",
host: "localhost",
database: "some_database",
password: "mypass",
port: "5432"
});

app.get('/', (req, res) => {

    req = {
        product_id : 3358,
        price: 3000,
        category_id: 1234
        }
        let response = {
        is_discount: false,
        price:0
        }
        // in this case we have db with 2 tables categories(id,parent_id,name) 
        //discounts(id,type(product or catecory),morph_id,discount_type(% or price),value,start time,end_time ) 
        // let string = "SELECT Id FROM discounts WHERE morph_id ="+event.product_id+"WHERE type =product";
        pool.query("SELECT Id FROM discounts WHERE morph_id ="+req.product_id+"AND type =product", (err, res) => {
        if (err) {
          console.log(err)
          let response = {
            is_discount: false,
            price:0
          }
        }else{
        let pr_response = {
          is_discount: true,
          price:res.rows[0].price
        }
        if(pr_response.price > 0){
          return pr_response
        }
        }
        pool.end();
        });
        pool.query("SELECT Id FROM discounts WHERE morph_id ="+req.product_id+"AND type =category", (err, res) => {
        if (err) {
          console.log(err)
        }else{
        ret_catid =req.category_id;

        while (cat_res.rows[0].parent_id != null)
           {
            pool.query("SELECT Id FROM categories WHERE morph_id = "+ret_catid+" AND type =category", (err, cat_res) => {
              if (err) {
                console.log(err)
        
              }else{
              let prc_response = {
                is_discount: true,
                price:cat_res.rows[0].price
              }
              ret_catid = cat_res.rows[0].parent_id;
              if(prc_response.price > 0){
                return prc_response
              }
              }
              pool.end();
            });
            
          };
        }
        pool.end();
        });
        return response;

  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
