class NavigationMenuMain extends HTMLElement {
    constructor() {
        super();
        const {
            mainContainerSelector,
            navIconSelector,
            rootLinkBtnSelector,
            rootLinkContainerSelector,
            customImageConatinerSelector,
            linkContainerSelector,
            hamburgerIconSelector,
            exitIconSelector,
            mobileBackBtnSelector,
            menuMainTitleSelector,
            mobileMenuDefaultTitle,
            screenType
        } = this.dataset

        this.navIconSelector = navIconSelector;
        this.mainContainerSelector = mainContainerSelector;
        this.rootLinkBtnSelector = rootLinkBtnSelector;
        this.rootLinkContainerSelector = rootLinkContainerSelector;
        this.customImageContainerSelector = customImageConatinerSelector;
        this.linkContainerSelector = linkContainerSelector;
        this.hamburgerIconSelector = hamburgerIconSelector;
        this.mobileBackBtnSelector = mobileBackBtnSelector;
        this.menuMainTitleSelector = menuMainTitleSelector;
        this.mobileMenuDefaultTitle = mobileMenuDefaultTitle
        this.exitIconSelector = exitIconSelector;
        this.screenType = screenType;

    }

    connectedCallback() {
        this.toggleOpenRootMenuContainer()
    }

    toggleOpenRootMenuContainer() {
        const navIcon = this.querySelector(this.navIconSelector);
        if (!navIcon) return;

        navIcon.addEventListener('click', () => {
            const mainContainer = this.querySelector(this.mainContainerSelector);
            this.hideOtherSiblingContainer(this.screenType);

            if (this.screenType === 'mobile_screen') {
                this.manageClasses(mainContainer, ['toggle', 'toggle'], ['hidden', 'display-grid'])
                this.toggleShowMobileScreen(mainContainer)
            } else {
                this.manageClasses(mainContainer, ['toggle', 'toggle'], ['hidden', 'display-grid'])
                this.toggleShowLargeScreen(mainContainer)
            }
        });
    }

    toggleShowMobileScreen(mainContainer) {
        if (!(mainContainer.classList.contains('hidden'))) {
            this.triggerMobileExit(mainContainer)
        }
        this.resetRootLevelBtns()
        this.hideNotRootLevelBtns()
    }

    triggerMobileExit(mainContainer) {
        if (!mainContainer) return;
        const backBtnClass = this.querySelector(this.mobileBackBtnSelector);
        const menuMainTitleElement = this.querySelector(this.menuMainTitleSelector);
        const rootLinkBtns = this.querySelectorAll(`button[data-btn-level="${this.rootLinkBtnSelector}"]`);

        this.querySelector(this.exitIconSelector).addEventListener('click', (e) => {
            e.preventDefault();
            menuMainTitleElement.textContent = this.mobileMenuDefaultTitle;
            this.resetClassOfElements([
                {
                    element: mainContainer,
                    method: ['add', 'remove'],
                    classNames: ['hidden', 'display-grid']
                },
                {
                    element: this.querySelector(this.customImageContainerSelector),
                    method: ['add', 'remove'],
                    classNames: ['hidden', 'display-grid']
                },
                {
                    element: rootLinkBtns,
                    method: 'remove',
                    classNames: 'hidden'
                },
                {
                    element: backBtnClass.parentElement,
                    method: ['add', 'remove'],
                    classNames: ['hidden', 'display-grid']
                },
                {
                    element: menuMainTitleElement.parentElement,
                    method: ['remove', 'add'],
                    classNames: ['col-span-2', 'col-span-3']
                }
            ])
        })
    }

    toggleShowLargeScreen(mainContainer) {
        if (mainContainer.classList.contains('hidden')) {
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

            this.resetRootLevelBtns()
        } else {
            this.manageClasses(this.querySelector(this.hamburgerIconSelector), 'add', 'hidden')
            this.manageClasses(this.querySelector(this.exitIconSelector), 'remove', 'hidden');
        }
    }



    resetRootLevelBtns() {
        const rootLevelLinkBtns = this.querySelectorAll(this.rootLinkBtnSelector);
        if (!(rootLevelLinkBtns instanceof NodeList) && !rootLevelLinkBtns.length) return;
        rootLevelLinkBtns.forEach((rootLinkBtnElement) => {
            this.manageClasses(rootLinkBtnElement, ['remove', 'add'], ['focus-btn', 'hover-btn'])
            this.changeChevronIconColor(rootLinkBtnElement, '#000000')
        })
    }

    hideNotRootLevelBtns() {
        const notRootLevelLinkBtns = this.querySelectorAll(`button[link-btns]:not(${this.rootLinkBtnSelector})`);
        if (!(notRootLevelLinkBtns instanceof NodeList) && !notRootLevelLinkBtns.length) return;

        notRootLevelLinkBtns.forEach((notRootLevelLinkBtnElement) => {
            this.manageClasses(notRootLevelLinkBtnElement, ['add', 'remove', 'add'], ['hidden', 'focus-btn', 'hover-btn'])
        })
    }

    hideOtherSiblingContainer(screenType) {
        if (screenType === 'mobile_screen') {
            const mobileLinkContainer = this.querySelector(`${this.mainContainerSelector} ${this.linkContainerSelector}`)
            if (!mobileLinkContainer) return;
            this.manageClasses(mobileLinkContainer, ['add'], ['flex'])
        }

        if (screenType === 'large_screen') {
            const desktopLinkContainers = this.querySelectorAll(`${this.mainContainerSelector} > ${this.linkContainerSelector}`);
            if (!(desktopLinkContainers instanceof NodeList) && !desktopLinkContainers.length) return;

            desktopLinkContainers.forEach((element) => {
                if (this.rootLinkContainerSelector !== element.dataset.linkLevelContainer) {
                    this.manageClasses(element, 'add', 'hidden')
                    this.manageClasses(this.querySelector(this.customImageContainerSelector), ['add', 'remove'], ['hidden', 'display-grid'])
                }
            })
        }

    }

    removeHighlightsOfNotSelected(currentElements, nextLevelLinkContainerSelector) {
        if (nextLevelLinkContainerSelector && nextLevelLinkContainerSelector?.nextElementSibling?.classList.contains('link-container')) {
            this.manageClasses(nextLevelLinkContainerSelector.nextElementSibling, 'add', 'hidden')
        }

        if (currentElements instanceof NodeList && currentElements.length) {
            currentElements.forEach((element) => {
                this.manageClasses(element, ['remove', 'add'], ['focus-btn', 'hover-btn'])
                this.changeChevronIconColor(element, '#000000')
            })

            return;
        }

        if (currentElements && !(currentElements instanceof NodeList)) {
            this.manageClasses(currentElements, ['remove', 'add'], ['focus-btn', 'hover-btn'])
            this.changeChevronIconColor(currentElements, '#000000')
            return;
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

        if (elements.length && !Array.isArray(method) && !Array.isArray(classNames)) {
            elements.forEach((element) => {
                element.classList[method](classNames);
            })
            return;
        }

        elements.classList[method](classNames);
    }

    hideElementIfNotMatched(elements, valueToMatch, dataSetAttribute) {
        if (!(elements instanceof NodeList) && !elements.length && !elements) return;

        elements.forEach((element) => {
            if (element.dataset[dataSetAttribute] === valueToMatch) {
                element.classList.remove('hidden')
            } else {
                element.classList.add('hidden')
            }
        })

    }

    removeSpecificElement(elements) {
        if (elements instanceof NodeList && elements.length && elements !== null) {
            elements.forEach(element => element.remove())
        }
    }
}

if (!customElements.get('navigation-menu-main')) {
    customElements.define('navigation-menu-main', NavigationMenuMain);
}
