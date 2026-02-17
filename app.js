const container = document.getElementById("directory");
const searchInput = document.getElementById("searchInput");
const clearBtn = document.getElementById("clearBtn");
const resultsCount = document.getElementById("resultsCount");
const nameSort = document.getElementById("nameSort");
const yearSort = document.getElementById("yearSort");

function escapeRegex(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function highlightMatch(text, searchTerm) {
  if (!searchTerm) return text;

  const safeSearch = escapeRegex(searchTerm);
  const regex = new RegExp(`(${safeSearch})`, "gi");

  return text.replace(regex, `<mark>$1</mark>`);
}

function highlightPhone(phone, searchTerm) {
  if (!searchTerm) return phone;

  const digitsOnlySearch = searchTerm.replace(/\D/g, "");
  if (!digitsOnlySearch) {
    return highlightMatch(phone, searchTerm);
  }

  const digitsOnlyPhone = phone.replace(/\D/g, "");

  const index = digitsOnlyPhone.indexOf(digitsOnlySearch);
  if (index === -1) return phone;

  // Map digit positions back to formatted phone string
  let digitCount = 0;
  let result = "";
  let matchStart = index;
  let matchEnd = index + digitsOnlySearch.length;

  for (let i = 0; i < phone.length; i++) {
    if (/\d/.test(phone[i])) {
      if (digitCount === matchStart) result += "<mark>";
      if (digitCount === matchEnd) result += "</mark>";

      digitCount++;
    }

    result += phone[i];
  }

  if (digitCount === matchEnd) result += "</mark>";

  return result;
}


let organizations = [];

// Fetch data
fetch("chinese_organizations.json")
  .then((response) => response.json())
  .then((data) => {
    organizations = data;
    renderOrganizations(data);
  })
  .catch((error) => console.error("Error loading data:", error));

function applyFilters() {
  const searchTerm = searchInput.value.toLowerCase().trim();

  let filtered = organizations.filter(org => {

    const establishedYear = parseInt(
      (org["Established"] || "").match(/\d{4}/)?.[0]
    );

    let yearMatch = false;

    if (/^\d{4}$/.test(searchTerm)) {
      yearMatch = establishedYear === parseInt(searchTerm);
    }

    // Remove non-digits from search term
    const numericSearch = searchTerm.replace(/\D/g, "");

    const phoneDigits = (org["Phone"] || "").replace(/\D/g, "");

    const basicMatch =
      (org["English Name"] || "").toLowerCase().includes(searchTerm) ||
      (org["Chinese Name"] || "").toLowerCase().includes(searchTerm) ||
      (org["Address"] || "").toLowerCase().includes(searchTerm) ||
      (org["Phone"] || "").toLowerCase().includes(searchTerm) ||
      (numericSearch && phoneDigits.includes(numericSearch));


    const safeSearch = escapeRegex(searchTerm);
    const searchRegex = new RegExp(`\\b${safeSearch}\\b`, "i");

    const leadershipMatch = (org["Leadership"] || []).some(person =>
      searchRegex.test(person.role || "") ||
      searchRegex.test(person.name || "") ||
      searchRegex.test(person.chinese_name || "")
    );

    return basicMatch || leadershipMatch || yearMatch;
  });

  // 🔹 SORTING
  filtered.sort((a, b) => {

    const yearA = parseInt((a["Established"] || "").match(/\d{4}/)?.[0]) || 0;
    const yearB = parseInt((b["Established"] || "").match(/\d{4}/)?.[0]) || 0;

    const nameA = (a["English Name"] || "");
    const nameB = (b["English Name"] || "");

    // 🔹 If year sort is selected, apply it first
    if (yearSort.value === "old" && yearA !== yearB) {
      return yearA - yearB;
    }

    if (yearSort.value === "new" && yearA !== yearB) {
      return yearB - yearA;
    }

    // 🔹 Then apply name sort
    if (nameSort.value === "az") {
      return nameA.localeCompare(nameB);
    }

    if (nameSort.value === "za") {
      return nameB.localeCompare(nameA);
    }

    return 0;
  });


  renderOrganizations(filtered);
}

// Render cards
function renderOrganizations(data) {
  container.innerHTML = "";
  const searchTerm = searchInput.value.toLowerCase().trim();


  if (data.length === 0) {
    resultsCount.textContent = "No organizations found.";
    container.innerHTML = `<p class="no-results">No results found.</p>`;
    return;
  }

  resultsCount.textContent = `${data.length} result${data.length !== 1 ? "s" : ""} found.`;

  data.forEach((org) => {
    const card = document.createElement("div");
    card.classList.add("card");

    //console.log(org.Leadership);

    card.innerHTML = `
                <h3>${highlightMatch(org["English Name"] || "", searchTerm)}</h3>
                <p>${highlightMatch(org["Chinese Name"] || "", searchTerm)}</p>


                ${org["Established"] ? `<p><strong>Established:</strong> ${highlightMatch(org["Established"], searchTerm)}</p>` : ""}

                ${org["Address"] ? `
                    <p>
                      <strong>Address:</strong>
                      <a href="https://www.google.com/maps/search/${encodeURIComponent(org["Address"])}" target="_blank">
                        ${highlightMatch(org["Address"], searchTerm)}
                      </a>
                    </p>
                ` : ""}



                ${org["Phone"] ? `
                  <p>
                    <strong>Phone:</strong>
                    <a href="tel:${org["Phone"].replace(/\D/g, "")}">
                      ${highlightPhone(org["Phone"], searchTerm)}
                    </a>
                  </p>
                ` : ""}



                ${org["Fax"] ? `<p><strong>Fax:</strong> ${org["Fax"]}</p>` : ""}

                ${org["Email"] ? `<p><strong>Email:</strong> <a href="mailto:${org["Email"]}">${org["Email"]}</a></p>` : ""}

                ${org["Website"] ? `<a href="${org["Website"]}" target="_blank">Visit Website</a>` : ""}

                ${org["Leadership"] && org["Leadership"].length > 0 ? `
                  <div class="leadership">
                    <strong>Leadership:</strong>
                    <ul>
                      ${org["Leadership"].map(person => `
                        <li>
                          ${highlightMatch(person.role || "", searchTerm)}:
                          ${highlightMatch(person.name || "", searchTerm)}
                          ${highlightMatch(person.chinese_name || "", searchTerm)}
                        </li>
                      `).join("")}
                    </ul>
                  </div>` : ""
      }
` ;

    container.appendChild(card);
  });
}

// Live search
searchInput.addEventListener("input", function () {
  clearBtn.style.display = this.value ? "block" : "none";
  applyFilters();
});

nameSort.addEventListener("change", applyFilters);
yearSort.addEventListener("change", applyFilters);


// Clear button
clearBtn.addEventListener("click", () => {
  searchInput.value = "";
  clearBtn.style.display = "none";
  applyFilters();
});
