export const formatDuration = (duration: number) => {
    const days = Math.floor(duration / 3600 / 24);
    const hours = Math.floor((duration / 3600) % 24);
    const minutes = Math.floor((duration / 60) % 60);
    const seconds = Math.floor(duration % 60);
    return `${days > 0 ? `${days} days,` : ''} ${hours > 0 ? `${hours} hours,` : ''} ${minutes > 0 ? `${minutes} minutes,` : ''} ${seconds > 0 ? `${seconds} seconds` : ''}`
}

export const currentTime = () => {
    return Math.floor(Date.now() / 1000);
}