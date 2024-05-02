class NavigationLargeScreenComponent extends HTMLElement {
    constructor() {
        super();
        const { linkLevelContainer, btnLinkLevel, linksTitleSelector, linksSecondarySelector, customMenuAttribute, customImageSelector, linkContainerSelector, rootLevelLinkSelector } = this.dataset
        this.linkLevelContainer = linkLevelContainer;
        this.btnLinkLevel = btnLinkLevel;
        this.customImageSelector = customImageSelector;
        this.linksTitleSelector = linksTitleSelector
        this.linksSecondarySelector = linksSecondarySelector
        this.customMenuAttribute = customMenuAttribute;
        this.commonLinkAttribute = linkContainerSelector;
        this.rootLinkLevelSelector = rootLevelLinkSelector;
        this.navigationMainMenu = document.querySelector('navigation-menu-main')
    }

    connectedCallback() {
        this.showParentMenu()
    }

    showParentMenu() {
        const currentLinkBtns = this.querySelectorAll(this.btnLinkLevel);

        if (!(currentLinkBtns instanceof NodeList) && currentLinkBtns.length) return;
        console.log('currentLinkBtns', currentLinkBtns)
        currentLinkBtns.forEach((element) => {
            element.addEventListener('click', (e) => {
                e.preventDefault();

                const { title, btnLevel } = element.dataset;

                const hasChildLinks = element.querySelector('.chevron-right-icon > path');

                const notSelectedBtnLinkElements = this.querySelectorAll(`${btnLevel}:not([data-title="${title}"])`);

                this.navigationMainMenu.removeHighlightsOfNotSelected(notSelectedBtnLinkElements, this.nextElementSibling)

                this.navigationMainMenu.manageClasses(element, ['add', 'remove'], ['focus-btn', 'hover-btn'])
                if (hasChildLinks) {
                    this.navigationMainMenu.changeChevronIconColor(element, '#fff');
                    this.showChildMenu(title, this.nextElementSibling)
                    this.renderLinkHeaders(this.nextElementSibling, title)
                    this.showCustomMenu(this.nextElementSibling, title)
                    this.showCustomImageMenu(btnLevel, title, true);
                } else {
                    this.showCustomImageMenu(btnLevel, title, false);
                }

                this.selectNextElementSibling(this.nextElementSibling, title, true, !hasChildLinks)
            })
        })
    }

    showChildMenu(rootTitle, currentLinkContainer) {
        if (!rootTitle || !currentLinkContainer || !currentLinkContainer.classList.contains(this.commonLinkAttribute)) return;
        currentLinkContainer.classList.remove('hidden');
        const currentLinkBtnSelector = currentLinkContainer.dataset.btnLinkLevel;
        const currentLinkBtns = currentLinkContainer.querySelectorAll(currentLinkBtnSelector);

        if (!(currentLinkBtns instanceof NodeList) && currentLinkBtns.length) return;
        this.navigationMainMenu.hideElementIfNotMatched(currentLinkBtns, rootTitle, 'rootTitle');
    }

    showCustomMenu(currentLinkContainer, parentTitle) {
        if (!parentTitle || !currentLinkContainer || !currentLinkContainer.classList.contains(this.commonLinkAttribute)) return;
        const customMenuContainers = currentLinkContainer.querySelectorAll(this.customMenuAttribute);

        if (!(customMenuContainers instanceof NodeList) && !customMenuContainers.length) return;

        const currentContainerLinkLevel = currentLinkContainer.dataset.linkLevelContainer;


        customMenuContainers.forEach((element) => {
            element.dataset.linkLevelContainer
            if (element.dataset.linkLevelContainer !== currentContainerLinkLevel) {
                element.remove();
            } else {
                const currentElementTitle = element.dataset.parentTitle;
                this.showCustomMenuLinks(currentElementTitle, parentTitle, element)
            }
        })
    }

    showCustomMenuLinks(currentElementTitle, parentTitle, element) {
        if (!currentElementTitle || !parentTitle || !element) return;
        if (currentElementTitle === parentTitle) {
            element.classList.remove('hidden');
            element.querySelectorAll('button').forEach((btnElement) => {
                this.navigationMainMenu.manageClasses(btnElement, 'remove', 'hidden');
            })
        } else {
            element.classList.add('hidden');
        }
    }

    showCustomImageMenu(btnLevel, title, hasChildLinks) {
        const customImageMenu = document.querySelector(this.customImageSelector);
        const currentImages = customImageMenu.querySelectorAll('div');

        if (!customImageMenu) return;

        if (btnLevel !== this.rootLinkLevelSelector) return;

        if (hasChildLinks) {
            this.navigationMainMenu.manageClasses(customImageMenu, ['remove', 'add'], ['hidden', 'display-grid'])
            this.navigationMainMenu.hideElementIfNotMatched(currentImages, title, 'title');
        }

        if (btnLevel === this.rootLinkLevelSelector && !hasChildLinks) {
            this.navigationMainMenu.manageClasses(customImageMenu, ['add', 'remove'], ['hidden', 'display-grid'])
        }
    }

    renderLinkHeaders(nextLinkContainer, rootTitle) {
        if (!nextLinkContainer || !nextLinkContainer.classList.contains(this.commonLinkAttribute)) return;

        const nextMenuHeaderTitle = nextLinkContainer.querySelector(this.linksTitleSelector);
        const nextMenuSecondaryTitle = nextLinkContainer.querySelector(this.linksSecondarySelector);

        if (nextMenuHeaderTitle && nextMenuSecondaryTitle) {
            nextMenuHeaderTitle.textContent = rootTitle;
            nextMenuSecondaryTitle.textContent = `See All ${rootTitle}`
        }
    }

    selectNextElementSibling(baseTargetElement, title, isBaseTargetExist, hasChildLinks) {
        if (!isBaseTargetExist) return;
        const nextLevelElement = baseTargetElement.classList.contains(this.commonLinkAttribute);

        if (nextLevelElement) {
            const resetNextLevelElementBtns = baseTargetElement?.querySelectorAll(`button:not([data-root-title="${title}"])`)
            this.navigationMainMenu.removeHighlightsOfNotSelected(resetNextLevelElementBtns)
            this.hideOtherElementsIfNoLinks(hasChildLinks, baseTargetElement)
            this.selectNextElementSibling(baseTargetElement.nextElementSibling, title, nextLevelElement);
        }
    }

    hideOtherElementsIfNoLinks(hasChildLinks, elementContainerToHide) {
        if (hasChildLinks && elementContainerToHide) {
            this.navigationMainMenu.manageClasses(elementContainerToHide, ['add'], ['hidden'])
        }
    }


}

if (!customElements.get('navigation-large-screen-component')) {
    customElements.define('navigation-large-screen-component', NavigationLargeScreenComponent);
}
