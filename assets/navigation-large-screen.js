
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
        this.navIcon.addEventListener('click', () => {
            const hamburgerIcon = this.querySelector('.hamburger-icon');
            const exitIcon = this.querySelector('.exit-icon');

            const navContentsDesktop = this.querySelector('#nav-contents-desktop');
            navContentsDesktop.classList.toggle('hidden')
            navContentsDesktop.classList.toggle('display-grid')

            if (navContentsDesktop.classList.contains('hidden')) {
                hamburgerIcon.classList.remove('hidden');
                exitIcon.classList.add('hidden');
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

                parentLinkBtnElement.classList.add('focus-btn');
                parentLinkBtnElement.classList.remove('hover-btn');
                this.toggleShowChildLink(parentLinkTitle);

                parentLinkBtn.forEach((parentLinkNotFocusBtn, _parentLinkBtnIndex = index) => {
                    if (parentLinkBtnIndex !== _parentLinkBtnIndex) {
                        parentLinkNotFocusBtn.classList.remove('focus-btn')
                        parentLinkNotFocusBtn.classList.add('hover-btn')
                    }
                })

            });

        })
    }

    toggleShowChildLink(parentLinkTitle) {
        const childLinksElement = this.querySelector('[child-link-container]');
        childLinksElement.classList.remove('hidden');
        const childLinkBtnElements = this.querySelectorAll('.child-link-btn');

        childLinkBtnElements.forEach((childLinkEachElement) => {
            if (childLinkEachElement.getAttribute('data-title') === parentLinkTitle) {
                childLinkEachElement.classList.remove('hidden');
                childLinkEachElement.addEventListener('click', (e) => {
                    e.preventDefault();

                    const { title, childTitle } = e.target.dataset

                    childLinkEachElement.classList.add('focus-btn');
                    childLinkEachElement.classList.remove('hover-btn');

                    this.toggleShowGrandChildLink(childTitle);

                    childLinkBtnElements.forEach((childLinkNotFocusBtn) => {
                        const _childTitle = childLinkNotFocusBtn.dataset.childTitle

                        if (childTitle !== _childTitle) {
                            childLinkNotFocusBtn.classList.remove('focus-btn')
                            childLinkNotFocusBtn.classList.add('hover-btn')
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
        grandChildLinksElement.classList.remove('hidden');
        const grandChildLinkBtnElements = this.querySelectorAll('.grand-child-link-btn');

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
