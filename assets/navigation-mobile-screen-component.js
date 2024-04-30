
class NavigationMobileScreenComponent extends HTMLElement {
    constructor() {
        super();
        const {
            mobileBackBtnSelector,
            parentContainerSelector,
            menuMainTitleSelector,
            customMenuAttribute,
            customImageSelector,
            linkContainerSelector,
            rootLinkBtnSelector,
            level1LinkBtnSelector,
            level2LinkBtnSelector,
            accountMenuContainerSelector,
            exitIconSelector
        } = this.dataset

        this.mobileBackBtnSelector = mobileBackBtnSelector;
        this.parentContainerSelector = parentContainerSelector
        this.menuMainTitleSelector = menuMainTitleSelector;
        this.customMenuAttribute = customMenuAttribute;
        this.customImageSelector = customImageSelector;
        this.linkContainerSelector = linkContainerSelector;
        this.rootLinkBtnSelector = rootLinkBtnSelector;
        this.navigationMainMenu = document.querySelector('navigation-menu-main')
        this.level1LinkBtnSelector = level1LinkBtnSelector;
        this.level2LinkBtnSelector = level2LinkBtnSelector;
        this.accountMenuContainerSelector = accountMenuContainerSelector
        this.exitIconSelector = exitIconSelector
    }

    connectedCallback() {
        this.highLightLinkBtns(this.rootLinkBtnSelector);
        this.triggerBacktBtn();
    }


    triggerBacktBtn() {
        const backBtn = document.querySelector(this.mobileBackBtnSelector);
        if (!backBtn) return;

        backBtn.addEventListener('click', () => {
            const currentBtnLevel = backBtn.dataset.btnLevel;
            const rootTitle = backBtn.dataset.rootTitle;
            this.backToPreviousLink(currentBtnLevel, rootTitle)
        })
    }

    highLightLinkBtns(btnSelector) {
        const currentLinkBtns = this.querySelectorAll(btnSelector);
        if (!(currentLinkBtns instanceof NodeList) && currentLinkBtns.length) return;

        this.showCustomMenuAndImages(btnSelector);

        currentLinkBtns.forEach((btnElement) => {
            btnElement.addEventListener('click', () => {
                const { title, rootTitle, btnLevel } = btnElement.dataset;

                const hasChildLinks = btnElement.querySelector('.chevron-right-icon > path');

                if (hasChildLinks) {
                    this.navigationMainMenu.changeChevronIconColor(btnElement, '#fff');
                    this.showNextLinkBtns(title, btnLevel, rootTitle)
                } else {

                }
            })
        })

        this.showAccountMenu(btnSelector);
    }

    showPrevOrNextLink(btnLevel, rootTitle, action, title) {
        if ('back' === action) {
            this.showParentMenu(btnLevel, rootTitle, action)
        } else {

        }
    }

    showNextLinkBtns(title, btnLevel, rootTitle) {
        if (btnLevel === this.rootLinkBtnSelector) {
            const elementsToHideSelectors = [`button[data-btn-level="${btnLevel}"]`, `button[data-btn-level="${this.level2LinkBtnSelector}"]`];
            this.hideOtherElements(this.level1LinkBtnSelector, title, [...this.mergeNodeListArray(elementsToHideSelectors)])
            this.showCustomMenuAndImages(this.level1LinkBtnSelector, title);
            this.highLightLinkBtns(this.level1LinkBtnSelector);
            this.showBackBtnElement(title, this.level1LinkBtnSelector, rootTitle)
            return;
        }

        if (btnLevel === this.level1LinkBtnSelector) {
            const elementsToHideSelectors = [`button[data-btn-level="${btnLevel}"]`, `button[data-btn-level="${this.rootLinkBtnSelector}"]`];
            this.hideOtherElements(this.level2LinkBtnSelector, title, [...this.mergeNodeListArray(elementsToHideSelectors)])
            this.showCustomMenuAndImages(this.level2LinkBtnSelector, title);
            this.highLightLinkBtns(this.level2LinkBtnSelector)
            this.showBackBtnElement(title, this.level2LinkBtnSelector, rootTitle)
            return;
        }
    }

    backToPreviousLink(btnLevel, rootTitle) {
        const action = 'back'
        if (btnLevel === this.level2LinkBtnSelector) {
            const elementsToHideSelectors = [`button[data-btn-level="${btnLevel}"]`, `button[data-btn-level="${this.rootLinkBtnSelector}"]`];
            this.hideOtherElements(this.level1LinkBtnSelector, rootTitle, [...this.mergeNodeList(elementsToHideSelectors)], action)
            this.showCustomMenuAndImages(this.level1LinkBtnSelector, rootTitle);
            this.showBackBtnElement(rootTitle, this.level1LinkBtnSelector, null, action)
            this.showAccountMenu(this.level1LinkBtnSelector);
            return;
        }

        if (btnLevel === this.level1LinkBtnSelector) {
            const elementsToHideSelectors = [`button[data-btn-level="${btnLevel}"]`, `button[data-btn-level="${this.level2LinkBtnSelector}"]`];
            this.hideOtherElements(this.rootLinkBtnSelector, rootTitle, [...this.mergeNodeList(elementsToHideSelectors)], action)
            this.showCustomMenuAndImages(this.rootLinkBtnSelector, rootTitle);
            this.showBackBtnElement(rootTitle, this.rootLinkBtnSelector, null, action);
            this.showAccountMenu(this.rootLinkBtnSelector);
            return;
        }

    }

    showAccountMenu(currentBtnLevel) {
        const accountMenuContainer = this.querySelector(this.accountMenuContainerSelector);

        if (currentBtnLevel === this.rootLinkBtnSelector) {
            this.navigationMainMenu.manageClasses(accountMenuContainer, 'remove', 'hidden');
        } else {
            this.navigationMainMenu.manageClasses(accountMenuContainer, 'add', 'hidden');
        }
    }



    mergeNodeListArray(selectors) {
        if (!selectors.length) return;
        const resultElements = selectors.map((selector) => Array.from(this.querySelectorAll(selector)))
        return resultElements.flat();
    }

    showCustomMenuAndImages(currentBtnLevel, title) {
        this.renderCustomImageMenu(currentBtnLevel, title);
        this.processCustomMenu(currentBtnLevel, title);
    }

    renderCustomImageMenu(currentBtnLevel, title) {
        if (!currentBtnLevel) return;
        const customImageMenuContainer = this.querySelector(this.customImageSelector);

        if (!customImageMenuContainer) return;

        if (currentBtnLevel === this.rootLinkBtnSelector) {
            this.navigationMainMenu.manageClasses(customImageMenuContainer, 'add', 'hidden');
            return;
        }

        this.navigationMainMenu.manageClasses(customImageMenuContainer, 'remove', 'hidden');

        if (currentBtnLevel === this.level1LinkBtnSelector && title) {
            const customImages = customImageMenuContainer.querySelectorAll('div');
            this.navigationMainMenu.hideElementIfNotMatched(customImages, title, 'title');
        }
    }


    processCustomMenu(currentBtnLevel, title) {
        if (!currentBtnLevel) return;
        const customMenu = this.querySelectorAll(this.customMenuAttribute);

        if (!(customMenu instanceof NodeList) && !customMenu.length && customMenu) return;

        customMenu.forEach((element) => {
            this.renderCustomMenu(element, currentBtnLevel, title);
        })
    }

    renderCustomMenu(element, currentBtnLevel, title) {
        const { btnLevel, parentTitle } = element.dataset;

        if (btnLevel === this.rootLinkBtnSelector && !title) {
            this.navigationMainMenu.manageClasses(element, 'remove', 'hidden');
            return;
        }

        if (title && btnLevel === currentBtnLevel && parentTitle === title) {
            this.navigationMainMenu.manageClasses(element, 'remove', 'hidden');
            return;
        }

        if (title) {
            this.navigationMainMenu.manageClasses(element, 'add', 'hidden');
            return;
        }

    }

    showBackBtnElement(title, btnLevel, rootTitle, action) {
        const backBtnClass = document.querySelector(this.mobileBackBtnSelector);
        const menuMainTitleElement = document.querySelector(this.menuMainTitleSelector);
        if (!backBtnClass || !menuMainTitleElement) return;

        const btnParentElement = backBtnClass.parentElement;
        const menuTitleParentElement = menuMainTitleElement.parentElement;

        this.renderTitleContent(btnParentElement, menuTitleParentElement, menuMainTitleElement, backBtnClass, title, btnLevel, rootTitle, action)
    }

    renderTitleContent(btnParentElement, menuTitleParentElement, menuMainTitleElement, backBtnClass, title, btnLevel, rootTitle, action) {
        if ('back' === action && btnLevel === this.rootLinkBtnSelector) {
            this.changeBackBtnAttributeValue(menuMainTitleElement, backBtnClass, 'Harvey Norman', btnLevel, 'Harvey Norman')
            this.navigationMainMenu.manageClasses(btnParentElement, ['add', 'remove'], ['hidden', 'display-grid'])
            this.navigationMainMenu.manageClasses(menuTitleParentElement, ['remove', 'add'], ['col-span-2', 'col-span-3'])
        } else {
            this.changeBackBtnAttributeValue(menuMainTitleElement, backBtnClass, title, btnLevel, rootTitle)
            this.navigationMainMenu.manageClasses(btnParentElement, ['remove', 'add'], ['hidden', 'display-grid'])
            this.navigationMainMenu.manageClasses(menuTitleParentElement, ['add', 'remove'], ['col-span-2', 'col-span-3'])
        }
    }

    changeBackBtnAttributeValue(menuMainTitleElement, backBtnClass, title, btnLevel, rootTitle) {
        menuMainTitleElement.textContent = title;
        backBtnClass.setAttribute('data-title', title)
        backBtnClass.setAttribute('data-btn-level', btnLevel)
        backBtnClass.setAttribute('data-root-title', rootTitle)

        const rootTitleValue = rootTitle ?? title;
        backBtnClass.setAttribute('data-root-title', rootTitleValue)
    }

    hideOtherElements(nextLinkBtnSelector, title, elementsToHide, action) {
        const nextLinkBtns = this.querySelectorAll(nextLinkBtnSelector);

        if (!(nextLinkBtns instanceof NodeList) && nextLinkBtns.length) return;

        if (!elementsToHide.length && !nextLinkBtnSelector) return;

        this.navigationMainMenu.manageClasses(elementsToHide, 'add', 'hidden');

        nextLinkBtns.forEach((element) => {
            if ('back' === action && nextLinkBtnSelector === this.rootLinkBtnSelector) {
                element.classList.remove('hidden')
                this.navigationMainMenu.manageClasses(element, ['remove', 'add'], ['focus-btn', 'hover-btn'])
                this.navigationMainMenu.changeChevronIconColor(element, '#000');
            }

            if (element.dataset.rootTitle !== title) return;
            this.navigationMainMenu.manageClasses(element, 'remove', 'hidden');
            this.navigationMainMenu.removeHighlightsOfNotSelected(element);
        })
    }

}

if (!customElements.get('navigation-mobile-screen-component')) {
    customElements.define('navigation-mobile-screen-component', NavigationMobileScreenComponent);
}
