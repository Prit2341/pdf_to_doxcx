document.addEventListener('DOMContentLoaded', () => {
    const uploadButton = document.getElementById('uploadButton');
    const fileInput = document.getElementById('fileInput');
    const fileList = document.getElementById('fileList');

    uploadButton.addEventListener('click', () => {
        fileInput.click();
    });

    fileInput.addEventListener('change', handleFileSelect);

    function handleFileSelect(event) {
        const files = event.target.files;
        fileList.innerHTML = '';  // Clear any existing files
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const fileElement = document.createElement('div');
            fileElement.classList.add('uploaded');
            
            fileElement.innerHTML = `
                <i class="far fa-file"></i>
                <div class="file">
                    <div class="file__name">
                        <p>${file.name}</p>
                        <i class="fas fa-times" onclick="removeFile(this)"></i>
                    </div>
                    <div class="progress">
                        <div class="progress-bar bg-success progress-bar-striped progress-bar-animated" style="width:0%"></div>
                    </div>
                </div>
            `;
            fileList.appendChild(fileElement);

            // Simulate file upload progress
            simulateProgress(fileElement.querySelector('.progress-bar'));
        }
    }

    function simulateProgress(progressBar) {
        let width = 0;
        const interval = setInterval(() => {
            if (width >= 100) {
                clearInterval(interval);
            } else {
                width += 10;
                progressBar.style.width = width + '%';
            }
        }, 100);
    }
});

function removeFile(element) {
    const fileElement = element.closest('.uploaded');
    fileElement.remove();
}
