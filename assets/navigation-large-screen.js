class NavigationLargeScreen extends HTMLElement {
    constructor() {
        super();
        this.navIcon = this.querySelector("#nav-icon");
        this.rootLinkBtnSelector = '.root-level-link-btn';
        this.level1LinkBtnSelector = '.level-1-link-btn';
        this.level2LinkBtnSelector = '.level-2-link-btn';
        this.rootLinkContainerSelector = '[root-level-link-container]';
        this.level1LinkContainerSelector = '[level-1-link-container]';
        this.level2LinkContainerSelector = '[level-2-link-container]';
        this.customImageContainerSelector = '[custom-image-container]';

        this.Links = []
    }

    connectedCallback() {
        this.toggleRootMenuContainer()
        this.showRootMenu()
    }

    toggleRootMenuContainer() {
        this.navIcon.addEventListener('click', () => {
            const rootLevelLinkBtns = this.querySelectorAll(this.rootLinkBtnSelector);
            const navContentsDesktop = this.querySelector('#nav-contents-desktop');
            this.manageClasses(navContentsDesktop, ['toggle', 'toggle'], ['hidden', 'display-grid'])

            if (navContentsDesktop.classList.contains('hidden')) {
                this.resetClassOfElements()

                rootLevelLinkBtns.forEach((rootLinkBtnElement) => {
                    this.manageClasses(rootLinkBtnElement, ['remove', 'add'], ['focus-btn', 'hover-btn'])
                    this.changeChevronIconColor(rootLinkBtnElement, '#000000')
                })
            } else {
                this.manageClasses(this.querySelector('.hamburger-icon'), 'add', 'hidden')
                this.manageClasses(this.querySelector('.exit-icon'), 'remove', 'hidden');
            }
        });
    }

    showRootMenu() {
        const linkContainers = this.querySelectorAll('#nav-contents-desktop > div.link-container');
        if (!(linkContainers instanceof NodeList) && !linkContainers.length) return;

        linkContainers.forEach((element) => {
            const nextSiblingElement = element.nextElementSibling.classList.contains('link-container') ? element.nextElementSibling : null;
            this.Links.push({
                parentLinkElement: element,
                childLinkELement: nextSiblingElement
            })
        })

        this.Links.forEach(({ parentLinkElement, childLinkELement }) => {
            const parentLinkBtnSelector = parentLinkElement.dataset.btnLinkLevel;
            const parentLinkBtns = parentLinkElement.querySelectorAll(parentLinkBtnSelector);

            if (!childLinkELement) return;

            this.showCurrentMenu(parentLinkBtns, [
                {
                    element: childLinkELement,
                    method: 'add',
                    classNames: 'hidden'
                },
                {
                    element: this.querySelector(this.customImageContainerSelector),
                    method: ['add', 'remove'],
                    classNames: ['hidden', 'display-grid']
                }
            ], childLinkELement)

        })
    }

    showCurrentMenu(currentLinkBtns, hideElementsIfNoChildLinks, nextLevelLinkContainerSelector, hasParentTitle) {
        currentLinkBtns.forEach((element) => {

            if ('undefined' === typeof hasParentTitle) {
                this.processingOfMenu(element, hideElementsIfNoChildLinks, nextLevelLinkContainerSelector);
                return;
            }

            if (hasParentTitle && element.dataset.rootTitle === hasParentTitle) {
                element.classList.remove('hidden');
                this.processingOfMenu(element, hideElementsIfNoChildLinks, nextLevelLinkContainerSelector, 'data-title')
            } else {
                element.classList.add('hidden');
            }
        })
    }

    processingOfMenu(element, hideElementsIfNoChildLinks, nextLevelLinkContainerSelector, parentTitleSelector) {
        element.addEventListener('click', (e) => {
            e.preventDefault();

            const parentTitleDefaultIfNoSelector = parentTitleSelector ?? 'data-root-title';
            const parentTitle = e.target.getAttribute(parentTitleDefaultIfNoSelector);
            const hasChildLinks = element.querySelector('.chevron-right-icon > path');
            const btnlinkLevelSelector = e.target.getAttribute('data-btn-level');

            this.manageClasses(element, ['add', 'remove'], ['focus-btn', 'hover-btn'])

            const nextMenuHeaderTitle = nextLevelLinkContainerSelector.querySelector('.link-headers .link-title');
            const nextMenuSecondaryTitle = nextLevelLinkContainerSelector.querySelector('.link-headers .link-secondary-title');

            nextMenuHeaderTitle.textContent = parentTitle;
            nextMenuSecondaryTitle.textContent = `See All ${parentTitle}`

            const notSelectedBtnLinkElements = this.querySelectorAll(`${btnlinkLevelSelector}:not([data-title="${parentTitle}"])`);

            if (hasChildLinks) {
                this.changeChevronIconColor(element, '#fff');
                this.showChildMenu(parentTitle, nextLevelLinkContainerSelector)
            } else {
                this.hideElementsIfNoChildLinks(hideElementsIfNoChildLinks)
            }

            if (!(notSelectedBtnLinkElements instanceof NodeList) && !notSelectedBtnLinkElements.length) return;
            this.removeHighlightsOfNotSelected(notSelectedBtnLinkElements, nextLevelLinkContainerSelector)
        });
    }

    showChildMenu(parentTitle, currentLinkContainer) {
        if (!currentLinkContainer) return;

        const childLinkBtns = currentLinkContainer.querySelectorAll('[main-menu] > button');
        const nextElementSibling = currentLinkContainer.nextElementSibling
        const customMenuContainer = currentLinkContainer.querySelectorAll(`ul[data-parent-title="${parentTitle}"]`);

        this.manageClasses(currentLinkContainer, 'remove', 'hidden');

        if (customMenuContainer instanceof NodeList && customMenuContainer.length) {
            this.showOnlyCustomMenuForCurrentLinkContainer(customMenuContainer, currentLinkContainer)
        } else {
            this.manageClasses(currentLinkContainer.querySelectorAll(`ul[custom-menu-container]`), 'add', 'hidden')
        }

        if (!(childLinkBtns instanceof NodeList) && !childLinkBtns.length) return;

        this.showCurrentMenu(childLinkBtns, [
            {
                element: nextElementSibling,
                method: 'add',
                classNames: 'hidden'
            }
        ], nextElementSibling, parentTitle)
    }

    showOnlyCustomMenuForCurrentLinkContainer(customMenuContainer, currentLinkContainer) {
        const currentLinkContainerLevel = currentLinkContainer.dataset.linkLevelContainer;

        customMenuContainer.forEach((element) => {
            if (currentLinkContainerLevel === element.dataset.linkLevelContainer) {
                element.classList.remove('hidden');
            } else {
                element.classList.add('hidden');
            }
        })
    }

    removeHighlightsOfNotSelected(currentElements, nextLevelLinkContainerSelector) {
        if (!(currentElements instanceof NodeList) && !currentElements.length) return;

        currentElements.forEach((element) => {
            this.manageClasses(element, ['remove', 'add'], ['focus-btn', 'hover-btn'])
            this.changeChevronIconColor(element, '#000000')
        })

        if (nextLevelLinkContainerSelector.dataset.linkLevelContainer) {
            this.processHideOfElements(nextLevelLinkContainerSelector.nextElementSibling)
        }
    }

    hideElementsIfNoChildLinks(elementsToHide) {
        this.processHideOfElements(elementsToHide)
    }

    processHideOfElements(elementsToHide) {
        if (elementsToHide.length && elementsToHide) {
            elementsToHide.forEach(({ element, method, classNames }) => {
                this.manageClasses(element, method, classNames)
            })
        }
    }

    resetClassOfElements() {
        const elementsToReset = [
            {
                element: this.querySelector('.hamburger-icon'),
                method: 'remove',
                classNames: 'hidden'
            },
            {
                element: this.querySelector('.exit-icon'),
                method: 'add',
                classNames: 'hidden'
            },
            {
                element: this.querySelector(this.customImageContainerSelector),
                method: ['add', 'remove'],
                classNames: ['hidden', 'display-grid']
            }, {
                element: this.querySelector(this.level1LinkContainerSelector),
                method: 'add',
                classNames: 'hidden'
            }, {
                element: this.querySelector(this.level2LinkContainerSelector),
                method: 'add',
                classNames: 'hidden'
            }
        ]

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
