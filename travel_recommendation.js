"use strict";

const searchForm = document.getElementById("search-form");

if (searchForm) {
  const input = document.getElementById("search-input");
  const clearButton = document.getElementById("clear-button");
  const section = document.getElementById("recommendations");
  const heading = document.getElementById("results-heading");
  const status = document.getElementById("search-status");
  const grid = document.getElementById("results-grid");
  const categories = {
    beach: "beaches", beaches: "beaches",
    temple: "temples", temples: "temples",
    country: "countries", countries: "countries"
  };
  let requestVersion = 0;

  searchForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const version = ++requestVersion;
    const keyword = input.value.trim().toLowerCase();
    const category = Object.hasOwn(categories, keyword) ? categories[keyword] : null;
    grid.replaceChildren();
    section.hidden = false;
    document.body.classList.add("has-results");
    heading.textContent = "Recommendations";

    if (!category) {
      status.textContent = keyword
        ? "No matching category. Try beach, temple, or country."
        : "Enter beach, temple, or country to explore.";
      return;
    }

    status.textContent = "Loading destinations…";
    try {
      const response = await fetch("./travel_recommendation_api.json");
      if (!response.ok) throw new Error("Destination data unavailable");
      const data = await response.json();
      if (!Array.isArray(data[category]) || data[category].length < 2) {
        throw new Error("Destination data incomplete");
      }
      if (version !== requestVersion) return;

      const cards = document.createDocumentFragment();
      data[category].slice(0, 2).forEach((place) => {
        const card = document.createElement("article");
        card.className = "result-card";
        const image = document.createElement("img");
        image.src = place.imageUrl;
        image.alt = place.name;
        image.width = 640;
        image.height = 360;
        const content = document.createElement("div");
        content.className = "result-card-content";
        const title = document.createElement("h3");
        title.textContent = place.name;
        const description = document.createElement("p");
        description.textContent = place.description;
        content.append(title, description);
        card.append(image, content);
        cards.append(card);
      });
      grid.replaceChildren(cards);
      heading.textContent = category.charAt(0).toUpperCase() + category.slice(1);
      status.textContent = "2 places to explore";
    } catch (error) {
      if (version !== requestVersion) return;
      status.textContent = "Recommendations could not load. Please try again.";
    }
  });

  clearButton.addEventListener("click", () => {
    requestVersion++;
    input.value = "";
    grid.replaceChildren();
    status.textContent = "";
    heading.textContent = "Recommendations";
    section.hidden = true;
    document.body.classList.remove("has-results");
    input.focus();
  });
}

const contactForm = document.getElementById("contact-form");

if (contactForm) {
  const nameInput = document.getElementById("contact-name");
  const emailInput = document.getElementById("contact-email");
  const messageInput = document.getElementById("contact-message");
  const status = document.getElementById("contact-status");

  [nameInput, emailInput, messageInput].forEach((field) => {
    field.addEventListener("input", () => {
      field.setCustomValidity("");
      status.textContent = "";
    });
  });

  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();
    [nameInput, emailInput, messageInput].forEach((field) => {
      field.setCustomValidity(field.value.trim() ? "" : "Please complete this field.");
    });
    if (!contactForm.reportValidity()) return;

    const subject = "TravelBloom travel inquiry";
    const body = `Name: ${nameInput.value.trim()}\nEmail: ${emailInput.value.trim()}\n\n${messageInput.value.trim()}`;
    status.textContent = "Opening an email draft. This demo website has not sent or stored your message.";
    window.location.href = `mailto:hello@travelbloom.example?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  });
}
