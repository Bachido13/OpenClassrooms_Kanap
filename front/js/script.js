fetch("http://localhost:3000/api/products") //Demande de requête (fetch) à l'API (url)
  .then(function (response) {
    return response.json(); //return de la réponse (Booléen)
  })
  .then(function (kanaps) {  //récupération de la réponse
    const kanapsSection = document.getElementById("items"); // "items" = class de la section où l'on insère nos kanaps (réponse)
    let innerHtml = "";
    for (let i = 0; i < kanaps.length; i++) {  //boucle "for" pour implémenter chaque kanap
      const kanap = kanaps[i];
      innerHtml += `<a href="./product.html?id=${kanap._id}"> 
        <article>
          <img src=${kanap.imageUrl} alt=${kanap.altTxt}>
          <h3 class="productName">${kanap.name}</h3>
          <p class="productDescription">${kanap.description}</p>
        </article>
      </a>` // le nom de chaque propriété de "kanap" doit correspondre au nom dans la console
    }
    kanapsSection.innerHTML = innerHtml // l'espace vide dans la section est remplacé par notre "let innerHTML" avec toutes les datas des différents kanaps 
  })
  .catch(function (error) { // s'il y a une erreur lors de l'exectution de notre script, "error" s'affiche dans la console
    console.log(error)
  });