import RewardsSVG from "../SVG/Rewards";
import ScarcitySVG from "../SVG/Scarcity";
import StabilitySVG from "../SVG/Stability";
import { PillarsConfigTypes } from "./type";

export const PillarsConfig: PillarsConfigTypes[] = [
    {
        title: 'Scarcity',
        description: 'Please add "Scarcity is at the core at any value. Therefore to build community value, Shezmu is designed to be scarce',
        icon: ScarcitySVG
    },
    {
        title: 'Stability',
        description: 'Please add "The structure of Shezmu’s tokenomic incentivizes long term stability through multiple unique mechanisms developed by the Shezmu Team',
        icon: StabilitySVG
    },
    {
        title: 'Rewards',
        description: 'Guardian owners earn Shezmu and USDC rewards',
        icon: RewardsSVG
    }
]

export const ShezmuOfferConfig: PillarsConfigTypes[] = [
    {
        title: 'Daily Shezmu rewards',
        description: 'Guardian owners have the ability to claim Shezmu rewards at the current reward yield',
        icon: ScarcitySVG
    },
    {
        title: 'USDC allowance',
        description: 'Guardian owners are entitled to a share of the sales tax paid via USDC',
        icon: StabilitySVG
    },
    {
        title: 'No lockout periods whatsoever',
        description: 'Guardian owners always have the ability to sell their Guardians meaning no illiquid positions ever',
        icon: RewardsSVG
    }
]