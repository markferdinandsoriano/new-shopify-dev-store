
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
        this.exitIconSelector = exitIconSelector
    }

    connectedCallback() {
        this.showLinkBtns(this.rootLinkBtnSelector);
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

    showLinkBtns(btnSelector) {
        const currentLinkBtns = this.querySelectorAll(btnSelector);
        if (!(currentLinkBtns instanceof NodeList) && currentLinkBtns.length) return;

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
    }

    backToPreviousLink(btnLevel, rootTitle) {
        const action = 'back'
        if (btnLevel === this.level2LinkBtnSelector) {
            this.hideOtherElements(this.level1LinkBtnSelector, rootTitle, [this.querySelectorAll(`button[data-btn-level="${btnLevel}"]`), this.querySelectorAll(`button[data-btn-level="${this.rootLinkBtnSelector}"]`)], action)
            this.showBackBtnElement(rootTitle, this.level1LinkBtnSelector, null, action)
            return;
        }

        if (btnLevel === this.level1LinkBtnSelector) {
            this.hideOtherElements(this.rootLinkBtnSelector, rootTitle, [this.querySelectorAll(`button[data-btn-level="${btnLevel}"]`), this.querySelectorAll(`button[data-btn-level="${this.level2LinkBtnSelector}"]`)], action)
            this.showBackBtnElement(rootTitle, this.rootLinkBtnSelector, null, action)
            return;
        }

    }

    showNextLinkBtns(title, btnLevel, rootTitle) {
        if (btnLevel === this.rootLinkBtnSelector) {
            this.hideOtherElements(this.level1LinkBtnSelector, title, [this.querySelectorAll(`button[data-btn-level="${btnLevel}"]`), this.querySelectorAll(`button[data-btn-level="${this.level2LinkBtnSelector}"]`)])
            this.showLinkBtns(this.level1LinkBtnSelector);
            this.showBackBtnElement(title, this.level1LinkBtnSelector, rootTitle)
            return;
        }

        if (btnLevel === this.level1LinkBtnSelector) {
            this.hideOtherElements(this.level2LinkBtnSelector, title, [this.querySelectorAll(`button[data-btn-level="${btnLevel}"]`), this.querySelectorAll(`button[data-btn-level="${this.rootLinkBtnSelector}"]`)])
            this.showLinkBtns(this.level2LinkBtnSelector)
            this.showBackBtnElement(title, this.level2LinkBtnSelector, rootTitle)
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
            this.changeTitleContent(menuMainTitleElement, backBtnClass, 'Harvey Norman', btnLevel, 'Harvey Norman')
            this.navigationMainMenu.manageClasses(btnParentElement, ['add', 'remove'], ['hidden', 'display-grid'])
            this.navigationMainMenu.manageClasses(menuTitleParentElement, ['remove', 'add'], ['col-span-2', 'col-span-3'])
        } else {
            this.changeTitleContent(menuMainTitleElement, backBtnClass, title, btnLevel, rootTitle)
            this.navigationMainMenu.manageClasses(btnParentElement, ['remove', 'add'], ['hidden', 'display-grid'])
            this.navigationMainMenu.manageClasses(menuTitleParentElement, ['add', 'remove'], ['col-span-2', 'col-span-3'])
        }
    }

    changeTitleContent(menuMainTitleElement, backBtnClass, title, btnLevel, rootTitle) {
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

        elementsToHide.forEach((element) => {
            this.navigationMainMenu.manageClasses(element, ['add'], ['hidden'])
        })

        if ('back' === action && nextLinkBtnSelector === this.rootLinkBtnSelector) {
            nextLinkBtns.forEach((element) => {
                element.classList.remove('hidden')
                this.navigationMainMenu.manageClasses(element, ['remove', 'add'], ['focus-btn', 'hover-btn'])
                this.navigationMainMenu.changeChevronIconColor(element, '#000');
            })
        } else {
            nextLinkBtns.forEach((element) => {
                if (element.dataset.rootTitle !== title) return;
                this.navigationMainMenu.manageClasses(element, 'remove', 'hidden');
                this.navigationMainMenu.removeHighlightsOfNotSelected(element);
            })
        }
    }

}

if (!customElements.get('navigation-mobile-screen-component')) {
    customElements.define('navigation-mobile-screen-component', NavigationMobileScreenComponent);
}
