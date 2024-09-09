export default function pacman() {

    const canvas_pacman = document.querySelector(".pacman_canvas")
    const width = canvas_pacman.width
    const height = canvas_pacman.height
    const ctx = canvas_pacman.getContext('2d');

    ctx.lineWidth = 2;
    ctx.font = "50px Arial";

    ctx.fillStyle = 'rgb(222, 222, 255)';
    ctx.fillRect(0, 0, width, height);
    ctx.translate(width, height);
    const image = new Image()
    image.src = "./sheets/pacman_blanc.png";
    image.onload = draw;

    let spritePacman = 0;
    let spriteFantom1 = 0;
    let spriteFantom2 = 0;
    let spriteFantom3 = 0;

    let posXPacman = 0;
    let posXFantom1 = -30;
    let posXFantom2 = -50;
    let posXFantom3 = -30;


    function draw() {

        ctx.fillRect(-(width), -(height), width, height);

        ctx.drawImage(image, 457 + spritePacman * 16, 0, 14, 14, posXPacman, -20, 14, 14)
        ctx.drawImage(image, 457 + spriteFantom1 * 17, 65, 14, 14, posXFantom1, -85, 14, 14)
        ctx.drawImage(image, 457 + spriteFantom2 * 17, 113, 14, 14, posXFantom2, -85, 14, 14)
        ctx.drawImage(image, 457 + spriteFantom3 * 17, 96, 14, 14, posXFantom3, -20, 14, 14)

        //gestion pacman
        if (posXPacman > width) {

            let newStartPos = -(width);
            posXPacman = Math.ceil(newStartPos);
        } else {
            posXPacman += 2;
        }
        if (posXPacman % 13 === 0) {
            if (spritePacman === 2) {
                spritePacman = 0;
            } else {
                spritePacman++;
            }
        }

        //gestion fantom1
        if (posXFantom1 % 13 === 0) {
            if (spriteFantom1 === 1) {
                spriteFantom1 = 0;
            } else {
                spriteFantom1++;
            }
        }
        if (posXFantom1 > width) {
            let newStartPos = -(width);
            posXFantom1 = Math.ceil(newStartPos);
        } else {
            posXFantom1 += 2;
        }

        //gestion fantom2
        if (posXFantom2 % 13 === 0) {
            if (spriteFantom2 === 1) {
                spriteFantom2 = 0;
            } else {
                spriteFantom2++;
            }
        }

        if (posXFantom2 > width) {
            let newStartPos = -(width);
            posXFantom2 = Math.ceil(newStartPos);
        } else {
            posXFantom2 += 2;
        }

        if (posXFantom3 % 13 === 0) {
            if (spriteFantom3 === 1) {
                spriteFantom3 = 0;
            } else {
                spriteFantom3++;
            }
        }

        if (posXFantom3 > width) {
            let newStartPos = -(width);
            posXFantom3 = Math.ceil(newStartPos);
        } else {
            posXFantom3 += 2;
        }
        window.requestAnimationFrame(draw);

    }
}
