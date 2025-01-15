       function updatePreview() {
            let preview = '';
            let structure = '';
            const folders = document.querySelectorAll('.folder-row');
            
            folders.forEach((folder, index) => {
                const folderName = folder.querySelector('.folder-input').value;
                if (!folderName) return;
                
                structure += `mkdir "${folderName}"\n`;
                preview += `├── ${folderName}\n`;
                
                const sub1Values = [];
                folder.querySelectorAll('[data-sub-type="1"] input').forEach(input => {
                    if (input.value) {
                        sub1Values.push(input.value);
                        structure += `mkdir "${folderName}\\${input.value}"\n`;
                        preview += `│   └── ${input.value}\n`;
                    }
                });
                
                if (index < folders.length - 1) {
                    preview += '│\n';
                }
            });
            
            document.getElementById('preview-content').textContent = preview || 'No folders added yet';
            return structure;
        }

        function deleteFolder(btn) {
            if (document.querySelectorAll('.folder-row').length === 1) {
                alert('Minimal harus ada satu folder!');
                return;
            }
            const folderRow = btn.closest('.folder-row');
            folderRow.remove();
            updateFolderNumbers();
            updatePreview();
        }

        function updateFolderNumbers() {
            const folders = document.querySelectorAll('.folder-row');
            folders.forEach((folder, index) => {
                const folderHeader = folder.querySelector('.folder-header span');
                folderHeader.textContent = `Folder ${index + 1}`;
                folder.dataset.folderId = index + 1;
            });
        }

        function addSub(btn) {
            const inputGroup = btn.parentElement;
            const subContainer = inputGroup.querySelector('.sub-container');
            
            const subItem = document.createElement('div');
            subItem.className = 'sub-item';
            
            const input = document.createElement('input');
            input.type = 'text';
            input.placeholder = 'Nama subfolder...';
            input.addEventListener('input', updatePreview);
            
            const removeBtn = document.createElement('button');
            removeBtn.className = 'remove-btn';
            removeBtn.textContent = 'X';
            removeBtn.onclick = () => {
                subItem.remove();
                updatePreview();
            };
            
            subItem.appendChild(input);
            subItem.appendChild(removeBtn);
            subContainer.appendChild(subItem);
            input.focus();
        }

        function addFolder() {
            const container = document.getElementById('folders-container');
            const folderCount = container.children.length + 1;
            
            const newRow = document.createElement('div');
            newRow.className = 'folder-row';
            newRow.dataset.folderId = folderCount;
            
            newRow.innerHTML = `
                <div class="input-group">
                    <div class="folder-header">
                        <span>Folder ${folderCount}</span>
                        <button class="delete-folder" onclick="deleteFolder(this)">Hapus</button>
                    </div>
                    <input type="text" class="folder-input" placeholder="Nama folder...">
                </div>
                <div class="input-group">
                    <div class="folder-header">
                        <span>Sub 1</span>
                    </div>
                    <div class="sub-container" data-sub-type="1"></div>
                    <button class="add-sub" onclick="addSub(this)">Tambah Sub1</button>
                </div>
            `;
            
            container.appendChild(newRow);
            newRow.querySelector('.folder-input').focus();
            addEventListeners();
        }

        function copyToClipboard() {
            const structure = updatePreview();
            if (!structure) {
                alert('Tidak ada folder untuk disalin!');
                return;
            }
            navigator.clipboard.writeText(structure).then(() => {
                const copyBtn = document.getElementById('copyBtn');
                copyBtn.textContent = 'Copied!';
                setTimeout(() => {
                    copyBtn.textContent = 'Copy to clipboard';
                }, 2000);
            });
        }

        function downloadFile(type) {
            const structure = updatePreview();
            if (!structure) {
                alert('Tidak ada folder untuk diunduh!');
                return;
            }
            const blob = new Blob([structure], { type: 'text/plain' });
            const a = document.createElement('a');
            a.href = URL.createObjectURL(blob);
            a.download = `folder_structure.${type}`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(a.href);
        }

        function addEventListeners() {
            document.querySelectorAll('input').forEach(input => {
                input.addEventListener('input', updatePreview);
            });
        }

        // Initial setup
        addEventListeners();
        updatePreview();