class NavigationMenuComponent extends HTMLElement {
    constructor() {
        super();
        const { linkLevelContainer, btnLinkLevel, customMenuAttribute, customImageSelector, linkContainerSelector, rootLevelLinkSelector } = this.dataset
        this.linkLevelContainer = linkLevelContainer;
        this.btnLinkLevel = btnLinkLevel;
        this.customImageSelector = customImageSelector;
        this.customMenuAttribute = customMenuAttribute;
        this.commonLinkAttribute = linkContainerSelector;
        this.rootLinkLevelSelector = rootLevelLinkSelector;
        this.navigationLargeScreenMainComponent = document.querySelector('navigation-large-screen')
    }

    connectedCallback() {
        this.showParentMenu()
    }

    showParentMenu() {
        const currentLinkBtns = this.querySelectorAll(this.btnLinkLevel);

        if (!(currentLinkBtns instanceof NodeList) && currentLinkBtns.length) return;

        currentLinkBtns.forEach((element) => {
            element.addEventListener('click', (e) => {
                e.preventDefault();
                const { title, btnLevel } = element.dataset;

                const hasChildLinks = element.querySelector('.chevron-right-icon > path');

                const notSelectedBtnLinkElements = this.querySelectorAll(`${btnLevel}:not([data-title="${title}"])`);

                this.navigationLargeScreenMainComponent.removeHighlightsOfNotSelected(notSelectedBtnLinkElements, this.nextElementSibling)

                this.navigationLargeScreenMainComponent.manageClasses(element, ['add', 'remove'], ['focus-btn', 'hover-btn'])
                if (hasChildLinks) {
                    this.navigationLargeScreenMainComponent.changeChevronIconColor(element, '#fff');
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

        currentLinkBtns.forEach((element) => {
            const { rootTitle: title } = element.dataset;

            if (title === rootTitle) {
                element.classList.remove('hidden');
            } else {
                element.classList.add('hidden');
            }

        })

    }

    showCustomMenu(currentLinkContainer, parentTitle) {
        if (!parentTitle || !currentLinkContainer || !currentLinkContainer.classList.contains('link-container')) return;
        const customMenuContainers = currentLinkContainer.querySelectorAll(`[${this.customMenuAttribute}]`);

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
                this.navigationLargeScreenMainComponent.manageClasses(btnElement, 'remove', 'hidden');
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
            this.navigationLargeScreenMainComponent.manageClasses(customImageMenu, ['remove', 'add'], ['hidden', 'display-grid'])
            currentImages.forEach((imgContainerElement) => {
                if (imgContainerElement.dataset.title === title) {
                    imgContainerElement.classList.remove('hidden')
                } else {
                    imgContainerElement.classList.add('hidden')
                }
            })
        }

        if (btnLevel === this.rootLinkLevelSelector && !hasChildLinks) {
            this.navigationLargeScreenMainComponent.manageClasses(customImageMenu, ['add', 'remove'], ['hidden', 'display-grid'])
        }
    }

    renderLinkHeaders(nextLinkContainer, rootTitle) {
        if (!nextLinkContainer || !nextLinkContainer.classList.contains('link-container')) return;

        const nextMenuHeaderTitle = nextLinkContainer.querySelector('.link-headers .link-title');
        const nextMenuSecondaryTitle = nextLinkContainer.querySelector('.link-headers .link-secondary-title');

        if (nextMenuHeaderTitle && nextMenuSecondaryTitle) {
            nextMenuHeaderTitle.textContent = rootTitle;
            nextMenuSecondaryTitle.textContent = `See All ${rootTitle}`
        }
    }

    selectNextElementSibling(baseTargetElement, title, isBaseTargetExist, hasChildLinks) {
        if (!isBaseTargetExist) return;
        const nextLevelElement = baseTargetElement.classList.contains('link-container');

        if (nextLevelElement) {
            const resetNextLevelElementBtns = baseTargetElement?.querySelectorAll(`button:not([data-root-title="${title}"])`)
            this.navigationLargeScreenMainComponent.removeHighlightsOfNotSelected(resetNextLevelElementBtns)
            this.hideOtherElementsIfNoLinks(hasChildLinks, baseTargetElement)
            this.selectNextElementSibling(baseTargetElement.nextElementSibling, title, nextLevelElement);
        }
    }

    hideOtherElementsIfNoLinks(hasChildLinks, elementContainerToHide) {
        if (hasChildLinks && elementContainerToHide) {
            this.navigationLargeScreenMainComponent.manageClasses(elementContainerToHide, ['add'], ['hidden'])
        }
    }


}

if (!customElements.get('navigation-menu-component')) {
    customElements.define('navigation-menu-component', NavigationMenuComponent);
}
