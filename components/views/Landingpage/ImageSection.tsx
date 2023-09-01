export default function ImageSection() {
    return (
        <div className='w-full flex justify-center bg-[#050508] mt-0 md:-mt-16 px-5 md:px-12 lg:px-16 xl:px-0'>
            <img src='/image/landing_img_1.png' alt='placeholder' draggable={false} className="hidden md:block" />
            <img src='/image/landing_img_2.png' alt='placeholder' draggable={false} className="block md:hidden w-full" />
        </div>
    )
}
