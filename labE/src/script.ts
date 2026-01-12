
type StyleKey = "style1" | "style2" | "style3";

interface Style {
    readonly name: string;
    readonly file: string;
}

interface AppState {
    currentStyle: StyleKey;
    currentFile: string;
    readonly styles: Readonly<Record<StyleKey, Style>>;
}

const state: AppState = {
    currentStyle: "style1",
    currentFile: "/public/style-1.css",
    styles: {
        style1: { name: "Style 1", file: "/public/style-1.css" },
        style2: { name: "Style 2", file: "/public/style-2.css" },
        style3: { name: "Style 3", file: "/public/style-3.css"}
    }
};

const STYLE_LINK_ID: string = "style-link";
const STYLE_NAV_ID: string = "style-nav";

function addLink(href: string): HTMLLinkElement
{
    const current = document.getElementById(STYLE_LINK_ID);
    if (current && current instanceof HTMLLinkElement) {
        current.href = href;
        return current;
    }

    const link: HTMLLinkElement = document.createElement("link");
    link.id = STYLE_LINK_ID;
    link.rel = "stylesheet";
    link.type = "text/css";
    link.href = href;
    document.head.appendChild(link);
    return link;
}

function removeLink(): void
{
    const el = document.getElementById(STYLE_LINK_ID);
    if (el && el.parentNode) el.parentNode.removeChild(el);
}

function setStyle(newStyle: StyleKey): void
{
    if (newStyle === state.currentStyle)  {
        return;
    }

    const style = state.styles[newStyle];

    removeLink();
    addLink(style.file);

    state.currentStyle = newStyle;
    state.currentFile = style.file;

    drawLinks();
}

function drawLinks(): void
{
    let styleNav = document.getElementById(STYLE_NAV_ID);
    if (!styleNav) {
        styleNav = document.createElement("nav");
        styleNav.id = STYLE_NAV_ID;
        document.body.prepend(styleNav);
    }
    styleNav.replaceChildren();

    const list = document.createElement("ul");
    for (const key of Object.keys(state.styles) as StyleKey[]) {
        const style = state.styles[key];

        const li = document.createElement("li");
        const a = document.createElement("a");
        a.href = "#";
        a.textContent = key === state.currentStyle ? `${style.name} (active)` : style.name;

        a.addEventListener("click", (e: MouseEvent) => {
            e.preventDefault();
            setStyle(key);
        });

        li.appendChild(a);
        list.appendChild(li);
    }
    styleNav.appendChild(list);
}

function init(): void
{
    addLink(state.currentFile);
    drawLinks();
}

init();
