import Image from "next/image";
import { useEffect, useState } from "react";

type Props = {
    name: string;
}

const GuardianImage = ({ name }: Props) => {
    const [imageUrl, setImageUrl] = useState('/image/01-pharaoh.png');

    useEffect(() => {
        if (name == "pharaoh") {
            setImageUrl("/image/01-pharaoh.png");
        }
        if (name == "vizier") {
            setImageUrl("/image/02-vizier.png");
        }
        if (name == "noble") {
            setImageUrl("/image/03-noble.png");
        }
        if (name == "priest") {
            setImageUrl("/image/04-priest.png");
        }
        if (name == "scribe") {
            setImageUrl("/image/05-scribe.png");
        }
        if (name == "craftsmen") {
            setImageUrl("/image/06-craftsmen.png");
        }
    }, [name])

    return (
        <div className="flex flex-col items-center">
            <Image className="rounded-[16px]" src={imageUrl} width="97" height="97" alt='placeholder' />
        </div>
    );
};

export default GuardianImage