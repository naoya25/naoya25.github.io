(() => {
  const cfg = window.PORTFOLIO_CONFIG;
  const API = "https://api.github.com";

  const $ = (id) => document.getElementById(id);

  const LANG_COLORS = {
    TypeScript: "#3178c6",
    JavaScript: "#f1e05a",
    Rust: "#dea584",
    Python: "#3572A5",
    Dart: "#00B4AB",
    HTML: "#e34c26",
    CSS: "#563d7c",
    Ruby: "#701516",
    Go: "#00ADD8",
    Swift: "#F05138",
    "C++": "#f34b7d",
    Makefile: "#427819",
  };
  const langColor = (lang) => LANG_COLORS[lang] || "#8e8e93";

  const el = (tag, className, text) => {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text != null) node.textContent = text;
    return node;
  };

  const pagesUrl = (repo) =>
    repo?.has_pages ? `https://${cfg.username}.github.io/${repo.name}/` : null;

  const ogImage = (repoName) =>
    `https://opengraph.githubassets.com/portfolio/${cfg.username}/${repoName}`;

  const fmtDate = (iso) => {
    const d = new Date(iso);
    return `${d.getFullYear()}年${d.getMonth() + 1}月更新`;
  };

  const setStaticLinks = () => {
    const url = `https://github.com/${cfg.username}`;
    for (const id of ["nav-github", "hero-github"]) $(id).href = url;
    $("footer-source").href = `${url}/${cfg.username}.github.io`;
    for (const id of ["hero-qiita", "footer-qiita"]) {
      if (cfg.qiita) $(id).href = cfg.qiita;
      else $(id).remove();
    }
  };

  const countUp = (node, target) => {
    const start = performance.now();
    const dur = 900;
    const tick = (now) => {
      const t = Math.min((now - start) / dur, 1);
      node.textContent = String(Math.round(target * (1 - Math.pow(1 - t, 3))));
      if (t < 1) requestAnimationFrame(tick);
    };
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
      node.textContent = String(target);
    } else {
      requestAnimationFrame(tick);
    }
  };

  const observeCountUp = (node, target) => {
    const io = new IntersectionObserver((entries) => {
      if (entries.some((e) => e.isIntersecting)) {
        io.disconnect();
        countUp(node, target);
      }
    });
    io.observe(node);
  };

  const renderProfile = (user) => {
    const name = user.name || user.login;
    document.title = `${name} — Portfolio`;
    $("nav-brand").textContent = user.login;
    $("avatar").src = user.avatar_url;
    $("avatar").alt = `${name} のアイコン`;
    $("avatar").classList.remove("skeleton");
    $("name").textContent = name;
    $("bio").textContent = user.bio || cfg.fallbackBio;
    $("footer-copy").textContent = `© ${new Date().getFullYear()} ${user.login}`;

    const stats = [
      [user.public_repos, "Repositories"],
      [user.followers, "Followers"],
      [user.following, "Following"],
    ];
    const ul = $("stats");
    ul.replaceChildren();
    for (const [num, label] of stats) {
      const li = el("li");
      const numEl = el("span", "num", "0");
      li.append(numEl, el("span", "label", label));
      ul.append(li);
      countUp(numEl, num);
    }
    observeCountUp($("band-count"), user.public_repos);
  };

  const gradCover = (f, repo) => {
    const c = langColor(repo?.language);
    const cover = el("div", "cover cover-grad");
    cover.style.background =
      `radial-gradient(120% 160% at 12% 0%, ${c}55 0%, transparent 55%),` +
      `radial-gradient(120% 160% at 88% 100%, ${c}33 0%, transparent 60%),` +
      `linear-gradient(135deg, ${c}22, transparent 70%)`;
    cover.append(el("span", "monogram", (f.title || f.repo).slice(0, 1).toUpperCase()));
    return cover;
  };

  // 画像の優先順: config の image → リポ直下の cover.png → (coverStyle:"og" なら OG 画像) → 言語色グラデ
  const buildCover = (f, repo) => {
    const candidates = [];
    if (f.image) candidates.push(f.image);
    candidates.push(`https://raw.githubusercontent.com/${cfg.username}/${f.repo}/HEAD/cover.png`);
    if (cfg.coverStyle === "og") candidates.push(ogImage(f.repo));
    const img = el("img", "cover");
    img.alt = "";
    img.loading = "lazy";
    let i = 0;
    img.onerror = () => {
      i += 1;
      if (i < candidates.length) img.src = candidates[i];
      else img.replaceWith(gradCover(f, repo));
    };
    img.src = candidates[0];
    return img;
  };

  const renderFeatured = (repoMap) => {
    const grid = $("featured-grid");
    grid.replaceChildren();
    cfg.featured.forEach((f, i) => {
      const repo = repoMap.get(f.repo.toLowerCase());
      const card = el("article", "feature-card" + (i === 0 ? " wide" : ""));

      card.append(buildCover(f, repo));

      const body = el("div", "body");
      body.append(el("p", "kicker", repo?.language || "Project"));
      body.append(el("h3", null, f.title || f.repo));
      body.append(el("p", null, repo?.description || f.desc || ""));
      const links = el("div", "links");
      const gh = el("a", null, "リポジトリを見る ›");
      gh.href = repo?.html_url || `https://github.com/${cfg.username}/${f.repo}`;
      gh.rel = "noopener";
      links.append(gh);
      const demoUrl = f.demo || repo?.homepage || pagesUrl(repo);
      if (demoUrl) {
        const demo = el("a", null, "デモを見る ›");
        demo.href = demoUrl;
        demo.rel = "noopener";
        links.append(demo);
      }
      body.append(links);
      card.append(body);
      grid.append(card);
    });
  };

  const renderSkills = (repos) => {
    const counts = new Map();
    for (const r of repos) {
      if (r.fork || !r.language) continue;
      counts.set(r.language, (counts.get(r.language) || 0) + 1);
    }
    const top = [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 7);
    const max = top[0]?.[1] || 1;
    const list = $("lang-list");
    list.replaceChildren();
    for (const [lang, count] of top) {
      const li = el("li");
      const name = el("span", "lang-name");
      const dot = el("span", "lang-dot");
      dot.style.background = langColor(lang);
      name.append(dot, document.createTextNode(lang));
      const bar = el("span", "bar");
      const fill = el("span", "bar-fill");
      fill.style.width = `${Math.round((count / max) * 100)}%`;
      fill.style.background = langColor(lang);
      bar.append(fill);
      li.append(name, bar, el("span", "lang-count", `×${count}`));
      list.append(li);
    }

    const tools = $("tool-list");
    tools.replaceChildren();
    for (const t of cfg.tools || []) tools.append(el("li", null, t));
  };

  const renderCareer = () => {
    const list = $("career-list");
    list.replaceChildren();
    for (const c of cfg.career || []) {
      const li = el("li");
      const right = el("div");
      right.append(el("p", "title", c.title));
      if (c.detail) right.append(el("p", "detail", c.detail));
      li.append(el("span", "period", c.period), right);
      list.append(li);
    }
    if (!(cfg.career || []).length) document.getElementById("career").remove();
  };

  const renderRepos = (repos) => {
    const featured = new Set(cfg.featured.map((f) => f.repo.toLowerCase()));
    const hidden = new Set(cfg.hidden.map((r) => r.toLowerCase()));
    const grid = $("repo-grid");
    grid.replaceChildren();
    repos
      .filter((r) => !r.fork && !featured.has(r.name.toLowerCase()) && !hidden.has(r.name.toLowerCase()))
      .slice(0, cfg.maxRepos)
      .forEach((r) => {
        const card = el("a", "repo-card");
        card.href = r.html_url;
        card.rel = "noopener";
        card.append(el("span", "repo-name", r.name));
        if (r.description) card.append(el("span", "repo-desc", r.description));
        const meta = el("span", "repo-meta");
        if (r.language) {
          const lang = el("span");
          const dot = el("span", "lang-dot");
          dot.style.background = langColor(r.language);
          lang.append(dot, document.createTextNode(r.language));
          meta.append(lang);
        }
        if (r.stargazers_count > 0) meta.append(el("span", null, `★ ${r.stargazers_count}`));
        meta.append(el("span", null, fmtDate(r.pushed_at)));
        card.append(meta);
        grid.append(card);
      });
  };

  const showFallback = () => {
    $("name").textContent = cfg.username;
    $("bio").textContent = cfg.fallbackBio;
    renderFeatured(new Map());
    renderSkills([]);
    renderCareer();
  };

  const init = async () => {
    setStaticLinks();
    try {
      const [userRes, repoRes] = await Promise.all([
        fetch(`${API}/users/${cfg.username}`),
        fetch(`${API}/users/${cfg.username}/repos?per_page=100&sort=pushed`),
      ]);
      if (!userRes.ok || !repoRes.ok) throw new Error("GitHub API error");
      const user = await userRes.json();
      const repos = await repoRes.json();
      renderProfile(user);
      renderFeatured(new Map(repos.map((r) => [r.name.toLowerCase(), r])));
      renderSkills(repos);
      renderCareer();
      renderRepos(repos);
    } catch (e) {
      console.warn("GitHub API 取得に失敗。フォールバック表示:", e);
      showFallback();
    }
  };

  init();
})();
