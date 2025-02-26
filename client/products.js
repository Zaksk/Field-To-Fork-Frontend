const productCard = document.getElementById("productCard");
const productImage = document.getElementById("productImage");
const productTitle = document.getElementById("productTitle");
const productDescription = document.getElementById("productDescription");

document.addEventListener("DOMContentLoaded", function () {
    // Select all product cards (main products + sidebar products)
    const productCards = document.querySelectorAll(".product-card, .popular-product");

    productCards.forEach(card => {
        card.addEventListener("click", function () {
            let productTitle, productDescription, productImage;

            // Check if it's a sidebar or main product card
            if (this.classList.contains("popular-product")) {
                // Get data from sidebar product's attributes
                productTitle = this.getAttribute("data-title") || "Unknown Product";
                productDescription = this.getAttribute("data-description") || "No description available.";
                productImage = this.getAttribute("data-image") || "./client/assets/default-product.jpg"; // Default image
            } else {
                // Get data from main product cards
                productTitle = this.querySelector(".card-title").textContent;
                productDescription = this.querySelector(".card-text").textContent;
                productImage = this.querySelector(".card-img-top").src || "./client/assets/default-product.jpg";
            }

            // Update modal content
            document.getElementById("modalProductTitle").textContent = productTitle;
            document.getElementById("modalProductDescription").textContent = productDescription;
            document.getElementById("modalProductImage").src = productImage;

            // Show modal
            const productModal = new bootstrap.Modal(document.getElementById("productModal"));
            productModal.show();
        });
    });
});