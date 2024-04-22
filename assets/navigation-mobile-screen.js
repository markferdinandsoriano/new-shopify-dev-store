
class NavigationMobileScreen extends HTMLElement {
    constructor() {
        super();
        this.hamburgerIcon = this.querySelector('#nav-icon');
        this.closeIcon = this.querySelector("#close-menu");
    }

    connectedCallback() {
        this.toggleMenuContentsMobile();
        this.toggleShowMenus();
        this.toggleBackMenus();
    }

    toggleMenuContentsMobile() {
        this.closeIcon.addEventListener('click', () => {
            const menuContent = this.querySelector('#menu-content');
            const backMenuBtn = this.querySelector('#back-menu-btn');
            const titleHeader = this.querySelector('.title-header');
            const parentLinkBtn = this.querySelectorAll('.parent-link-btn');
            const grandChildLinkBtnElements = this.querySelectorAll('.grand-child-link-btn');
            const childLinkBtnElements = this.querySelectorAll('.child-link-btn');

            menuContent.classList.remove('display-grid');
            menuContent.classList.add('hidden');
            titleHeader.textContent = 'HARVEY NORMAN';
            backMenuBtn.classList.add('hidden');
            backMenuBtn.setAttribute('data-link-level', '');
            backMenuBtn.setAttribute('data-parent-title', '');

            parentLinkBtn.forEach((parentLinkBtnElement) => {
                parentLinkBtnElement.classList.remove('hidden');
            })

            childLinkBtnElements.forEach((childLinkBtnElement) => {
                childLinkBtnElement.classList.add('hidden');
            })

            grandChildLinkBtnElements.forEach((grandChildLinkBtnElement) => {
                grandChildLinkBtnElement.classList.add('hidden');
            })
        })

        this.hamburgerIcon.addEventListener('click', () => {
            const menuContent = this.querySelector('#menu-content');
            menuContent.classList.remove('hidden');
            menuContent.classList.add('display-grid');
        })

    }

    toggleShowMenus() {
        const parentLinkBtn = this.querySelectorAll('.parent-link-btn');
        const titleHeader = this.querySelector('.title-header');
        const backMenuBtn = this.querySelector('#back-menu-btn');


        parentLinkBtn.forEach((parentLinkBtnElement) => {
            parentLinkBtnElement.addEventListener('click', (e) => {
                const parentLinkTitle = e.target.getAttribute('data-title');
                const childLinkBtnElements = this.querySelectorAll('.child-link-btn');

                titleHeader.textContent = parentLinkTitle;
                backMenuBtn.classList.remove('hidden');
                backMenuBtn.setAttribute('data-link-level', 'child');
                backMenuBtn.setAttribute('data-parent-title', parentLinkTitle);

                childLinkBtnElements.forEach((childLinkBtnElement) => {
                    const childLinkParentTitle = childLinkBtnElement.getAttribute('data-title');
                    const childLinkTitle = childLinkBtnElement.getAttribute('data-child-title');


                    if (parentLinkTitle === childLinkParentTitle) {
                        childLinkBtnElement.classList.toggle('hidden');

                        childLinkBtnElement.addEventListener('click', (e) => {

                            titleHeader.textContent = childLinkTitle;
                            backMenuBtn.classList.remove('hidden');
                            backMenuBtn.setAttribute('data-link-level', 'grand-child');

                            this.toggleShowGrandChildLinks(e, childLinkBtnElements)
                        })

                        parentLinkBtn.forEach((parentLinkBtnElement) => {
                            parentLinkBtnElement.classList.add('hidden');
                            parentLinkBtnElement.classList.add('hover-btn');
                        })
                    }
                })
            })

        })

    }

    toggleShowGrandChildLinks(e, childLinkBtnElements) {
        const childLinkTitle = e.target.getAttribute('data-child-title');
        const grandChildLinkBtnElements = this.querySelectorAll('.grand-child-link-btn');



        grandChildLinkBtnElements.forEach((grandChildLinkBtnElement) => {
            const grandChildLinktTitle = grandChildLinkBtnElement.getAttribute('data-title');
            if (grandChildLinktTitle === childLinkTitle) {
                grandChildLinkBtnElement.classList.remove('hidden');
            } else {
                grandChildLinkBtnElement.classList.add('hidden');
            }
        })

        childLinkBtnElements.forEach((childLinkBtnElement) => {
            childLinkBtnElement.classList.add('hidden');
            childLinkBtnElement.classList.add('hover-btn');
        })
    }

    toggleBackMenus() {
        const backMenuBtn = this.querySelector('#back-menu-btn');
        const titleHeader = this.querySelector('.title-header');
        backMenuBtn.addEventListener('click', (e) => {
            const linkLevel = e.target.getAttribute('data-link-level');
            const parentTitle = e.target.getAttribute('data-parent-title');
            const childLinkBtnElements = this.querySelectorAll('.child-link-btn');
            const parentLinkBtn = this.querySelectorAll('.parent-link-btn');

            if ('grand-child' === linkLevel) {
                const grandChildLinkBtnElements = this.querySelectorAll('.grand-child-link-btn');
                const titleHeader = this.querySelector('.title-header');

                grandChildLinkBtnElements.forEach((grandChildLinkBtnElement) => {
                    grandChildLinkBtnElement.classList.add('hidden');
                })

                childLinkBtnElements.forEach((childLinkBtnElement) => {
                    const childLinkParentTitle = childLinkBtnElement.getAttribute('data-title');
                    if (parentTitle === childLinkParentTitle) {
                        childLinkBtnElement.classList.remove('hidden');
                    }
                })

                backMenuBtn.setAttribute('data-link-level', 'child');
                titleHeader.textContent = parentTitle;
            }

            if ('child' === linkLevel) {

                childLinkBtnElements.forEach((childLinkBtnElement) => {
                    childLinkBtnElement.classList.add('hidden');
                })
                parentLinkBtn.forEach((parentLinkBtnElement) => {
                    parentLinkBtnElement.classList.remove('hidden');
                })

                backMenuBtn.classList.add('hidden');
                titleHeader.textContent = 'HARVEY NORMAN'
            }
        })
    }

}

if (!customElements.get('navigation-mobile-screen')) {
    customElements.define('navigation-mobile-screen', NavigationMobileScreen);
}
