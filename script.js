const csvUrl =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vRy8ReQN9RP6SCgDu32sMFXNDWwrawe0d-tFUFE6K3syuPor5dztNyFotsFqYnKb7u1cz6pHUQV9uHU/pub?output=csv";

function setupSearch(data) {
  const input = document.getElementById("searchInput");

  input.addEventListener("input", () => {
    const keyword = input.value.toLowerCase().trim();

    const filtered = data.filter((entry) => {
      // Combine all searchable fields into one string
      const searchable = [
        entry.Obtainment,
        entry.Owner,
        entry.Designer,
        entry.Artist,
        entry.Traits,
        entry.Substance,
        entry.Inspo,
      ]
        .join(" ")
        .toLowerCase();

      return searchable.includes(keyword);
    });

    displayMasterlist(filtered);
  });
}

// After fetching CSV and displaying masterlist the first time:
fetchCSV(csvUrl).then((data) => {
  displayMasterlist(data);
  setupSearch(data);
});

function filterMasterlist(data, keyword, category) {
  if (!keyword) return data; // no keyword → return all
  keyword = keyword.toLowerCase();

  return data.filter((entry) => {
    if (category === "All") {
      const combined = [
        entry.ID,
        entry.Obtainment,
        entry.Base,
        entry.Owner,
        entry.Designer,
        entry.Artist,
        entry.Inspo,
        entry.Substance,
        entry.Traits,
      ]
        .join(" ")
        .toLowerCase();
      return combined.includes(keyword);
    } else if (category === "Traits") {
      const combinedFields = `${entry.Traits || ""} ${
        entry.Substance || ""
      }`.toLowerCase();
      return combinedFields.includes(keyword);
    } else {
      const field = entry[category] || "";
      return field.toLowerCase().includes(keyword);
    }
  });
}

// Convert "URL | Text" into HTML link

function parseLinkField(field) {
  if (!field) return "N/A";
  const parts = field.split("|").map((p) => p.trim());
  if (parts.length === 2) {
    return `<a href="${parts[0]}" target="_blank">${parts[1]}</a>`;
  }
  return field; // plain text if no pipe
}

function parseLinkField2(field) {
  if (!field) return "N/A";
  if (field.startsWith("http://") || field.startsWith("https://")) {
    return `<a href="${field}" target="_blank">${field}</a>`;
  }
  return field;
}

// Fetch CSV from Google Sheets
async function fetchCSV(url) {
  const response = await fetch(url, { cache: "no-store" });
  const csvText = await response.text();
  const results = Papa.parse(csvText, {
    header: true,
    skipEmptyLines: true,
    transformHeader: (h) => h.trim(),
    transform: (v) => v.trim(),
  });
  return results.data.filter((row) => row.ID);
}

// Display the masterlist with lazy-loading
function displayMasterlist(data) {
  const container = document.getElementById("masterlist");
  const countContainer = document.getElementById("cardCount");
  container.innerHTML = "";

  // Show how many cards are currently displayed
  countContainer.textContent = `Showing ${data.length} entries!`;

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const card = entry.target;
          const entryData = card.dataset.entry;
          const dataObj = JSON.parse(entryData);

          populateCard(card, dataObj);
          obs.unobserve(card); // stop observing once loaded
        }
      });
    },
    { root: null, rootMargin: "500px", threshold: 0.1 }
  );

  data.forEach((entry) => {
    const card = document.createElement("div");
    card.className = "card";
    card.dataset.entry = JSON.stringify(entry);
    card.innerHTML = `<h2>Loading...</h2><div style="height:150px; background:#f0f0f0;"></div>`;
    container.appendChild(card);
    observer.observe(card);
  });
}

// Populate a card when it becomes visible
function populateCard(card, entry) {
  const traitsFormatted = entry.Traits
    ? entry.Traits.split("\n")
        .map((t) => t.trim())
        .join("<br>")
    : "N/A";

  const substanceFormatted = entry.Substance
    ? entry.Substance.split("\n")
        .map((t) => t.trim())
        .join("<br>")
    : "N/A";

  const idParts = entry.ID ? entry.ID.split("-") : [];
  const imageName =
    idParts.length > 1 ? `images/${idParts[1]}.png` : "images/placeholder.png";

  let html = `<h2>[${entry.ID}]</h2>
    <img src="${imageName}"
    loading="lazy"
    decoding="async"
    alt="ML Image"
    onerror="this.onerror=null;this.src='images/placeholder.png';">`;

  let html2 = `<p><strong>Obtained via:</strong> ${
    entry.Obtainment || "N/A"
  }</p>
    <p><strong>Owner:</strong> ${parseLinkField(entry.Owner)}</p>
    <p><strong>Designer:</strong> ${parseLinkField(entry.Designer)}</p>
    <p><strong>Artist:</strong> ${parseLinkField(entry.Artist)}</p>
    <p><strong>Substance:<br></strong> ${substanceFormatted}</p>
    <p><strong>Traits:</strong><br>${traitsFormatted}</p>`;

  if (entry.Inspo && entry.Inspo !== "") {
    html2 += `<p><strong>Based off of:</strong> ${parseLinkField2(
      entry.Inspo
    )}</p>`;
  }

  // Handle special Obtainment cases
  if (entry.Obtainment === "Hidden") {
    card.classList.add("hidden");
    html2 = `<p>This is a raffle design that has yet to be revealed!</p>`;
  } else if (entry.Obtainment === "Reserved") {
    html = `<h2>[${entry.ID}]</h2><img src="background.png"></img>`;
    html2 = `<h2 style="text-align:center">Reserved</h2>`;
  } else if (entry.Obtainment === "Secret") {
    card.classList.add("secret");
    html = `<h2>[S?R?TZ-01?]</h2>
      <img src="${imageName}"
      alt="ML Image"
      onerror="this.onerror=null;this.src='images/placeholder.png';">`;
    html2 = `<p><i>Oh, I just love the new look here--don't you?</i></p>`;
  } else if (entry.Obtainment === "Voided") {
    html = `<h2>[${entry.ID}]</h2><img src="background.png"></img>`;
    html2 = `The Spratz that was once here has now been voided!`;
  }

  card.innerHTML = html + html2;

  // Add popup if base exists
  if (entry.Base && entry.Base !== "") {
    const popup = document.createElement("div");
    popup.className = "popup";
    popup.innerHTML = `<p>This artwork uses a base by ${parseLinkField(
      entry.Base
    )}!</p>`;
    card.appendChild(popup);
  }

  // Image click fullscreen
  const img = card.querySelector("img");
  if (img) {
    img.addEventListener("click", () => {
      const overlay = document.createElement("div");
      overlay.className = "fullscreen-overlay";

      const containerDiv = document.createElement("div");
      containerDiv.className = "image-container";

      const fullImg = img.cloneNode();
      containerDiv.appendChild(fullImg);
      overlay.appendChild(containerDiv);

      overlay.addEventListener("click", (e) => {
        if (e.target === overlay) overlay.remove();
      });

      document.body.appendChild(overlay);
    });
  }
}

fetchCSV(csvUrl).then((data) => {
  // Sort initially by ID descending
  data.sort((a, b) => {
    const numA = a.ID.split("-")[1] ? parseInt(a.ID.split("-")[1], 10) : 0;
    const numB = b.ID.split("-")[1] ? parseInt(b.ID.split("-")[1], 10) : 0;
    return numB - numA;
  });

  const searchInput = document.getElementById("searchInput");
  const searchCategory = document.getElementById("searchCategory");

  function updateDisplay() {
    const keyword = searchInput.value;
    const category = searchCategory.value;
    const filteredData = filterMasterlist(data, keyword, category);
    displayMasterlist(filteredData);
  }

  searchInput.addEventListener("input", updateDisplay);
  searchCategory.addEventListener("change", updateDisplay);

  // Initial display
  displayMasterlist(data);
});
