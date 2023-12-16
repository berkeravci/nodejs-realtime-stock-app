
document.addEventListener('DOMContentLoaded', function () {
let socket = io();
let row;

document.querySelectorAll('.buy').forEach(button => {
    button.addEventListener('click', (event) => {
        row = event.target.closest('tr');
        console.log(row)
        
        
      
      const productId = event.target.dataset.productId
      
      
      socket.emit('buy', productId);
      
    });
  });

  socket.on('updateStock', productId => {
    
    stock = document.getElementById(productId);
    
    stock.textContent = parseInt(stock.textContent)-1;
    
    if(parseInt(stock.textContent)==0){
        btn = document.getElementById("btn"+productId);
        
        btn.innerHTML = "Out of stock";
        tr = document.getElementById("tr"+productId);
        tr.className = "out-of-stock";
    }
  });
  
  socket.on('urlUpdate',data =>{
    
    const datas = data.split("/")
     stock = document.getElementById(datas[0]); 
        if(parseInt(datas[1])>0){
            tr = document.getElementById("tr"+datas[0]);
            tr.classList.remove("out-of-stock"); 
            btn = document.getElementById("btn"+datas[0]);
            btn.addEventListener('click', (eventt) => {
                row = eventt.target.closest('tr');
              const productId = event.target.dataset.productId
              socket.emit('buy', productId);
            });
            btn.innerHTML = `<button class="buy" data-product-id="`+datas[0]+`">Buy</button>`
            btn.disabled = false;
        }
     stock.textContent = datas[1];
  })
});



