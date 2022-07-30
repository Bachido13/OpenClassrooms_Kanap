/*------------------------------------------------PANIER--------------------------------------------------------*/
// variable globale qui doit être chargé avec les items du panier et leurs infos complètes
let cart = [];

// Promesse récupérant un article à l'unité, appelée pour récupérer les infos complètes
// de chaque item du panier
const getOneProduct = (item) => {
    return new Promise((resolve, reject) => {
        fetch("http://localhost:3000/api/products/" + item.id)
            .then(function (response) {
                return response.json();
            })
            .then(function (kanap_) {
                resolve({ ...kanap_, quantity: item.quantity, color: item.color, id: item.id });
            })
            .catch(function (error) {
                reject(error)
            })
    })
};

// Récupération du panier dans le localStorage
const getCart = () => { //on appaelle notre objet de la page product
    const cart_ = localStorage.cartKanapRambach; // avec la clé localStorage
    if (!cart_) { // si l'objet est vide 
        return []; // alors on retourne un tableau vide
    } else {
        return JSON.parse(cart_); // sinon on formate le JSON en JS
    }
};

// Actualisation du localStorage survenant après chaque actualisation du tableau cart en 
// "épurant" les objets de ce tableau avec seulement leur quantité, couleur et id
const updateCartInLocalStorage = () => {
    const cart_ = cart.map(item => {
        return {
            color: item.color,
            price: item.price,
            quantity: item.quantity,
            id: item.id
        };
    });
    localStorage.cartKanapRambach = JSON.stringify(cart_);
};

// Calcul du Prix du Panier et du nombre d'articles
const updateTotalPriceAndQuantity = () => {
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
    priceInner.innerHTML = totalPrice;
}

// Initialisation visuelle du panier
const initCart = () => {
    const cart__items = document.getElementById("cart__items");
    if (cart.length === 0) {
        alert("Votre panier est vide");
    } else {
        // Affichage des Produits du Panier
        for (let i = 0; i < cart.length; i++) {
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
                                        <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${product.quantity}">
                                    </div>
                                    <div class="cart__item__content__settings__delete">
                                        <p class="deleteItem">Supprimer</p>
                                    </div>
                                </div>
                            </div>
                        </article>`;
            cart__items.insertAdjacentHTML("beforeend", innerHtml);
        }
    }

    // Modification de la quantité du Produit
    document.querySelectorAll(".itemQuantity").forEach((itemQuantity) => {
        itemQuantity.addEventListener(`change`, function () {
            const parent = this.parentNode.parentNode.parentNode.parentNode;
            const { id, color } = parent.dataset;
            let index = cart.findIndex(cartItem => cartItem.id == id && cartItem.color == color);
            cart[index].quantity = parseInt(event.target.value);
            if (cart[index].quantity <= 0 || cart[index].quantity > 100) {
                alert("Veuillez choisir une quantité entre 1 et 100 !");
            } else {
                updateCartInLocalStorage();
                updateTotalPriceAndQuantity();
            }
        });
    });

    // Suppression de l'article du Panier
    document.querySelectorAll(".deleteItem").forEach((deleteItemP) => {
        deleteItemP.addEventListener('click', function () {
            const parent = this.parentNode.parentNode.parentNode.parentNode;
            const { id, color } = parent.dataset;
            let index = cart.findIndex((cartItem) => cartItem.id == id && cartItem.color == color);
            cart.splice(index, 1);
            updateCartInLocalStorage();
            updateTotalPriceAndQuantity();
            parent.remove();
        })
    })
}

// Fonction appelée au chargement du script qui initialise la partie panier de la page
// ainsi que la partie formulaire si le panier n'est pas vide.
const getAllProductToInitCart = () => {
    const cartBefore = getCart();
    if (cartBefore.length === 0) {
        document.getElementById("cartAndFormContainer").innerHTML = "<h1>Votre panier est vide !</h1>";
        return;
    }
    formHandler();
    const promises = [];
    cartBefore.forEach(item => {
        promises.push(getOneProduct(item))
    })
    Promise.all(promises)
        .then(cart_ => {
            cart = cart_;
            initCart()
            updateTotalPriceAndQuantity();
        });
};

/*--------------------------------------------FORMULAIRE--------------------------------------------*/

// Groupement de toutes les fonctionnalités liées au formulaire dans une seule fonction
// Cette fonction sera éxécutée une seule fois, au chargement de ce script, seulement si le panier n'est pas vide
const formHandler = () => {

    // Déclarations Regex et localistations messages d'erreur
    const regexName = /[A-Za-zàâäéèêëïîôöùûüç\-\']/g;
    const firstNameErrorMsg = document.getElementById("firstNameErrorMsg");
    const lastNameErrorMsg = document.getElementById("lastNameErrorMsg");
    const regexAddress = /^[0-9]{1,4}(?:(?:[,. ]){1}[-a-zA-Zàâäéèêëïîôöùûüç]+)+/;
    const addressErrorMsg = document.getElementById("addressErrorMsg");
    const cityErrorMsg = document.getElementById("cityErrorMsg");
    const regexEmail = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z]{2,4})+$/;
    const emailErrorMsg = document.getElementById("emailErrorMsg");


    // Ecoute de l'input firstname
    document.getElementById("firstName").addEventListener('change', () => {
        if (regexName.test(firstName.value)) {
            firstNameErrorMsg.innerHTML = "";
        } else {
            firstNameErrorMsg.innerHTML = "Veuillez entrer un prénom avec les bons caractères."
        }
    });

    // Ecoute de l'input lastname
    document.getElementById("lastName").addEventListener('change', () => {
        if (regexName.test(lastName.value)) {
            lastNameErrorMsg.innerHTML = "";
        } else {
            lastNameErrorMsg.innerHTML = "Veuillez entrer un nom avec les bons caractères."
        }
    });

    // Ecoute de l'input address
    document.getElementById("address").addEventListener('change', () => {
        if (regexAddress.test(address.value)) {
            addressErrorMsg.innerHTML = "";
        } else {
            addressErrorMsg.innerHTML = "Veuillez entrer une adresse avec les bons caractères."
        }
    });

    // Ecoute de l'input city
    document.getElementById("city").addEventListener('change', () => {
        if (regexName.test(city.value)) {
            cityErrorMsg.innerHTML = "";
        } else {
            cityErrorMsg.innerHTML = "Veuillez entrer une ville avec les bons caractères."
        }
    });

    // Ecoute de l'input email
    document.getElementById("email").addEventListener('change', () => {
        if (regexEmail.test(email.value)) {
            emailErrorMsg.innerHTML = "";
        } else {
            emailErrorMsg.innerHTML = "Veuillez entrer un email avec les bons caractères."
        }
    });


    let form = document.querySelector('.cart__order__form')
        .addEventListener('submit', (event) => {
            event.preventDefault();
            if (firstNameErrorMsg.innerHTML.length == 0 && document.getElementById("firstName").value.trim().length > 0 &&
                lastNameErrorMsg.innerHTML.length == 0 && document.getElementById("lastName").value.trim().length > 0 &&
                addressErrorMsg.innerHTML.length == 0 && document.getElementById("address").value.trim().length > 0 &&
                cityErrorMsg.innerHTML.length == 0 && document.getElementById("city").value.trim().length > 0 &&
                emailErrorMsg.innerHTML.length == 0 && document.getElementById("email").value.trim().length > 0) {
                const order = {
                    contact: {
                        firstName: document.getElementById("firstName").value,
                        lastName: document.getElementById("lastName").value,
                        address: document.getElementById("address").value,
                        city: document.getElementById("city").value,
                        email: document.getElementById("email").value,
                    },
                    products: cart.map((item) => item.id)
                };

                const headers = new Headers();
                headers.append("Content-type", "application/json");

                const reqInit = {
                    headers,
                    method: "POST",
                    body: JSON.stringify(order)
                };

                fetch("http://localhost:3000/api/products/order/", reqInit)
                    .then(function (response) {
                        return response.json();
                    })
                    .then(function (info) {
                        localStorage.removeItem("cartKanapRambach");
                        document.location.href = "./confirmation.html?orderId=" + info.orderId;
                    });
            }
        });
};

getAllProductToInitCart();