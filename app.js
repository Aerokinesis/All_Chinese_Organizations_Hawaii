const container = document.getElementById("directory");
const searchInput = document.getElementById("searchInput");
const clearBtn = document.getElementById("clearBtn");
const resultsCount = document.getElementById("resultsCount");

let organizations = [];

// Fetch data
fetch("chinese_organizations.json")
  .then((response) => response.json())
  .then((data) => {
    organizations = data;
    renderOrganizations(data);
  })
  .catch((error) => console.error("Error loading data:", error));

// Render cards
function renderOrganizations(data) {
  container.innerHTML = "";

  if (data.length === 0) {
    resultsCount.textContent = "No organizations found.";
    container.innerHTML = `<p class="no-results">No results found.</p>`;
    return;
  }

  resultsCount.textContent = `${data.length} result${data.length !== 1 ? "s" : ""} found.`;

  data.forEach((org) => {
    const card = document.createElement("div");
    card.classList.add("card");

    card.innerHTML = `
                <h3>${org["English Name"]}</h3>
                <p>${org["Chinese Name"]}</p>

                ${org["Established"] ? `<p><strong>Established:</strong> ${org["Established"]}</p>` : ""}
                ${org["Address"] ? `<p><strong>Address</strong>: ${org["Address"]}</p>` : ""}

                ${org["Phone"] ? `<p><strong>Phone:</strong> <a href="tel:${org["Phone"].replace(/\D/g, "")}">${org["Phone"]}</a></p>` : ""}

                ${org["Fax"] ? `<p><strong>Fax:</strong> ${org["Fax"]}</p>` : ""}

                ${org["Email"] ? `<p><strong>Email:</strong> <a href="mailto:${org["Email"]}">${org["Email"]}</a></p>` : ""}

                ${org["Website"] ? `<a href="${org["Website"]}" target="_blank">Visit Website</a>` : ""}
`;

    container.appendChild(card);
  });
}

// Live search
searchInput.addEventListener("input", function () {
  const searchTerm = this.value.toLowerCase().trim();

  // 👇 SHOW OR HIDE CLEAR BUTTON
  clearBtn.style.display = searchTerm ? "block" : "none";

  const filtered = organizations.filter(org =>
    (org["English Name"] || "").toLowerCase().includes(searchTerm) ||
    (org["Chinese Name"] || "").toLowerCase().includes(searchTerm) ||
    (org["Address"] || "").toLowerCase().includes(searchTerm)
  );

  renderOrganizations(filtered);
});

// Clear button
clearBtn.addEventListener("click", () => {
  searchInput.value = "";
  clearBtn.style.display = "none";
  renderOrganizations(organizations);
});
