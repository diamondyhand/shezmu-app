import { RouterLinkConfigTypes } from "./type"

export const IndexRouterLinkConfig: RouterLinkConfigTypes[] = [
    {
        title: 'Main',
        link: '/dapp'
    },
    {
        title: 'OpenSea',
        link: 'https://opensea.io/collection/shezmu-guardian'
    },
    {
        title: 'Social',
        link: ''
    }
]

export const DappRouterLinkConfig: RouterLinkConfigTypes[] = [
    {
        title: 'OpenSea',
        link: 'https://opensea.io/collection/shezmu-guardian'
    }
]

export const FooterLinkConfig: string[] = [
    'Disclaimer', 'Privacy policy', 'name@gmail.com', 'Coin address'
]

export const InputRange = [
    {
        label: '10',
        value: 10
    },
    {
        label: '100',
        value: 100
    },
    {
        label: '1K',
        value: 1000
    },
    {
        label: '1.6K',
        value: 1600
    }
]