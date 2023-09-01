export interface RouterLinkConfigTypes {
    title: string
    subTitles?: string[]
    link: string
}

export interface PillarsConfigTypes {
    title: string;
    description: string;
    icon: Function;
}

export interface DappRewardConfigTypes {
    title: string;
    description: string;
    svg: Function;
    count: number;
}

export interface TokenListTypes {
    name: string;
    address: `0x${string}`;
    balance: number;
    index: number;
}