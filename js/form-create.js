const toolbarOptions = [
    ["bold", "italic", "underline", "strike"], // toggled buttons
    ["blockquote"],
    ["link"],
    [{ list: "ordered" }, { list: "bullet" }],
    ["clean"],
];


const editorsData = [];
const editorWrappers = document.querySelectorAll('.editor-wrapper');
editorWrappers.forEach(editorWrapper => {
    const editorHtmlElement = editorWrapper.querySelector('.editor-component');
    const editorCharCount = editorWrapper.querySelector('.charCount');
    const maxChars = editorHtmlElement.getAttribute('data-max-chars');
    const editorItem = new Quill(editorHtmlElement, {
        modules: {
            toolbar: toolbarOptions,
        },
        theme: "snow",
    });
    editorsData.push(editorItem);

    // Ограничиваем колличество контента в редакторе
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
    // Ограничиваем вставку контента в редактор только текстом
    editorItem.root.addEventListener('paste', function (e) {
        e.preventDefault();
        const text = (e.clipboardData || window.clipboardData).getData('text/plain');
        const selection = editorItem.getSelection();
        const position = selection ? selection.index : 0;
        editorItem.insertText(position, text);
    });

});

// Добавляем маску на поля type="tel"
const telInputs = document.querySelectorAll('input[type="tel"]');
telInputs.forEach(telInput => {
    IMask(
        telInput,
        {
            mask: '+{7}(000)000-00-00'
        }
    )
});
// Добавляем маску на поля data-field-type="number"
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

// Обработчик сброса ошибки с полей
const dataDields = document.querySelectorAll('.data-field');
dataDields.forEach(field => {
    field.addEventListener('input', () => {
        field.closest('.fg').classList.remove('err')
    })
});

// Функция проверки значения поля на тип email
function isValidEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}
// Сброс ошибок с полей согласия
const customFormAgree = document.querySelectorAll('.form-agree');
customFormAgree.forEach(el => {
    el.addEventListener('change', () => {
        el.closest('.m-check').classList.remove('err');
    })
});





// const dropzonesInits = document.querySelectorAll('[data-dropzone-item]');
// dropzonesInits.forEach(item => {
//     const acceptedFiles = item.getAttribute('data-accepted-files');
//     const maxFilesCount = +item.getAttribute('data-max-files-count');
//     const maxFilesSize = +item.getAttribute('data-max-total-size');
//     const maxFilesSizeInBites = maxFilesSize * 1024 * 1024; // МБ в байтах


//     let dropzoneInit = new Dropzone(item, {
//         url: "/upload",        // URL загрузки файлов
//         autoProcessQueue: false, // <== ОТКЛЮЧАЕМ авто-загрузку
//         uploadMultiple: maxFilesCount > 1 ? true : false,   // <== Загружаем сразу несколько файлов
//         parallelUploads: maxFilesCount, // до 3 файлов одновременно
//         maxFiles: maxFilesCount,           // Лимит файлов
//         addRemoveLinks: true, // Важно: включено добавление ссылки удаления
//         dictRemoveFile: "Удалить файл", // <== Вот здесь свой текст!
//         paramName: "files",
//         acceptedFiles: acceptedFiles,
//         previewTemplate: `
//         <div class="dz-preview dz-file-preview">
//             <div class="dz-details">
//                 <div class="dz-filename"><span data-dz-name></span></div>
//                 <div class="dz-size" data-dz-size></div>
//             </div>
//             <div class="dz-error-message"><span data-dz-errormessage></span></div>
//         </div>
//         `
//     });


//     dropzoneInit.on("addedfile", function (file) {
//         // 1. Проверка на дубликаты
//         let isDuplicate = false;
//         dropzoneInit.files.forEach(function (existingFile) {
//             if (
//                 existingFile !== file && // не проверяем сам файл
//                 existingFile.name === file.name &&  // если имя одинаковое
//                 existingFile.size === file.size   // и размер тот же
//             ) {
//                 isDuplicate = true;
//             }
//         });

//         if (isDuplicate) {
//             dropzoneInit.removeFile(file);
//             alert("Этот файл уже был загружен");
//             return; // прекращаем выполнение, если дубликат
//         }

//         // 2. Проверка на общий размер всех файлов
//         let totalSize = 0;
//         dropzoneInit.files.forEach(function (f) {
//             totalSize += f.size;
//         });

//         if (totalSize > maxFilesSizeInBites) {
//             dropzoneInit.removeFile(file);
//             alert(`Общий размер файлов не должен превышать ${maxFilesSize} МБ.`);
//         }
//     });

//     dropzoneInit.on("maxfilesexceeded", function (file) {
//         // 3. Проверка на количество файлов
//         dropzoneInit.removeFile(file);
//         alert(`Можно загрузить не более ${maxFilesCount} файлов.`);
//     });

//     dropzoneInit.on("error", function (file, message) {
//         // 4. Обработка ошибок типов файлов
//         if (message == "You can't upload files of this type.") {
//             dropzoneInit.removeFile(file);
//             alert("Неправильный формат файла.");
//         }
//     });
// });

// Инит зон для подгрузки файлов.
const dropzonesInitsArray = [];
const dropzonesInits = document.querySelectorAll('[data-dropzone-item]');
dropzonesInits.forEach(item => {
    const acceptedFiles = item.getAttribute('data-accepted-files');
    const maxFilesCount = +item.getAttribute('data-max-files-count');
    const maxFilesSize = +item.getAttribute('data-max-total-size');
    const maxFilesSizeInBytes = maxFilesSize * 1024 * 1024; // МБ в байтах

    const uploadedFiles = JSON.parse(item.getAttribute('data-uploaded-files') || '[]');

    let existingFiles = []; // загруженные на сервере файлы
    let dropzoneInit = new Dropzone(item, {
        url: "/upload",
        autoProcessQueue: false,
        uploadMultiple: maxFilesCount > 1,
        parallelUploads: maxFilesCount,
        maxFiles: maxFilesCount,
        addRemoveLinks: true,
        dictRemoveFile: "Удалить файл",
        paramName: "files",
        acceptedFiles: acceptedFiles,
        previewTemplate: `
        <div class="dz-preview dz-file-preview">
            <div class="dz-details">
                <div class="dz-filename"><span data-dz-name></span></div>
                <div class="dz-size" data-dz-size></div>
            </div>
            <div class="dz-error-message"><span data-dz-errormessage></span></div>
        </div>
        `
    });


    //  Добавляем уже загруженные файлы
    if (uploadedFiles.length > 0) {
        uploadedFiles.forEach(fileData => {
            let mockFile = {
                name: fileData.name,
                size: fileData.size,
                accepted: true
            };

            dropzoneInit.emit("addedfile", mockFile);
            dropzoneInit.emit("thumbnail", mockFile, fileData.url);
            dropzoneInit.emit("complete", mockFile);

            mockFile.serverId = fileData.id || null;
            existingFiles.push(mockFile);
        });
    }
    dropzoneInit.existingFiles = existingFiles;

    // Функция подсчёта общего размера всех файлов
    function getTotalSize() {
        let size = 0;
        existingFiles.forEach(file => size += file.size);
        dropzoneInit.files.forEach(file => size += file.size);
        return size;
    }

    // Функция подсчёта общего количества файлов
    function getTotalFilesCount() {
        return existingFiles.length + dropzoneInit.files.length;
    }

    dropzoneInit.on("addedfile", function (file) {
        // Проверка на дубликаты
        let isDuplicate = false;

        // среди уже загруженных файлов
        existingFiles.forEach(existingFile => {
            if (existingFile.name === file.name && existingFile.size === file.size) {
                isDuplicate = true;
            }
        });

        // среди файлов в очереди
        dropzoneInit.files.forEach(existingFile => {
            if (existingFile !== file && existingFile.name === file.name && existingFile.size === file.size) {
                isDuplicate = true;
            }
        });

        if (isDuplicate) {
            dropzoneInit.removeFile(file);
            alert("Этот файл уже был загружен.");
            return;
        }

        // Проверка на количество файлов
        if (getTotalFilesCount() > maxFilesCount) {
            dropzoneInit.removeFile(file);
            alert(`Можно загрузить не более ${maxFilesCount} файлов.`);
            return;
        }

        // Проверка на общий размер файлов
        if (getTotalSize() > maxFilesSizeInBytes) {
            dropzoneInit.removeFile(file);
            alert(`Общий размер файлов не должен превышать ${maxFilesSize} МБ.`);
            return;
        }
    });

    dropzoneInit.on("maxfilesexceeded", function (file) {
        dropzoneInit.removeFile(file);
        alert(`Можно загрузить не более ${maxFilesCount} файлов.`);
    });

    dropzoneInit.on("error", function (file, message) {
        if (message === "You can't upload files of this type.") {
            dropzoneInit.removeFile(file);
            alert("Неправильный формат файла.");
        }
    });

    dropzoneInit.on("removedfile", function (file) {
        if (file.serverId) {
            // Удаляем старый файл из existingFiles
            existingFiles = existingFiles.filter(f => f !== file);
            console.log(`Файл с id ${file.serverId} будет удалён с сервера`);
            dropzoneInit.existingFiles = existingFiles;
        } else {
            console.log(`Файл "${file.name}" удалён из очереди`);
        }

        setTimeout(() => {
            const totalFilesCount = existingFiles.length + dropzoneInit.files.length;

            if (totalFilesCount === 0) {
                dropzoneInit.element.classList.remove('dz-started');
            } else {
                dropzoneInit.element.classList.add('dz-started');
            }
        }, 10); //
    });

    dropzonesInitsArray.push({
        zoneInit: dropzoneInit
    });
});



document.addEventListener('click', (e) => {
    const target = e.target;
    if (target.closest('#submit-request')) {
        e.preventDefault();
        // Проверка полей согласия обработки персональных данных 
        customFormAgree.forEach(el => !el.checked && el.closest('.m-check').classList.add('err'))

        // Проверяем редакторы на наличе контента
        editorsData.forEach(editor => {
            const isRequiredEditor = editor.container.getAttribute('data-req');
            if (isRequiredEditor == 'false') return;
            const editorValue = editor.getText().trim();
            if (!editorValue) {
                editor.container.closest('.editor-wrapper').classList.add('err')
            }
        });
        // Валидация полей согласно их типу
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
            return;
        }
    }
});

