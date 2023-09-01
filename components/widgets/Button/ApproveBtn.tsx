// ** style imports
import { ApproveButton } from './style'

interface ApproveBtnProps {
    className?: string;
    onClick?: () => void;
    isApproving?: boolean;
    isTokenApproved: boolean | undefined;
}

export default function ApproveBtn(props: ApproveBtnProps) {
    return (
        <ApproveButton disabled={props.isApproving} {...props}>{props.isApproving ? 'Approving...' : 'Approve'}</ApproveButton>
    )
}
