// * Select DOM Elements
const body = document.querySelector("body");
const headerToggleButton = document.getElementById("header-toggle-button");

const extensionListItemButtons = document.querySelectorAll(
    ".extension-list-item",
);

const extensionContent = document.querySelector("#extension-content");

// * Configure
let filterOption = "all";
let loading = false;
let extensionData = [];

// * Define initialize method
const initialize = () => {
    loading = true;

    const theme = localStorage.getItem("theme") || "light";

    theme === "dark"
        ? body.setAttribute("data-theme", "dark")
        : body.setAttribute("data-theme", "light");

    extensionListItemButtons.forEach((button) => {
        if (button.getAttribute("data-filter") === filterOption) {
            button.setAttribute("data-active", "true");
        } else {
            button.setAttribute("data-active", "false");
        }
    });

    extensionContent.innerHTML = `
        <p class="message">Loading...</p>
    `;
};

// * Define toggle theme method
const toggleTheme = () => {
    const theme = body.getAttribute("data-theme");

    if (theme === "dark") {
        body.setAttribute("data-theme", "light");
        localStorage.setItem("theme", "light");
    } else {
        body.setAttribute("data-theme", "dark");
        localStorage.setItem("theme", "dark");
    }
};

// * Define filter method
const filterExtensions = (option) => {
    if (option === "all") {
        renderExtensions(extensionData);
    }

    if (option === "active") {
        const filteredData = extensionData.filter(
            (extension) => extension.isActive === true,
        );
        console.log(filteredData);
        renderExtensions(filteredData);
    }

    if (option === "inactive") {
        const filteredData = extensionData.filter(
            (extension) => extension.isActive === false,
        );
        console.log(filteredData);
        renderExtensions(filteredData);
    }
};

// * Get data in file json
const getExtensionsData = async () => {
    const response = await fetch("data.json");
    if (!response.ok) return null;

    const data = await response.json();

    return data;
};

const renderExtensions = (extensionData) => {
    if (!extensionData || extensionData.length === 0) {
        extensionContent.innerHTML = `
            <p class="message">No data returned.</p>
        `;
        return;
    }

    extensionContent.innerHTML = "";

    extensionData.forEach((extension) => {
        const extensionHTML = `
            <div class="card">
                <div class="card-content">
                    <div class="card-img">
                        <img
                            src="${extension.logo}"
                            alt="DevLens"
                        />
                    </div>
                    <div class="card-info">
                        <h6 class="card-title">${extension.name}</h6>
                        <p class="card-description">
                            ${extension.description}
                        </p>
                    </div>
                </div>
                <div class="card-option">
                    <button class="card-button-remove">remove</button>
                    <button
                        class="card-button-active"
                        data-active="${extension.isActive}"
                    ></button>
                </div>
            </div>
        `;

        extensionContent.innerHTML += extensionHTML;
    });
};

(async () => {
    initialize();

    headerToggleButton.addEventListener("click", toggleTheme);

    extensionListItemButtons.forEach((button) => {
        button.addEventListener("click", () => {
            extensionListItemButtons.forEach((btn) =>
                btn.setAttribute("data-active", "false"),
            );

            filterOption = button.getAttribute("data-filter");

            button.setAttribute("data-active", "true");

            filterExtensions(filterOption);
        });
    });

    const extensionDataResult = await getExtensionsData();

    extensionData = extensionDataResult ? extensionDataResult : [];

    renderExtensions(extensionData);
})();
