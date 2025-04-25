const toolbarOptions = [
    ["bold", "italic", "underline", "strike"], // toggled buttons
    ["blockquote"],
    ["link"],
    [{ list: "ordered" }, { list: "bullet" }],
    [{ align: [] }],
    [{ size: ["small", false, "large", "huge"] }], // custom dropdown
    [{ color: [] }, { background: [] }], // dropdown with defaults from theme
    ["clean"], // remove formatting button
];
const maxChars = 2000;

// var quill = new Quill("#editor", {
//     modules: {
//         toolbar: toolbarOptions,
//     },
//     theme: "snow",
// });



// document.querySelector('#btn').addEventListener('click', (e) => {
//     console.log(quill.root.innerHTML);

// })



const editorWrappers = document.querySelectorAll('.editor-wrapper');
editorWrappers.forEach(editorWrapper => {
    const editorHtmlElement = editorWrapper.querySelector('.editor-component');
    const editorCharCount = editorWrapper.querySelector('.charCount');
    const editorItem = new Quill(editorHtmlElement, {
        modules: {
            toolbar: toolbarOptions,
        },
        theme: "snow",
    });
    editorItem.on("text-change", function (delta, oldDelta, source) {
        let text = editorItem.getText();
        let length = text.length;
        editorCharCount.innerText = `${length >= maxChars ? maxChars : length
            } / ${maxChars}`;

        if (length > maxChars) {
            editorItem.deleteText(maxChars, editorItem.getLength(), "silent");
        }
    });
})

