export default function CanvasTitle() {
    const canvas_words = document.querySelector(".words_canvas")
    const words_ctx = canvas_words.getContext('2d');
    words_ctx.font = "48px Arial";
    words_ctx.fillStyle = "#fff";
    words_ctx.strokeText("{Codovore.fr}", 40, 59)
}
