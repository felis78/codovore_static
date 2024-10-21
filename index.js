import('https://unpkg.com/highlighted-code').then(({default: HighlightedCode}) => {
    HighlightedCode.useTheme('monokai'); // Choisissez le thème souhaité
});

import { showToast} from "./JS/assistant.js";


document.addEventListener('DOMContentLoaded', function() {
    let codeBlocks = document.querySelectorAll('pre code');
    codeBlocks.forEach(function(block) {
        hljs.highlightElement(block);
    });
});

async function modify_dom() {
    let css = document.getElementById("CSSEditor").value;
    let html = document.getElementById("code_html").value;
    let js = document.getElementById("JSEditor").value;

    const insertZone = document.getElementById("zonedinsertion")
    while (insertZone.firstChild) {
        insertZone.removeChild(insertZone.firstChild);
    }
    Object.assign(insertZone.style, {});
    insertZone.insertAdjacentHTML("afterbegin", html);
    let styleElement = document.createElement("style");
    if (!KillForbidenJSCode(css)) {
        return false
    }
    styleElement.textContent = css;
    document.head.appendChild(styleElement);
    if (!KillForbidenJSCode(js)) {
        return false
    }
    eval(js);
}

//Modification de l'effet de la touche tab pour permettre l'indentation dans le code
function enableTabIndent(textarea) {
    textarea.onkeydown = function(e) {
        // Vérifie si la touche pressée est Tab
        if (e.keyCode === 9 || e.which === 9) {
            e.preventDefault(); // Empêche le comportement par défaut du navigateur
            var oldStart = this.selectionStart; // Sauvegarde la position initiale du curseur
            var before = this.value.substring(0, this.selectionStart); // Récupère le texte avant la sélection
            var selected = this.value.substring(this.selectionStart, this.selectionEnd); // Récupère le texte sélectionné
            var after = this.value.substring(this.selectionEnd); // Récupère le texte après la sélection
            this.value = before + "    " + selected + after; // Insère quatre espaces à la place de la touche Tab
            this.selectionEnd = oldStart + 4; // Déplace le curseur après les espaces insérés
        }
    }
}

function KillForbidenJSCode(code){
    const JSsecurityCheckRegex = /XMLHttpRequest|fetch|import|localStorage|Set-Cookie/i;
    const CSSsecurityCheckRegex = /body|textarea|title|button|input|select/i;
    if (JSsecurityCheckRegex.test(code)){
        console.log("Utilisation d'un élément de code JS interdit: XMLHttpRequest | fetch | import | localStorage | Set-Cookie")
        return false
    }
    if (CSSsecurityCheckRegex.test(code)){
        console.log("Utilisation d'un élément de code css interdit: body|textarea|title|button|input|select")
        return false
    }
    return true
}


//Emulation de la console dans le dom
function logToConsole(message) {
    const consoleElement = document.getElementById('console');
    const messageElement = document.createElement('div');
    messageElement.textContent = '> ' + message;
    consoleElement.appendChild(messageElement);
    consoleElement.scrollTop = consoleElement.scrollHeight;
}

const originalConsoleLog = console.log;
console.log = function(...args) {
    logToConsole(args.join(' '));
    originalConsoleLog.apply(console, args);
};

const originalConsoleError = console.error;
console.error = function(...args) {
    logToConsole('%c' + args.join(' '), 'color: red;');
    originalConsoleError.apply(console, args);
};

// contrôle du toast
document.addEventListener('DOMContentLoaded', () => {
    const button = document.createElement('button');
    button.textContent = "Afficher l'assistant";
    button.onclick = () => {
        const toast = document.getElementById('toast')
        if (!toast)
        {
            showToast('Assistant', 'success');
        }
    }

    document.body.appendChild(button);
});

document.addEventListener('DOMContentLoaded', () => {


})

let textarea = document.getElementById('codeEditors');
enableTabIndent(textarea)
const button = document.getElementById("button");
button.addEventListener("click", modify_dom)