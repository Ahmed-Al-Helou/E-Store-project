const iconSearch = document.getElementById("icon-search");
const iconAdd = document.getElementById("icon-add");
const iconCart = document.getElementById("icon-cart");

const addItem = document.querySelector(".add-item");
const cart = document.querySelector(".cart");

const closeAdd = document.getElementById("add-close");
const closeCart = document.getElementById("cart-close");
const closeSearch =document.getElementById("search-close");

const search = document.querySelector(".search");

const title = document.getElementById("add-title");
const category = document.getElementById("add-category");
const description = document.getElementById("add-description");
const price = document.getElementById("add-price");
const count = document.getElementById("add-count");
const img = document.getElementById("add-img");
const btnAdd = document.getElementById("btn-add-item");

const btnDelete =document.getElementById("delete-item");

let index;
let mood="Add";


iconAdd.addEventListener("click",()=>{
    addItem.classList.add("show");
});

closeAdd.addEventListener("click",()=>{
    addItem.classList.remove("show");
});

iconCart.addEventListener("click",()=>{
    cart.classList.add("open");
});

closeCart.addEventListener("click",()=>{
    cart.classList.remove("open");
});

iconSearch.addEventListener("click",()=>{
    search.classList.add("view");
})

closeSearch.addEventListener("click",()=>{
    search.classList.remove("view")
})


let dataProduct;

if(localStorage.product !=null ){
    dataProduct = JSON.parse(localStorage.product);
}else{
    dataProduct=[];
}

btnAdd.onclick = ()=>{
    let newProduct={
        title : title.value,
        category : category.value,
        description : description.value,
        price : price.value,
        count : count.value,
        img : img.value
    }
    if(title.value !='' && category.value !='' && description.value != '' && price.value !='' && count.value !='' && img.value !=''){

        if(mood === "Add"){
            if(newProduct.count > 1){
                for(let i=0; i < newProduct.count ; i++){
                    dataProduct.push(newProduct);
                }
            }else{
                dataProduct.push(newProduct);
                
            }

        }else{
            dataProduct[index]=newProduct;
            mood="Add";
            btnAdd.innerHTML = "Add";
        }
        clearData();
    }


    localStorage.setItem("product", JSON.stringify(dataProduct));

    
    showProduct()

}



function clearData(){
    title.value ="";
    category.value ="";
    description.value ="";
    price.value ="";
    count.value ="";
    img.value ="";
}



function showProduct(){
    let content="";
    for(let i=0 ; i < dataProduct.length ; i++){
        content += displayCard(dataProduct[i],i)
        
        
    }

    document.querySelector(".shop-content").innerHTML = content;
}

showProduct();




function deleteProduct(i){
    dataProduct.splice(i,1);
    localStorage.product = JSON.stringify(dataProduct);
    showProduct();
}


function updateProduct(i){
    title.value = dataProduct[i].title;
    category.value = dataProduct[i].category;
    price.value = dataProduct[i].price;
    count.value = dataProduct[i].count;
    description.value = dataProduct[i].description;
    img.value = dataProduct[i].img;
    index =i;
    btnAdd.innerHTML = "Update";
    mood="Update";
    addItem.classList.add("show");
    scroll({
        top:0,
        behavior:"smooth"
    })
}

let searchMood;


function displayCard(ob,i){
    return `
    <div class="card"> 
    <img src="${ob.img}" alt="img" id="img-card"> 
    <h3 class="title-card">${ob.title}</h3>
    <div class="details-card">
        <p class="description-card">${ob.description} </p>
        <p class="category-card">${ob.category}</p>
    </div>
    <span class="price-card">${ob.price}</span>
    <i onclick="deleteProduct(${i})" class='bx bxs-trash-alt' id="delete-item"></i>
    <i onclick="updateProduct(${i})" class='bx bx-edit-alt' id="update-item"></i>
    <i onclick="addProductToCart(${i})" class='bx bxs-cart-add' id="add-to-cart"></i>
    </div>


    `;
}
function searchProduct(value){
    let content="";
    
    if(searchMood === "Title"){

        for(let i=0 ; i< dataProduct.length ; i++){
            if(dataProduct[i].title.includes(value.toLowerCase())){
                content += displayCard(dataProduct[i],i)

            }
        }
    }else{
        for(let i=0 ; i< dataProduct.length ; i++){

            if(dataProduct[i].price.includes(value.toLowerCase())){
                content += displayCard(dataProduct[i],i)

            }
        }

    }

    document.querySelector(".shop-content").innerHTML = content;
}



function cartBoxElement(i){

    return `
    <div class="cart-box">
    <img src="${dataProduct[i].img}" alt="" class="cart-img">
    <div class="detail-box">
        <div class="cart-product-title">${dataProduct[i].title}</div>
        <div class="cart-price">${dataProduct[i].price}</div>
        <input onclick="handle_changeItemCount(${i})" type="number" value="1" class="cart-count" min="1" >
    </div>
    <!-- cart remove -->
    <i onclick="deleteItem(${i})"  class='bx bxs-trash-alt cart-remove' id="cart-remove"></i>
    </div>

`;

}





let productCartAll=[];
function addProductToCart(i){
    let title = dataProduct[i].title;
    let price = dataProduct[i].price;
    let img = dataProduct[i].img;

    const productCart={
        title,
        price,
        img
    }

    let newCart = cartBoxElement(i);
    let newNode = document.createElement("div");
    newNode.innerHTML = newCart;
    productCartAll.push(productCart)
    localStorage.setItem('CartProduct',JSON.stringify(productCartAll))

    const cartContent = cart.querySelector(".cart-content");
    cartContent.appendChild(newNode);


        let btn_buy = document.querySelector(".btn-buy");
        btn_buy.addEventListener("click",handle_btnOrder);
        updateTotal()
        
}


function deleteItem(i){

    productCartAll = productCartAll.filter(el =>{
        el.title != dataProduct[i].title;
    })
    document.querySelector(".cart-content").innerHTML = productCartAll;
    updateTotal();
}




function handle_changeItemCount(i){
    if(isNaN(this.value) || this.value < 1){
        this.value = 1;
    }
    this.value = Math.floor(this.value); // because to keep integer 

    updateTotal();
}

function handle_btnOrder(){
    if(productCartAll.length <= 0){
        alert("This is No Order to Place Yet \n Please Make an Order first!");
        return;
    }

    const cartContent=cart.querySelector(".cart-content");
    cartContent.innerHTML ="";
    alert("Your Order is Placed Successful:");
    productCartAll = [];

    updateTotal();

}

function updateTotal(){
    let cartBoxes = document.querySelectorAll(".cart-box");
    const totalElement= cart.querySelector(".total-price");
    let total=0;

    cartBoxes.forEach((cartBox) => {
        let priceElement = cartBox.querySelector(".cart-price");
        let price = parseFloat(priceElement.innerHTML.replace("$",""));
        let count=  cartBox.querySelector(".cart-count").value;
        total += price * count;

    })

    total = total.toFixed(2);

    totalElement.innerHTML = "$" + total;

}



