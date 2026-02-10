let educationCount = 0;
let experienceCount = 0;
let customBlockCount = 0;

window.onload = function() {
    addEducation();
    addExperience();

    document.getElementById('resumeForm').addEventListener('submit', handleFormSubmit);
};

function addEducation() {
    educationCount++;
    const container = document.getElementById('educationList');
    const entryDiv = document.createElement('div');
    entryDiv.className = 'entry-item';
    entryDiv.id = `education-${educationCount}`;
    entryDiv.innerHTML = `
        <div class="entry-header">
            <h4>Education Entry ${educationCount}</h4>
            ${educationCount > 1 ? `<button type="button" class="btn-remove" onclick="removeEntry('education-${educationCount}')">Remove</button>` : ''}
        </div>
        <div class="form-row">
            <div class="form-group">
                <label>University / Institution</label>
                <input type="text" class="edu-university" required>
            </div>
            <div class="form-group">
                <label>Year</label>
                <input type="text" class="edu-year" placeholder="e.g., 2018-2022" required>
            </div>
        </div>
        <div class="form-group">
            <label>Degree / Program</label>
            <input type="text" class="edu-degree" required>
        </div>
        <div class="form-group">
            <label>Description</label>
            <textarea class="edu-description" rows="2"></textarea>
        </div>
    `;
    container.appendChild(entryDiv);
}

function addExperience() {
    experienceCount++;
    const container = document.getElementById('experienceList');
    const entryDiv = document.createElement('div');
    entryDiv.className = 'entry-item';
    entryDiv.id = `experience-${experienceCount}`;
    entryDiv.innerHTML = `
        <div class="entry-header">
            <h4>Experience Entry ${experienceCount}</h4>
            ${experienceCount > 1 ? `<button type="button" class="btn-remove" onclick="removeEntry('experience-${experienceCount}')">Remove</button>` : ''}
        </div>
        <div class="form-row">
            <div class="form-group">
                <label>Company</label>
                <input type="text" class="exp-company">
            </div>
            <div class="form-group">
                <label>Year</label>
                <input type="text" class="exp-year" placeholder="e.g., 2020-2023">
            </div>
        </div>
        <div class="form-group">
            <label>Role / Position</label>
            <input type="text" class="exp-role">
        </div>
        <div class="form-group">
            <label>Description</label>
            <textarea class="exp-description" rows="3"></textarea>
        </div>
    `;
    container.appendChild(entryDiv);
}

function removeEntry(id) {
    const element = document.getElementById(id);
    if (element) {
        element.remove();
    }
}

function addCustomBlock() {
    customBlockCount++;
    const container = document.getElementById('customBlocksList');
    const blockDiv = document.createElement('div');
    blockDiv.className = 'entry-item';
    blockDiv.id = `customblock-${customBlockCount}`;
    blockDiv.innerHTML = `
        <div class="entry-header">
            <h4>Custom Section ${customBlockCount}</h4>
            <button type="button" class="btn-remove" onclick="removeEntry('customblock-${customBlockCount}')">Remove</button>
        </div>
        <div class="form-group">
            <label>Section Title</label>
            <input type="text" class="custom-title" placeholder="e.g., Awards, Certifications, Achievements">
        </div>
        <div class="form-group">
            <label>Content</label>
            <textarea class="custom-content" rows="4" placeholder="Enter your section content"></textarea>
        </div>
    `;
    container.appendChild(blockDiv);
}

function handleFormSubmit(e) {
    e.preventDefault();

    const formData = {
        fullName: document.getElementById('fullName').value,
        jobTitle: document.getElementById('jobTitle').value,
        phone: document.getElementById('phone').value,
        email: document.getElementById('email').value,
        location: document.getElementById('location').value,
        summary: document.getElementById('summary').value,
        education: [],
        experience: [],
        skills: document.getElementById('skills').value.split(',').map(s => s.trim()).filter(s => s),
        customBlocks: []
    };

    document.querySelectorAll('#educationList .entry-item').forEach(item => {
        formData.education.push({
            university: item.querySelector('.edu-university').value,
            year: item.querySelector('.edu-year').value,
            degree: item.querySelector('.edu-degree').value,
            description: item.querySelector('.edu-description').value
        });
    });

    document.querySelectorAll('#experienceList .entry-item').forEach(item => {
        const company = item.querySelector('.exp-company').value;
        if (company) {
            formData.experience.push({
                company: company,
                year: item.querySelector('.exp-year').value,
                role: item.querySelector('.exp-role').value,
                description: item.querySelector('.exp-description').value
            });
        }
    });

    document.querySelectorAll('#customBlocksList .entry-item').forEach(item => {
        const title = item.querySelector('.custom-title').value;
        if (title) {
            formData.customBlocks.push({
                title: title,
                content: item.querySelector('.custom-content').value
            });
        }
    });

    localStorage.setItem('resumeData', JSON.stringify(formData));

    displayResume(formData);
}

function displayResume(data) {
    document.getElementById('preview-name').textContent = data.fullName;
    document.getElementById('preview-title').textContent = data.jobTitle;
    document.getElementById('preview-phone').textContent = data.phone;
    document.getElementById('preview-email').textContent = data.email;
    document.getElementById('preview-location').textContent = data.location;
    document.getElementById('preview-summary').textContent = data.summary;

    const educationHTML = data.education.map(edu => `
        <div class="entry">
            <div class="entry-title">${edu.university}</div>
            <div class="entry-year">${edu.year}</div>
            <div class="entry-subtitle">${edu.degree}</div>
            ${edu.description ? `<div class="entry-description">${edu.description}</div>` : ''}
        </div>
    `).join('');
    document.getElementById('preview-education').innerHTML = educationHTML;

    const experienceHTML = data.experience.map(exp => `
        <div class="entry">
            <div class="entry-title">${exp.company}</div>
            <div class="entry-year">${exp.year}</div>
            <div class="entry-subtitle">${exp.role}</div>
            ${exp.description ? `<div class="entry-description">${exp.description}</div>` : ''}
        </div>
    `).join('');

    const experienceSection = document.getElementById('preview-experience').parentElement;
    if (data.experience.length === 0) {
        experienceSection.style.display = 'none';
    } else {
        experienceSection.style.display = 'block';
        document.getElementById('preview-experience').innerHTML = experienceHTML;
    }

    const skillsHTML = data.skills.map(skill => `<span class="skill-tag">${skill}</span>`).join('');
    document.getElementById('preview-skills').innerHTML = skillsHTML;

    const customBlocksHTML = (data.customBlocks && data.customBlocks.length > 0) ? data.customBlocks.map(block => `
        <div class="resume-section">
            <h3 class="section-title">${block.title}</h3>
            <p style="margin: 0;">${block.content.replace(/\n/g, '<br>')}</p>
        </div>
    `).join('') : '';
    document.getElementById('preview-custom-blocks').innerHTML = customBlocksHTML;

    document.getElementById('formSection').style.display = 'none';
    document.getElementById('previewSection').style.display = 'block';
    window.scrollTo(0, 0);
}

function backToForm() {
    document.getElementById('formSection').style.display = 'block';
    document.getElementById('previewSection').style.display = 'none';
    window.scrollTo(0, 0);
}

function loadFromStorage() {
    const savedData = localStorage.getItem('resumeData');
    if (!savedData) {
        alert('No saved data found!');
        return;
    }

    const data = JSON.parse(savedData);

    document.getElementById('fullName').value = data.fullName;
    document.getElementById('jobTitle').value = data.jobTitle;
    document.getElementById('phone').value = data.phone;
    document.getElementById('email').value = data.email;
    document.getElementById('location').value = data.location;
    document.getElementById('summary').value = data.summary;
    document.getElementById('skills').value = data.skills.join(', ');

    document.getElementById('educationList').innerHTML = '';
    educationCount = 0;
    data.education.forEach((edu, index) => {
        addEducation();
        const item = document.querySelectorAll('#educationList .entry-item')[index];
        item.querySelector('.edu-university').value = edu.university;
        item.querySelector('.edu-year').value = edu.year;
        item.querySelector('.edu-degree').value = edu.degree;
        item.querySelector('.edu-description').value = edu.description;
    });

    document.getElementById('experienceList').innerHTML = '';
    experienceCount = 0;
    data.experience.forEach((exp, index) => {
        addExperience();
        const item = document.querySelectorAll('#experienceList .entry-item')[index];
        item.querySelector('.exp-company').value = exp.company;
        item.querySelector('.exp-year').value = exp.year;
        item.querySelector('.exp-role').value = exp.role;
        item.querySelector('.exp-description').value = exp.description;
    });

    if (data.customBlocks && data.customBlocks.length > 0) {
        document.getElementById('customBlocksList').innerHTML = '';
        customBlockCount = 0;
        data.customBlocks.forEach((block, index) => {
            addCustomBlock();
            const item = document.querySelectorAll('#customBlocksList .entry-item')[index];
            item.querySelector('.custom-title').value = block.title;
            item.querySelector('.custom-content').value = block.content;
        });
    }

    alert('Data loaded successfully!');
}

function downloadPDF() {
    const element = document.getElementById('resumePreview');
    const opt = {
        margin: 0,
        filename: `${document.getElementById('preview-name').textContent}_Resume.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };

    html2pdf().set(opt).from(element).save();
}
