const productCard = document.getElementById("productCard");
const productImage = document.getElementById("productImage");
const productTitle = document.getElementById("productTitle");
const productDescription = document.getElementById("productDescription");
const productContainer = document.getElementById("productContainer");
const productCards = document.querySelectorAll(".product-card");
const dataBtn = document.getElementById("dataBtn");

dataBtn.addEventListener("click", () => {
  window.location.assign("../visualsPage/data.html");
});
// URLS
const apiUrl = "https://field-to-fork-backend.onrender.com";
const productsUrl = `${apiUrl}/products/`;
// TODO: add other urls here and use variables

// Fetches products and returns them
async function fetchProducts() {
    try {
        const token = localStorage.getItem("token");
        const response = await fetch(productsUrl, {
            method: "GET",
            headers: {
                Authorization: token,
            },
        });
        if (!response.ok) {
            throw new Error("Failed to fetch products");
        }
        return await response.json();

    } catch (error) {
        console.log("Error fetching products", error);
        return [];
    }
}

// Renders the list of products
function renderProducts(products) {
  productContainer.innerHTML = "";

  if (products.length === 0) {
    productContainer.innerHTML = "<p>No products found for this category.</p>";
  }

  products.forEach((product) => {
    const productCard = document.createElement("div");
    productCard.classList.add("col-md-4");

    productCard.innerHTML = `
            <div class="product-card card shadow-sm p-3" data-category="${product.category}" data-postcode="${product.postcode}" data-product-id="${product.id}">
                <img src="${product.product.image_url}" class="card-img-top product-image" alt="${product.type}" data-product-id="${product.id}">
                <div class="card-body">
                    <h4 class="card-title product-title">${product.type}</h4>
                    <p class="card-text product-id">id:${product.product.product_id}<p>
                    <p class="card-text product-description">${product.product.description}</p>
                    <p class="card-texr product-postcode"><strong>Location: </strong>${product.postcode}<p>
                    <p class="card-text product-distance"><strong>Distance: </strong><span class="distance-value">N/A</span></p>
                    <p class="card-text product-price"><strong>Price: £</strong>${product.product.price}</p>
                    <a href="#" class="btn btn-outline-success">See More...</a>
                </div>
            </div>
        `;
    productContainer.appendChild(productCard);
  });
}

// API request to fetch & display products cards
document.addEventListener("DOMContentLoaded", async () => {
  const allProducts = await fetchProducts();
  renderProducts(allProducts);

  function filterProducts(category) {
    let filteredProducts;

    if (category === "all") {
        return allProducts;
    }
    
    return allProducts.filter((product) => {
        console.log(`Checking product with category: ${product.category}`);
        return product.category === category;
    });
  }

  // Event listener for filter change
  document
    .querySelectorAll('input[type="radio"][name="product"]')
    .forEach((radio) => {
      radio.addEventListener("change", function () {
        const selectedCategory = this.value;
        console.log("Selected Category from radio button:", selectedCategory);
        const filteredProducts = filterProducts(selectedCategory);
        renderProducts(filteredProducts);
      });
    });
});

// Display the card when clicked
document.addEventListener("DOMContentLoaded", function () {
  let productId = null;

  // Use event delegation to handle clicks on product cards
  productContainer.addEventListener("click", async function (event) {
      // Check if the clicked element or its parent is a product card
      const productCard = event.target.closest(".product-card");
      if (productCard) {
        let productTitle, productDescription, productImage, productPrice;

        // Get data from the clicked product card
        productTitle = productCard.querySelector(".product-title").textContent;
        productDescription = productCard.querySelector(
          ".product-description"
        ).textContent;
        productImage =
          productCard.querySelector(".product-image").src ||
          "../assets/default-product.jpg";

        productPrice = productCard.querySelector(".product-price").textContent;

        // Get product ID from the card
        productId = parseInt(
          productCard
            .querySelector(".product-id")
            .innerText.replace("id:", "")
            .trim()
        );

        // Update modal content
        document.getElementById("modalProductTitle").textContent = productTitle;
        document.getElementById("modalProductDescription").textContent =
          productDescription;
        document.getElementById("modalProductImage").src = productImage;
        document.getElementById("modalProductPrice").textContent = productPrice;

        // Show modal
        const productModal = new bootstrap.Modal(
          document.getElementById("productModal")
        );
        productModal.show();

        // Fetch comments for the selected product
        fetchComments(productId);
      }
    });

  // Fetch comments for a specific product
  async function fetchComments(productId) {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("User is not authenticated. Please log in!");
      return;
    }

    try {
      const response = await fetch(
        `https://field-to-fork-backend.onrender.com/users/comments/${productId}`,
        {
          method: "GET",
          headers: {
            Authorization: token,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch comments.");
      }

      const comments = await response.json();
      console.log(comments);
      displayComments(comments);
    } catch (error) {
      console.log("Error fetching comments:", error);
      alert("Failed to load comments. Please try again.");
    }
  }

  // Function to display comments on the page
  function displayComments(comments) {
    const commentsList = document.getElementById("commentsList");
    commentsList.innerHTML = ""; // Clear previous comments

    // Check if there are comments
    if (comments.length === 0) {
      commentsList.innerHTML =
        "<li>No comments yet. Be the first to comment!</li>";
      return;
    }

    // Function to convert the timestamp

    function formatTimestamp(timestamp) {
      return new Date(timestamp).toLocaleString("en-GB", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });
    }

    // Display each comment
    comments.forEach((comment) => {
      const commentItem = document.createElement("div");
      commentItem.classList.add(
        "comment-item",
        "card",
        "mb-2",
        "p-2",
        "shadow-sm"
      );
      const createdAt = formatTimestamp(comment.comment.created_at);
        commentItem.innerHTML = `
        <div class="d-flex align-items-center">
            <div>
                <strong class="d-block">${comment.user_name}</strong>
                <small class="text-muted">${createdAt}</small>
            </div>
        </div>
        <p class="mt-2 mb-1">${comment.comment.comment_text}</p>
        `;
      commentsList.appendChild(commentItem);
    });
  }

  // Comment form submission
  const commentForm = document.getElementById("commentForm");
  const commentText = document.getElementById("commentText");

  commentForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    const commentContent = commentText.value.trim();
    if (!commentContent) {
      alert("Comment cannot be empty!");
      return;
    }

    // Check if a product has been selected
    if (!productId) {
      alert("No product selected. Please select a product first!");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      alert("User is not authenticated. Please log in!");
      return;
    }

    const commentData = {
      product_id: productId, // Use the selected product ID
      comment_text: commentContent,
    };

    try {
        const data = {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
          body: JSON.stringify(commentData),
        };
        console.log(`Comment: ${JSON.stringify(data)}`);
      const response = await fetch(
        "https://field-to-fork-backend.onrender.com/users/comments/",
        data
      );

      if (!response.ok) {
        throw new Error("Failed to post comment.");
      }

      const newComment = await response.json();
      displayComment(newComment);
      commentText.value = ""; // Clear the comment text
    } catch (error) {
      console.log("Error posting comment:", error);
      alert("Failed to post comment. Please try again.");
    }
  });

  function displayComment(comment) {
    const commentsList = document.getElementById("commentsList");

    console.log("Received comment data:", comment);

    const userName = comment.user_name || comment.username || "Anonymous";
    const timestampRaw =
      comment.timestamp || comment.created_at || comment.date;

    let formattedTimestamp = "Unknown time";
    if (timestampRaw) {
      const timestamp = new Date(timestampRaw);
      if (!isNaN(timestamp.getTime())) {
        formattedTimestamp = timestamp.toLocaleString();
      }
    }
}
});

//C-- Add Product form
document.addEventListener("DOMContentLoaded", function () {
  const addProductBtn = document.querySelector(".add-product-btn");
  const addProductModal = new bootstrap.Modal(
    document.getElementById("addProductModal")
  );

  addProductBtn.addEventListener("click", function () {
    addProductModal.show();
  });

  document.getElementById("addProductModal").addEventListener("hidden.bs.modal", function () {
    document.querySelectorAll(".modal-backdrop").forEach((backdrop) => {
        backdrop.remove();
    });
    document.body.classList.remove("modal-open");
  })
});

// C-- Upload image to Add Product form
document.addEventListener("DOMContentLoaded", function () {
    const productImageInput = document.getElementById("product-Image");
    const imagePreview = document.getElementById("imagePreview");

    productImageInput.addEventListener("change", function (event) {
        const file = event.target.files[0]; // Get the selected file

        if (file) {
            const reader = new FileReader();

            reader.onload = function (e) {
                imagePreview.src = e.target.result; // Set preview image source
                imagePreview.classList.remove("d-none"); // Show preview
            };

            reader.readAsDataURL(file); // Convert file to Data URL for preview
        }
    });
});

// Distance calculator
document.addEventListener("DOMContentLoaded", () => {
    const productContainer = document.getElementById("productContainer");
    const sortByDistanceButton = document.getElementById("sortByDistance");
    const postcodeInput = document.getElementById("postcode");
    let lastUsedPostcode = "";
    const cachedDistances = {}; // Cache API results

    sortByDistanceButton.addEventListener("click", async () => {
        const userPostcode = postcodeInput.value.trim();
        if (!userPostcode) return alert("Please enter your postcode.");

        if (userPostcode !== lastUsedPostcode) {
            lastUsedPostcode = userPostcode;
            Object.keys(cachedDistances).forEach(key => delete cachedDistances[key]);
        }

        await sortProductsByDistance(userPostcode);
    });

    async function fetchCoordinates(postcode) {
        try {
            const response = await fetch(`https://api.postcodes.io/postcodes/${postcode}`);
            if (!response.ok) throw new Error("Invalid postcode");
            const { result } = await response.json();
            return { lat: result.latitude, lon: result.longitude };
        } catch (error) {
            console.error("Error fetching postcode data:", error);
            return null;
        }
    }

    function calculateDistance({ lat: lat1, lon: lon1 }, { lat: lat2, lon: lon2 }) {
        const R = 6371, dLat = (lat2 - lat1) * (Math.PI / 180), dLon = (lon2 - lon1) * (Math.PI / 180);
        const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * Math.sin(dLon / 2) ** 2;
        return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)) * 0.621371; // Convert km to miles
    }

    async function getDistance(postcode1, postcode2) {
        const cacheKey = `${postcode1}-${postcode2}`;
        if (cachedDistances[cacheKey] !== undefined) return cachedDistances[cacheKey];

        const coords1 = await fetchCoordinates(postcode1);
        const coords2 = await fetchCoordinates(postcode2);
        if (!coords1 || !coords2) return null;

        return cachedDistances[cacheKey] = calculateDistance(coords1, coords2);
    }

    async function sortProductsByDistance(userPostcode) {
        try {
            const productWrappers = [...productContainer.querySelectorAll(".col-md-4")];
            if (!productWrappers.length) return console.error("No product cards found.");

            let products = await Promise.all(productWrappers.map(async (wrapper) => {
                const card = wrapper.querySelector(".product-card");
                const productPostcode = card.dataset.postcode;
                let distance = card.dataset.distance ? parseFloat(card.dataset.distance) : await getDistance(userPostcode, productPostcode);
                if (distance === null) return null;
                card.dataset.distance = distance;
                return { wrapper, card, distance };
            }));

            products = products.filter(Boolean).sort((a, b) => a.distance - b.distance);
            products.forEach(({ wrapper, card, distance }) => {
                productContainer.appendChild(wrapper);
                const distanceElement = card.querySelector(".distance-value");
                if (distanceElement) distanceElement.textContent = `${distance.toFixed(2)} miles`;
            });
        } catch (error) {
            console.error("Error sorting products by distance:", error);
            alert("Error sorting products by distance. Please try again.");
        }
    }
});




//shopping cart

document.addEventListener("DOMContentLoaded", function () {
  const addToCartBtn = document.getElementById("addToCartBtn");
  const quantityInput = document.getElementById("quantity");
  const cartItemsContainer = document.getElementById("item");
  const cartTotalElement = document.getElementById("cartTotal");
  const notification = document.getElementById("notification");

  let cart = [];

  addToCartBtn.addEventListener("click", function () {
    // Get the innerText of the price element
    const priceText = document.getElementById("modalProductPrice").innerText; // e.g., "Price: £10.00"

    // Remove the "Price: £" part to extract the number
    const priceValue = parseFloat(priceText.replace("Price: £", "")); // Extracts "10.00" and converts to number

    // Create the product object
    const product = {
      title: document.getElementById("modalProductTitle").innerText,
      variety: document.getElementById("modalProductVariety").innerText,
      price: priceValue, // Use the extracted numeric value
      quantity: parseInt(quantityInput.value),
      image: document.getElementById("modalProductImage").src,
    };

    // Check if the product is already in the cart
    const existingProductIndex = cart.findIndex(
      (item) => item.title === product.title && item.variety === product.variety
    );

    if (existingProductIndex !== -1) {
      // Update the quantity if the product is already in the cart
      cart[existingProductIndex].quantity += product.quantity;
    } else {
      // Add the product to the cart if it's not already there
      cart.push(product);
    }

    updateCartDisplay();

    // Show notification
    notification.style.display = "block";
    setTimeout(() => {
      notification.style.display = "none";
    }, 3000); // Hide notification after 3 seconds

    // Open the offcanvas shopping cart
    // const offcanvas = new bootstrap.Offcanvas(document.getElementById('offcanvasRight'));
    // offcanvas.show();
  });

  function updateCartDisplay() {
    cartItemsContainer.innerHTML = ""; // Clear the current cart display
    let total = 0;

    cart.forEach((item) => {
      const cartItem = document.createElement("div");
      cartItem.className = "cart-item";
      cartItem.innerHTML = `
                <img src="${item.image}" alt="${item.title}" width="50">
                <div>
                    <h6>${item.title} - ${item.variety}</h6>
                    <p>£${item.price.toFixed(2)} x ${item.quantity}</p>
                </div>
            `;
      cartItemsContainer.appendChild(cartItem);

      // Calculate the total price
      total += item.price * item.quantity;
    });

    // Update the total price
    cartTotalElement.innerText = total.toFixed(2);
  }
});

async function fetchProductTypeByCategory(categoryId) {
  const token = localStorage.getItem("token");
  if (!token) {
    alert("User is not authenticated. Please log in!");
    return;
  }
  try {
    const response = await fetch(
      `https://field-to-fork-backend.onrender.com/products/type/${categoryId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch types by category.");
    }

    return await response.json();
  } catch (error) {
    console.log("Error fetching types:", error);
  }
}

async function createProductOnServer(product) {
  const token = localStorage.getItem("token");
  if (!token) {
    alert("User is not authenticated. Please log in!");
    return;
  }

  try {
    const response = await fetch(
        "https://field-to-fork-backend.onrender.com/products/",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: token,
            },
            body: JSON.stringify(product),
        }
    );
    return await response.json();

  } catch (error) {
    console.log("Error fetching types:", error);
    return null;
  }
}

// API request to Add new product
document.addEventListener("DOMContentLoaded", function () {
  const addProductForm = document.getElementById("addProductForm");
  const typeDropdown = document.getElementById("typeDropdown");
  const addProductModal = new bootstrap.Modal(
    document.getElementById("addProductModal")
  );

  // Dynamically adding product types
  const categoryDropdown = document.getElementById("categoryDropdown");
  categoryDropdown.addEventListener("change", async function (e) {
    // Check selection
    const selectedCategory = this.options[this.selectedIndex];
    const categoryId = selectedCategory.getAttribute("data-id");
    // Clear types list
    typeDropdown.options.length = 1;
    typeDropdown.selectedIndex = 0;
    typeDropdown.dispatchEvent(new Event("change"));
    if (categoryId) {
      // Fetch product types by category
      data = await fetchProductTypeByCategory(categoryId);
      // For each type add a child to the corresponding dropdown list
      for (const idx in data) {
        const item = data[idx];

        let option = document.createElement("option");
        option.value = item.type_name;
        option.textContent = item.type_name;
        option.setAttribute("data-type-id", item.type_id);
        option.setAttribute("data-price-type-id", item.price_type_id);
        option.setAttribute("data-price-type-name", item.price_type_name);
        typeDropdown.appendChild(option);
      }
    }
  });

  typeDropdown.addEventListener("change", function (e) {
    const selection = this.options[this.selectedIndex];
    const priceTypeName = selection.getAttribute("data-price-type-name");
    const priceLabel = document.getElementById("productPriceLabel");
    priceLabel.innerText = priceTypeName
      ? `Price (£) per ${priceTypeName}`
      : "Price (£)";
  });

  addProductForm.addEventListener("submit", async function (e) {
    e.preventDefault(); // Prevent page refresh

    const categoryId =
      categoryDropdown.options[categoryDropdown.selectedIndex].getAttribute(
        "data-id"
      );
    const typeId =
      typeDropdown.options[typeDropdown.selectedIndex].getAttribute(
        "data-type-id"
      );
    const variety = document.getElementById("productVariety").value.trim();
    const description = document
      .getElementById("productDescription")
      .value.trim();
    const price = parseFloat(document.getElementById("productPrice").value).toFixed(2);

    if (!categoryId || !typeId || !variety || !description || !price) {
      alert("Please fill in all fields and select an image!");
      return;
    }

    // TODO: Image upload
    const imageUrl = '';
    console.log(`UserId: ${localStorage}`);

    // Create a new product object
    const newProduct = {
      type_id: typeId,
      variety: variety,
      active: true,
      description: description,
      image_url: imageUrl,
      price: price
    };

    try {
        await createProductOnServer(newProduct);
        const prods = await fetchProducts();
        renderProducts(prods);

    } catch (error) {
        console.log("Error fetching types:", error);
        alert("Unable to store product!");

    } finally {
        // Close modal and reset form
        addProductModal.hide();
        addProductForm.reset();
    }
  });

  // Function to convert image file to Base64
  function convertImageToBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  }

  // Function to dynamically add a product to the UI
  function addProductToUI(product) {
    const productCard = document.createElement("div");
    productCard.classList.add("col-md-4");

    productCard.innerHTML = `
            <div class="product-card card shadow-sm p-3" data-category="${product.category}" data-postcode="${product.postcode}">
                <img src="${product.image}" class="card-img-top product-image" alt="${product.name}">
                <div class="card-body">
                    <h4 class="card-title product-title">${product.name}</h4>
                    <p class="card-text product-id">id:${product.product.product_id}<p>
                    <p class="card-text product-description">${product.description}</p>
                    <p class="card-text product-distance"><strong>Distance:</strong> <span class="distance-value">N/A</span></p>
                    <p class="card-text"><strong>Price: £</strong>${product.price}</p>
                    <a href="#" class="btn btn-outline-success">See More...</a>
                </div>
            </div>
        `;

    // Append to the product container
    productContainer.prepend(productCard);
  }
});
