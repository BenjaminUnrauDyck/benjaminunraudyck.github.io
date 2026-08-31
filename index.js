import {
    Name, LastName, FullName, mail, metaTitle, metaDescription, metaKeywords, metaAuthor, contactInfo, githubUsername, /*bio,*/ /*languages,*/ certifications, /*education, experience,*/ footer, footerLinks, skills, testimonials
} from './data.js';
import { URLs } from './user-data/urls.js';
import { translations } from './translations.js';


const enableLogging = true; // Set this to false to disable logs

/**
 * Set the meta tags and title dynamically
 */
function setMetaTags() {
    if (enableLogging) console.log('Setting meta tags');
    document.title = metaTitle;
    document.querySelector('meta[name="description"]').setAttribute('content', metaDescription);
    document.querySelector('meta[name="keywords"]').setAttribute('content', metaKeywords);
    document.querySelector('meta[name="author"]').setAttribute('content', metaAuthor);
}

/**
 * Improved element creation function that can also attach events.
 */
function createElement(type, { className, text, style, attributes, events, children } = {}) {
    if (enableLogging) console.log(`Creating element: ${type}, className: ${className}`);
    const element = document.createElement(type);
    if (className) element.className = className;
    if (text) element.textContent = text;
    if (style) element.setAttribute('style', style);
    Object.entries(attributes || {}).forEach(([key, value]) => element.setAttribute(key, value));
    Object.entries(events || {}).forEach(([event, handler]) => element.addEventListener(event, handler));
    (children || []).forEach(child => element.appendChild(createElement(...child)));
    return element;
}

/**
 * Function to handle generic container population.
 */
function populateContainer(containerId, items, createElementCallback) {
    const container = document.getElementById(containerId);
    if (!container) {
        console.error(`No container found with ID ${containerId}`);
        return;
    }
    container.innerHTML = ''; // Clear container
    items.forEach((item, index) => {
        if (enableLogging) console.log(`Appending item to container: ${containerId}, item:`, item, 'index:', index);
        container.appendChild(createElementCallback(item, index));
    });
}

/**
 * Example of a generic createElementCallback
 */
function createBioItem(item) {
    return createElement('p', { text: item });
}

/**
 * Creates a language skill element with a progress bar.
 */
function createLanguageSkillElement(language) {
    if (enableLogging) console.log('Creating language skill element:', language);
    const { skillName, color, percentage } = language;
    const skillContainer = createElement('div', {
        className: 'col-md-6',
        children: [
            ['div', {
                className: 'progress-wrap',
                children: [
                    ['h3', { text: skillName }],
                    ['div', {
                        className: 'progress',
                        children: [
                            ['div', {
                                className: `progress-bar color-${color}`,
                                attributes: { style: `width: ${percentage}%` }
                            }]
                        ]
                    }]
                ]
            }]
        ]
    });
    return skillContainer;
}

function createSkillItem(skill) {
    if (enableLogging) console.log('Creating skill item:', skill);
    const { skillName, imagePath, description } = skill;

    const listItem = document.createElement('li');
    listItem.className = 'skill-item';

    if (imagePath) {
        const image = document.createElement('img');
        image.className = 'skill-logo';
        image.setAttribute('src', imagePath);
        image.setAttribute('alt', `Logo of ${skillName}`);
        image.setAttribute('loading', 'lazy');
        listItem.appendChild(image);
    }

    const skillNameSpan = document.createElement('span');
    skillNameSpan.className = 'skill-name';
    skillNameSpan.textContent = skillName;
    listItem.appendChild(skillNameSpan);

    const descriptionP = document.createElement('p');
    descriptionP.className = 'skill-description';
    descriptionP.textContent = description || '';  // Set to empty string if no description
    listItem.appendChild(descriptionP);

    return listItem;
}

function createCertificationItem(certification) {
    if (enableLogging) console.log('Creating certification item:', certification);
    const { certificationName = '', image = '', preview = '#', description = '' } = certification || {};

    const certificationCard = document.createElement('li');
    certificationCard.className = 'skill-item';

    const link = document.createElement('a');
    link.setAttribute('href', preview);
    link.setAttribute('target', '_blank');
    certificationCard.appendChild(link);

    if (image) {
        const img = document.createElement('img');
        img.setAttribute('src', image);
        img.setAttribute('alt', `Image of ${certificationName}`);
        img.setAttribute('class', 'certification-img');
        img.setAttribute('loading', 'lazy');
        link.appendChild(img);
    }

    const nameElement = document.createElement('h4');
    nameElement.textContent = certificationName;
    nameElement.className = 'skill-name';
    link.appendChild(nameElement);

    if (description) {
        const descriptionElement = document.createElement('p');
        descriptionElement.textContent = description;
        link.appendChild(descriptionElement);
    }

    return certificationCard;
}

function createExperienceItem(experience) {
    if (enableLogging) console.log('Creating experience item:', experience);
    const { title, subtitle, duration, details, tags, icon } = experience;

    const experienceEntry = document.createElement('article');
    experienceEntry.className = 'timeline-entry animate-box fadeInUp animated';

    const timelineInner = document.createElement('div');
    timelineInner.className = 'timeline-entry-inner';

    const timelineIcon = document.createElement('div');
    timelineIcon.className = 'timeline-icon color-3';
    const iconElement = document.createElement('i');
    iconElement.className = `fa ${icon}`;
    timelineIcon.appendChild(iconElement);

    const timelineLabel = document.createElement('div');
    timelineLabel.className = 'timeline-label';

    const titleHTML = document.createElement('h2');
    titleHTML.innerHTML = `${title} <span class="timeline-sublabel">${subtitle}</span>`;
    timelineLabel.appendChild(titleHTML);

    const durationSpan = document.createElement('span');
    durationSpan.className = 'duration';
    durationSpan.textContent = duration;
    timelineLabel.appendChild(durationSpan);

    details.forEach(detail => {
        const detailParagraph = document.createElement('p');
        detailParagraph.className = 'timeline-text';
        detailParagraph.textContent = detail;
        timelineLabel.appendChild(detailParagraph);
    });

    const tagsDiv = document.createElement('div');
    tags.forEach(tag => {
        const tagSpan = document.createElement('span');
        tagSpan.className = 'badge badge-secondary';
        tagSpan.textContent = tag;
        tagsDiv.appendChild(tagSpan);
    });
    timelineLabel.appendChild(tagsDiv);

    timelineInner.appendChild(timelineIcon);
    timelineInner.appendChild(timelineLabel);
    experienceEntry.appendChild(timelineInner);

    return experienceEntry;
}

function createEducationItem(education) {
    if (enableLogging) console.log('Creating education item:', education);
    const { title, subtitle, duration, details, tags, icon } = education;

    const educationEntry = document.createElement('article');
    educationEntry.className = 'timeline-entry animate-box fadeInUp animated';

    const timelineInner = document.createElement('div');
    timelineInner.className = 'timeline-entry-inner';

    const timelineIcon = document.createElement('div');
    timelineIcon.className = 'timeline-icon color-3';
    const iconElement = document.createElement('i');
    iconElement.className = `fa ${icon}`;
    timelineIcon.appendChild(iconElement);

    const timelineLabel = document.createElement('div');
    timelineLabel.className = 'timeline-label';

    const titleHTML = document.createElement('h2');
    titleHTML.innerHTML = `${title} <span class="timeline-sublabel">${subtitle}</span>`;
    timelineLabel.appendChild(titleHTML);

    const durationSpan = document.createElement('span');
    durationSpan.className = 'duration';
    durationSpan.textContent = duration;
    timelineLabel.appendChild(durationSpan);

    details.forEach(detail => {
        const detailParagraph = document.createElement('p');
        detailParagraph.className = 'timeline-text';
        detailParagraph.textContent = detail;
        timelineLabel.appendChild(detailParagraph);
    });

    const tagsDiv = document.createElement('div');
    tags.forEach(tag => {
        const tagSpan = document.createElement('span');
        tagSpan.className = 'badge badge-secondary';
        tagSpan.textContent = tag;
        tagsDiv.appendChild(tagSpan);
    });
    timelineLabel.appendChild(tagsDiv);

    timelineInner.appendChild(timelineIcon);
    timelineInner.appendChild(timelineLabel);
    educationEntry.appendChild(timelineInner);

    return educationEntry;
}

/**
 * Creates an HTML element for a testimonial.
 * @param {Object} testimonial - An object containing the title and detail of a testimonial.
 * @param {boolean} isActive - A boolean indicating if the testimonial is active.
 * @returns {HTMLElement} - A DOM element representing the testimonial.
 */
function createTestimonialElement(testimonial, isActive) {
    if (enableLogging) console.log('Creating testimonial element:', testimonial, 'isActive:', isActive);
    const wrapper = document.createElement('div');
    wrapper.className = `carousel-item ${isActive ? 'active' : ''}`;

    const contentWrapper = document.createElement('div');
    contentWrapper.className = 'carousel-content';

    const title = document.createElement('h3');
    title.textContent = testimonial.title;
    title.className = 'testimonial-title';

    const detail = document.createElement('p');
    detail.textContent = testimonial.detail;
    detail.className = 'testimonial-detail';

    contentWrapper.appendChild(title);
    contentWrapper.appendChild(detail);
    wrapper.appendChild(contentWrapper);

    return wrapper;
}

function createFooterItem(item) {
    if (enableLogging) console.log('Creating footer item:', item);
    const { label, data } = item;

    if (label === "copyright-text") {
        const copyrightDiv = document.createElement('div');
        data.forEach(text => {
            const paragraph = document.createElement('p');
            paragraph.innerHTML = text;
            copyrightDiv.appendChild(paragraph);
        });
        return copyrightDiv;
    } else {
        const colDiv = document.createElement('div');
        colDiv.className = 'col';

        const colTitle = document.createElement('p');
        colTitle.className = 'col-title';
        colTitle.textContent = label;
        colDiv.appendChild(colTitle);

        const nav = document.createElement('nav');
        nav.className = 'col-list';
        const ul = document.createElement('ul');
        data.forEach(linkItem => {
            const li = document.createElement('li');
            const a = document.createElement('a');
            a.textContent = linkItem.text;
            if (linkItem.link) {
                a.setAttribute('href', linkItem.link);
                if (linkItem.target) {
                    a.setAttribute('target', linkItem.target);
                }
            }
            if (linkItem.func) {
                a.addEventListener('click', window[linkItem.func]);
            }
            li.appendChild(a);
            ul.appendChild(li);
        });
        nav.appendChild(ul);
        colDiv.appendChild(nav);

        return colDiv;
    }
}

/**
 * Create and return a GitHub card element.
 
function createGitHubCard(username) {
    if (enableLogging) console.log('Creating GitHub card for username:', username);
    const githubCardDiv = document.getElementById('github-card');
    githubCardDiv.setAttribute('username', username);
    return githubCardDiv;
}*/

/**
 * Create and return a category element.
 */
function createCategoryElement(categoryName, items, createItemCallback) {
    if (enableLogging) console.log('Creating category element:', categoryName);
    const listItem = createElement('li');
    const linkDiv = createElement('div', { className: 'link', children: [['p', { text: categoryName, style: 'margin-bottom: 0px; cursor: pointer;' }]] });
    const sublist = createElement('ul', { className: 'submenu', style: 'display: none;' });

    listItem.appendChild(linkDiv);
    listItem.appendChild(sublist);

    // Populate the sublist with items
    items.forEach(item => {
        sublist.appendChild(createItemCallback(item));
    });

    // Add click event to toggle the submenu display
    linkDiv.addEventListener('click', () => {
        const isDisplayed = sublist.style.display === 'flex' || sublist.style.display === '';
        sublist.style.display = isDisplayed ? 'none' : 'flex';
    });

    return listItem;
}

/**
 * A unified fetch function to handle all data retrieval needs.
 */
async function fetchData(url, handleData) {
    if (enableLogging) console.log('Fetching data from URL:', url);
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        handleData(data);
    } catch (error) {
        console.error(`Error fetching data: ${error.message}`);
    }
}

function mapBasicResponse(response) {
    const { basics } = response;
    const { name, label, image, email, phone, url, summary, profiles, headline, blog, yearsOfExperience, username, locationAsString, region, karma, id, followers, following, picture, website } = basics;
    if (enableLogging) console.log('Mapping basic response:', basics);
    window.parent.document.title = name;
}
function initializeCarousel(carouselSelector, prevButtonSelector, nextButtonSelector, interval = 3000, enableLogging = false) {
    const carouselElement = $(carouselSelector);
    carouselElement.carousel({
        interval: interval
    });

    document.getElementById(prevButtonSelector).addEventListener('click', () => {
        if (enableLogging) console.log('Previous testimonial button clicked');
        carouselElement.carousel('prev');
        carouselElement.carousel('pause');
    });

    document.getElementById(nextButtonSelector).addEventListener('click', () => {
        if (enableLogging) console.log('Next testimonial button clicked');
        carouselElement.carousel('next');
        carouselElement.carousel('pause');
    });

    document.addEventListener('click', (event) => {
        const isClickInside = event.target.closest(`#${prevButtonSelector}`) || event.target.closest(`#${nextButtonSelector}`);
        if (!isClickInside) {
            if (enableLogging) console.log('Click outside navigation buttons, resuming carousel');
            carouselElement.carousel('cycle');
        }
    });
}

function populateTestimonials(containerId, testimonials, enableLogging = false) {
    if (enableLogging) console.log('Populating testimonials');
    populateContainer(containerId, testimonials, (item, index) => {
        if (enableLogging) console.log('Creating testimonial item:', item, 'at index:', index);
        return createTestimonialElement(item, index === 0);
    });
}

function populateSkillsAccordion(containerId, skills, enableLogging = false) {
    const skillsAccordion = document.getElementById(containerId);
    Object.keys(skills).forEach(category => {
        if (skills[category]) {
            const categoryElement = createCategoryElement(category.replace(/_/g, ' '), skills[category], createSkillItem);
            skillsAccordion.appendChild(categoryElement);
        } else {
            if (enableLogging) console.warn(`Undefined skill category: ${category}`);
        }
    });
}

function populateCertificationsAccordion(containerId, certifications, enableLogging = false) {
    const certificationsAccordion = document.getElementById(containerId);
    Object.keys(certifications).forEach(category => {
        if (certifications[category]) {
            const categoryElement = createCategoryElement(category.replace(/_/g, ' '), certifications[category], createCertificationItem);
            certificationsAccordion.appendChild(categoryElement);
        } else {
            if (enableLogging) console.warn(`Undefined certification category: ${category}`);
        }
    });
}

function populatePersonalInfo(fullNameId, emailId, contactInfoId, fullName, email, contactInfo, enableLogging = false) {
    if (enableLogging) console.log('Populating personal info');
    document.getElementById(fullNameId).textContent = fullName;
    const emailElement = document.getElementById(emailId);
    emailElement.textContent = email;
    emailElement.setAttribute('href', `mailto:${email}`);
    document.getElementById(contactInfoId).textContent = contactInfo;
}
function applyLanguage(language) {
    const t = translations[language];
    const translatedFooter = [
        {
            label: t.content.footer.devProfiles,
            data: footer[0].data
        },

        {
            label: t.content.footer.socialProfiles,
            data: footer[1].data
        },

        {
            label: t.content.footer.resources,
            data: [
                {
                    text: t.content.footer.sendMail,
                    link: footerLinks.email
                },
                {
                    text: t.content.footer.downloadResume,
                    link: footerLinks.resume[language],
                    target: "_blank"
                }
            ]
        },

        footer[2]
    ];

    populateContainer("footer", translatedFooter, createFooterItem);
    populateContainer('bio', t.content.bio, createBioItem); 
    populateContainer(
        'languages',
        t.content.languages,
        createLanguageSkillElement
    );

    populateContainer(
        'experience',
        t.content.experience,
        createExperienceItem
    );
        // Education
    populateContainer(
        'education',
        t.content.education,
        createEducationItem
    );
    document.getElementById('contact-info').textContent =
        t.content.contactInfo;

    document.documentElement.lang = language;

    document.querySelector('[data-nav-section="about"]').textContent =
        t.nav.about;

    document.querySelector('[data-nav-section="languages"]').textContent =
        t.nav.languages;

    document.querySelector('[data-nav-section="skills"]').textContent =
        t.nav.skills;

    document.querySelector('[data-nav-section="certifications"]').textContent =
        t.nav.certifications;

    document.querySelector('[data-nav-section="experience"]').textContent =
        t.nav.experience;

    document.querySelector('[data-nav-section="education"]').textContent =
        t.nav.education;

    document.querySelector('[data-nav-section="testimonials"]').textContent =
        t.nav.testimonials;

    document.querySelector('[data-nav-section="contact"]').textContent =
        t.nav.contact;

    document.querySelector('[data-section="about"] h1').textContent =
        t.headings.about;

    document.querySelector('[data-section="languages"] h1').textContent =
        t.headings.languages;

    document.querySelector('[data-section="skills"] h1').textContent =
        t.headings.skills;

    document.querySelector('[data-section="certifications"] h1').textContent =
        t.headings.certifications;

    document.querySelector('[data-section="experience"] h1').textContent =
        t.headings.experience;

    document.querySelector('[data-section="education"] h1').textContent =
        t.headings.education;

    document.querySelector('[data-section="testimonials"] h1').textContent =
        t.headings.testimonials;

    document.querySelector('[data-section="contact"] h1').textContent =
        t.headings.contact;
}

document.addEventListener("DOMContentLoaded", () => {
    try {
        
        console.log('DOMContentLoaded fired');
        if (enableLogging) console.log('Document loaded, initializing...');

        // Set meta tags
        setMetaTags();

        // Populate personal info
        populatePersonalInfo('fullname', 'email', 'contact-info', FullName, mail, contactInfo, enableLogging);

        // Create GitHub card
        //createGitHubCard(githubUsername);
        // fetchData(URLs.gitConnected, mapBasicResponse);
        // Populate bio
        //populateContainer('bio', bio, createBioItem);

        // Populate languages
       // populateContainer('languages', languages, createLanguageSkillElement);

        // Populate skills accordion
        populateSkillsAccordion('skills-accordion', skills, enableLogging);

        // Populate certifications accordion
        populateCertificationsAccordion('accordion', certifications, enableLogging);

        // Populate testimonials
        populateTestimonials('testimonialItems', testimonials.feedback, enableLogging);

        // Populate footer
        //populateContainer('footer', footer, createFooterItem);

        // Initialize carousel
        initializeCarousel('#testimonialCarousel', 'prevTestimonial', 'nextTestimonial', 3000, enableLogging);

        const languageSelector = document.getElementById('language-selector');

        const savedLanguage = localStorage.getItem('language') || 'en';
        languageSelector.value = savedLanguage;

        applyLanguage(savedLanguage);

        languageSelector.addEventListener('change', (event) => {
            const language = event.target.value;

            localStorage.setItem('language', language);
            applyLanguage(language);

        const projectSelector = document.getElementById('project-selector');
        console.log('projectSelector:', projectSelector);

        projectSelector.addEventListener('change', (event) => {
            const projectUrl = event.target.value;

            if (projectUrl) {
                window.open(projectUrl, '_blank');
            }

            projectSelector.value = '';
        });
});

    } catch (error) {
        console.error(`Error during initialization: ${error.message}`);
    }
});
