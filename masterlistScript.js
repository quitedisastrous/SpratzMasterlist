const csvUrl =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vRy8ReQN9RP6SCgDu32sMFXNDWwrawe0d-tFUFE6K3syuPor5dztNyFotsFqYnKb7u1cz6pHUQV9uHU/pub?gid=0&single=true&output=csv";

let allData = [];
let currentPage = 1;
const PAGE_SIZE = 18;

/*window.CSSmover = function () {
  const favicon = document.getElementById("favicon");
  if (!favicon) return;
  favicon.setAttribute("href", "013yovfwoebfq.png?v=" + Date.now());
};*/

window.CSSmover = function () {
  const oldFavicon = document.getElementById("favicon");
  if (oldFavicon) oldFavicon.remove();

  const newFavicon = document.createElement("link");
  newFavicon.id = "favicon";
  newFavicon.rel = "icon";
  newFavicon.type = "image/png";
  newFavicon.href = "013yovfwoebfq.png?v=" + Date.now();

  document.head.appendChild(newFavicon);
};

function filterMasterlist(data, keyword, category) {
  if (!keyword) return data;
  keyword = keyword.toLowerCase();

  return data.filter((entry) => {
    if (category === "All") {
      return [
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
        .toLowerCase()
        .includes(keyword);
    } else if (category === "Traits") {
      return `${entry.Traits || ""} ${entry.Substance || ""}`
        .toLowerCase()
        .includes(keyword);
    } else {
      return (entry[category] || "").toLowerCase().includes(keyword);
    }
  });
}

function paginate(data) {
  const start = (currentPage - 1) * PAGE_SIZE;
  return data.slice(start, start + PAGE_SIZE);
}

function updatePagination(totalItems) {
  const pagination = document.getElementById("pagination");
  const totalPages = Math.max(1, Math.ceil(totalItems / PAGE_SIZE));

  pagination.innerHTML = `
    <button ${
      currentPage === 1 ? "disabled" : ""
    } onclick="changePage(-1)">Prev</button>
    <span>Page ${currentPage} of ${totalPages}</span>
    <button ${
      currentPage === totalPages ? "disabled" : ""
    } onclick="changePage(1)">Next</button>
  `;
}

window.changePage = function (delta) {
  currentPage += delta;
  window.scrollTo({ top: 0, behavior: "smooth" });
  updateDisplay();
};

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

function displayMasterlist(pageData, totalCount) {
  const container = document.getElementById("masterlist");
  const countContainer = document.getElementById("cardCount");

  container.innerHTML = "";
  countContainer.textContent = `Showing ${totalCount} total entries`;

  pageData.forEach((entry) => {
    const card = document.createElement("div");
    card.className = "card";
    container.appendChild(card);
    populateCard(card, entry);
  });
}

function parseLinkField(field) {
  if (!field) return "N/A";
  const parts = field.split("|").map((p) => p.trim());
  if (parts.length === 2) {
    return `<a href="${parts[0]}" target="_blank">${parts[1]}</a>`;
  }
  return field;
}

function parseLinkField2(field) {
  if (!field) return "N/A";
  if (field.startsWith("http")) {
    return `<a href="${field}" target="_blank">${field}</a>`;
  }
  return field;
}

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

  let html = `
    <h2>[${entry.ID}]</h2>
    <img src="${imageName}"
      decoding="async"
      alt="ML Image"
      onerror="this.onerror=null;this.src='images/placeholder.png';">
  `;

  let htmlowner = `
    <p><strong>Owner:</strong> ${parseLinkField(entry.Owner)}</p>`;

  if (
    entry.Owner === "https://toyhou.se/IggythePsycho | IggythePsycho" ||
    entry.Owner === "https://toyhou.se/Mari-22 | Mari-22" ||
    entry.Owner === "https://toyhou.se/Rudy | Rudy" ||
    entry.Owner === "https://toyhou.se/Runary | Runary" ||
    entry.Owner === "https://toyhou.se/Void_And_Stars | Void_And_Stars"
  ) {
    htmlowner = `
    <p><strong>Owner:</strong> ✩${parseLinkField(entry.Owner)}</p>
  `;
  } else if (entry.Owner === "https://toyhou.se/Queued | Queued") {
    htmlowner = `
    <p><strong>Owner:</strong> ✭${parseLinkField(entry.Owner)}</p>
  `;
  }

  let htmldesigner = `
    <p><strong>Designer:</strong> ${parseLinkField(entry.Designer)}</p>
  `;

  if (
    entry.Designer === "https://toyhou.se/IggythePsycho | IggythePsycho" ||
    entry.Designer === "https://toyhou.se/Mari-22 | Mari-22" ||
    entry.Designer === "https://toyhou.se/Rudy | Rudy" ||
    entry.Designer === "https://toyhou.se/Runary | Runary" ||
    entry.Designer === "https://toyhou.se/Void_And_Stars | Void_And_Stars"
  ) {
    htmldesigner = `
    <p><strong>Designer:</strong> ✩${parseLinkField(entry.Designer)}</p>
  `;
  } else if (entry.Designer === "https://toyhou.se/Queued | Queued") {
    htmldesigner = `
    <p><strong>Designer:</strong> ✭${parseLinkField(entry.Designer)}</p>
  `;
  }

  let htmlartist = `
    <p><strong>Artist:</strong> ${parseLinkField(entry.Artist)}</p>`;

  if (
    entry.Artist === "https://toyhou.se/IggythePsycho | IggythePsycho" ||
    entry.Artist === "https://toyhou.se/Mari-22 | Mari-22" ||
    entry.Artist === "https://toyhou.se/Rudy | Rudy" ||
    entry.Artist === "https://toyhou.se/Runary | Runary" ||
    entry.Artist === "https://toyhou.se/Void_And_Stars | Void_And_Stars"
  ) {
    htmlartist = `
    <p><strong>Artist:</strong> ✩${parseLinkField(entry.Artist)}</p>
  `;
  } else if (entry.Artist === "https://toyhou.se/Queued | Queued") {
    htmlartist = `
    <p><strong>Artist:</strong> ✭${parseLinkField(entry.Artist)}</p>
  `;
  }

  let html2 = `
    <p><strong>Obtained via:</strong> ${
      entry.Obtainment || "N/A"
    }</p> ${htmlowner} ${htmldesigner} ${htmlartist}
    <p><strong>Substance:<br></strong> ${substanceFormatted}</p>
    <p><strong>Traits:</strong><br>${traitsFormatted}</p>
  `;

  if (entry.Inspo) {
    html2 += `<p><strong>Based off of:</strong> ${parseLinkField2(
      entry.Inspo
    )}</p>`;
  }

  if (entry.Obtainment === "Hidden Raffle") {
    card.classList.add("hidden");
    html2 = `<p>This is a raffle design that has yet to be revealed! Stick around to see it eventually!</p>`;
  } else if (entry.Obtainment === "Hidden Adopt") {
    html2 = `<h2 style="text-align:center">This is an adopt that has yet to be purchased!</h2>`;
  } else if (entry.Obtainment === "Reserved") {
    html = `<h2>[${entry.ID}]</h2><img src="background.png">`;
    html2 = `<h2 style="text-align:center">Reserved</h2>`;
  } else if (entry.Obtainment === "Secret") {
    card.classList.add("secret");
    html = `
      <h2 onclick="CSSmover()" style="cursor:pointer;">[S?R?TZ-01?]</h2>
      <img src="${imageName}"
        alt="ML Image"
        onerror="this.onerror=null;this.src='images/placeholder.png';">
    `;
    html2 = `<p><i>Oh, I just love the new look here--don't you?</i></p>`;
  } else if (entry.Obtainment === "Voided") {
    html = `<h2>[${entry.ID}]</h2><img src="background.png">`;
    html2 = `The Spratz that was once here has now been voided!`;
  }

  card.innerHTML = html + html2;

  if (entry.Base) {
    const popup = document.createElement("div");
    popup.className = "popup";
    popup.innerHTML = `<p>This artwork uses a base by ${parseLinkField(
      entry.Base
    )}!</p>`;
    card.appendChild(popup);
  }

  const img = card.querySelector("img");
  if (img) {
    img.addEventListener("click", () => {
      const overlay = document.createElement("div");
      overlay.className = "fullscreen-overlay";

      const containerDiv = document.createElement("div");
      containerDiv.className = "image-container";

      containerDiv.appendChild(img.cloneNode());
      overlay.appendChild(containerDiv);

      overlay.addEventListener("click", (e) => {
        if (e.target === overlay) overlay.remove();
      });

      document.body.appendChild(overlay);
    });
  }
}

const searchInput = document.getElementById("searchInput");
const searchCategory = document.getElementById("searchCategory");

function updateDisplay() {
  const keyword = searchInput.value;
  const category = searchCategory.value;

  const filtered = filterMasterlist(allData, keyword, category);
  const pageData = paginate(filtered);

  displayMasterlist(pageData, filtered.length);
  updatePagination(filtered.length);
}

fetchCSV(csvUrl).then((data) => {
  data.sort((a, b) => {
    const numA = parseInt(a.ID.split("-")[1] || 0, 10);
    const numB = parseInt(b.ID.split("-")[1] || 0, 10);
    return numB - numA;
  });

  allData = data;

  searchInput.addEventListener("input", () => {
    currentPage = 1;
    updateDisplay();
  });

  searchCategory.addEventListener("change", () => {
    currentPage = 1;
    updateDisplay();
  });

  updateDisplay();
});
