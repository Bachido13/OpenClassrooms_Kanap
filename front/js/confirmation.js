let orderId = new URL(location).searchParams.get("orderId");
console.log(orderId);
document.getElementById("orderId").innerHTML = orderId;