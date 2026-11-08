import markUrl from "../images/lff-valvenco-mark.png";

const LINKS = [
  ["Typography", "96px to 12px", "/?path=/story/typography--scale", true],
  ["Button", "Tone, size, arrow", "/?path=/story/button--tones", true],
  ["Color", "Palette and grounds", "/?path=/story/color--palette", true],
  ["Iconography", "Five sharp marks", "/?path=/story/iconography--set", true],
  ["Motion", "Hover, leave, press", "/?path=/story/motion--button-hover", true],
  ["Scroll", "Wheel, header, reveals", "/?path=/story/scroll--rules", true],
  ["Changelog", "On this page", "#changelog", false],
];

const CHANGES = [
  ["Typography", "Inter, from the 96px display to the 12px eyebrow."],
  ["Color", "Primary #00B1F5, white, grey #ECECEC, black, and type at 80% and 60%."],
  ["Iconography", "Arrow, arrow up-right, download, mail, and product. 15px, sharp."],
  ["Button", "Primary, secondary, and neutral. Small and default. The arrow is optional. The page links to a live playground."],
  ["Motion", "Hover 0.5s. Leave runs from the last letter. Press scales to 0.9. A fine pointer only. Reduced motion skips the movement."],
  ["Scroll", "Wheel catch-up 0.08. The header tucks after 120px. Reveals, parallax, and steps keep their own timings."],
];

export default {
  title: "Introduction",
  parameters: {
    docs: {
      description: {
        component:
          "Where to start in the Valvenco UI Library, and what the stories specify.",
      },
    },
  },
};

export const Intro = {
  render: () => {
    const root = document.createElement("div");
    root.className = "intro";

    const cover = document.createElement("section");
    cover.className = "intro-cover";
    cover.setAttribute("aria-labelledby", "intro-title");

    const lockup = document.createElement("div");
    lockup.className = "intro-lockup";

    const mark = document.createElement("img");
    mark.className = "intro-mark";
    mark.src = markUrl;
    mark.width = 291;
    mark.height = 84;
    mark.alt = "";

    const title = document.createElement("h1");
    title.className = "intro-title";
    title.id = "intro-title";
    title.textContent = "LFF Valvenco";

    const lede = document.createElement("p");
    lede.className = "intro-lede";
    lede.textContent =
      "These stories are the build reference for the Valvenco UI Library. Use the values on each page. Leave out anything that is not listed.";

    const nav = document.createElement("nav");
    nav.className = "intro-links";
    nav.setAttribute("aria-label", "Stories");
    for (const [label, hint, href, top] of LINKS) {
      const link = document.createElement("a");
      link.className = "intro-link";
      link.href = href;
      if (top) link.target = "_top";
      const name = document.createElement("span");
      name.className = "intro-link__name";
      name.textContent = label;
      const note = document.createElement("span");
      note.className = "intro-link__hint";
      note.textContent = hint;
      link.append(name, note);
      nav.append(link);
    }

    lockup.append(mark, title, lede, nav);
    cover.append(lockup);

    const log = document.createElement("section");
    log.className = "intro-log";
    log.id = "changelog";
    log.setAttribute("aria-labelledby", "changelog-title");

    const logInner = document.createElement("div");
    logInner.className = "intro-log__inner";

    const logTitle = document.createElement("h2");
    logTitle.className = "intro-log__title";
    logTitle.id = "changelog-title";
    logTitle.textContent = "Changelog";

    const logLede = document.createElement("p");
    logLede.className = "intro-log__lede";
    logLede.textContent = "The stories are the spec. Styles are in css/motion.css. Behavior is in js/.";

    const entry = document.createElement("article");
    entry.className = "intro-entry";

    const entryHead = document.createElement("div");
    entryHead.className = "intro-entry__head";
    const version = document.createElement("h3");
    version.className = "intro-entry__version";
    version.textContent = "Foundation";
    const date = document.createElement("time");
    date.dateTime = "2026-11-08";
    date.textContent = "8 Nov 2026";
    entryHead.append(version, date);

    const list = document.createElement("dl");
    list.className = "intro-entry__list";
    for (const [name, copy] of CHANGES) {
      const row = document.createElement("div");
      const term = document.createElement("dt");
      term.textContent = name;
      const detail = document.createElement("dd");
      detail.textContent = copy;
      row.append(term, detail);
      list.append(row);
    }

    entry.append(entryHead, list);
    logInner.append(logTitle, logLede, entry);
    log.append(logInner);
    root.append(cover, log);
    return root;
  },
};
