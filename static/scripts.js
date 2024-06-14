document.addEventListener('DOMContentLoaded', () => {
    const uploadButton = document.getElementById('uploadButton');
    const fileInput = document.getElementById('fileInput');
    const fileList = document.getElementById('fileList');
    const uploadForm = document.getElementById('myForm');

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

        // Automatically submit the form to start the conversion
        if (files.length > 0) {
            const formData = new FormData(uploadForm);

            try {
                const response = await fetch('/convert', {
                    method: 'POST',
                    body: formData
                });

                if (response.ok) {
                    const blob = await response.blob();
                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = 'converted.docx'; // Default filename
                    document.body.appendChild(a);
                    a.click();
                    a.remove();
                    window.URL.revokeObjectURL(url);
                } else {
                    const data = await response.json();
                    console.error('Conversion error:', data.error);
                }
            } catch (error) {
                console.error('Error during conversion:', error);
            }
        }
    }
});
