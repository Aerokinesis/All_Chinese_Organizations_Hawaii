const container = document.getElementById("directory");
const searchInput = document.getElementById("searchInput");

let organizations = []; // store data globally

fetch("chinese_organizations.json")
    .then(response => response.json())
    .then(data => {
        organizations = data;
        renderOrganizations(organizations);
    })
    .catch(error => console.error("Error loading data:", error));

    function renderOrganizations(data) {
        container.innerHTML = ""; // clear existing cards
        
        if (data.length === 0) {
            container.innerHTML = `<p class="no-results">No results found.</p>`;
            return;
        }

        data.forEach(org => {
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

searchInput.addEventListener("input", function () {
  const searchTerm = this.value.toLowerCase();

  const filtered = organizations.filter(org =>
    (org["English Name"] || "").toLowerCase().includes(searchTerm) ||
    (org["Chinese Name"] || "").toLowerCase().includes(searchTerm) ||
    (org["Address"] || "").toLowerCase().includes(searchTerm)
  );

  renderOrganizations(filtered);
});

searchInput.addEventListener("input", function () {
  const searchTerm = this.value.toLowerCase();

  const filtered = organizations.filter(org =>
    (org["English Name"] || "").toLowerCase().includes(searchTerm) ||
    (org["Chinese Name"] || "").toLowerCase().includes(searchTerm) ||
    (org["Address"] || "").toLowerCase().includes(searchTerm)
  );

  renderOrganizations(filtered);
});