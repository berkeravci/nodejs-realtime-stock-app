const express = require("express")
const app = express() ;
const path = require("path");
const http = require("http").Server(app) ;
const io = require("socket.io")(http) ; 
const db = require('./assets/db.js')
const expressEjsLayouts = require("express-ejs-layouts");



app.set("views", path.join(__dirname,"views"));
app.set("view engine", "ejs");

app.use(express.static(__dirname + "/public"));
app.use(express.urlencoded({extended:true}))
app.use(expressEjsLayouts) ;
io.on("connection", socket => {
    console.log("a new connection from a client");
    
    socket.on("buy", productId => {
        console.log(productId);
        
        console.log('Buy event received for product ID:', productId);
        console.log(productId);
        const product = db.products.find(product => product.id === parseInt(productId, 10));
        console.log(product);
        if (product && product.stock > 0) {
          product.stock -= 1;
          console.log('Stock after purchase:', product.stock);
          console.log(product);
          
          console.log(productId);
          
          io.emit("updateStock",product.id);
          console.log(db.products)
        }
      });


    socket.on("disconnect", () => {
        console.log(" disconnected");
       
       
   })
});
app.get("/", (req, res) => {
    res.render("page", {
        pageTitle : "EJS Application" ,
        products: db.products,
        categories:db.category,
        cssFile:"mt.css",
        layout:"base"
    })
});
app.get("/stock/:productId/:newStock", (req, res) => {
    const productId = parseInt(req.params.productId);
    const newStock = parseInt(req.params.newStock);

    const product = db.products.find(product => product.id === parseInt(productId, 10));
    console.log(productId);
    if (product) {
        product.stock = newStock;

        
        data = productId + "/"+newStock;
        
        io.emit('urlUpdate',data);
        
        res.redirect("/");
        console.log(newStock);
    } else {
        
        res.status(404).send(`Product with ID ${productId} not found`);
    }
});
http.listen(8080, (err) => {
    console.log("Server started at port 8080");
    console.log("use http://localhost:8080") ;
  }) ;