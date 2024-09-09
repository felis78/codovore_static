export default class Templating {

     importTemplate(template_name, elementSelector) {
        fetch("templates/"+template_name+".html")
            .then(response => response.text())
            .then(template => {
                const templating = document.createElement("template");
                templating.innerHTML = template.content;
                console.log(templating);
                const clone = templating.cloneNode(true);
                document.querySelector('.'+ elementSelector).appendChild(clone);
            })
    }
}

