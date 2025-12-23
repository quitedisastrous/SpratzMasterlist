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

let toggle = "none";

window.CSSmover3 = function () {
  const footer = document.querySelector("footer"); // main footer
  const bottomFooter = document.getElementById("bottomFooter"); // bottom footer

  const secretMessage3 = `
    <i>A dreadful thing it has said to me, its wishes won't come true.<br>
    But since you've played your part, I suppose I'll give this to you.<br><br>This is between us. Reveal it to none.<br>013yovfwoebfq</i>
  `;

  if (toggle === "111") {
    if (footer) footer.innerHTML = secretMessage3;
    if (bottomFooter) bottomFooter.innerHTML = secretMessage3;
    toggle = "none";
  }
};

window.CSSmover2 = function () {
  const footer = document.querySelector("footer"); // main footer
  const bottomFooter = document.getElementById("bottomFooter"); // bottom footer

  const secretMessage2 = `
    <b>I don't know why it sent you, but no longer will I play.<br>
    Tell it that I decline. I hope it stays away.</b>
  `;

  if (toggle === "secret") {
    if (footer) footer.innerHTML = secretMessage2;
    if (bottomFooter) bottomFooter.innerHTML = secretMessage2;
    toggle = "111";
  }
};

window.CSSmover = function () {
  const oldFavicon = document.getElementById("favicon");
  if (oldFavicon) oldFavicon.remove();

  const newFavicon = document.createElement("link");
  newFavicon.id = "favicon";
  newFavicon.rel = "icon";
  newFavicon.type = "image/png";
  newFavicon.href = "013yovfwoebfq.png?v=" + Date.now();

  document.head.appendChild(newFavicon);

  const footer = document.querySelector("footer"); // main footer
  const bottomFooter = document.getElementById("bottomFooter"); // bottom footer

  const secretMessage = `
    <i>Perhaps you could not get to it, but worry not, it's fine.<br>
    Instead do me a favor, and find the one touched by the Divine.</i>
  `;

  if (toggle === "none") {
    if (footer) footer.innerHTML = secretMessage;
    if (bottomFooter) bottomFooter.innerHTML = secretMessage;
    toggle = "secret";
  }
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
      <h2 onclick="CSSmover()">[S?R?TZ-01?]</h2>
      <div class="secret-wrapper">
      <img src="${imageName}"
        alt="ML Image"
        id="secret-image"
        onerror="this.onerror=null;this.src='images/placeholder.png';">
        </div>
    `;
    html2 = `<p><i>Oh, I just love the new look here--do you <span id="sec">no</span>t?</i></p>`;
    card.innerHTML = html + html2;

    const span3 = card.querySelector("#sec");
    span3.addEventListener("click", () => {
      console.log("click, toggle =", toggle);
      CSSmover3();
    });
  } else if (entry.Obtainment === "Voided") {
    html = `<h2>[${entry.ID}]</h2><img src="background.png">`;
    html2 = `The Spratz that was once here has now been voided!`;
  }

  if (entry.ID === "SPRATZ-111") {
    html = `
      <h2 onclick="CSSmover2()">[SPRATZ-111]</h2>
      <div class="secret-wrapper">
      <img src="${imageName}"
        alt="ML Image"
        onerror="this.onerror=null;this.src='images/placeholder.png';">
        </div>
    `;
  }

  if (!(entry.Obtainment === "Secret")) {
    card.innerHTML = html + html2;
  }

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
