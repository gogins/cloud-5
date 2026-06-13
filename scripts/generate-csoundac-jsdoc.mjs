#!/usr/bin/env node
/**
 * Build the single CsoundAC API reference (jsdocs/CsoundAC.html):
 *   - API surface from csoundac_embind.cpp
 *   - Descriptions from csound-ac Doxygen XML (full C++ comments, inlined)
 *
 * Usage:
 *   node scripts/generate-csoundac-jsdoc.mjs [path/to/csoundac_embind.cpp]
 */

import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const cloud5Root = path.resolve(__dirname, "..");
const jsdocsDir = path.join(cloud5Root, "jsdocs");

const defaultEmbindCandidates = [
    // actions/checkout path: csound-wasm (under GITHUB_WORKSPACE / cloud-5 root)
    path.resolve(cloud5Root, "csound-wasm/CsoundAC/csoundac_embind.cpp"),
    path.resolve(cloud5Root, "../csound-wasm/CsoundAC/csoundac_embind.cpp"),
    path.resolve(cloud5Root, "dependencies/csound-wasm/CsoundAC/csoundac_embind.cpp"),
];

const defaultCsoundAcCandidates = [
    path.resolve(cloud5Root, "csound-ac"),
    path.resolve(cloud5Root, "../csound-ac"),
    path.resolve(cloud5Root, "dependencies/csound-ac"),
];

function tryFirstExisting(paths) {
    for (const candidate of paths) {
        if (fs.existsSync(candidate)) {
            return candidate;
        }
    }
    return null;
}

function firstExisting(paths, label) {
    const found = tryFirstExisting(paths);
    if (found) {
        return found;
    }
    throw new Error(`${label} not found. Checked: ${paths.join(", ")}`);
}

function embindCandidates() {
    const fromEnv = process.env.CSOUND_WASM_EMBIND?.trim();
    return [
        ...(fromEnv ? [path.resolve(fromEnv)] : []),
        ...defaultEmbindCandidates,
    ];
}

function csoundAcCandidates() {
    const fromEnv = process.env.CSOUND_AC_ROOT?.trim();
    return [
        ...(fromEnv ? [path.resolve(fromEnv)] : []),
        ...defaultCsoundAcCandidates,
    ];
}

function resolveEmbindPath(argvPath) {
    if (argvPath) {
        const resolved = path.resolve(argvPath);
        if (!fs.existsSync(resolved)) {
            throw new Error(`Embind file not found: ${resolved}`);
        }
        return resolved;
    }
    return firstExisting(embindCandidates(), "csoundac_embind.cpp");
}

function tryResolveCsoundAcRoot() {
    return tryFirstExisting(csoundAcCandidates());
}

function ensureDoxygen(csoundAcRoot) {
    const docDir = path.join(csoundAcRoot, "doc");
    const doxyfile = path.join(docDir, "Doxyfile");
    const xmlDir = path.join(docDir, "xml");
    if (!fs.existsSync(doxyfile)) {
        throw new Error(`Doxyfile not found: ${doxyfile}`);
    }
    execSync("doxygen -", {
        cwd: docDir,
        stdio: ["pipe", "pipe", "pipe"],
        input: "@INCLUDE = Doxyfile\nGENERATE_XML = YES\n",
    });
    return xmlDir;
}

function stripXmlText(xml) {
    if (!xml) return "";
    return xml
        .replace(/<para>/g, "\n\n")
        .replace(/<\/para>/g, "")
        .replace(/<linebreak\/>/g, "\n")
        .replace(/<[^>]+>/g, " ")
        .replace(/&quot;/g, '"')
        .replace(/&amp;/g, "&")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&apos;/g, "'")
        .replace(/[ \t]+\n/g, "\n")
        .replace(/[ \t]{2,}/g, " ")
        .replace(/\n{3,}/g, "\n\n")
        .trim();
}

function escapeHtml(text) {
    return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");
}

function formatProse(doc) {
    const prose = [doc?.brief, doc?.detailed, doc?.inbody].filter(Boolean).join("\n\n");
    if (!prose) return "";
    return `<div class="doc">${escapeHtml(prose).replace(/\n\n/g, "</p><p>").replace(/\n/g, "<br>")}</div>`;
}

function parseMemberBlock(block) {
    const qualifiedName = block.match(/<qualifiedname>([^<]+)<\/qualifiedname>/)?.[1];
    if (!qualifiedName) return null;
    const brief = stripXmlText(block.match(/<briefdescription>([\s\S]*?)<\/briefdescription>/)?.[1] || "");
    const detailed = stripXmlText(block.match(/<detaileddescription>([\s\S]*?)<\/detaileddescription>/)?.[1] || "");
    const inbody = stripXmlText(block.match(/<inbodydescription>([\s\S]*?)<\/inbodydescription>/)?.[1] || "");
    const params = [...block.matchAll(
        /<param>[\s\S]*?<declname>([^<]+)<\/declname>(?:[\s\S]*?<briefdescription>([\s\S]*?)<\/briefdescription>)?[\s\S]*?<\/param>/g,
    )].map((match) => ({
        name: match[1],
        description: stripXmlText(match[2] || ""),
    }));
    const returnType = stripXmlText(block.match(/<type>([\s\S]*?)<\/type>/)?.[1] || "");
    return { qualifiedName, brief, detailed, inbody, params, returnType };
}

function loadDoxygenDocs(xmlDir) {
    const members = new Map();
    const classes = new Map();

    const namespaceFile = path.join(xmlDir, "namespacecsound.xml");
    if (fs.existsSync(namespaceFile)) {
        const xml = fs.readFileSync(namespaceFile, "utf8");
        for (const block of xml.match(/<memberdef[\s\S]*?<\/memberdef>/g) || []) {
            const member = parseMemberBlock(block);
            if (member) members.set(member.qualifiedName, member);
        }
    }

    for (const entry of fs.readdirSync(xmlDir)) {
        if (!entry.startsWith("classcsound_1_1") || !entry.endsWith(".xml")) continue;
        const xml = fs.readFileSync(path.join(xmlDir, entry), "utf8");
        const compoundName = xml.match(/<compoundname>([^<]+)<\/compoundname>/)?.[1];
        if (compoundName) {
            const compoundTail = xml.match(
                /<\/sectiondef>\s*<briefdescription>([\s\S]*?)<\/briefdescription>\s*<detaileddescription>([\s\S]*?)<\/detaileddescription>/,
            );
            classes.set(compoundName, {
                qualifiedName: compoundName,
                brief: stripXmlText(compoundTail?.[1] || ""),
                detailed: stripXmlText(compoundTail?.[2] || ""),
            });
        }
        for (const block of xml.match(/<memberdef[\s\S]*?<\/memberdef>/g) || []) {
            const member = parseMemberBlock(block);
            if (member) members.set(member.qualifiedName, member);
        }
    }

    return { members, classes };
}

function extractCppSymbol(line) {
    const match = line.match(/&((?:csound|PitvIndices)::[A-Za-z0-9_]+(?:::[A-Za-z0-9_]+)*)/);
    return match?.[1] || null;
}

function extractBindingsBlock(source) {
    const start = source.indexOf("EMSCRIPTEN_BINDINGS");
    if (start === -1) throw new Error("EMSCRIPTEN_BINDINGS block not found");
    const open = source.indexOf("{", start);
    let depth = 0;
    for (let i = open; i < source.length; i++) {
        if (source[i] === "{") depth++;
        else if (source[i] === "}") {
            depth--;
            if (depth === 0) return source.slice(open + 1, i);
        }
    }
    throw new Error("Unterminated EMSCRIPTEN_BINDINGS block");
}

function splitTopLevelCommas(text) {
    const parts = [];
    let depth = 0;
    let start = 0;
    for (let i = 0; i < text.length; i++) {
        const ch = text[i];
        if (ch === "<") depth++;
        else if (ch === ">") depth--;
        else if (ch === "," && depth === 0) {
            parts.push(text.slice(start, i).trim());
            start = i + 1;
        }
    }
    parts.push(text.slice(start).trim());
    return parts;
}

function parseClassDecl(line) {
    const match = line.match(/^emscripten::class_<(.+)>\s*\(\s*"([^"]+)"\s*\)/);
    if (!match) return null;
    const inside = match[1].replace(/\/\*[\s\S]*?\*\//g, "");
    const jsName = match[2];
    const parts = splitTopLevelCommas(inside);
    const cppType = parts[0];
    const bases = parts
        .slice(1)
        .map((part) => part.match(/emscripten::base<(.+)>/)?.[1]?.trim())
        .filter(Boolean);
    return { cppType, jsName, bases };
}

function parseEmbind(block) {
    const moduleFunctions = [];
    const classes = [];
    let currentClass = null;

    for (const rawLine of block.split("\n")) {
        const line = rawLine.trim();
        if (!line || line.startsWith("//") || line.startsWith("/*") || line.startsWith("*")) continue;

        const moduleFn = line.match(/^emscripten::function\("([^"]+)"/);
        if (moduleFn) {
            moduleFunctions.push({ jsName: moduleFn[1], cppSymbol: extractCppSymbol(line) });
            continue;
        }

        const classDecl = parseClassDecl(line);
        if (classDecl) {
            currentClass = {
                jsName: classDecl.jsName,
                cppType: classDecl.cppType,
                bases: classDecl.bases,
                methods: [],
                properties: [],
            };
            classes.push(currentClass);
            continue;
        }

        if (currentClass) {
            const method = line.match(/^\.function\("([^"]+)"/);
            if (method) {
                currentClass.methods.push({ jsName: method[1], cppSymbol: extractCppSymbol(line) });
                continue;
            }
            const prop = line.match(/^\.property\("([^"]+)"/);
            if (prop) {
                currentClass.properties.push({
                    jsName: prop[1],
                    cppSymbol: extractCppSymbol(line),
                });
                continue;
            }
            if (line === ";") currentClass = null;
        }
    }

    return { moduleFunctions, classes };
}

function cppTypeToQualified(cppType) {
    const trimmed = cppType.trim();
    if (trimmed.startsWith("csound::")) return trimmed;
    if (trimmed === "PitvIndices") return "PitvIndices";
    return null;
}

function jsNameToMember(cppType) {
    const simple = cppType.replace(/^csound::/, "");
    if (simple.includes("vector") || simple.includes("std::")) return null;
    return simple.replace(/[^A-Za-z0-9_]/g, "") || null;
}

function lookupMemberDoc(docs, cppSymbol, { jsName, classCppType } = {}) {
    if (!cppSymbol && classCppType && jsName) {
        const className = cppTypeToQualified(classCppType);
        if (className) {
            return docs.members.get(`${className}::${jsName}`)
                || docs.members.get(`${className}::get${jsName.charAt(0).toUpperCase()}${jsName.slice(1)}`);
        }
    }
    if (cppSymbol) {
        let doc = docs.members.get(cppSymbol);
        if (!doc && classCppType && jsName) {
            const getter = `${cppTypeToQualified(classCppType)}::get${jsName.charAt(0).toUpperCase()}${jsName.slice(1)}`;
            doc = docs.members.get(getter);
        }
        return doc;
    }
    return null;
}

function anchorId(...parts) {
    return parts.join("-").replace(/[^A-Za-z0-9_-]/g, "_");
}

function emitSignature(jsName, cppSymbol) {
    const cppMethod = cppSymbol?.split("::").pop();
    if (cppSymbol && cppMethod && cppMethod !== jsName) {
        return `<code>${escapeHtml(jsName)}</code> <span class="cpp">(C++ <code>${escapeHtml(cppSymbol)}</code>)</span>`;
    }
    if (cppSymbol) {
        return `<code>${escapeHtml(jsName)}</code> <span class="cpp">(<code>${escapeHtml(cppSymbol)}</code>)</span>`;
    }
    return `<code>${escapeHtml(jsName)}</code>`;
}

function emitParamsTable(doc) {
    if (!doc?.params?.length) return "";
    const rows = doc.params.map((p) => {
        const desc = p.description ? escapeHtml(p.description) : "";
        return `<tr><td><code>${escapeHtml(p.name)}</code></td><td>${desc}</td></tr>`;
    }).join("");
    return `<table class="params"><thead><tr><th>Parameter</th><th>Description</th></tr></thead><tbody>${rows}</tbody></table>`;
}

function emitMemberSection(id, titleHtml, doc) {
    const parts = [`<section class="member" id="${escapeHtml(id)}">`];
    parts.push(`<h4>${titleHtml}</h4>`);
    const prose = formatProse(doc);
    if (prose) parts.push(prose);
    parts.push(emitParamsTable(doc));
    if (doc?.returnType) {
        parts.push(`<p class="returns"><strong>Returns:</strong> <code>${escapeHtml(doc.returnType)}</code></p>`);
    }
    parts.push("</section>");
    return parts.join("\n");
}

function emitHtmlReference({ moduleFunctions, classes, docs }) {
    const toc = [];
    const body = [];

    toc.push('<li><a href="#overview">Overview</a></li>');
    toc.push('<li><a href="#createCsoundAC">createCsoundAC()</a></li>');
    toc.push('<li><a href="#module-functions">Module functions</a><ul>');
    for (const fn of moduleFunctions) {
        toc.push(`<li><a href="#fn-${anchorId(fn.jsName)}">${escapeHtml(fn.jsName)}</a></li>`);
    }
    toc.push("</ul></li>");
    toc.push('<li><a href="#classes">Classes</a><ul>');
    for (const cls of classes) {
        toc.push(`<li><a href="#class-${anchorId(cls.jsName)}">${escapeHtml(cls.jsName)}</a></li>`);
    }
    toc.push("</ul></li>");

    body.push(`<section id="overview">
<h1>CsoundAC API Reference</h1>
<p>Algorithmic composition library for JavaScript (WebAssembly Embind build of
<a href="https://github.com/gogins/csound-ac">csound-ac</a>).
This page lists <strong>only</strong> symbols exported to JavaScript and documents them with
the C++ Doxygen comments from the source headers.</p>
<pre><code>const CsoundAC = await createCsoundAC();
globalThis.CsoundAC = CsoundAC;</code></pre>
<p>Chord-space theory:
<a href="https://github.com/gogins/csound-ac/blob/main/CHORDSPACE.md">CHORDSPACE.md</a></p>
</section>`);

    body.push(`<section id="createCsoundAC">
<h2>createCsoundAC()</h2>
<p>Emscripten factory defined in <code>CsoundAC.js</code>. Returns a Promise that resolves to
the CsoundAC module namespace described below.</p>
</section>`);

    body.push('<section id="module-functions"><h2>Module functions</h2>');
    body.push("<p>Free functions on the object returned by <code>createCsoundAC()</code>.</p>");
    for (const fn of moduleFunctions) {
        const doc = lookupMemberDoc(docs, fn.cppSymbol);
        body.push(emitMemberSection(
            `fn-${anchorId(fn.jsName)}`,
            emitSignature(fn.jsName, fn.cppSymbol),
            doc,
        ));
    }
    body.push("</section>");

    body.push('<section id="classes"><h2>Classes</h2>');
    for (const cls of classes) {
        const classQualified = cppTypeToQualified(cls.cppType);
        const classDoc = classQualified ? docs.classes.get(classQualified) : null;
        const classId = `class-${anchorId(cls.jsName)}`;
        const bases = cls.bases.map(jsNameToMember).filter(Boolean);

        body.push(`<section class="class" id="${classId}">`);
        body.push(`<h3>${escapeHtml(cls.jsName)}</h3>`);
        if (classQualified) {
            body.push(`<p class="cpp">C++ <code>${escapeHtml(classQualified)}</code></p>`);
        }
        if (bases.length) {
            body.push(`<p><strong>Extends:</strong> ${bases.map((b) => `<code>${escapeHtml(b)}</code>`).join(", ")}</p>`);
        }
        const classProse = formatProse(classDoc);
        if (classProse) body.push(classProse);

        if (cls.properties.length) {
            body.push("<h4>Properties</h4>");
            for (const prop of cls.properties) {
                const doc = lookupMemberDoc(docs, prop.cppSymbol, {
                    jsName: prop.jsName,
                    classCppType: cls.cppType,
                });
                body.push(emitMemberSection(
                    `${classId}-prop-${anchorId(prop.jsName)}`,
                    emitSignature(prop.jsName, prop.cppSymbol),
                    doc,
                ));
            }
        }

        if (cls.methods.length) {
            body.push("<h4>Methods</h4>");
            for (const method of cls.methods) {
                const doc = lookupMemberDoc(docs, method.cppSymbol, {
                    jsName: method.jsName,
                    classCppType: cls.cppType,
                });
                body.push(emitMemberSection(
                    `${classId}-method-${anchorId(method.jsName)}`,
                    emitSignature(method.jsName, method.cppSymbol),
                    doc,
                ));
            }
        }
        body.push("</section>");
    }
    body.push("</section>");

    return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>CsoundAC API Reference</title>
<style>
body { font-family: system-ui, sans-serif; line-height: 1.5; max-width: 52rem; margin: 0 auto; padding: 1.5rem; }
nav#toc { background: #f6f8fa; border: 1px solid #d8dee4; border-radius: 6px; padding: 1rem 1.25rem; margin-bottom: 2rem; }
nav#toc ul { margin: 0.25rem 0 0.5rem 1.25rem; padding: 0; }
h1, h2, h3, h4 { line-height: 1.25; }
section.class, section.member { margin: 1.25rem 0 2rem; padding-top: 0.5rem; border-top: 1px solid #e6e6e6; }
.cpp { color: #57606a; font-size: 0.92em; }
.doc p { margin: 0.75rem 0; }
table.params { border-collapse: collapse; width: 100%; margin: 0.75rem 0; font-size: 0.95em; }
table.params th, table.params td { border: 1px solid #d8dee4; padding: 0.35rem 0.5rem; text-align: left; vertical-align: top; }
table.params th { background: #f6f8fa; }
code, pre { font-family: ui-monospace, SFMono-Regular, Menlo, monospace; }
pre { background: #f6f8fa; padding: 0.75rem 1rem; border-radius: 6px; overflow-x: auto; }
</style>
</head>
<body>
<p><a href="index.html">← cloud-5 JSDoc</a></p>
<nav id="toc"><strong>Contents</strong><ul>${toc.join("\n")}</ul></nav>
<main>
${body.join("\n")}
</main>
<p class="cpp" style="margin-top:3rem">AUTO-GENERATED by <code>pnpm run generate-csoundac-jsdoc</code>. Embind surface only.</p>
</body>
</html>`;
}

function removeStaleCsoundAcJsdocArtifacts() {
    fs.mkdirSync(jsdocsDir, { recursive: true });
    if (fs.existsSync(path.join(jsdocsDir, "csound-ac"))) {
        fs.rmSync(path.join(jsdocsDir, "csound-ac"), { recursive: true, force: true });
    }
    const staleNames = new Set([
        "CsoundAC.generated.js.html",
        "CsoundAC-api.mjs.html",
        "ChordLindenmayer.html",
    ]);
    for (const name of fs.readdirSync(jsdocsDir)) {
        if (name.startsWith("CsoundAC.") || staleNames.has(name)) {
            fs.unlinkSync(path.join(jsdocsDir, name));
        }
    }
    const generatedJs = path.join(cloud5Root, "CsoundAC.generated.js");
    if (fs.existsSync(generatedJs)) {
        fs.unlinkSync(generatedJs);
    }
}

function main() {
    let embindPath;
    try {
        embindPath = resolveEmbindPath(process.argv[2]);
    } catch (err) {
        const fallback = path.join(jsdocsDir, "CsoundAC.html");
        if (fs.existsSync(fallback)) {
            console.warn(`${err.message}`);
            console.warn(`Keeping existing ${fallback}`);
            return;
        }
        throw err;
    }
    const csoundAcRoot = tryResolveCsoundAcRoot();

    let docs = { members: new Map(), classes: new Map() };
    if (csoundAcRoot) {
        docs = loadDoxygenDocs(ensureDoxygen(csoundAcRoot));
    } else {
        console.warn("csound-ac not found; listing Embind names without Doxygen prose.");
    }

    const parsed = parseEmbind(extractBindingsBlock(fs.readFileSync(embindPath, "utf8")));
    removeStaleCsoundAcJsdocArtifacts();

    const html = emitHtmlReference({ ...parsed, docs });
    const outPath = path.join(jsdocsDir, "CsoundAC.html");
    fs.writeFileSync(outPath, html, "utf8");

    console.log(
        `Wrote ${outPath} (${parsed.moduleFunctions.length} module functions, ${parsed.classes.length} classes, ${docs.members.size} Doxygen members)`,
    );
}

main();
