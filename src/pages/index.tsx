import { useEffect, useState } from "react";

export default function Page() {
  const [restaurant, setRestaurant] = useState<any>({});

  useEffect(() => {
    if (!window) return;
    getRandomRestaurant();
  }, []);

  useEffect(() => {
    if (!Object.keys(restaurant).length) return;
    console.log("restaurant found.");
  }, [restaurant]);

  async function getRandomRestaurant() {
    const resp = await fetch("/api/random").then((res) => res.json());
    setRestaurant(resp);
    console.log(resp);
  }

  if (!Object.keys(restaurant).length) return <div></div>;

  return (
    <>
      <div
        className="fixed w-full h-full bg-cover bg-no-repeat bg-fixed bg-center -z-20 overflow-hidden"
        style={{
          backgroundImage: `url(${
            restaurant.image_url ||
            "https://s3-media0.fl.yelpcdn.com/assets/public/large_empty_biz_skyline.yji-0e6572ba15d839878b7a.svg"
          })`,
        }}
      >
        <div className="fixed w-full h-full -z-20 overflow-hidden bg-gray-700 opacity-80" />
      </div>
      <div id="mainContent" className="flex flex-col w-screen h-screen">
        <header
          id="header"
          className="text-white mb-36 mt-20 justify-end flex"
          style={{ width: "calc(100vw - 5rem)" }}
        >
          <div className="flex flex-col items-end">
            <div
              id="restaurantTitle"
              className="text-7xl w-max text-transparent bg-clip-text h-max mt-16 bg-auto"
              style={{
                textShadow: "2px 2px 50px black",
                backgroundSize: "100%",
                backgroundImage: `linear-gradient(to right, hsl(${
                  72 - restaurant.rating * 12
                }, 100%, 70%), hsl(${80 - restaurant.rating * 12}, 100%, 50%)`,
                lineHeight: "initial",
              }}
            >
              <a
                href={restaurant.url || ""}
                target="_blank"
                rel="noopener noreferrer"
              >
                {restaurant.name.slice(0, 25)}
                {restaurant.name.length > 25 ? "..." : ""}
              </a>
            </div>
            <div id="restaurantAddress" className="text-xl text-gray-200">
              {restaurant.location.address1 || restaurant.location.address2
                ? `${restaurant.location.address1} ${
                    restaurant.location.address2 || ""
                  } ${restaurant.location.address3 || ""}`
                : "[NO ADDRESS PROVIDED]"}
            </div>
          </div>
          <div className="h-36 w-6 ml-6 mt-12 flex flex-col justify-center items-center">
            {Array(5)
              .fill("")
              .map((_item, idx) => (
                <div
                  className={`w-6 ${
                    restaurant.rating === idx + 0.5 ? "h-3" : "h-6"
                  } my-1 rounded-sm flex overflow-hidden justify-center select-none`}
                  style={
                    idx + 0.5 <= restaurant.rating
                      ? {
                          backgroundColor: `hsl(${
                            60 - restaurant.rating * 6
                          }, 100%, 50%)`,
                        }
                      : {
                          display: "none",
                        }
                  }
                  key={`star_${idx}`}
                >
                  <span style={{ filter: `grayscale(1) brightness(2)` }}>
                    ⭐
                  </span>
                </div>
              ))}
          </div>
        </header>
        <main className="bg-gray-300 h-full w-full">hola</main>
      </div>
    </>
  );
}
