
class NavigationMenu extends HTMLElement {
    constructor() {
        super();
        this.navIcon = this.querySelector("#nav-icon");
    }

    connectedCallback() {
        const headerTitle = this.querySelector('#header-title');
        const navContents = this.querySelector('#nav-contents');
        const navContentsDesktop = this.querySelector('#nav-contents-desktop')
        const backIconBtn = this.querySelector('#back-icon-btn');
        const closeIcon = this.querySelector('#close-menu');
        const fistLevelMenuElements = this.querySelectorAll('#first-level-links');
        const secondLevelLinks = this.querySelectorAll('#second-level-links');
        const secondLevelTitle = this.querySelectorAll('#second-level-title');
        const thirdlevelLinks = this.querySelectorAll('#third-level-links');
        this.desktopNavigation()

        closeIcon.addEventListener('click', () => {
            navContents.classList.toggle('hidden')
        })

        this.navIcon.addEventListener('click', () => {
            navContents.classList.toggle('hidden')
            navContentsDesktop.classList.toggle('hidden')
        })


        fistLevelMenuElements.forEach((element) => {
            element.addEventListener('click', () => {
                const { title } = element.dataset;

                headerTitle.innerText = title
                headerTitle.setAttribute('title-level', 2)
                fistLevelMenuElements.forEach((element) => {
                    element.classList.add('hidden')
                })

                backIconBtn.classList.remove('hidden')

                secondLevelLinks.forEach((secondLevelElement) => {
                    const secondLevelTitle = secondLevelElement.dataset.title
                    if (title === secondLevelTitle) {
                        secondLevelElement.classList.toggle('hidden')
                    }
                })

            })
        })

        secondLevelTitle.forEach((secondElement) => {
            secondElement.addEventListener('click', () => {
                const { title } = secondElement.dataset;

                headerTitle.innerText = title
                headerTitle.setAttribute('title-level', 3)
                secondLevelTitle.forEach((secondLevelTitleELement) => {
                    secondLevelTitleELement.classList.add('hidden')
                })

                backIconBtn.classList.remove('hidden');

                thirdlevelLinks.forEach((thirdLevelElement) => {
                    const thirdLevelLinkTitle = thirdLevelElement.dataset.title
                    if (title === thirdLevelLinkTitle) {
                        thirdLevelElement.classList.toggle('hidden')
                    }
                })
            })
        })

        backIconBtn.addEventListener('click', (event) => {
            if (!headerTitle.hasAttribute('title-level')) return;
            const titleLevel = headerTitle.getAttribute('title-level');

            if ("3" === titleLevel) {
                thirdlevelLinks.forEach((thirdlevelLinksElement) => {
                    thirdlevelLinksElement.classList.add('hidden')
                })

                secondLevelLinks.forEach((secondLevelElement) => {
                    if (!secondLevelElement.classList.contains('hidden')) {

                        secondLevelElement.querySelectorAll('#second-level-title').forEach((secondLevelTitles) => {
                            secondLevelTitles.classList.toggle('hidden')
                        })

                        const previousTitle = secondLevelElement.getAttribute('data-title');
                        headerTitle.innerText = previousTitle
                        headerTitle.setAttribute('title-level', 2)
                    }

                })
            }

            if ("2" === titleLevel) {
                secondLevelLinks.forEach((secondLevelElement) => {
                    secondLevelElement.classList.add('hidden')
                })

                fistLevelMenuElements.forEach((firstLevelElements) => {
                    firstLevelElements.classList.toggle('hidden')
                    headerTitle.innerText = 'Title'
                    headerTitle.setAttribute('title-level', false)
                })

                backIconBtn.classList.toggle('hidden')
            }


        })

    }

    desktopNavigation() {
        const parentLinkList = this.querySelectorAll('.parent-link');
        const childLinkList = this.querySelectorAll('.child-link')
        parentLinkList.forEach((parentElement) => {
            parentElement.addEventListener('click', (event) => {
                const childLinkContainer = this.querySelector('[child-link-container]');
                childLinkContainer.classList.toggle('hidden')
                this.querySelectorAll('.child-link').forEach((childElement) => {

                    const { title } = childElement.dataset

                    if (event.target.innerText === title) {
                        childElement.classList.remove('hidden')
                    } else {
                        childElement.classList.add('hidden')
                    }

                })
            })
        })

        childLinkList.forEach((childElement) => {
            childElement.addEventListener('click', (event) => {
                const grandChildLinkContainer = this.querySelector('[grand-child-link-container]');
                grandChildLinkContainer.classList.toggle('hidden');
                this.querySelectorAll('.grand-child-link').forEach((grandChildElement) => {


                    const { title } = grandChildElement.dataset

                    if (event.target.innerText === title) {
                        grandChildElement.classList.remove('hidden')
                    } else {
                        grandChildElement.classList.add('hidden')
                    }

                })
            })

        })
    }
}

if (!customElements.get('navigation-menu')) {
    customElements.define('navigation-menu', NavigationMenu);
}
