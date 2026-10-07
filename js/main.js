(function () {
  const header = document.querySelector(".header");
  const nav = document.querySelector(".nav");
  const burger = document.querySelector(".burger");
  const links = [...document.querySelectorAll(".nav a")];

  if (burger && nav) {
    burger.addEventListener("click", () => {
      const open = nav.classList.toggle("is-open");
      burger.setAttribute("aria-expanded", String(open));
      burger.setAttribute("aria-label", open ? "Fermer le menu" : "Ouvrir le menu");
    });

    nav.addEventListener("click", (event) => {
      if (event.target.closest("a")) {
        nav.classList.remove("is-open");
        burger.setAttribute("aria-expanded", "false");
      }
    });
  }

  if (header) {
    const onScroll = () => header.classList.toggle("is-stuck", window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  const page = (location.pathname.split("/").pop() || "index.html").toLowerCase();
  links.forEach((link) => {
    const href = (link.getAttribute("href") || "").split("#")[0].split("?")[0].toLowerCase();
    link.classList.toggle("is-active", href === page || (page === "" && href === "index.html"));
  });

  document.querySelectorAll(".faq-item button").forEach((button) => {
    button.addEventListener("click", () => {
      const item = button.closest(".faq-item");
      const open = item.classList.contains("is-open");
      document.querySelectorAll(".faq-item").forEach((other) => {
        other.classList.remove("is-open");
        const otherButton = other.querySelector("button");
        otherButton.setAttribute("aria-expanded", "false");
        const mark = otherButton.querySelector(".pm");
        if (mark) mark.textContent = "+";
      });
      if (!open) {
        item.classList.add("is-open");
        button.setAttribute("aria-expanded", "true");
        const mark = button.querySelector(".pm");
        if (mark) mark.textContent = "−";
      }
    });
  });

  const clubs = {
    minimes: {
      name: "Toulouse Minimes",
      address: "12 rue de Fenouillet, 31200 Toulouse",
      photo: "assets/img/club-1.jpg",
      alt: "Salle de boxe du club Toulouse Minimes"
    },
    "saint-cyprien": {
      name: "Toulouse Saint-Cyprien",
      address: "11 rue Sainte-Lucie, 31300 Toulouse",
      photo: "assets/img/salle-cyprien.jpg",
      alt: "Ring et sacs du club Toulouse Saint-Cyprien"
    },
    "etats-unis": {
      name: "Toulouse États-Unis",
      address: "388 avenue des États-Unis, 31200 Toulouse",
      photo: "assets/img/club-3.jpg",
      alt: "Salle de boxe du club Toulouse États-Unis"
    },
    ramonville: {
      name: "Ramonville",
      address: "33 rue des Ormes, 31520 Ramonville-Saint-Agne",
      photo: "assets/img/club-4.jpg",
      alt: "Ring et cage du club de Ramonville"
    },
    portet: {
      name: "Portet-sur-Garonne",
      address: "61 route d'Espagne, 31120 Portet-sur-Garonne",
      photo: "assets/img/salle-portet.jpg",
      alt: "Salle de boxe du club de Portet-sur-Garonne"
    }
  };

  const seasonNote = "Saison 2026–2027, d'après le planning publié sur boxingcenter.fr. Cours de septembre à juin, maintenus pendant les vacances scolaires.";
  const weekDays = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];
  const plans = {
    minimes: {
      note: seasonNote,
      slots: [
        { day: "Mercredi", time: "15h – 16h", age: "7 – 11 ans", course: "Boxe éducative" },
        { day: "Mercredi", time: "16h – 17h", age: "12 – 16 ans", course: "Boxe éducative" },
        { day: "Mercredi", time: "17h – 18h30", age: "Compétiteurs", course: "Éducative compétiteurs" },
        { day: "Samedi", time: "14h15 – 15h", age: "3 – 6 ans", course: "Baby Boxe" },
        { day: "Samedi", time: "15h – 16h", age: "7 – 11 ans", course: "Boxe éducative" },
        { day: "Samedi", time: "16h – 17h", age: "12 – 16 ans", course: "Boxe éducative" },
        { day: "Samedi", time: "17h – 18h30", age: "Compétiteurs", course: "Éducative compétiteurs" }
      ]
    },
    "saint-cyprien": {
      note: seasonNote,
      slots: [
        { day: "Mercredi", time: "15h – 16h", age: "7 – 11 ans", course: "Boxe éducative" },
        { day: "Mercredi", time: "16h – 17h", age: "12 – 16 ans", course: "Boxe éducative" },
        { day: "Mercredi", time: "17h – 18h15", age: "Compétiteurs", course: "Éducative compétiteurs" },
        { day: "Samedi", time: "14h15 – 15h", age: "3 – 6 ans", course: "Baby Boxe" },
        { day: "Samedi", time: "15h – 16h", age: "7 – 11 ans", course: "Boxe éducative" },
        { day: "Samedi", time: "16h – 17h", age: "12 – 16 ans", course: "Boxe éducative" },
        { day: "Samedi", time: "17h – 18h15", age: "Compétiteurs", course: "Éducative compétiteurs" }
      ]
    },
    "etats-unis": {
      note: seasonNote,
      slots: [
        { day: "Mercredi", time: "15h – 16h", age: "7 – 11 ans", course: "Pieds-poings · salle boxe" },
        { day: "Mercredi", time: "16h – 17h", age: "12 – 16 ans", course: "Pieds-poings · salle boxe" },
        { day: "Mercredi", time: "18h – 19h", age: "10 – 16 ans", course: "MMA enfants · salle MMA" },
        { day: "Samedi", time: "14h15 – 15h", age: "3 – 6 ans", course: "Pieds-poings · salle boxe" },
        { day: "Samedi", time: "15h – 16h", age: "7 – 11 ans", course: "Pieds-poings · salle boxe" },
        { day: "Samedi", time: "16h – 17h", age: "12 – 16 ans", course: "Pieds-poings · salle boxe" },
        { day: "Samedi", time: "18h – 19h", age: "10 – 16 ans", course: "MMA enfants · salle MMA" }
      ]
    },
    ramonville: {
      note: seasonNote,
      slots: [
        { day: "Mercredi", time: "15h – 16h", age: "7 – 11 ans", course: "Boxe éducative" },
        { day: "Mercredi", time: "16h – 17h", age: "12 – 16 ans", course: "Boxe éducative" },
        { day: "Samedi", time: "14h15 – 15h", age: "3 – 6 ans", course: "Baby Boxe" },
        { day: "Samedi", time: "15h – 16h", age: "7 – 11 ans", course: "Boxe éducative" },
        { day: "Samedi", time: "16h – 17h", age: "12 – 16 ans", course: "Boxe éducative" }
      ]
    },
    portet: {
      note: seasonNote + " Planning provisoire à Portet : nouveau planning annoncé le 9 novembre.",
      slots: [
        { day: "Mercredi", time: "14h – 15h", age: "Enfants", course: "Kick" },
        { day: "Mercredi", time: "15h – 16h", age: "Ados", course: "Kick" },
        { day: "Mercredi", time: "16h – 17h", age: "7 – 11 ans", course: "Boxe éducative" },
        { day: "Mercredi", time: "17h – 18h", age: "12 – 16 ans", course: "Boxe éducative" },
        { day: "Samedi", time: "10h – 11h", age: "Enfants", course: "Kick" },
        { day: "Samedi", time: "11h – 12h", age: "Ados", course: "Kick" },
        { day: "Samedi", time: "15h – 16h", age: "4 – 6 ans", course: "Baby Boxe" },
        { day: "Samedi", time: "16h – 17h", age: "7 – 11 ans", course: "Boxe éducative" },
        { day: "Samedi", time: "17h – 18h", age: "12 – 16 ans", course: "Boxe éducative" }
      ]
    }
  };

  const hoursPhoto = document.querySelector("#hours-photo");
  const hoursName = document.querySelector("#hours-name");
  const hoursAddress = document.querySelector("#hours-address");
  const hoursBook = document.querySelector("#hours-book");
  const hoursBody = document.querySelector("#hours-body");
  const hoursNote = document.querySelector("#hours-note");
  const slotSelect = document.querySelector("#slot");
  const hourTabs = [...document.querySelectorAll("[data-hours]")];

  function renderHours(id) {
    const plan = plans[id];
    if (!plan || !hoursBody) return;
    hoursBody.replaceChildren();
    weekDays.forEach((day) => {
      const slots = plan.slots.filter((slot) => slot.day === day);
      if (!slots.length) {
        const tr = document.createElement("tr");
        const dayCell = document.createElement("td");
        dayCell.textContent = day;
        const emptyTime = document.createElement("td");
        emptyTime.textContent = "—";
        const emptyAge = document.createElement("td");
        emptyAge.textContent = "—";
        const offCell = document.createElement("td");
        const off = document.createElement("span");
        off.className = "off";
        off.textContent = "Pas de cours";
        offCell.appendChild(off);
        tr.append(dayCell, emptyTime, emptyAge, offCell);
        hoursBody.appendChild(tr);
        return;
      }
      slots.forEach((slot) => {
        const tr = document.createElement("tr");
        tr.className = "is-on";
        [slot.day, slot.time, slot.age, slot.course].forEach((text) => {
          const td = document.createElement("td");
          td.textContent = text;
          tr.appendChild(td);
        });
        hoursBody.appendChild(tr);
      });
    });
    if (hoursNote) hoursNote.textContent = plan.note;
  }

  function fillSlots(id) {
    const plan = plans[id];
    if (!slotSelect || !plan) return;
    const current = slotSelect.value;
    slotSelect.replaceChildren();
    const placeholder = document.createElement("option");
    placeholder.value = "";
    placeholder.textContent = "Choisir un créneau";
    slotSelect.appendChild(placeholder);
    plan.slots.forEach((slot) => {
      const option = document.createElement("option");
      option.value = slot.day + " · " + slot.time + " · " + slot.course + " (" + slot.age + ")";
      option.textContent = option.value;
      slotSelect.appendChild(option);
    });
    if ([...slotSelect.options].some((option) => option.value === current)) {
      slotSelect.value = current;
    }
  }

  function selectClub(id) {
    const club = clubs[id];
    if (!club) return;
    if (hoursPhoto) {
      hoursPhoto.src = club.photo;
      hoursPhoto.alt = club.alt;
    }
    if (hoursName) hoursName.textContent = club.name;
    if (hoursAddress) hoursAddress.textContent = club.address;
    if (hoursBook) {
      hoursBook.dataset.club = id;
      hoursBook.href = "essai.html?club=" + id;
    }
    hourTabs.forEach((tab) => {
      const on = tab.dataset.hours === id;
      tab.classList.toggle("is-on", on);
      tab.setAttribute("aria-selected", String(on));
    });
    const radio = document.querySelector(`input[name="club"][value="${id}"]`);
    if (radio) radio.checked = true;
    renderHours(id);
    fillSlots(id);
  }

  document.querySelectorAll('input[name="club"]').forEach((radio) => {
    radio.addEventListener("change", () => {
      if (radio.checked) selectClub(radio.value);
    });
  });

  hourTabs.forEach((tab) => {
    tab.addEventListener("click", () => selectClub(tab.dataset.hours));
  });

  const params = new URLSearchParams(location.search);
  const clubParam = params.get("club");
  const ageParam = params.get("age");
  if (clubParam && clubs[clubParam]) selectClub(clubParam);
  else if (hourTabs.length) selectClub("minimes");
  if (ageParam) {
    const ageRadio = document.querySelector(`input[name="age"][value="${ageParam}"]`);
    if (ageRadio) ageRadio.checked = true;
  }

  const track = document.querySelector("#review-track");
  const prev = document.querySelector("#rev-prev");
  const next = document.querySelector("#rev-next");
  if (track && prev && next) {
    const scrollReviews = (dir) => {
      const card = track.querySelector(".review");
      if (!card) return;
      track.scrollBy({ left: dir * (card.offsetWidth + 12), behavior: "smooth" });
    };
    prev.addEventListener("click", () => scrollReviews(-1));
    next.addEventListener("click", () => scrollReviews(1));
  }

  const form = document.querySelector("#trial-form");
  const error = document.querySelector("#form-error");
  const ok = document.querySelector("#form-ok");
  if (form && error && ok) {
    const labels = {
      minimes: "Toulouse Minimes",
      "saint-cyprien": "Toulouse Saint-Cyprien",
      "etats-unis": "Toulouse États-Unis",
      ramonville: "Ramonville",
      portet: "Portet-sur-Garonne"
    };
    const ages = {
      "3-6": "3 – 6 ans (Baby Boxe)",
      "7-11": "7 – 11 ans (Boxe éducative)",
      "12-16": "12 – 16 ans (Ados)"
    };

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const data = new FormData(form);
      const age = data.get("age");
      const club = data.get("club");
      const slot = String(data.get("slot") || "");
      const parent = String(data.get("parent") || "").trim();
      const phone = String(data.get("phone") || "").trim();
      const email = String(data.get("email") || "").trim();
      const phoneOk = /^(?:\+33|0)[1-9](?:[\s.-]?\d{2}){4}$/.test(phone);
      const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

      if (!age || !club || !slot || parent.length < 2 || !phoneOk || !emailOk || !labels[club] || !ages[age]) {
        error.textContent = "Indiquez l'âge, le club, le créneau, votre nom, un téléphone français et un e-mail valides.";
        return;
      }
      error.textContent = "";
      const summary = [
        "Bonjour,",
        "",
        "Je souhaite réserver une séance d'essai de boxe éducative.",
        "Parent : " + parent,
        "Téléphone : " + phone,
        "E-mail : " + email,
        "Âge : " + ages[age],
        "Club : " + labels[club],
        "Créneau : " + slot
      ].join("\n");

      ok.innerHTML =
        "<h3>Demande prête à envoyer</h3><p>Votre messagerie va s'ouvrir avec le récapitulatif. L'équipe du club confirme le créneau sous 24h. Vous pouvez aussi appeler le <a href='tel:+33561506866'>05 61 50 68 66</a>.</p>";
      ok.classList.add("is-on");
      form.classList.add("is-done");
      window.location.href =
        "mailto:contact@boxingcenter.fr?subject=" +
        encodeURIComponent("Séance d'essai – " + labels[club]) +
        "&body=" +
        encodeURIComponent(summary);
    });
  }

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const clubSign = document.querySelector("#club-sign");
  if (clubSign) {
    const hangSign = () => {
      if (reduceMotion) {
        clubSign.classList.add("is-still");
        return;
      }
      clubSign.classList.add("is-hung");
      clubSign.addEventListener("animationend", () => clubSign.classList.add("is-wind"), { once: true });
    };
    const onSignScroll = () => {
      if (window.scrollY < 80) return;
      hangSign();
      window.removeEventListener("scroll", onSignScroll);
    };
    if (window.scrollY >= 80) hangSign();
    else window.addEventListener("scroll", onSignScroll, { passive: true });
  }
  if (!reduceMotion && "IntersectionObserver" in window) {
    const motion = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-in");
        motion.unobserve(entry.target);
      });
    }, { threshold: 0.16, rootMargin: "0px 0px -6% 0px" });

    document.querySelectorAll(".b-cards, .age-cards, .routes-grid, .perk-bar, .stats, .club-board, .room-track, .storyline, .figure-row, .stage").forEach((group) => {
      [...group.children].forEach((child, index) => {
        if (child.classList.contains("side-card") || child.classList.contains("map-card")) return;
        child.classList.add("reveal");
        child.style.transitionDelay = Math.min(index, 4) * 70 + "ms";
        motion.observe(child);
      });
    });

    const slot = document.querySelector(".sticker-slot");
    const quote = slot && slot.querySelector(".quote-bar");
    if (slot && quote) {
      quote.classList.add("sticker");
      const stick = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          quote.classList.add("is-stuck");
          stick.unobserve(slot);
        });
      }, { threshold: 0.45 });
      stick.observe(slot);
    }
  }

  const drifts = [...document.querySelectorAll(".drift-photo")];
  if (!reduceMotion && drifts.length && window.innerWidth > 900) {
    const drift = () => {
      const mid = window.innerHeight * 0.5;
      drifts.forEach((img) => {
        const rect = img.getBoundingClientRect();
        const delta = (rect.top + rect.height / 2 - mid) / window.innerHeight;
        img.style.transform = "translate3d(0," + (delta * -22).toFixed(1) + "px,0) scale(1.05)";
      });
    };
    window.addEventListener("scroll", drift, { passive: true });
    drift();
  }

  document.querySelectorAll("[data-count]").forEach((node) => {
    const target = Number(node.dataset.count);
    const decimals = Number(node.dataset.decimals || 0);
    const prefix = node.dataset.prefix || "";
    const suffix = node.dataset.suffix || "";
    const format = (value) => {
      const shown = decimals ? value.toFixed(decimals).replace(".", ",") : String(Math.round(value));
      return prefix + shown + suffix;
    };
    if (reduceMotion || !Number.isFinite(target)) {
      node.textContent = format(target);
      return;
    }
    const counter = new IntersectionObserver((entries) => {
      if (!entries.some((entry) => entry.isIntersecting)) return;
      counter.disconnect();
      const start = performance.now();
      const tick = (now) => {
        const progress = Math.min(1, (now - start) / 1100);
        const eased = 1 - Math.pow(1 - progress, 3);
        node.textContent = format(target * eased);
        if (progress < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }, { threshold: 0.7 });
    counter.observe(node);
  });

  const mapNode = document.querySelector("#club-map");
  if (mapNode && window.L) {
    const spots = [
      { id: "minimes", n: "01", name: "Toulouse Minimes", address: "12 rue de Fenouillet, 31200 Toulouse", lat: 43.626498, lng: 1.430597 },
      { id: "saint-cyprien", n: "02", name: "Saint-Cyprien", address: "11 rue Sainte-Lucie, 31300 Toulouse", lat: 43.592848, lng: 1.433022 },
      { id: "etats-unis", n: "03", name: "États-Unis", address: "388 avenue des États-Unis, 31200 Toulouse", lat: 43.663567, lng: 1.414873 },
      { id: "ramonville", n: "04", name: "Ramonville", address: "33 rue des Ormes, 31520 Ramonville-Saint-Agne", lat: 43.536593, lng: 1.484020 },
      { id: "portet", n: "05", name: "Portet-sur-Garonne", address: "61 route d'Espagne, 31120 Portet-sur-Garonne", lat: 43.516548, lng: 1.379725 }
    ];
    const map = L.map(mapNode, {
      scrollWheelZoom: false,
      zoomControl: true
    });
    L.tileLayer("https://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap France",
      maxZoom: 20
    }).addTo(map);

    const markers = {};
    const focus = (id, open) => {
      const spot = spots.find((item) => item.id === id);
      const marker = markers[id];
      if (!spot || !marker) return;
      document.querySelectorAll(".finder-list button").forEach((button) => {
        button.setAttribute("aria-pressed", String(button.dataset.spot === id));
      });
      document.querySelectorAll(".map-pin").forEach((pin) => pin.classList.remove("is-on"));
      const pin = marker.getElement();
      if (pin) pin.classList.add("is-on");
      if (reduceMotion) map.setView([spot.lat, spot.lng], 13);
      else map.flyTo([spot.lat, spot.lng], 13, { duration: 0.7 });
      if (open) marker.openPopup();
    };

    spots.forEach((spot) => {
      const icon = L.divIcon({
        className: "map-pin",
        html: "<i>" + spot.n + "</i>",
        iconSize: [28, 28],
        iconAnchor: [14, 14],
        popupAnchor: [0, -16]
      });
      const destination = encodeURIComponent(spot.address);
      const marker = L.marker([spot.lat, spot.lng], { icon: icon, title: spot.name }).addTo(map);
      marker.bindPopup(
        "<strong>" + spot.name + "</strong><p>" + spot.address + "</p>" +
        "<a href=\"horaires.html?club=" + spot.id + "\">Voir les horaires</a><br>" +
        "<a href=\"https://www.google.com/maps/dir/?api=1&destination=" + destination + "\" target=\"_blank\" rel=\"noopener\">Ouvrir l'itinéraire</a>"
      );
      marker.on("click", () => focus(spot.id, true));
      markers[spot.id] = marker;
    });

    map.fitBounds(L.latLngBounds(spots.map((spot) => [spot.lat, spot.lng])), { padding: [36, 36] });
    document.querySelectorAll(".finder-list button").forEach((button) => {
      button.addEventListener("click", () => focus(button.dataset.spot, true));
    });
  }
})();
