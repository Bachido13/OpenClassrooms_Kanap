//--------------------------AFFICHAGE DU PRODUIT------------------------------------\\

let urlparams = document.location.search; // recupération du produit selectionné dans l'index
let urlsearchParams = new URLSearchParams(urlparams);
let productId = urlsearchParams.get("id"); //récuperation de l'id du produit
let kanap = {};

fetch("http://localhost:3000/api/products/" + productId) //Demande de requête (fetch) à l'API (url) pour le produit spécifique
    .then(function (response) {
        return response.json(); //return de la réponse (Booléen)
    })
    .then(function (kanap_) { //récupération de la réponse
        kanap = kanap_;
        const kanapImg = document.querySelector(".item__img"); // place HTML où l'on implémentera notre JS (image) [indiquer la class ou l'id pour etre plus précis]
        kanapImg.innerHTML = `<img src=${kanap.imageUrl} alt=${kanap.atlTxt}>`; // 
        const kanapNom = document.querySelector(".title");
        kanapNom.innerHTML = `${kanap.name}`;
        const kanapPrix = document.querySelector("#price"); // place HTML où l'on implémentera notre JS (prix) [indiquer la class ou l'id pour etre plus précis]
        kanapPrix.innerHTML = `${kanap.price}`;
        const kanapDescription = document.querySelector("#description"); // place HTML où l'on implémentera notre JS (description) [indiquer la class ou l'id pour etre plus précis]
        kanapDescription.innerHTML = `${kanap.description}`
        const kanapOption = document.querySelector("select"); // place HTML où l'on implémentera notre JS (option) [indiquer la class ou l'id pour etre plus précis]
        let innerHtml = ""
        for (let i = 0; i < kanap.colors.length; i++) { //boucle "for" pour implémenter chaque option
            const color = kanap.colors[i];
            innerHtml += `<option value="${color}">${color}</option>`;
        }
        kanapOption.innerHTML = innerHtml; // l'espace vide dans la section est remplacé par notre "let innerHTML" avec toutes les options

    })
    .catch(function (error) { // s'il y a une erreur lors de l'exectution de notre script, "error" s'affiche dans la console
        console.log(error)
    })


//Ajout du produit au panier

const addToCart = () => {
    const dataStore = localStorage.cartKanapRambach; //déclaration de la clé dans localstorage
    let cart = []; //tableau vide pour enregistrer nos porduits pour le panier
    if (dataStore) { //formatage du JSON vers JavaScript
        cart = JSON.parse(dataStore);
    }
    const existingProductIndex = cart.findIndex((product) => {
        return product.id === productId && product.color === document.querySelector("#colors").value;
    })
    if (existingProductIndex === -1) {
        cart.push({ //ajout de l'objet produit avec ses 3 informations
            id: productId,
            quantity: document.querySelector("#quantity").value,
            color: document.querySelector("#colors").value,
            // price: kanap.price,
            // name: kanap.name,
            // imageUrl: kanap.imageUrl,
            // altTxt: kanap.altTxt,
        });
    } else {
        for (let i = 0; i < cart.length; i++) {
            if (cart[i].color === document.querySelector("#colors").value && cart[i].id === productId) {
                cart[i].quantity = Number.parseInt(cart[i].quantity) + Number.parseInt(document.querySelector("#quantity").value);
            }
        }
    }
    localStorage.cartKanapRambach = JSON.stringify(cart) // formatage du localstorage (en JavaScript) au format JSON
    document.getElementById("addToCart").innerHTML = "Produit ajouté à votre panier"
};

document.querySelector("#addToCart").addEventListener("click", addToCart); //détecteur au clic sur le bouton "ajouter au panier"
