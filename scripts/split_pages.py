# -*- coding: utf-8 -*-
"""Build the transparent logo and split the one-page site into pages."""
import re
from pathlib import Path

import numpy as np
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / "index.html"


def make_logo():
    im = Image.open(r"C:\Users\PC\Pictures\Screenshots\Screenshot 2026-10-07 025234.png").convert("RGBA")
    rgb = np.array(im)
    r = rgb[:, :, 0].astype(np.int16)
    g = rgb[:, :, 1].astype(np.int16)
    b = rgb[:, :, 2].astype(np.int16)
    mx = np.maximum(np.maximum(r, g), b)
    mn = np.minimum(np.minimum(r, g), b)
    chroma = mx - mn
    lum = (r + g + b) / 3
    navy = (b > r + 8) & (b > 18)
    background = (mx < 22) & (chroma < 12) & ~navy
    alpha = np.full(lum.shape, 255, dtype=np.float32)
    alpha[background] = 0
    fringe = (~navy) & (~background) & (chroma < 22) & (lum < 90)
    alpha[fringe] = np.clip((lum[fringe] - 10) * (255 / 55), 0, 255)
    rgb[:, :, 3] = alpha.astype(np.uint8)
    out = Image.fromarray(rgb, "RGBA")
    ys, xs = np.where(alpha > 16)
    pad = 2
    out = out.crop((
        max(0, xs.min() - pad),
        max(0, ys.min() - pad),
        min(out.width, xs.max() + pad + 1),
        min(out.height, ys.max() + pad + 1),
    ))
    dest = ROOT / "assets" / "logo.png"
    out.save(dest)
    # Square favicon on black, matching the original plate.
    side = max(out.size) + 16
    icon = Image.new("RGBA", (side, side), (11, 11, 14, 255))
    icon.paste(out, ((side - out.width) // 2, (side - out.height) // 2), out)
    icon.resize((64, 64), Image.Resampling.LANCZOS).save(ROOT / "assets" / "favicon.png")
    print("logo", out.size)


def rewrite(text):
    pairs = [
        ("#boxe-educative", "boxe-educative.html"),
        ("#pour-tous", "boxe-educative.html#pour-tous"),
        ("#competences", "boxe-educative.html#competences"),
        ("#securite", "boxe-educative.html#securite"),
        ("#coachs", "boxe-educative.html#coachs"),
        ("#equipe", "boxe-educative.html#equipe"),
        ("#cours", "boxe-educative.html#cours"),
        ("#horaires", "horaires.html"),
        ("#clubs", "clubs.html"),
        ("#essai", "essai.html"),
        ("#contact", "contact.html"),
        ("#faq", "faq.html"),
        ("#accueil", "index.html"),
        ("#ages", "index.html#ages"),
        ("#benefices", "index.html#benefices"),
        ("#avis", "avis.html"),
        ("#progres", "avis.html#progres"),
        ("#mentions", "contact.html#mentions"),
    ]
    for old, new in pairs:
        text = text.replace(f'href="{old}"', f'href="{new}"')
    text = re.sub(
        r'href="(horaires|essai)\.html" data-club="([^"]+)"',
        r'href="\1.html?club=\2" data-club="\2"',
        text,
    )
    text = re.sub(
        r'href="essai\.html" data-age="([^"]+)"',
        r'href="essai.html?age=\1" data-age="\1"',
        text,
    )
    text = text.replace(
        '<span class="wordmark">BOXING<i></i>CENTER</span>',
        '<img class="brand-logo" src="assets/logo.png" alt="Boxing Center">',
    )
    text = text.replace(
        '<p class="bc-logo"><span>BOXING</span><i></i><span>CENTER</span></p>',
        '<a class="footer-logo" href="index.html"><img src="assets/logo.png" alt="Boxing Center"></a>',
    )
    text = text.replace(
        """<div class="socials">
          <a href="contact.html" aria-label="Instagram">IG</a>
          <a href="contact.html" aria-label="Facebook">Fb</a>
          <a href="contact.html" aria-label="YouTube">Yt</a>
          <a href="contact.html" aria-label="TikTok">Tk</a>
        </div>""",
        """<div class="socials">
          <a href="contact.html" aria-label="Instagram"><svg class="icon" viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="4"/><circle cx="12" cy="12" r="3.5"/><circle cx="17.2" cy="6.8" r="0.8" fill="currentColor" stroke="none"/></svg></a>
          <a href="contact.html" aria-label="Facebook"><svg class="icon" viewBox="0 0 24 24"><path d="M14 9h3V6h-3c-2.2 0-4 1.8-4 4v2H8v3h2v7h3v-7h2.6l.4-3H13v-2c0-.6.4-1 1-1z"/></svg></a>
          <a href="contact.html" aria-label="YouTube"><svg class="icon" viewBox="0 0 24 24"><rect x="3" y="7" width="18" height="11" rx="3"/><path d="m11 10 5 2.5-5 2.5z" fill="currentColor" stroke="none"/></svg></a>
          <a href="contact.html" aria-label="TikTok"><svg class="icon" viewBox="0 0 24 24"><path d="M14 6c.6 2.2 2 3.6 4 4v3c-1.5 0-2.9-.5-4-1.4V16a5 5 0 1 1-5-5c.3 0 .7 0 1 .1V14a2.2 2.2 0 1 0 1.5 2.1V6h2.5z"/></svg></a>
        </div>""",
    )
    text = re.sub(r'\s*id="mentions"', "", text, count=1)
    return text


HEADER = """<header class="header">
    <div class="wrap">
      <a class="logo" href="index.html" aria-label="Boxing Center, accueil">
        <img src="assets/logo.png" alt="Boxing Center">
      </a>
      <nav class="nav" id="nav" aria-label="Navigation principale">
        <a href="index.html">Accueil</a>
        <a href="boxe-educative.html">Boxe Éducative</a>
        <a href="clubs.html">Clubs</a>
        <a href="horaires.html">Horaires</a>
        <a href="essai.html">Essai</a>
        <a href="contact.html">Contact</a>
      </nav>
      <a class="btn" href="essai.html"><svg class="icon"><use href="#i-cal"/></svg> Réserver une séance d'essai <svg class="icon"><use href="#i-arrow"/></svg></a>
      <button class="burger" type="button" aria-expanded="false" aria-controls="nav" aria-label="Ouvrir le menu"><span></span></button>
    </div>
  </header>"""

ROUTES = """
    <section class="routes">
      <div class="wrap routes-grid">
        <a href="boxe-educative.html"><strong>La boxe éducative</strong><span>Apprendre les gestes, sans recherche de puissance.</span><em>Découvrir →</em></a>
        <a href="clubs.html"><strong>5 clubs</strong><span>Minimes, Saint-Cyprien, États-Unis, Ramonville, Portet.</span><em>Voir les clubs →</em></a>
        <a href="horaires.html"><strong>Horaires</strong><span>Mercredi et samedi, 16h – 18h, hors vacances.</span><em>Consulter →</em></a>
        <a href="avis.html"><strong>Avis des parents</strong><span>Confiance, calme et plaisir, aussi en dehors du ring.</span><em>Lire les avis →</em></a>
      </div>
    </section>"""

CONTACT = """
    <section class="contact-page">
      <div class="wrap">
        <p class="crumb"><a href="index.html">Accueil</a><span>/</span>Contact</p>
        <h1 class="display">Une question ? <span class="accent">Écrivez-nous.</span></h1>
        <p class="lead">L'équipe répond sous 24h, du lundi au samedi, 9h – 19h. Les tarifs sont donnés au club, lors de la séance d'essai.</p>
        <div class="contact-grid">
          <article>
            <h2>Coordonnées</h2>
            <ul class="contact-list">
              <li><svg class="icon"><use href="#i-phone"/></svg><div><a href="tel:+33561506866">05 61 50 68 66</a><span>Du lundi au samedi · 9h – 19h</span></div></li>
              <li><svg class="icon"><use href="#i-mail"/></svg><div><a href="mailto:contact@boxingcenter.fr">contact@boxingcenter.fr</a><span>Réponse sous 24h</span></div></li>
              <li><svg class="icon"><use href="#i-pin"/></svg><div>5 clubs à Toulouse et ses alentours</div></li>
            </ul>
            <a class="btn" href="essai.html"><svg class="icon"><use href="#i-cal"/></svg> Réserver une séance d'essai</a>
          </article>
          <article id="tarifs">
            <h2>Tarifs</h2>
            <p>Il n'y a pas de paiement en ligne. Chaque club communique le tarif au moment de la séance d'essai, sans engagement.</p>
            <p>Le matériel de la séance (gants et protections adaptés à l'âge) est fourni.</p>
          </article>
          <article class="span-2" id="mentions">
            <h2>Mentions</h2>
            <p>Boxing Center — boxe éducative pour les enfants à Toulouse et ses alentours. Contact : 05 61 50 68 66 · contact@boxingcenter.fr. La demande d'essai ouvre votre messagerie : ce site n'enregistre pas les données du formulaire. L'inscription se fait au club.</p>
          </article>
        </div>
      </div>
    </section>"""


def page(title, description, body, crumb=None):
    crumb_html = ""
    if crumb:
        crumb_html = f'<p class="crumb wrap"><a href="index.html">Accueil</a><span>/</span>{crumb}</p>'
    return f"""<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>{title}</title>
  <meta name="description" content="{description}">
  <link rel="icon" href="assets/favicon.png" type="image/png">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Caveat:wght@600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="css/styles.css">
</head>
<body>
  {SPRITE}
  <a class="sr-only" href="#contenu">Aller au contenu</a>
  {HEADER}
  <main id="contenu">
    {crumb_html}
{body}
  </main>
  {FOOTER}
  <script src="js/main.js"></script>
</body>
</html>
"""


def first_h1(html):
    if "<h1" in html:
        return html
    html = html.replace('<h2 class="display"', '<h1 class="display"', 1)
    return html.replace("</h2>", "</h1>", 1)


def main():
    global SPRITE, FOOTER
    make_logo()
    html = SRC.read_text(encoding="utf-8")
    SPRITE = re.search(r'<svg class="sr-only".*?</svg>', html, re.S).group(0)
    main_html = re.search(r'<main id="accueil">(.*)</main>', html, re.S).group(1)
    footer = re.search(r'<footer class="footer".*?</footer>', html, re.S).group(0)
    sections = re.findall(r'    <section\b.*?\n    </section>', main_html, re.S)
    by_id = {}
    for section in sections:
        found = re.search(r'<section[^>]*\bid="([^"]+)"', section)
        if found:
            by_id[found.group(1)] = section
        elif 'class="hero"' in section:
            by_id["hero"] = section
        else:
            raise SystemExit("section sans id")
    print("sections", list(by_id))
    footer = rewrite(footer)
    # Drop the long legal paragraph; it now lives on the contact page.
    footer = re.sub(r'\s*<div class="wrap"[^>]*>\s*<p>Boxing Center.*?</p>\s*</div>', "", footer, flags=re.S)
    FOOTER = footer
    groups = {
        "index.html": ["hero", "benefices", "ages"],
        "boxe-educative.html": ["boxe-educative", "pour-tous", "cours", "competences", "securite", "coachs"],
        "clubs.html": ["clubs"],
        "horaires.html": ["horaires"],
        "essai.html": ["essai"],
        "avis.html": ["progres", "avis"],
        "faq.html": ["faq"],
    }
    crumbs = {
        "boxe-educative.html": "Boxe éducative",
        "clubs.html": "Clubs",
        "horaires.html": "Horaires",
        "essai.html": "Séance d'essai",
        "avis.html": "Avis",
        "faq.html": "FAQ",
    }
    metas = {
        "index.html": ("Boxe enfants à Toulouse | Boxing Center", "Cours de boxe éducative pour les enfants dans les 5 clubs Boxing Center à Toulouse."),
        "boxe-educative.html": ("Boxe éducative | Boxing Center Toulouse", "La boxe éducative apprend les gestes et les valeurs de la boxe, sans recherche de puissance."),
        "clubs.html": ("Nos clubs | Boxing Center Toulouse", "Cinq clubs Boxing Center autour de Toulouse : Minimes, Saint-Cyprien, États-Unis, Ramonville et Portet-sur-Garonne."),
        "horaires.html": ("Horaires | Boxing Center Toulouse", "Cours enfants le mercredi et le samedi, de 16h à 18h, dans les 5 clubs."),
        "essai.html": ("Séance d'essai | Boxing Center Toulouse", "Réservez une première séance de boxe éducative, sans engagement."),
        "avis.html": ("Avis des parents | Boxing Center Toulouse", "Ce que les parents observent chez leurs enfants, au club et à la maison."),
        "faq.html": ("Questions fréquentes | Boxing Center Toulouse", "Âge, combats, matériel, horaires et séance d'essai : les réponses aux parents."),
        "contact.html": ("Contact | Boxing Center Toulouse", "Téléphone, e-mail et tarifs des cours de boxe enfants Boxing Center."),
    }
    for name, ids in groups.items():
        chunks = [rewrite(by_id[i]) for i in ids]
        if name == "index.html":
            chunks.append(ROUTES)
        body = "\n".join(chunks)
        if name != "index.html":
            body = first_h1(body)
        (ROOT / name).write_text(page(*metas[name], body, crumbs.get(name)), encoding="utf-8")
        print("wrote", name)
    (ROOT / "contact.html").write_text(page(*metas["contact.html"], CONTACT), encoding="utf-8")
    print("wrote contact.html")


if __name__ == "__main__":
    main()
