import Craftsman from "../SVG/Craftsman";
import Noble from "../SVG/Noble";
import Pharaoh from "../SVG/Pharaoh";
import Priest from "../SVG/Priest";
import Scribe from "../SVG/Scribe";
import Viziers from "../SVG/Viziers";
import { DappRewardConfigTypes, TokenListTypes } from "./type";

export const DappRewardConfigForDesktop: DappRewardConfigTypes[] = [
    {
        title: 'Nobles 25x',
        description: 'Introducing Nobles, each is worth twenty five Guardians. Each Noble pays XXX Shezmu daily and USDC rewards',
        svg: Noble,
        count: 25
    },
    {
        title: 'Viziers  50x',
        description: 'Introducing Viziers, each is worth fifty Guardians. Each Vizier pays XXX Shezmu daily and USDC rewards',
        svg: Viziers,
        count: 50
    },
    {
        title: 'Pharaoh 100x',
        description: 'Introducing Pharaoh, each is worth one hundred Guardians. Each Pharaoh pays XXX Shezmu daily and USDC rewards',
        svg: Pharaoh,
        count: 100
    },
    {
        title: 'Craftsman 1x',
        description: 'Introducing Craftsman, each is worth one Guardian. Each Craftsman pays XXX Shezmu daily and USDC rewards',
        svg: Craftsman,
        count: 1
    },
    {
        title: 'Scribe  5x',
        description: 'Introducing Scribe, each is worth five Guardians. Each Scribe pays XXX Shezmu daily and USDC rewards',
        svg: Scribe,
        count: 5
    },
    {
        title: 'High Priest 10x',
        description: 'Introducing High Priest, each is worth ten Guardians. Each High Priest pays XXX Shezmu daily and USDC rewards',
        svg: Priest,
        count: 10
    }
]

export const DappRewardConfigForMobile: DappRewardConfigTypes[] = [
    {
        title: 'Craftsman 1x',
        description: 'Introducing Craftsman, each is worth one Guardian. Each Craftsman pays XXX Shezmu daily and USDC rewards',
        svg: Craftsman,
        count: 1
    },
    {
        title: 'Scribe  5x',
        description: 'Introducing Scribe, each is worth five Guardians. Each Scribe pays XXX Shezmu daily and USDC rewards',
        svg: Scribe,
        count: 5
    },
    {
        title: 'High Priest 10x',
        description: 'Introducing High Priest, each is worth ten Guardians. Each High Priest pays XXX Shezmu daily and USDC rewards',
        svg: Priest,
        count: 10
    },
    {
        title: 'Nobles 25x',
        description: 'Introducing Nobles, each is worth twenty five Guardians. Each Noble pays XXX Shezmu daily and USDC rewards',
        svg: Noble,
        count: 25
    },
    {
        title: 'Viziers  50x',
        description: 'Introducing Viziers, each is worth fifty Guardians. Each Vizier pays XXX Shezmu daily and USDC rewards',
        svg: Viziers,
        count: 50
    },
    {
        title: 'Pharaoh 100x',
        description: 'Introducing Pharaoh, each is worth one hundred Guardians. Each Pharaoh pays XXX Shezmu daily and USDC rewards',
        svg: Pharaoh,
        count: 100
    }
]

export const TabNameList: string[] = ['Mint', 'Reward', 'Compound']