import markdownIt from 'https://cdn.jsdelivr.net/npm/markdown-it@14.1.0/+esm'

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
    document.getElementById('ask_gpt').value=""
    const response = await fetch('http://localhost:3000/api/messages', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question }),
    })
        .then(res => res.json())
        .then(response => {
            response.datas.data.reverse().forEach(resp => {
                divContainerGPT.innerHTML = md.render(`${resp.role} > ${resp.content[0].text.value}`)
                answer_zone.appendChild(divContainerGPT);
                answer_zone.scrollTop = answer_zone.scrollHeight;
            });
        })
}

export async function create_thread(){
    await fetch("http://localhost:3000/api/new_thread")
}

export async function delete_thread(){
    await fetch("http://localhost:3000/api/del_thread")
}

export function markdown() {
    const md = markdownIt()
    const result = md.render('Voici un exemple simple de code JavaScript qui affiche "Hello, World!" dans la console : ```javascript console.log("Hello, World!"); ```');
    console.log(result)

}