// ==================================================
// CONFIGURARE CTFd
// ==================================================
// Pune aici URL-ul instanței tale CTFd înainte de workshop.
const CONFIG = {
  CTFD_URL: "PASTE_YOUR_CTFD_URL_HERE"
};

// ==================================================
// NAVIGARE
// ==================================================
(function () {
  const slides = Array.from(document.querySelectorAll(".slide"));
  const total = slides.length;
  let current = 0;

  const counter = document.getElementById("counter");
  const progressFill = document.getElementById("progressFill");
  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");
  const menuOverlay = document.getElementById("menuOverlay");
  const menuList = document.getElementById("menuList");

  const sectionTitles = [
    "Cover", "Ce înseamnă hacking?", "Cum funcționează un site?",
    "HTTP + DevTools", "Inspect Element", "Client vs Server",
    "URL Parameters + Cookies", "Encoding vs Encryption", "Terminal",
    "OSINT", "Ce este un CTF?", "Start CTF"
  ];

  function buildMenu() {
    sectionTitles.forEach((title, i) => {
      const li = document.createElement("li");
      li.textContent = `${String(i + 1).padStart(2, "0")} — ${title}`;
      li.addEventListener("click", () => {
        goTo(i);
        closeMenu();
      });
      menuList.appendChild(li);
    });
  }

  function render() {
    slides.forEach((s, i) => {
      s.classList.toggle("active", i === current);
    });
    counter.textContent = `${String(current + 1).padStart(2, "0")} / ${total}`;
    progressFill.style.width = `${((current + 1) / total) * 100}%`;
    prevBtn.disabled = current === 0;
    nextBtn.disabled = current === total - 1;

    Array.from(menuList.children).forEach((li, i) => {
      li.classList.toggle("current", i === current);
    });
  }

  function goTo(index) {
    if (index < 0 || index >= total || index === current) return;
    current = index;
    render();
  }

  function next() { goTo(current + 1); }
  function prev() { goTo(current - 1); }

  function openMenu() { menuOverlay.classList.add("open"); }
  function closeMenu() { menuOverlay.classList.remove("open"); }

  prevBtn.addEventListener("click", prev);
  nextBtn.addEventListener("click", next);
  document.getElementById("startBtn").addEventListener("click", next);

  window.addEventListener("keydown", (e) => {
    if (menuOverlay.classList.contains("open")) {
      if (e.key === "Escape") closeMenu();
      return;
    }
    // Don't hijack keys while typing in an input/textarea.
    const tag = document.activeElement.tagName;
    const typing = tag === "INPUT" || tag === "TEXTAREA";

    if (e.key === "Escape") { openMenu(); return; }
    if (typing) return;

    if (e.key === "ArrowRight" || e.key === "ArrowDown" || e.key === " ") {
      e.preventDefault();
      next();
    } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
      e.preventDefault();
      prev();
    }
  });

  menuOverlay.addEventListener("click", (e) => {
    if (e.target === menuOverlay) closeMenu();
  });

  buildMenu();
  render();
})();

// ==================================================
// COVER — boot line + network visual
// ==================================================
(function () {
  const bootLine = document.getElementById("bootLine");
  const lines = ["> initializing...", "> ready."];
  let i = 0;
  function typeNext() {
    if (i >= lines.length) return;
    const isLast = i === lines.length - 1;
    const span = document.createElement("div");
    if (isLast) span.className = "boot-ready";
    span.textContent = lines[i];
    bootLine.appendChild(span);
    i++;
    setTimeout(typeNext, 500);
  }
  setTimeout(typeNext, 600);

  // Minimal network-node visual, built in pure SVG.
  const svg = document.getElementById("netSvg");
  if (svg) {
    const nodes = [
      [90, 80], [260, 50], [400, 120], [140, 220],
      [330, 260], [220, 350], [70, 300], [400, 380]
    ];
    const links = [[0,1],[1,2],[0,3],[1,4],[3,5],[4,5],[3,6],[4,7],[5,7]];
    let svgContent = "";
    links.forEach(([a, b]) => {
      const [x1, y1] = nodes[a];
      const [x2, y2] = nodes[b];
      svgContent += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="rgba(77,216,230,0.15)" stroke-width="1"/>`;
    });
    nodes.forEach(([x, y], idx) => {
      const r = idx % 3 === 0 ? 5 : 3;
      svgContent += `<circle cx="${x}" cy="${y}" r="${r}" fill="rgba(77,216,230,${idx % 2 === 0 ? 0.9 : 0.4})"/>`;
    });
    svg.innerHTML = svgContent;
  }
})();

// ==================================================
// 05 — HTML editor live preview
// ==================================================
(function () {
  const editor = document.getElementById("htmlEditor");
  const preview = document.getElementById("htmlPreview");
  if (!editor || !preview) return;

  function decodeEntities(str) {
    const ta = document.createElement("textarea");
    ta.innerHTML = str;
    return ta.value;
  }

  function render() {
    // Only allow a small safe subset of tags for this sandboxed demo.
    const raw = decodeEntities(editor.value);
    const div = document.createElement("div");
    div.innerHTML = raw;
    Array.from(div.querySelectorAll("*")).forEach((el) => {
      const allowed = ["H1", "H2", "P", "STRONG", "EM", "BR", "SPAN", "UL", "LI"];
      if (!allowed.includes(el.tagName)) {
        el.replaceWith(document.createTextNode(el.textContent));
      } else {
        Array.from(el.attributes).forEach((attr) => el.removeAttribute(attr.name));
      }
    });
    preview.innerHTML = div.innerHTML;
  }

  editor.addEventListener("input", render);
  render();
})();

// ==================================================
// 06 — Client vs Server demo (purely visual)
// ==================================================
(function () {
  const btn = document.getElementById("editBalanceBtn");
  const value = document.getElementById("balanceValue");
  const result = document.getElementById("balanceResult");
  if (!btn) return;
  let hacked = false;

  btn.addEventListener("click", () => {
    hacked = !hacked;
    if (hacked) {
      value.textContent = "999999 RON";
      value.classList.add("hacked");
      result.innerHTML = 'You changed the page. Did you change the server? <span class="balance-no">NO.</span>';
    } else {
      value.textContent = "100 RON";
      value.classList.remove("hacked");
      result.textContent = "";
    }
  });
})();

// ==================================================
// 07 — URL parameter demo
// ==================================================
(function () {
  const input = document.getElementById("idInput");
  const idDisplay = document.getElementById("idDisplay");
  const idOutput = document.getElementById("idOutput");
  if (!input) return;

  function update() {
    const val = input.value || "0";
    idDisplay.textContent = val;
    idOutput.textContent = `Profile #${val}`;
  }
  input.addEventListener("input", update);
  update();
})();

// ==================================================
// 08 — Base64 encode / decode
// ==================================================
(function () {
  const input = document.getElementById("b64Input");
  const output = document.getElementById("b64Output");
  const encodeBtn = document.getElementById("encodeBtn");
  const decodeBtn = document.getElementById("decodeBtn");
  if (!input) return;

  encodeBtn.addEventListener("click", () => {
    try {
      output.textContent = btoa(unescape(encodeURIComponent(input.value)));
    } catch (e) {
      output.textContent = "Nu pot codifica acest text.";
    }
  });

  decodeBtn.addEventListener("click", () => {
    try {
      output.textContent = decodeURIComponent(escape(atob(input.value)));
    } catch (e) {
      output.textContent = "Nu este Base64 valid.";
    }
  });
})();

// ==================================================
// 09 — Terminal sandbox
// ==================================================
(function () {
  const body = document.getElementById("terminalBody");
  const input = document.getElementById("terminalInput");
  if (!body || !input) return;

  const fs = {
    "notes.txt": "Nu uita: parolele slabe sunt punctul de intrare #1.",
    "image.jpg": "[binary file - nu poate fi afișat]",
    "secret.txt": "FLAG{TERMINAL_TIME}"
  };

  const commands = {
    help: () => "Comenzi disponibile: help, pwd, ls, cd, cat <fisier>, echo <text>, clear",
    pwd: () => "/home/student",
    ls: () => Object.keys(fs).join("\n"),
    cd: (args) => (args.length ? `bash: cd: ${args[0]}: nu există în acest sandbox` : "/home/student"),
    cat: (args) => {
      if (!args.length) return "cat: lipsește numele fișierului";
      const name = args[0];
      if (fs[name]) {
        const isFlag = name === "secret.txt";
        return isFlag ? { flag: fs[name] } : fs[name];
      }
      return `cat: ${name}: fișierul nu există`;
    },
    echo: (args) => args.join(" "),
    clear: () => null
  };

  function printLine(text, className) {
    const line = document.createElement("div");
    if (className) line.className = className;
    line.textContent = text;
    body.appendChild(line);
  }

  function printCommand(text) {
    const line = document.createElement("div");
    line.className = "t-cmd";
    line.textContent = text;
    body.appendChild(line);
  }

  function run(raw) {
    const trimmed = raw.trim();
    if (!trimmed) return;
    printCommand(trimmed);

    const [cmd, ...args] = trimmed.split(/\s+/);
    const handler = commands[cmd];

    if (!handler) {
      printLine(`bash: ${cmd}: comandă negăsită. Scrie "help" pentru comenzi.`, "t-err");
    } else if (cmd === "clear") {
      body.innerHTML = "";
    } else {
      const out = handler(args);
      if (out === null) return;
      if (typeof out === "object" && out.flag) {
        printLine(out.flag, "t-flag");
      } else {
        printLine(out);
      }
    }
    body.scrollTop = body.scrollHeight;
  }

  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      run(input.value);
      input.value = "";
    }
  });

  printLine('Terminal simulat. Scrie "help" pentru a începe.');
})();

// ==================================================
// 12 — Open CTFd
// ==================================================
(function () {
  const btn = document.getElementById("openCtfdBtn");
  const warning = document.getElementById("ctfdWarning");
  if (!btn) return;

  btn.addEventListener("click", () => {
    if (!CONFIG.CTFD_URL || CONFIG.CTFD_URL === "PASTE_YOUR_CTFD_URL_HERE") {
      warning.textContent = "Configurează CTFD_URL în script.js.";
      return;
    }
    window.open(CONFIG.CTFD_URL, "_blank", "noopener");
  });
})();