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


const editorsData = [];
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
    editorsData.push(editorItem);
    editorItem.on("text-change", function (delta, oldDelta, source) {
        editorWrapper.classList.remove('err');
        let text = editorItem.getText();
        let length = text.trim().length;
        editorCharCount.innerText = `${length >= maxChars ? maxChars : length
            } / ${maxChars}`;

        if (length > maxChars) {
            editorItem.deleteText(maxChars, editorItem.getLength(), "silent");
        }
    });
});


const telInputs = document.querySelectorAll('input[type="tel"]');
telInputs.forEach(telInput => {
    IMask(
        telInput,
        {
            mask: '+{7}(000)000-00-00'
        }
    )
});

const numberInputs = document.querySelectorAll('[data-field-type="number"]');
numberInputs.forEach(numberInput => {
    IMask(
        numberInput,
        {
            mask: Number,
            thousandsSeparator: ' ',
            autofix: true,
        });
});

// Обработчик сьроса ошибки с поля
const dataDields = document.querySelectorAll('.data-field');
dataDields.forEach(field => {
    field.addEventListener('input', () => {
        field.closest('.fg').classList.remove('err')
    })
});


function isValidEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}


document.addEventListener('click', (e) => {
    const target = e.target;
    if (target.closest('#submit-request')) {
        e.preventDefault();
        // Проверяем редакторы на наличе контента
        editorsData.forEach(editor => {
            const editorValue = editor.getText().trim();
            if (!editorValue) {
                editor.container.closest('.editor-wrapper').classList.add('err')
            }
        });
        // Валидация полей
        const dataFields = document.querySelectorAll('.data-field');
        dataFields.forEach(field => {

            const fieldParent = field.closest('.fg');
            if (field.hasAttribute('required')) {
                if (field.type == 'text' && field.value.trim().length < 1) {
                    fieldParent.classList.add('err');
                }
                if (field.type == 'tel' && field.value.length < 16) {
                    fieldParent.classList.add('err');
                }

                if (field.type == 'email' && !isValidEmail(field.value)) {
                    fieldParent.classList.add('err');
                }
            }
        });

        const errField = document.querySelector('.err');
        if (errField) {
            errField.scrollIntoView({ behavior: "smooth", block: "center" });
        }
    }
});