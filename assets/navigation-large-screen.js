
class NavigationLargeScreen extends HTMLElement {
    constructor() {
        super();
        this.navIcon = this.querySelector("#nav-icon");

    }

    connectedCallback() {
        this.toggleNavContentsDesktop()
        this.focusOnNavLinks()
    }

    toggleNavContentsDesktop() {
        this.navIcon.addEventListener('click', (e) => {
            const hamburgerIcon = this.querySelector('.hamburger-icon');
            const exitIcon = this.querySelector('.exit-icon');
            const childLinksElement = this.querySelector('[child-link-container]');
            const grandChildLinksElement = this.querySelector('[grand-child-link-container]');
            const customImageContainer = this.querySelector('[custom-image-container]');
            const parentLinkBtn = this.querySelectorAll('.parent-link-btn');

            const navContentsDesktop = this.querySelector('#nav-contents-desktop');
            navContentsDesktop.classList.toggle('hidden')
            navContentsDesktop.classList.toggle('display-grid')

            if (navContentsDesktop.classList.contains('hidden')) {
                hamburgerIcon.classList.remove('hidden');
                exitIcon.classList.add('hidden');
                customImageContainer.classList.add('hidden');
                customImageContainer.classList.remove('display-grid');
                childLinksElement.classList.add('hidden');
                grandChildLinksElement.classList.add('hidden');
                parentLinkBtn.forEach((parentLinkBtnElement) => {
                    parentLinkBtnElement.classList.remove('focus-btn');
                    parentLinkBtnElement.classList.add('hover-btn');
                    const _chevronRightIcon = parentLinkBtnElement.querySelector('.chevron-right-icon > path');

                    if (!_chevronRightIcon) return;
                    _chevronRightIcon.setAttribute('fill', '#000000')
                })
            } else {
                hamburgerIcon.classList.add('hidden');
                exitIcon.classList.remove('hidden');
            }
        });
    }

    focusOnNavLinks() {
        const parentLinkBtn = this.querySelectorAll('.parent-link-btn');


        parentLinkBtn.forEach((parentLinkBtnElement, index) => {
            parentLinkBtnElement.addEventListener('click', (e) => {
                e.preventDefault();
                const parentLinkBtnIndex = parseInt(e.target.getAttribute('data-index'));
                const parentLinkTitle = e.target.getAttribute('data-title');
                const chevronRightIcon = e.target.querySelector('.chevron-right-icon > path');
                const childMainHeader = this.querySelector('.child-main-header');
                const childSecondaryHeader = this.querySelector('.child-secondary-header');
                const customImageContainer = this.querySelector('[custom-image-container]');

                childMainHeader.textContent = parentLinkTitle;
                childSecondaryHeader.textContent = `See All ${parentLinkTitle}`

                parentLinkBtnElement.classList.add('focus-btn');
                parentLinkBtnElement.classList.remove('hover-btn');

                if (chevronRightIcon) {
                    chevronRightIcon.setAttribute('fill', '#fff')
                    this.toggleShowChildLink(parentLinkTitle);
                } else {
                    const childLinksElement = this.querySelector('[child-link-container]');
                    const grandChildLinksElement = this.querySelector('[grand-child-link-container]');
                    childLinksElement.classList.add('hidden');
                    grandChildLinksElement.classList.add('hidden');
                    customImageContainer.classList.add('hidden');
                    customImageContainer.classList.remove('display-grid');
                }

                parentLinkBtn.forEach((parentLinkNotFocusBtn, _parentLinkBtnIndex = index) => {
                    const _chevronRightIcon = parentLinkNotFocusBtn.querySelector('.chevron-right-icon > path');
                    if (parentLinkBtnIndex !== _parentLinkBtnIndex) {
                        parentLinkNotFocusBtn.classList.remove('focus-btn');
                        parentLinkNotFocusBtn.classList.add('hover-btn');

                        if (_chevronRightIcon) {
                            _chevronRightIcon.setAttribute('fill', '#000000')
                        }
                    }
                })

            });

        })
    }

    toggleShowChildLink(parentLinkTitle) {
        const childLinksElement = this.querySelector('[child-link-container]');
        const childLinkBtnElements = this.querySelectorAll('.child-link-btn');
        const customImageContainer = this.querySelector('[custom-image-container]');

        customImageContainer.classList.remove('hidden');
        customImageContainer.classList.add('display-grid');
        childLinksElement.classList.remove('hidden');

        childLinkBtnElements.forEach((childLinkEachElement) => {
            if (childLinkEachElement.getAttribute('data-title') === parentLinkTitle) {
                childLinkEachElement.classList.remove('hidden');
                childLinkEachElement.addEventListener('click', (e) => {
                    e.preventDefault();

                    const { childTitle } = e.target.dataset

                    childLinkEachElement.classList.add('focus-btn');
                    childLinkEachElement.classList.remove('hover-btn');

                    const chevronRightIcon = e.target.querySelector('.chevron-right-icon > path');

                    const grandChildMainHeader = this.querySelector('.grand-child-main-header');
                    const grandChildSecondaryHeader = this.querySelector('.grand-child-secondary-header');

                    grandChildMainHeader.textContent = childTitle;
                    grandChildSecondaryHeader.textContent = `See All ${childTitle}`

                    if (chevronRightIcon) {
                        chevronRightIcon.setAttribute('fill', '#fff')
                        this.toggleShowGrandChildLink(childTitle);
                    } else {
                        const grandChildLinksElement = this.querySelector('[grand-child-link-container]');
                        grandChildLinksElement.classList.add('hidden');
                    }



                    childLinkBtnElements.forEach((childLinkNotFocusBtn) => {
                        const _childTitle = childLinkNotFocusBtn.dataset.childTitle
                        const _chevronRightIcon = childLinkNotFocusBtn.querySelector('.chevron-right-icon > path');

                        if (childTitle !== _childTitle) {
                            childLinkNotFocusBtn.classList.remove('focus-btn')
                            childLinkNotFocusBtn.classList.add('hover-btn')
                            if (_chevronRightIcon) {
                                _chevronRightIcon.setAttribute('fill', '#000000')
                            }
                        }

                    })
                })
            } else {
                childLinkEachElement.classList.add('hidden');
            }
        })
    }

    toggleShowGrandChildLink(childLinkTitle) {
        const grandChildLinksElement = this.querySelector('[grand-child-link-container]');
        const customImageContainer = this.querySelector('[custom-image-container]');

        const grandChildLinkBtnElements = this.querySelectorAll('.grand-child-link-btn');
        grandChildLinksElement.classList.remove('hidden');
        customImageContainer.classList.add('display-grid');
        customImageContainer.classList.remove('hidden');

        grandChildLinkBtnElements.forEach((grandChildLinkEachElement) => {
            if (grandChildLinkEachElement.getAttribute('data-child-title') === childLinkTitle) {
                grandChildLinkEachElement.classList.remove('hidden');
                grandChildLinkEachElement.addEventListener('click', (e) => {
                    e.preventDefault();
                })

            } else {
                grandChildLinkEachElement.classList.add('hidden');
            }
        })

    }


}

if (!customElements.get('navigation-large-screen')) {
    customElements.define('navigation-large-screen', NavigationLargeScreen);
}
