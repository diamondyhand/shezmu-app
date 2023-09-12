// ** npm module
import { Icon } from '@iconify/react';
// ** style imports
import { LaunchAppButton } from '../style';

interface LaunchAppBtnProps {
    className?: string
}

export default function LaunchAppBtn(props: LaunchAppBtnProps) {
    return (
        <a href='/dapp'>
            <LaunchAppButton {...props}>
                Launch app
                <Icon icon="teenyicons:top-right-outline" className='text-base sm:text-xl' />
            </LaunchAppButton>
        </a>
    )
}
