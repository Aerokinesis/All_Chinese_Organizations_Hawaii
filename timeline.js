const slider = document.getElementById("yearSlider");
const yearDisplay = document.getElementById("yearDisplay");

slider.addEventListener("input", () => {

    const selectedYear = parseInt(slider.value);

    yearDisplay.textContent =
        `Showing organizations up to: ${selectedYear}`;

    const filtered = organizations.filter(org => {

        const year = parseInt(
            (org["Established"] || "").match(/\d{4}/)?.[0]
        );

        if (!year) return false;

        return year <= selectedYear;

    });

    renderOrganizations(filtered);
    addMarkers(filtered);

});