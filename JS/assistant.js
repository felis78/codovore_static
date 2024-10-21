import markdownIt from 'https://cdn.jsdelivr.net/npm/markdown-it@14.1.0/+esm'

let one_toast = 0;
let toastIdCounter = 0;

export async function showToast(message, type = 'info') {
    const toastContainer = document.getElementById('toast-container');

    const toast = document.createElement('div');
    await create_thread()
    one_toast ++
    toast.id = `toast-${toastIdCounter++}`;
    toast.className = `toast ${type}`;
    toast.innerHTML = `  <div id="toast">
        <button class="close-toast">&times;</button>
        <span>${message}</span>
        </div>
        <div class ="gpt_answer" id="gpt_answer"></div>
        <input type="text" class="ask_gpt"  id="ask_gpt" required minlength="4"
        size="100"/></div>
        <div>
        <div> Press enter to submit </div>
</div>
    `;
    toastContainer.appendChild(toast);
    toast.querySelector('.ask_gpt').addEventListener('keypress', (event) =>
    {
        if (event.key === 'Enter') {
            event.preventDefault()
            let question = document.getElementById('ask_gpt').value
            submit_to_gpt(question)
        }

    });

    toast.querySelector('.close-toast').addEventListener('click', () => {
        toast.style.animation = 'fadeOut 0.5s ease-in-out forwards';
        one_toast = 0;
        toast.remove();
        delete_thread()

    });
}

export async function submit_to_gpt(question) {
    const md = markdownIt();
    const divContainerGPT = document.createElement('div');
    divContainerGPT.style.cssText = `
    display: block;
    margin-left: 15px;
    max-width: 50rem;
    overflow: auto;
`;

    const divContainerUser =  document.createElement('div');
    divContainerUser.style.cssText = `
    display: block;
    margin-left: 15px;
    max-width: 50rem;
    overflow: auto;
    color:green;
    `

    let answer_zone = document.getElementById('gpt_answer')
    divContainerUser.innerHTML = `<p> User > ${question} </p>`
    answer_zone.appendChild(divContainerUser);
    answer_zone.scrollTop = answer_zone.scrollHeight;
    document.getElementById('ask_gpt').value=""
    await fetch('/api/messages', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question }),
    })
        .then(res => res.json())
        .then(response => {
            let array= response.datas.data[0]
            divContainerGPT.innerHTML = md.render(`${array.role} > ${array.content[0].text.value}`)
            answer_zone.appendChild(divContainerGPT);
            answer_zone.scrollTop = answer_zone.scrollHeight;
        })
}

export async function create_thread(){
    await fetch("/api/new_thread")
}

export async function delete_thread(){
    await fetch("/api/del_thread")
}

export function correct_code(code_to_correct, from_function){
    let promt = `corrige ce code ${from_function}: ${code_to_correct}`;
    submit_to_gpt(promt)
}
