const csvUrl =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vRy8ReQN9RP6SCgDu32sMFXNDWwrawe0d-tFUFE6K3syuPor5dztNyFotsFqYnKb7u1cz6pHUQV9uHU/pub?output=csv";

var toggle;

// Convert "URL | Text" into HTML link
function parseLinkField(field) {
  if (!field) return "N/A";
  const parts = field.split("|").map((p) => p.trim());
  if (parts.length === 2) {
    return `<a href="${parts[0]}" target="_blank">${parts[1]}</a>`;
  }
  return field; // plain text if no pipe
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

// Display the masterlist on the page
function displayMasterlist(data) {
  const container = document.getElementById("masterlist");
  container.innerHTML = "";

  data.forEach((entry) => {
    const card = document.createElement("div");
    card.className = "card";

    // Format traits with newlines
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

    // Image filename matches everything after the dash in the ID
    const idParts = entry.ID ? entry.ID.split("-") : [];
    const imageName =
      idParts.length > 1
        ? `images/${idParts[1]}.png`
        : "images/placeholder.png";

    let html = `
      <h2>[${entry.ID}]</h2>
      <img src="${imageName}"
     alt="ML Image"
     onerror="this.onerror=null;this.src='images/placeholder.png';">`;

    let html2 = `<p><strong>Obtained via:</strong> ${
      entry.Obtainment || "N/A"
    }</p>
      <p><strong>Owner:</strong> ${parseLinkField(entry.Owner)}</p>
      <p><strong>Designer:</strong> ${parseLinkField(entry.Designer)}</p>
      <p><strong>Artist:</strong> ${parseLinkField(entry.Artist)}</p>
      <p><strong>Substance:<br></strong> ${substanceFormatted}</p>
      <p><strong>Traits:</strong><br>${traitsFormatted}</p>
    `;

    if (entry.Inspo && entry.Inspo !== "") {
      html2 += `<p><strong>Character Inspiration:</strong> ${entry.Inspo}</p>`;
    }

    if (entry.Obtainment === "Hidden") {
      card.classList.add("hidden");
      html2 = `<p>This is a raffle design that has yet to be revealed! Stick around to see it eventually!</p>`;
    } else if (entry.Obtainment === "Reserved") {
      html = `<h2>[${entry.ID}]</h2>
      <img src="background.png"></img>`;
      html2 = `<h2 style = "text-align: center">Reserved</h2>`;
    } else if (entry.Obtainment === "Secret") {
      card.classList.add("secret");
      html = `
      <h2>[S?R?TZ-01?]</h2>
      <img src="${imageName}"
     alt="ML Image"
     onerror="this.onerror=null;this.src='images/placeholder.png';">`;
      html2 = `<p><i>Oh, I just love the new look here--don't you?</i></p>`;
    } else if (entry.Obtainment === "Voided") {
      html = `<h2>[${entry.ID}]</h2>
      <img src="background.png"></img>`;
      html2 = `The Spratz that was once here has now been voided!`;
    }

    var newhtml = html + html2;
    card.innerHTML = newhtml;
    container.appendChild(card);
  });
}

// Load masterlist on page load
fetchCSV(csvUrl).then((data) => displayMasterlist(data));
