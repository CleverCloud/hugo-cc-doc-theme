function createIcon(iconId) {
    const use = document.createElementNS('http://www.w3.org/2000/svg', 'use');
    use.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', '/icons.svg#' + iconId);

    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.classList = "icon";
    svg.setAttribute('width', '16');
    svg.setAttribute('height', '16');
    svg.appendChild(use);

    return svg;
}

function initToc(toc) {
    // Get ToC div
    if (toc) {
        /*
            Handles the table of content active items
        */
        const motionQuery = window.matchMedia('(prefers-reduced-motion)');
        // Create a list for the ToC entries 
        tocList = document.createElement("ul");

        tocNav = document.createElement("nav");
        tocNav.id ="TableOfContents";
        
        headers = document.getElementsByTagName("h3");
        // For each h3
        for (i = 0; i < headers.length; i++){
            name = headers[i].id;
            // create an anchor
            const anchorIcon = createIcon('link');
            anchor = document.createElement("a");
            anchor.setAttribute("href","#"+name);
            anchor.classList.add('anchor');
            anchor.appendChild(anchorIcon);
            headers[i].appendChild(anchor);

        }

        headers = document.getElementsByTagName("h2");
        // For each h2
        for (i = 0; i < headers.length; i++){
            name = headers[i].id;
            // create an anchor
            const anchorIcon = createIcon('link');
            anchor = document.createElement("a");
            anchor.setAttribute("href","#"+name);
            anchor.classList.add('anchor');
            anchor.appendChild(anchorIcon);
            headers[i].appendChild(anchor);

            // a list item for the entry
            tocListItem = document.createElement("li");
            
            // a link for the h3
            tocEntry = document.createElement("a");
            tocEntry.setAttribute("href","#"+name);
            tocEntry.innerText=headers[i].innerText;
            tocListItem.appendChild(tocEntry);
            tocList.appendChild(tocListItem);
        }
        tocNav.appendChild(tocList);
        toc.appendChild(tocNav); 

        const TableOfContents = {
            container: document.querySelector('#TableOfContents'),
            links: null,
            headings: null,
            intersectionOptions: {
                rootMargin: '0px',
                threshold: 1
            },
            previousSection: null,
            observer: null,

            init() {
                this.handleObserver = this.handleObserver.bind(this);

                this.setUpObserver();
                this.findLinksAndHeadings();
                this.observeSections();


                this.links.forEach(link => {
                    link.addEventListener('click', this.handleLinkClick.bind(this));
                });
            },


            handleLinkClick(evt) {
                evt.preventDefault();
                let target = evt.target.getAttribute('href');
                let id = target.replace('#', '');

                let section = this.headings.find(heading => {
                    return heading.getAttribute('id') === id;
                });

                section.setAttribute('tabindex', -1);
                section.focus();

                window.location.hash = target;
                window.scroll({
                    behavior: motionQuery.matches ? 'instant' : 'smooth',
                    top: section.offsetTop + 200,
                    block: 'start'
                });

                if (this.container.classList.contains('active')) {
                    this.container.classList.remove('active');
                }
            },

            handleObserver(entries, observer) {
                entries.forEach(entry => {
                    let href = `#${entry.target.getAttribute('id')}`;
                    let link = this.links.find(l => l.getAttribute('href') === href);


                    if (entry.isIntersecting && entry.intersectionRatio >= 1) {
                        link.classList.add('is-visible');
                        this.previousSection = entry.target.getAttribute('id');
                    } else {
                        link.classList.remove('is-visible');
                    }

                    this.highlightFirstActive();
                });
            },

            highlightFirstActive() {
                let firstVisibleLink = this.container.querySelector('.is-visible');

                this.links.forEach(link => {
                link.classList.remove('active');
                });

                if (firstVisibleLink) {
                firstVisibleLink.classList.add('active');
                }

                if (!firstVisibleLink && this.previousSection) {
                this.container.querySelector(
                    `a[href="#${this.previousSection}"]`).
                    classList.add('active');
                }
            },

            observeSections() {
                this.headings.forEach(heading => {
                    this.observer.observe(heading);
                });
            },

            setUpObserver() {
                this.observer = new IntersectionObserver(this.handleObserver, this.intersectionOptions);
            },

            findLinksAndHeadings() {
                this.links = [...this.container.querySelectorAll('a')];
                this.headings = this.links.map(link => {
                    let id = link.getAttribute('href');
                    return document.querySelector(id);
                });
            }
        };

        TableOfContents.init();
    }
};

export default function () {
    window.addEventListener('DOMContentLoaded', () => {
        const tocElement = document.getElementById("ToC");
    
        initToc(tocElement);
    });
}