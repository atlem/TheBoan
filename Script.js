document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("defaultOpen").click();

    const navItems = document.querySelectorAll(".nav-item");
    const checkoutTable = document.querySelector("#checkout-summary tbody");
    let cart = {};
    const totalElement = document.getElementById("total");
    const placeOrderButton = document.querySelector(".place-order");
    const confirmSection = document.getElementById("confirm-section");
    const searchInput = document.querySelector("#searchInput");
    const tooltip = document.getElementById("tooltip");
    // Fetch products from JSON
   
    
 fetch("Product.json")
 //   fetch("https://files.encryptiacity.com/Misc/Product.json")
        .then(response => response.json())
        .then(data => {
            Object.keys(data).forEach(category => {
                const categoryContainer = document.getElementById(category);
                categoryContainer.innerHTML = "";
                
                data[category].forEach(product => {
                    const productElement = document.createElement("div");
                    productElement.classList.add("product");

                    productElement.innerHTML = `
                        <p class="Product-Name">${product.name}</p>
                        <div class="image-wrapper">
                            <img src="${product.image}" alt="${product.name}" class="product-image">
                            <p class="price">$${product.price.toFixed(2)}</p>
                            <div class="AddToCart"><p>+</p></div>
                        </div>
                    `;

                    // Tooltip Hover Events
                    const productImage = productElement.querySelector(".product-image");
                    productImage.addEventListener("mouseover", (event) => showTooltip(event, product));
                    productImage.addEventListener("mousemove", (event) => moveTooltip(event));
                    productImage.addEventListener("mouseout", () => hideTooltip());

                    productElement.addEventListener("click", () => addToCart(product));
                    categoryContainer.appendChild(productElement);
                });
            });
        })
        .catch(error => console.error("Error loading products:", error));

    // Show tooltip on hover
    function showTooltip(event, product) {
        tooltip.innerHTML = `<div class="tooltipbox">
                            <p class="ProductName">${product.name}</><br><p>
                            <img class="Tooltip-image" src="${product.image}" alt="${product.name}" ><br>
                            <p class="price">$${product.price.toFixed(2)}</p>
                            <br>${product.description || "No description available.</div>"}`;
        tooltip.classList.add("visible");
        moveTooltip(event);
    }

    // Move tooltip with cursor
    function moveTooltip(event) {
        tooltip.style.top = `${event.clientY + 10}px`;
        tooltip.style.left = `${event.clientX + 10}px`;
    }

    // Hide tooltip on mouseout
    function hideTooltip() {
        tooltip.classList.remove("visible");
    }

    // Move tooltip with cursor
    function moveTooltip(event) {
        tooltip.style.top = `${event.clientY + 10}px`;
        tooltip.style.left = `${event.clientX + 10}px`;
    }

    // Hide tooltip on mouseout
    function hideTooltip() {
        tooltip.classList.remove("visible");
    }

    function addToCart(product) {
        console.log("Added to cart:", product);
    }
    function addToCart(product) {
        if (!cart[product.name]) {
            cart[product.name] = { price: product.price, quantity: 0 };
        }
        cart[product.name].quantity++;
        updateCheckout();
    }

    function updateCheckout() {
        checkoutTable.innerHTML = "";
        let total = 0;
        Object.keys(cart).forEach((key) => {
            const row = document.createElement("tr");
            row.innerHTML = `<td>${key}</td><td>$${cart[key].price.toFixed(2)}</td> x <td>${cart[key].quantity}</td>`;
            checkoutTable.appendChild(row);
            total += cart[key].price * cart[key].quantity;
        });
        totalElement.innerText = `$${total.toFixed(2)}`;
    }

    placeOrderButton.addEventListener("click", function () {
        if (Object.keys(cart).length === 0) {
            alert("Your Order is empty!");
            return;
        }

        confirmSection.innerHTML = `
            <div class="confirmation-section">
                <h3>Confirm Your Order</h3>
                <table>
                    <thead><tr><th>Product</th><th>Price</th><th>Qty</th></tr></thead>
                    <tbody>
                        ${Object.keys(cart).map(key => `<tr><td>${key}</td><td>$${cart[key].price.toFixed(2)}</td><td>${cart[key].quantity}</td></tr>`).join('')}
                    </tbody>
                </table>
                <p><strong>Total: ${totalElement.innerText}</strong></p>
                <button id="confirmOrder">Confirm</button>
                <button id="cancelOrder">Cancel</button>
            </div>
        `;

        document.getElementById("confirmOrder").addEventListener("click", function () {
            alert("Order placed successfully!");
            cart = {};
            updateCheckout();
            confirmSection.innerHTML = "<div><h4>Swipes sucsess order drawned from E acount</h3></div>";
        });

        document.getElementById("cancelOrder").addEventListener("click", function () {
            confirmSection.innerHTML = "";
        });
    });

    // Tab switching functionality
    navItems.forEach((button) => {
        button.addEventListener("click", () => {
            const category = button.getAttribute("data-category");
            document.querySelectorAll(".products").forEach(products => {
                products.style.display = products.id === category ? "grid" : "none";
            });
        });
    });

    // Search functionality
    searchInput.addEventListener("keyup", function () {
        const searchText = searchInput.value.toLowerCase();
        document.querySelectorAll(".product").forEach(product => {
            const productName = product.querySelector("p").textContent.toLowerCase();
            product.style.display = productName.includes(searchText) ? "grid" : "none";
        });
    });
});
