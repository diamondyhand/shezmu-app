interface ProgressBarProps {
    progressPercentage: number
}

const ProgressBar = ({ progressPercentage }: ProgressBarProps) => {
    return (
        <div className='h-2 w-full bg-[#F3F4F6] rounded-full transition-all'>
            <div
                style={{ width: `${progressPercentage}%` }}
                className={`h-full bg-[#F9D248] rounded-full`}
            />
        </div>
    );
};

export default ProgressBar