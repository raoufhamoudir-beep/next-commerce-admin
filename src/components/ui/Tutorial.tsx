
export default function Tutorial({ about }: {about : string}) {
    return (
        <div className="w-full h-full flex flex-col gap-4">

            <iframe
                src={about}
                title="Tutorial Video"
                allow="autoplay; fullscreen"
                allowFullScreen
                loading="lazy"
                className="w-full h-full"
            />
        </div>
    );
}