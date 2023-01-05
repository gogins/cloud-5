import { c as createAstro, a as createComponent, r as renderTemplate, b as addAttribute, _ as __astro_tag_component__, m as maybeRenderHead, d as renderComponent, e as renderSlot, $ as $$HeadCommon, f as renderHead } from '../entry.mjs';
import { unescape } from 'html-escaper';
import CommandLineIcon from '@heroicons/react/20/solid/CommandLineIcon.js';
import { Disclosure } from '@headlessui/react';
import Bars3Icon from '@heroicons/react/24/outline/Bars3Icon.js';
import XMarkIcon from '@heroicons/react/24/outline/XMarkIcon.js';
import { jsx, jsxs, Fragment } from 'react/jsx-runtime';
/* empty css                         */import { useRef, useState, useEffect } from 'preact/hooks';
import { jsx as jsx$1, Fragment as Fragment$1 } from 'preact/jsx-runtime';
import 'react';
import 'react-dom/server';
import 'preact';
import 'preact-render-to-string';
/* empty css                          *//* empty css                         */import 'fraction.js';
import 'bjork';
import 'canvas';
import 'escodegen';
import 'acorn';
import 'estree-walker';
import '@tonaljs/tonal';
import 'chord-voicings';

const SITE = {
  title: "Strudel Docs",
  description: "Documentation for the Strudel Live Coding Language",
  defaultLanguage: "en_US"
};
const OPEN_GRAPH = {
  image: {
    src: "https://github.com/withastro/astro/blob/main/assets/social/banner-minimal.png?raw=true",
    alt: "astro logo on a starry expanse of space, with a purple saturn-like planet floating in the right foreground"
  },
  twitter: "astrodotbuild"
};
const KNOWN_LANGUAGES = {
  English: "en"
};
Object.values(KNOWN_LANGUAGES);
const GITHUB_EDIT_URL = `https://github.com/tidalcycles/strudel/tree/main/website`;
const COMMUNITY_INVITE_URL = `https://discord.com/invite/HGEdXmRkzT`;
const SIDEBAR = {
  en: {
    Tutorial: [
      { text: "Getting Started", link: "learn/getting-started" },
      { text: "Notes", link: "learn/notes" },
      { text: "Sounds", link: "learn/sounds" },
      { text: "Coding syntax", link: "learn/code" },
      { text: "Mini-notation", link: "learn/mini-notation" },
      { text: "Samples", link: "learn/samples" },
      { text: "Synths", link: "learn/synths" },
      { text: "Audio effects", link: "learn/effects" },
      { text: "Functions", link: "learn/functions" },
      { text: "Signals", link: "learn/signals" },
      { text: "Tonal", link: "learn/tonal" },
      { text: "MIDI & OSC", link: "learn/input-output" }
    ],
    "Technical Manual": [
      { text: "Patterns", link: "technical-manual/patterns" },
      { text: "REPL", link: "technical-manual/repl" },
      { text: "Pattern Alignment", link: "technical-manual/alignment" },
      { text: "Docs", link: "technical-manual/docs" },
      { text: "Testing", link: "technical-manual/testing" }
    ]
  }
};

const $$Astro$6 = createAstro("/Users/michaelgogins/cloud-music/strudel/website/src/components/HeadSEO.astro", "https://strudel.tidalcycles.org/", "file:///Users/michaelgogins/cloud-music/strudel/website/");
const $$HeadSEO = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$6, $$props, $$slots);
  Astro2.self = $$HeadSEO;
  const { frontmatter, canonicalUrl } = Astro2.props;
  const formattedContentTitle = `${frontmatter.title} \u{1F680} ${SITE.title}`;
  const imageSrc = frontmatter.image?.src ?? OPEN_GRAPH.image.src;
  const canonicalImageSrc = new URL(imageSrc, Astro2.site);
  const imageAlt = frontmatter.image?.alt ?? OPEN_GRAPH.image.alt;
  return renderTemplate`<!-- Page Metadata --><link rel="canonical"${addAttribute(canonicalUrl, "href")}>

<!-- OpenGraph Tags -->
<meta property="og:title"${addAttribute(formattedContentTitle, "content")}>
<meta property="og:type" content="article">
<meta property="og:url"${addAttribute(canonicalUrl, "content")}>
<meta property="og:locale"${addAttribute(frontmatter.ogLocale ?? SITE.defaultLanguage, "content")}>
<meta property="og:image"${addAttribute(canonicalImageSrc, "content")}>
<meta property="og:image:alt"${addAttribute(imageAlt, "content")}>
<meta name="description" property="og:description"${addAttribute(frontmatter.description ?? SITE.description, "content")}>
<meta property="og:site_name"${addAttribute(SITE.title, "content")}>

<!-- Twitter Tags -->
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:site"${addAttribute(OPEN_GRAPH.twitter, "content")}>
<meta name="twitter:title"${addAttribute(formattedContentTitle, "content")}>
<meta name="twitter:description"${addAttribute(frontmatter.description ?? SITE.description, "content")}>
<meta name="twitter:image"${addAttribute(canonicalImageSrc, "content")}>
<meta name="twitter:image:alt"${addAttribute(imageAlt, "content")}>

<!--
  TODO: Add json+ld data, maybe https://schema.org/APIReference makes sense?
  Docs: https://developers.google.com/search/docs/advanced/structured-data/intro-structured-data
  https://www.npmjs.com/package/schema-dts seems like a great resource for implementing this.
  Even better, there's a React component that integrates with \`schema-dts\`: https://github.com/google/react-schemaorg
-->
`;
}, "/Users/michaelgogins/cloud-music/strudel/website/src/components/HeadSEO.astro");

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}
function MobileNav({
  sidebar
}) {
  return /* @__PURE__ */ jsx(Disclosure, {
    as: "nav",
    children: ({
      open
    }) => /* @__PURE__ */ jsxs(Fragment, {
      children: [/* @__PURE__ */ jsxs(Disclosure.Button, {
        className: "inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white",
        children: [/* @__PURE__ */ jsx("span", {
          className: "sr-only",
          children: "Open main menu"
        }), open ? /* @__PURE__ */ jsx(XMarkIcon, {
          className: "block h-6 w-6",
          "aria-hidden": "true"
        }) : /* @__PURE__ */ jsx(Bars3Icon, {
          className: "block h-6 w-6",
          "aria-hidden": "true"
        })]
      }), /* @__PURE__ */ jsx(Disclosure.Panel, {
        className: "md:hidden absolute top-14 right-0 max-h-screen pb-14 overflow-auto z-[100] w-full",
        children: /* @__PURE__ */ jsxs("div", {
          className: "space-y-1 px-4 py-4 bg-[#161616]",
          children: [/* @__PURE__ */ jsx("a", {
            href: "..",
            className: "py-2 flex cursor-pointer items-center space-x-1 hover:bg-bg hover:px-2 rounded-md",
            children: /* @__PURE__ */ jsx("span", {
              children: "go to REPL"
            })
          }), Object.entries(sidebar).map(([group, items], i) => /* @__PURE__ */ jsxs("div", {
            className: "space-y-2",
            children: [/* @__PURE__ */ jsx("div", {
              children: group
            }), items.map((item, j) => /* @__PURE__ */ jsx(Disclosure.Button, {
              as: "a",
              href: `/${item.link}`,
              className: classNames(item.current ? "bg-bg text-white" : "text-gray-300 hover:bg-bg hover:text-white", "block px-3 py-2 rounded-md text-base font-medium"),
              "aria-current": item.current ? "page" : void 0,
              children: item.text
            }, j))]
          }, i))]
        })
      })]
    })
  });
}
__astro_tag_component__(MobileNav, "@astrojs/react");

const $$Astro$5 = createAstro("/Users/michaelgogins/cloud-music/strudel/website/src/components/Header/Header.astro", "https://strudel.tidalcycles.org/", "file:///Users/michaelgogins/cloud-music/strudel/website/");
const $$Header = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$5, $$props, $$slots);
  Astro2.self = $$Header;
  Astro2.props;
  const langCode = "en";
  const sidebar = SIDEBAR[langCode];
  return renderTemplate`${maybeRenderHead($$result)}<nav class="flex justify-between py-2 px-4 items-center h-14 max-h-14 bg-[#161616] astro-5HK5URLU" title="Top Navigation">
  <!--     <div class="menu-toggle">
      <SidebarToggle client:idle />
    </div> -->
  <div class="flex overflow-visible items-center grow astro-5HK5URLU" style="overflow:visible">
    <a href="/" class="flex items-center text-2xl space-x-2 astro-5HK5URLU">
      <h1 class="text-white font-bold flex space-x-2 items-baseline text-xl astro-5HK5URLU">
        <span class="astro-5HK5URLU">🌀</span>
        <div class="flex space-x-1 items-baseline astro-5HK5URLU">
          <span class=" astro-5HK5URLU">strudel</span>
          <span class="text-sm astro-5HK5URLU">DOCS</span>
        </div>
      </h1>
    </a>
  </div>
  
  <div class="search-item h-10 astro-5HK5URLU">
    <!--     <Search client:idle /> -->
  </div>
  <a href="./" class="hidden md:flex cursor-pointer items-center space-x-1 astro-5HK5URLU">${renderComponent($$result, "CommandLineIcon", CommandLineIcon, { "className": "w-5 h-5 astro-5HK5URLU" })}<span class="astro-5HK5URLU">go to REPL</span>
  </a>
  <div class="md:hidden astro-5HK5URLU">
    ${renderComponent($$result, "MobileNav", MobileNav, { "sidebar": sidebar, "client:idle": true, "client:component-hydration": "idle", "client:component-path": "/Users/michaelgogins/cloud-music/strudel/website/src/docs/MobileNav", "client:component-export": "default", "class": "astro-5HK5URLU" })}
  </div>
</nav>



`;
}, "/Users/michaelgogins/cloud-music/strudel/website/src/components/Header/Header.astro");

const $$Astro$4 = createAstro("/Users/michaelgogins/cloud-music/strudel/website/src/components/RightSidebar/MoreMenu.astro", "https://strudel.tidalcycles.org/", "file:///Users/michaelgogins/cloud-music/strudel/website/");
const $$MoreMenu = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$4, $$props, $$slots);
  Astro2.self = $$MoreMenu;
  const { editHref } = Astro2.props;
  return renderTemplate`${maybeRenderHead($$result)}<ul class="px-4 py-4">
  ${editHref && renderTemplate`<li>
        <a class="flex items-center space-x-2"${addAttribute(editHref, "href")} target="_blank">
          <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="pen" class="svg-inline--fa fa-pen fa-w-16" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" height="1em" width="1em">
            <path fill="currentColor" d="M290.74 93.24l128.02 128.02-277.99 277.99-114.14 12.6C11.35 513.54-1.56 500.62.14 485.34l12.7-114.22 277.9-277.88zm207.2-19.06l-60.11-60.11c-18.75-18.75-49.16-18.75-67.91 0l-56.55 56.55 128.02 128.02 56.55-56.55c18.75-18.76 18.75-49.16 0-67.91z"></path>
          </svg>
          <span>Edit this page</span>
        </a>
      </li>`}
  ${renderTemplate`<li${addAttribute(`header-link depth-2`, "class")}>
        <a${addAttribute(COMMUNITY_INVITE_URL, "href")} target="_blank" class="flex items-center space-x-2">
          <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="comment-alt" class="svg-inline--fa fa-comment-alt fa-w-16" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" height="1em" width="1em">
            <path fill="currentColor" d="M448 0H64C28.7 0 0 28.7 0 64v288c0 35.3 28.7 64 64 64h96v84c0 9.8 11.2 15.5 19.1 9.7L304 416h144c35.3 0 64-28.7 64-64V64c0-35.3-28.7-64-64-64z"></path>
          </svg>
          <span>Join our community</span>
        </a>
      </li>`}
</ul>
<div style="margin: 2rem 0; text-align: center;">
  <!--   <ThemeToggleButton client:visible /> -->
</div>`;
}, "/Users/michaelgogins/cloud-music/strudel/website/src/components/RightSidebar/MoreMenu.astro");

const $$Astro$3 = createAstro("/Users/michaelgogins/cloud-music/strudel/website/src/components/PageContent/PageContent.astro", "https://strudel.tidalcycles.org/", "file:///Users/michaelgogins/cloud-music/strudel/website/");
const $$PageContent = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$3, $$props, $$slots);
  Astro2.self = $$PageContent;
  const { frontmatter, headings, githubEditUrl } = Astro2.props;
  frontmatter.title;
  Astro2.url.pathname;
  return renderTemplate`${maybeRenderHead($$result)}<article id="article" class="content astro-T4G566DL">
  <section class="main-section astro-T4G566DL">
    <!-- TODO: add dropdown toc on mobile -->
    <!--     <nav class="block sm:hidden mb-8">
      <span>On this Page:</span>
      <TableOfContents client:media="(max-width: 50em)" headings={headings} currentPage={currentPage} />
    </nav> -->
    <div class="prose prose-invert max-w-full pb-8 astro-T4G566DL">
      ${renderSlot($$result, $$slots["default"])}
    </div>
  </section>
  <nav class="block sm:hidden astro-T4G566DL">
    ${renderComponent($$result, "MoreMenu", $$MoreMenu, { "editHref": githubEditUrl, "class": "astro-T4G566DL" })}
  </nav>
</article>
`;
}, "/Users/michaelgogins/cloud-music/strudel/website/src/components/PageContent/PageContent.astro");

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(raw || cooked.slice()) }));
var _a;
const $$Astro$2 = createAstro("/Users/michaelgogins/cloud-music/strudel/website/src/components/LeftSidebar/LeftSidebar.astro", "https://strudel.tidalcycles.org/", "file:///Users/michaelgogins/cloud-music/strudel/website/");
const $$LeftSidebar = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$2, $$props, $$slots);
  Astro2.self = $$LeftSidebar;
  const { currentPage } = Astro2.props;
  const { BASE_URL } = (Object.assign({"BASE_URL":"/","MODE":"production","DEV":false,"PROD":true},{_:process.env._,BASE_URL:'/',}));
  let currentPageMatch = currentPage.slice(BASE_URL.length, currentPage.endsWith("/") ? -1 : void 0);
  const langCode = "en";
  const sidebar = SIDEBAR[langCode];
  return renderTemplate(_a || (_a = __template(["", '<nav aria-labelledby="grid-left">\n  <ul>\n    ', `
  </ul>
</nav>

<script>
  window.addEventListener('DOMContentLoaded', () => {
    var target = document.querySelector('[aria-current="page"]');
    if (target && target.offsetTop > window.innerHeight - 100) {
      document.querySelector('.nav-groups').scrollTop = target.offsetTop;
    }
  });
<\/script>`])), maybeRenderHead($$result), Object.entries(sidebar).map(([header, children]) => renderTemplate`<li>
          <div class="nav-group pb-4">
            <h2>${header}</h2>
            <ul>
              ${children.map((child) => {
    const url = "." + Astro2.site?.pathname + child.link;
    return renderTemplate`<li class="">
                    <a${addAttribute(`pl-4 py-0.5 w-full hover:bg-header block${currentPageMatch === child.link ? " bg-header" : ""}`, "class")}${addAttribute(url, "href")}${addAttribute(currentPageMatch === child.link ? "page" : false, "aria-current")}>
                      ${child.text}
                    </a>
                  </li>`;
  })}
            </ul>
          </div>
        </li>`));
}, "/Users/michaelgogins/cloud-music/strudel/website/src/components/LeftSidebar/LeftSidebar.astro");

const TableOfContents = ({
  headings = [],
  currentPage
}) => {
  const toc = useRef();
  const onThisPageID = "on-this-page-heading";
  const itemOffsets = useRef([]);
  const [currentID, setCurrentID] = useState("overview");
  useEffect(() => {
    const getItemOffsets = () => {
      const titles = document.querySelectorAll("article :is(h1, h2, h3, h4)");
      itemOffsets.current = Array.from(titles).map((title) => ({
        id: title.id,
        topOffset: title.getBoundingClientRect().top + window.scrollY
      }));
    };
    getItemOffsets();
    window.addEventListener("resize", getItemOffsets);
    return () => {
      window.removeEventListener("resize", getItemOffsets);
    };
  }, []);
  useEffect(() => {
    if (!toc.current)
      return;
    const setCurrent = (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          const {
            id
          } = entry.target;
          if (id === onThisPageID)
            continue;
          setCurrentID(entry.target.id);
          break;
        }
      }
    };
    const observerOptions = {
      rootMargin: "-100px 0% -66%",
      threshold: 1
    };
    const headingsObserver = new IntersectionObserver(setCurrent, observerOptions);
    document.querySelectorAll("article :is(h1,h2,h3)").forEach((h) => headingsObserver.observe(h));
    return () => headingsObserver.disconnect();
  }, [toc.current]);
  const onLinkClick = (e) => {
    setCurrentID(e.target.getAttribute("href").replace("#", ""));
  };
  const minDepth = 1;
  return jsx$1(Fragment$1, {
    children: jsx$1("ul", {
      ref: toc,
      children: headings.filter(({
        depth
      }) => depth >= minDepth && depth < 4).map((heading) => jsx$1("li", {
        className: "w-full",
        children: jsx$1("a", {
          href: `${currentPage}#${heading.slug}`,
          onClick: onLinkClick,
          className: `py-0.5 block cursor-pointer w-full border-l-4 border-header hover:bg-header ${["pl-4", "pl-9", "pl-12"][heading.depth - minDepth]} ${currentID === heading.slug ? "bg-header" : ""}`.trim(),
          children: unescape(heading.text)
        })
      }))
    })
  });
};
__astro_tag_component__(TableOfContents, "@astrojs/preact");

const $$Astro$1 = createAstro("/Users/michaelgogins/cloud-music/strudel/website/src/components/RightSidebar/RightSidebar.astro", "https://strudel.tidalcycles.org/", "file:///Users/michaelgogins/cloud-music/strudel/website/");
const $$RightSidebar = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$RightSidebar;
  const { headings, githubEditUrl } = Astro2.props;
  const currentPage = Astro2.url.pathname;
  return renderTemplate`${maybeRenderHead($$result)}<nav aria-labelledby="grid-right">
  ${renderComponent($$result, "TableOfContents", TableOfContents, { "client:media": "(min-width: 50em)", "headings": headings, "currentPage": currentPage, "client:component-hydration": "media", "client:component-path": "/Users/michaelgogins/cloud-music/strudel/website/src/components/RightSidebar/TableOfContents", "client:component-export": "default" })}
  ${renderComponent($$result, "MoreMenu", $$MoreMenu, { "editHref": githubEditUrl })}
</nav>`;
}, "/Users/michaelgogins/cloud-music/strudel/website/src/components/RightSidebar/RightSidebar.astro");

const $$Astro = createAstro("/Users/michaelgogins/cloud-music/strudel/website/src/layouts/MainLayout.astro", "https://strudel.tidalcycles.org/", "file:///Users/michaelgogins/cloud-music/strudel/website/");
const $$MainLayout = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$MainLayout;
  const { frontmatter, headings } = Astro2.props;
  const canonicalURL = new URL(Astro2.url.pathname, Astro2.site);
  const currentPage = Astro2.url.pathname;
  const currentFile = `src/pages${currentPage.replace(/\/$/, "")}.mdx`;
  const githubEditUrl = `${GITHUB_EDIT_URL}/${currentFile}`;
  return renderTemplate`<html${addAttribute(frontmatter.dir ?? "ltr", "dir")}${addAttribute(frontmatter.lang ?? "en-us", "lang")} class="initial">
  <head>
    ${renderComponent($$result, "HeadCommon", $$HeadCommon, {})}
    ${renderComponent($$result, "HeadSEO", $$HeadSEO, { "frontmatter": frontmatter, "canonicalUrl": canonicalURL })}
    <title>
      ${frontmatter.title ? `${frontmatter.title} \u{1F680} ${SITE.title}` : SITE.title}
    </title>
  ${renderHead($$result)}</head>

  <body class="h-screen text-gray-50">
    <div class="w-full h-full space-y-4 flex flex-col">
      <header class="max-w-full fixed top-0 w-full z-[100]">
        ${renderComponent($$result, "Header", $$Header, { "currentPage": currentPage })}
      </header>
      <main class="relative pt-16">
        <div class="h-full top-0 overflow-auto min-w-[300px] flex xl:justify-center pr-4 pl-4 md:pl-[300px] xl:pl-0">
          <aside title="Site Navigation" class="w-[300px] px-6 left-0 hidden md:block fixed">
            ${renderComponent($$result, "LeftSidebar", $$LeftSidebar, { "currentPage": currentPage })}
          </aside>
          ${renderComponent($$result, "PageContent", $$PageContent, { "frontmatter": frontmatter, "headings": headings, "githubEditUrl": githubEditUrl }, { "default": () => renderTemplate`${renderSlot($$result, $$slots["default"])}` })}
          <aside class="fixed right-0 h-full overflow-auto pr-4 pl-0 pb-16 hidden xl:block" title="Table of Contents">
            ${renderComponent($$result, "RightSidebar", $$RightSidebar, { "headings": headings, "githubEditUrl": githubEditUrl })}
          </aside>
        </div>
      </main>
      <!--     <Footer path={currentFile} /> -->
    </div>
  </body></html>`;
}, "/Users/michaelgogins/cloud-music/strudel/website/src/layouts/MainLayout.astro");

const $$file = "/Users/michaelgogins/cloud-music/strudel/website/src/layouts/MainLayout.astro";
const $$url = undefined;

export { $$MainLayout as default, $$file as file, $$url as url };
