document.addEventListener('DOMContentLoaded', () => {
    const uploadButton = document.getElementById('uploadButton');
    const fileInput = document.getElementById('fileInput');
    const fileList = document.getElementById('fileList');
    const uploadForm = document.getElementById('myForm');
    const loadingIndicator = document.getElementById('loadingIndicator');
    const progressBar = document.getElementById('progressBar');

    uploadButton.addEventListener('click', () => {
        fileInput.click();
    });

    fileInput.addEventListener('change', handleFileSelect);

    async function handleFileSelect(event) {
        const files = event.target.files;
        fileList.innerHTML = ''; // Clear any existing files

        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const fileElement = document.createElement('div');
            fileElement.classList.add('uploaded');

            fileElement.innerHTML = `
                <div class="file">
                    <div class="file__name">
                        <p>${file.name}</p>
                    </div>
                </div>
            `;

            fileList.appendChild(fileElement);
        }

        // Show the loading indicator and reset progress bar
        loadingIndicator.style.display = 'block';
        progressBar.style.width = '0%';
        progressBar.textContent = '0%';

        // Automatically submit the form to start the conversion
        if (files.length > 0) {
            const formData = new FormData(uploadForm);

            try {
                const xhr = new XMLHttpRequest();
                xhr.open('POST', '/convert', true);

                xhr.upload.onprogress = function(event) {
                    if (event.lengthComputable) {
                        const percentCompleted = Math.round((event.loaded / event.total) * 100);
                        progressBar.style.width = percentCompleted + '%';
                        progressBar.textContent = percentCompleted + '%';
                    }
                };

                xhr.onload = function() {
                    if (xhr.status === 200) {
                        const blob = new Blob([xhr.response], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
                        const url = window.URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = 'converted.docx'; // Default filename
                        document.body.appendChild(a);
                        a.click();
                        a.remove();
                        window.URL.revokeObjectURL(url);
                    } else {
                        console.error('Conversion error:', xhr.responseText);
                    }

                    // Hide the loading indicator after a short delay
                    setTimeout(() => {
                        loadingIndicator.style.display = 'none';
                    }, 1000);
                };

                xhr.send(formData);
            } catch (error) {
                console.error('Error during conversion:', error);
            }
        }
    }
});
