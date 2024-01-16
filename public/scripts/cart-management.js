const addToCartButtobElement = document.querySelector(
  "#product-details button"
);
const cartSpanElements = document.querySelectorAll(".nav-items .badge");

async function addToCart() {
  let response;
  try {
    response = await fetch("/cart/items", {
      method: "POST",
      body: JSON.stringify({
        productId: addToCartButtobElement.dataset.productid,
        _csrf: addToCartButtobElement.dataset.csrf,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    alert("Something went wrong!");
    return;
  }

  if (!response.ok) {
    alert("Something went wrong!");
    return;
  }

  const responseData = await response.json();
  console.log(responseData);
  const newTotalQuantity = responseData.newTotalItems;
  console.log(newTotalQuantity);
  for(const cartSpanElement of cartSpanElements){
    cartSpanElement.textContent = newTotalQuantity;
  }
}

addToCartButtobElement.addEventListener("click", addToCart);
