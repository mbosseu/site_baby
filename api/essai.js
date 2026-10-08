const CLUBS = new Set([
  "Club Toulouse Minimes",
  "Club Saint-Cyprien",
  "Club États-Unis",
  "Club Ramonville",
  "Club Portet-sur-Garonne",
]);

function readKey() {
  return String(process.env.BREVO_API_KEY || "").trim().replace(/^["']|["']$/g, "");
}

function clean(value, max) {
  return String(value || "").replace(/\s+/g, " ").trim().slice(0, max);
}

function escapeHtml(value) {
  return clean(value, 2000)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function senderCandidates() {
  const list = [
    process.env.BREVO_SENDER_EMAIL,
    "suzinabot@gmail.com",
    "suzinabot@11426075.brevosend.com",
  ];
  const seen = new Set();
  return list
    .map((email) => String(email || "").trim())
    .filter((email) => email && !seen.has(email) && seen.add(email));
}

async function sendWithSender({ apiKey, sender, to, replyTo, subject, html, text }) {
  const res = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      "api-key": apiKey,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      sender: { name: process.env.BREVO_SENDER_NAME || "Boxing Center", email: sender },
      to: [{ email: to }],
      replyTo: { email: replyTo, name: "Boxing Center" },
      subject,
      htmlContent: html,
      textContent: text,
    }),
  });
  const raw = await res.text();
  let data = {};
  try {
    data = raw ? JSON.parse(raw) : {};
  } catch {
    data = { message: raw.slice(0, 180) };
  }
  if (!res.ok) {
    const error = new Error(data.message || data.error || "Brevo API HTTP " + res.status);
    error.status = res.status;
    throw error;
  }
  return data;
}

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ ok: false, error: "Méthode refusée." });
  }

  const body = req.body && typeof req.body === "object" ? req.body : {};
  const parentLast = clean(body.parentLast, 80);
  const parentFirst = clean(body.parentFirst, 80);
  const phone = clean(body.phone, 30);
  const club = clean(body.club, 80);
  const childLast = clean(body.childLast, 80);
  const childFirst = clean(body.childFirst, 80);
  const message = clean(body.message, 2000);
  const age = Number(body.age);
  const digits = phone.replace(/\D/g, "");
  const valid = parentLast.length >= 2
    && parentFirst.length >= 2
    && digits.length >= 10
    && digits.length <= 15
    && CLUBS.has(club)
    && childLast.length >= 2
    && childFirst.length >= 2
    && Number.isInteger(age)
    && age >= 3
    && age <= 16;

  if (!valid) {
    return res.status(400).json({
      ok: false,
      error: "Indiquez vos nom et prénom, un numéro de téléphone, la salle, le nom, le prénom et l'âge de l'enfant (3 à 16 ans).",
    });
  }

  const apiKey = readKey();
  if (!apiKey.startsWith("xkeysib-")) {
    return res.status(500).json({ ok: false, error: "L'envoi des demandes n'est pas configuré." });
  }

  const to = process.env.TRIAL_TO || process.env.RECEPTION_EMAIL || "boxingcenter31@gmail.com";
  const replyTo = process.env.BREVO_REPLY_TO || "boxingcenter31@gmail.com";
  const senders = senderCandidates();
  const subject = "Séance d'essai – " + club;
  const text = [
    "Nouvelle demande de séance d'essai enfant (gratuite).",
    "",
    "Parent : " + parentFirst + " " + parentLast,
    "Téléphone : " + phone,
    "Salle : " + club,
    "Enfant : " + childFirst + " " + childLast,
    "Âge : " + age + " ans",
    "",
    "Message :",
    message || "(aucun message)",
  ].join("\n");
  const html = [
    "<p>Nouvelle demande de séance d'essai enfant (gratuite).</p>",
    "<p><strong>Parent :</strong> " + escapeHtml(parentFirst + " " + parentLast) + "<br>",
    "<strong>Téléphone :</strong> " + escapeHtml(phone) + "<br>",
    "<strong>Salle :</strong> " + escapeHtml(club) + "<br>",
    "<strong>Enfant :</strong> " + escapeHtml(childFirst + " " + childLast) + "<br>",
    "<strong>Âge :</strong> " + age + " ans</p>",
    "<p><strong>Message :</strong><br>" + escapeHtml(message || "(aucun message)").replace(/\n/g, "<br>") + "</p>",
  ].join("");

  let sent = false;
  for (const sender of senders) {
    try {
      await sendWithSender({ apiKey, sender, to, replyTo, subject, html, text });
      sent = true;
      break;
    } catch (error) {
      const msg = String(error.message || "");
      console.error("brevo", error.status || 0, msg.slice(0, 240));
      const senderRejected = error.status === 400 && /sender|expéditeur|from|not valid/i.test(msg);
      if (!senderRejected) break;
    }
  }

  if (!sent) {
    return res.status(502).json({
      ok: false,
      error: "L'envoi n'a pas abouti. Réessayez dans un instant.",
    });
  }

  return res.status(200).json({ ok: true });
};
