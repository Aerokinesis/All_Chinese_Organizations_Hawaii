let container = document.querySelector('.container');

fetch("chinese_organizations.json")
  .then(response => response.json())
  .then(data => {
    console.log(data);

    const container = document.getElementById("directory");

    data.forEach(org => {
      const card = document.createElement("div");
      card.classList.add("card");

      card.innerHTML = `
        <h3>${org["English Name"]}</h3>
        <p>${org["Chinese Name"]}</p>

        ${org["Established"] ? `<p>Established: ${org["Established"]}</p>` : ""}
        ${org["Address"] ? `<p>Address: ${org["Address"]}</p>` : ""}
        ${org["Phone"] ? `<p>Phone: ${org["Phone"]}</p>` : ""}
        ${org["Fax"] ? `<p>Fax: ${org["Fax"]}</p>` : ""}
        ${org["Email"] ? `<p>Email: ${org["Email"]}</p>` : ""}
        ${org["Website"] ? `<a href="${org["Website"]}" target="_blank">Visit Website</a>` : ""}
`;

      container.appendChild(card);
    });
  })
  .catch(error => console.error("Error loading data:", error));