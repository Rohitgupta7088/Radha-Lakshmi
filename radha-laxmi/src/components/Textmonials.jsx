const Textmonials = () => {
    const cardsData = [
        {
          description: 'Bangles are not just ornaments; they are emotions wrapped in colors and designs. From weddings to festivals, their gentle sound brings joy and positivity. They beautifully complete every traditional look with a touch of royalty.'
        },
        {
          description: 'The beauty of Indian bangles lies in their timeless grace. Each piece reflects our rich culture and traditions passed down through generations. Wearing them feels like carrying a piece of heritage, adding charm and elegance to every occasion.'
        },
        {
          description: 'There is something magical about the sparkle of bangles on the wrist. They symbolize prosperity, happiness, and feminine grace in Indian culture. Every design tells a story of craftsmanship and artistic excellence.'
        },
        {
          description: 'Adorning bangles is like celebrating tradition in its purest form. Their vibrant colors and intricate patterns make every moment special. They are a perfect blend of tradition and modern elegance, loved by every generation.'
        },
    ];

    const CreateCard = ({ card }) => (
        <div className="p-4 rounded-lg mx-4 shadow hover:shadow-lg transition-all duration-200 w-72 shrink-0">
            <p className="text-sm font-semibold py-4 text-gray-800">{ card.description}</p>
        </div>
    );

    return (
        <>
            <style>{`
            @keyframes marqueeScroll {
                0% { transform: translateX(0%); }
                100% { transform: translateX(-50%); }
            }

            .marquee-inner {
                animation: marqueeScroll 25s linear infinite;
            }

            .marquee-reverse {
                animation-direction: reverse;
            }
        `}</style>

            <div className="marquee-row w-full mx-auto overflow-hidden relative m-[50px]">
                <div className="absolute left-0 top-0 h-full w-20 z-10 pointer-events-none"></div>
                <div className="marquee-inner flex transform-gpu min-w-[200%] pt-10 pb-5">
                    {[...cardsData, ...cardsData].map((card, index) => (
                        <CreateCard key={index} card={card} />
                    ))}
                </div>
                <div className="absolute right-0 top-0 h-full w-20 md:w-40 z-10 pointer-events-none"></div>
            </div>
        </>
    )
}

export default Textmonials