class NavigationLargeScreen extends HTMLElement {
    constructor() {
        super();
        this.navIconSelector = "#nav-icon";
        this.navContentsSelector = '#nav-contents-desktop';
        this.rootLinkBtnSelector = '.root-level-link-btn';
        this.rootLinkContainerSelector = 'root-level-link-container';
        this.customImageContainerSelector = '.custom-images';
        this.linkContainerSelector = '.link-container';
        this.hamburgerIconSelector = '.hamburger-icon';
        this.exitIconSelector = '.exit-icon';
    }

    connectedCallback() {
        this.toggleOpenRootMenuContainer()
    }

    toggleOpenRootMenuContainer() {
        const navIcon = this.querySelector(this.navIconSelector);
        if (!navIcon) return;

        navIcon.addEventListener('click', () => {
            const rootLevelLinkBtns = this.querySelectorAll(this.rootLinkBtnSelector);
            const navContentsDesktop = this.querySelector(this.navContentsSelector);
            this.manageClasses(navContentsDesktop, ['toggle', 'toggle'], ['hidden', 'display-grid'])

            this.hideOtherSiblingContainer();

            if (navContentsDesktop.classList.contains('hidden')) {
                this.resetClassOfElements([
                    {
                        element: this.querySelector(this.hamburgerIconSelector),
                        method: 'remove',
                        classNames: 'hidden'
                    },
                    {
                        element: this.querySelector(this.exitIconSelector),
                        method: 'add',
                        classNames: 'hidden'
                    },
                    {
                        element: this.querySelector(this.customImageContainerSelector),
                        method: ['add', 'remove'],
                        classNames: ['hidden', 'display-grid']
                    }
                ])

                rootLevelLinkBtns.forEach((rootLinkBtnElement) => {
                    this.manageClasses(rootLinkBtnElement, ['remove', 'add'], ['focus-btn', 'hover-btn'])
                    this.changeChevronIconColor(rootLinkBtnElement, '#000000')
                })
            } else {
                this.manageClasses(this.querySelector(this.hamburgerIconSelector), 'add', 'hidden')
                this.manageClasses(this.querySelector(this.exitIconSelector), 'remove', 'hidden');
            }
        });
    }

    hideOtherSiblingContainer() {
        const linkContainers = this.querySelectorAll(`${this.navContentsSelector} > ${this.linkContainerSelector}`);
        if (!(linkContainers instanceof NodeList) && !linkContainers.length) return;

        linkContainers.forEach((element) => {
            if (this.rootLinkContainerSelector !== element.dataset.linkLevelContainer) {
                this.manageClasses(element, 'add', 'hidden')
                this.manageClasses(this.querySelector(this.customImageContainerSelector), ['add', 'remove'], ['hidden', 'display-grid'])
            }
        })
    }

    removeHighlightsOfNotSelected(currentElements, nextLevelLinkContainerSelector) {
        if (!(currentElements instanceof NodeList) && !currentElements.length) return;

        currentElements.forEach((element) => {
            this.manageClasses(element, ['remove', 'add'], ['focus-btn', 'hover-btn'])
            this.changeChevronIconColor(element, '#000000')
        })

        if (nextLevelLinkContainerSelector?.nextElementSibling?.classList.contains('link-container')) {
            this.manageClasses(nextLevelLinkContainerSelector.nextElementSibling, 'add', 'hidden')
        }
    }

    resetClassOfElements(elementsToReset) {
        if (!elementsToReset.length) return;
        elementsToReset.forEach(({ element, method, classNames }) => {
            this.manageClasses(element, method, classNames)
        })
    }

    changeChevronIconColor(currentElement, color) {
        const chevronRightIcon = currentElement?.querySelector('.chevron-right-icon > path');

        if (chevronRightIcon) {
            chevronRightIcon.setAttribute('fill', color)
        }
    }

    manageClasses(elements, method, classNames) {
        if (!elements && !method && !classNames) return;

        if (elements instanceof NodeList && elements.length && !Array.isArray(method) && method.length && !Array.isArray(classNames) && classNames.length) {
            elements.forEach((element) => {
                element.classList[method](classNames);
            })
            return;
        }

        if (!(elements instanceof NodeList) && Array.isArray(method) && method.length && Array.isArray(classNames) && classNames.length) {
            method.forEach((methodValue, index) => {
                elements.classList[methodValue](classNames[index]);
            })
            return;
        }

        if (elements instanceof NodeList && elements.length && Array.isArray(method) && method.length && Array.isArray(classNames) && classNames.length) {
            elements.forEach((element) => {
                method.forEach((methodElement, index) => {
                    element.classList[methodElement](classNames[index]);
                })
            })

            return;
        }

        elements.classList[method](classNames);
    }

    removeSpecificElement(elements) {
        if (elements instanceof NodeList && elements.length && elements !== null) {
            elements.forEach(element => element.remove())
        }
    }
}

if (!customElements.get('navigation-large-screen')) {
    customElements.define('navigation-large-screen', NavigationLargeScreen);
}
