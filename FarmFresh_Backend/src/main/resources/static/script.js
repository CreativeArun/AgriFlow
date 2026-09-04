// ===============================
// MOUSE-DRIVEN PARALLAX
// ===============================

const scene = document.getElementById('scene');
const wrap = document.getElementById('sceneWrap');

let tx = 0, ty = 0, cx = 0, cy = 0;

if (wrap && scene) {

    wrap.addEventListener('mousemove', (e) => {

        const r = wrap.getBoundingClientRect();

        tx = ((e.clientX - r.left) / r.width - 0.5) * 2;
        ty = ((e.clientY - r.top) / r.height - 0.5) * 2;

    });

    function loop() {

        cx += (tx - cx) * 0.04;
        cy += (ty - cy) * 0.04;

        scene.style.transform =
            `rotateY(${cx * 6}deg) rotateX(${-cy * 4}deg)`;

        requestAnimationFrame(loop);
    }

    loop();
}


// ===============================
// ROLE SWITCHING
// ===============================

function setRole(role) {

    document.body.className = 'active-' + role;

    document.querySelectorAll('.role-btn').forEach(btn => {

        btn.classList.toggle(
            'active',
            btn.dataset.role === role
        );

    });

    const userRoleLabel =
        document.getElementById('userRoleLabel');

    if (userRoleLabel) {

        userRoleLabel.textContent =
            role === 'farmer' ? 'Farmer' : 'Consumer';

    }
}


// ===============================
// BACKEND CONNECTION
// ===============================

const API_URL = "http://localhost:8080";


// ===============================
// LOAD PRODUCTS FROM BACKEND
// ===============================

async function loadProducts() {

    try {

        const response = await fetch(
            API_URL + "/api/marketplace/products"
        );

        if (!response.ok) {

            throw new Error(
                "Failed to load products. Status: "
                + response.status
            );

        }

        const products = await response.json();

        console.log("Products received from backend:");
        console.log(products);

        displayProducts(products);

    } catch (error) {

        console.error("Error connecting to backend:", error);

    }
}


// ===============================
// DISPLAY PRODUCTS IN FRONTEND
// ===============================

function displayProducts(products) {

    // Only select Consumer product section
    const productContainer =
        document.querySelector(
            '.role-layout[data-role="consumer"] .products'
        );

    if (!productContainer) {

        console.error("Product container not found");

        return;
    }

    // Remove old hardcoded products
    productContainer.innerHTML = "";


    products.forEach(product => {

        let emoji = "🌾";

        if (product.name.toLowerCase().includes("rice")) {
            emoji = "🍚";
        }
        else if (product.name.toLowerCase().includes("potato")) {
            emoji = "🥔";
        }
        else if (product.name.toLowerCase().includes("tomato")) {
            emoji = "🍅";
        }


        const card = document.createElement("div");

        card.className = "p-card";


        card.innerHTML = `

            <div class="p-img">

                <span style="font-size:44px;">
                    ${emoji}
                </span>

                <div class="p-fav">
                    ♡
                </div>

            </div>


            <div class="p-body">

                <div class="p-name">
                    ${product.name}
                </div>


                <div class="p-desc">
                    ${product.description || "Fresh farm product"}
                </div>


                <div class="p-price">
                    ₹${product.price}
                    <span>/ kg</span>
                </div>


                <div class="p-avail">
                    Available: ${product.quantity} kg
                </div>


                <button
                    class="btn-add"
                    onclick="addToCart(${product.id})">

                    🛒 Add to Cart

                </button>

            </div>

        `;


        productContainer.appendChild(card);

    });

}


function addToCart(productId) {

    console.log(
        "Add to cart clicked. Product ID:",
        productId
    );

    alert(
        "Product ID " + productId +
        " selected. Cart connection will be added next."
    );

}




loadProducts();