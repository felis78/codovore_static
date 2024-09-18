import('https://unpkg.com/highlighted-code').then(({default: HighlightedCode}) => {
    HighlightedCode.useTheme('monokai'); // Choisissez le thème souhaité
});

import {submit_to_gpt, delete_thread, create_thread} from "./JS/assistant.js";


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

let one_toast = 0;
let toastIdCounter = 0;
async function showToast(message, type = 'info') {
    const toastContainer = document.getElementById('toast-container');

    const toast = document.createElement('div');
    await create_thread()
    one_toast ++
    toast.id = `toast-${toastIdCounter++}`;
    toast.className = `toast ${type}`;
    toast.innerHTML = `  <div>
        <button class="close-toast">&times;</button>
        <span>${message}</span>
        </div>
        <div class ="gpt_answer" id="gpt_answer"></div>
        <input type="text" class="ask_gpt"  id="ask_gpt" required minlength="4"
        size="100"/></div>
        <div>
        <button class="submit_gpt" id="submit_gpt">Submit</button>
</div>
    `;
    toastContainer.appendChild(toast);
    toast.querySelector('.submit_gpt').addEventListener('click', () =>
    {
        let question = document.getElementById('ask_gpt').value
        submit_to_gpt(question)
    });

    toast.querySelector('.close-toast').addEventListener('click', () => {
        toast.style.animation = 'fadeOut 0.5s ease-in-out forwards';
        one_toast = 0;
        toast.remove();
        delete_thread()

    });
}
// contrôle du toast
document.addEventListener('DOMContentLoaded', () => {
    const button = document.createElement('button');
    button.textContent = "Afficher l'assistant";
    button.onclick = () => {
        if (one_toast === 0)
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

//### Instructions: - You are a world class coding assistant.
// - Given the current text, context, and the last character of the user input, provide a suggestion for code completion.
// - The suggestion must be based on the current text, as well as the text before the cursor.
// - This is not a conversation, so please do not ask questions or prompt for additional information. ### Notes
// - NEVER INCLUDE ANY MARKDOWN IN THE RESPONSE - THIS MEANS CODEBLOCKS AS WELL.
// - Never include any annotations such as "# Suggestion:" or "# Suggestions:".
// - Newlines should be included after any of the following characters: "{", "[", "(", ")", "]", "}", and ",".
// - Never suggest a newline after a space or newline. - Ensure that newline suggestions follow the same indentation as the current line.
// - The suggestion must start with the last character of the current user input.
// - Only ever return the code snippet, do not return any markdown unless it is part of the code snippet.
// - Do not return any code that is already present in the current text.
// - Do not return anything that is not valid code.
// - If you do not have a suggestion, return an empty string.`,