const getCart = () => { //on appaelle notre objet de la page product
    const cart = localStorage.cartKanapRambach; // avec la clé localStorage
    if (cart === null) { // si l'objet est vide 
        return []; // alors on retourne un tableau vide
    } else {
        return JSON.parse(cart); // sinon on formate le JSON en JS
    }
}
console.log(getCart())

const initCart = () => { // on appelle la fonction pour afficher notre panier 
    const cart = getCart();
    const cart__items = document.getElementById("cart__items");
    if (cart.length === 0) {
        alert("Votre panier est vide");
    }else {
        for (let i = 0; i < cart.length; i++) { //boucle "for" pour implémenter le code à ajouter pour le détail du panier
            const product = cart[i];
            const innerHtml = `<article class="cart__item" data-id=${product.id} data-color=${product.color}>
                            <div class="cart__item__img">
                                <img src=${product.imageUrl} alt=${product.altTxt}>
                            </div>
                            <div class="cart__item__content">
                                <div class="cart__item__content__description">
                                    <h2>${product.name}</h2>
                                    <p>${product.color}</p>
                                    <p>${product.price} €</p>
                                </div>
                                <div class="cart__item__content__settings">
                                    <div class="cart__item__content__settings__quantity">
                                        <p>Qté :${product.quantity} </p>
                                        <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${product.quantity}">
                                    </div>
                                    <div class="cart__item__content__settings__delete">
                                        <p class="deleteItem">Supprimer</p>
                                    </div>
                                </div>
                            </div>
                        </article>`;
            cart__items.insertAdjacentHTML("beforeend", innerHtml) ;  //on ajoute le innerHtml au cart__Items 
        }
    }
    document.querySelectorAll(".itemQuantity").forEach ((itemQuantity) => {
        itemQuantity.addEventListener(`change`, function(e) {
            const parent = this.parentNode.parentNode.parentNode.parentNode; // on remonte au parent 'article' de 'deleteItem'
            const {id, color} = parent.dataset;
            let index = cart.findIndex((cartItem) => cartItem.id == id && cartItem.color == color);
            cart[index].quantity = parseInt(event.target.value);
            if (cart[index].quantity <= 0 || cart[index].quantity > 100) { // Si quantité <=0 ou <100, message d'erreur
                alert("Veuillez choisir une quantité entre 1 et 100 !");
            } else {
                console.log(cart[index].quantity);
                localStorage.cartKanapRambach = JSON.stringify(cart);
                location.href = "cart.html";
            } 
        })
    })
    document.querySelectorAll(".deleteItem").forEach ((deleteItemP)=> { //pour chaque 'deleteItem' on crée un paramètre 'deleteItemP' que l'on écoute
        deleteItemP.addEventListener('click', function(e) {
            const parent = this.parentNode.parentNode.parentNode.parentNode; // on remonte au parent 'article' de 'deleteItem'
            const {id, color} = parent.dataset; // on crée 2 constantes id et color qui correspondent aux datas dans le cart
            let index = cart.findIndex((cartItem) => cartItem.id == id && cartItem.color == color); 
            cart.splice(index, 1);
            localStorage.cartKanapRambach = JSON.stringify(cart);
            parent.remove();
        })
    }) 
}
initCart();

const cartPrice = () => {    
    const cart = getCart();
    let totalPrice = 0;
    let totalQuantity = 0;
    const quantityInner = document.getElementById("totalQuantity");
    const priceInner = document.getElementById("totalPrice");
    for (let i = 0; i < cart.length; i++) {
        let prixDuProduit = cart[i].price * cart[i].quantity;
        let quantityItem = Number.parseInt(cart[i].quantity);
        totalQuantity += quantityItem;
        totalPrice += prixDuProduit;
    }
    quantityInner.innerHTML = totalQuantity;
    priceInner.innerHTML = totalPrice ; 
}

cartPrice();

