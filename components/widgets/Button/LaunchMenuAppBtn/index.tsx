// ** npm module
import { Icon } from '@iconify/react';
// ** style imports
import { LaunchMenuAppButton } from '../style';

interface LaunchMenuAppBtnProps {
    className?: string
}

export default function LaunchMenuAppBtn(props: LaunchMenuAppBtnProps) {
    return (
        <a href='/dapp'>
            <LaunchMenuAppButton {...props}>
                Launch app
            </LaunchMenuAppButton>
        </a>
    )
}
