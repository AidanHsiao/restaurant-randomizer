import { NextApiRequest, NextApiResponse } from "next";

export default async function Handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const business = await main();
  res.status(200).json(business);
}

async function main() {
  let { businesses, total } = await searchBusinesses();
  const promiseList = [];
  for (let i = 0; i <= Math.floor(total / 50); i++) {
    promiseList.push(searchBusinesses(businesses, i * 50));
  }
  const randomBusiness = await Promise.allSettled(promiseList).then((resp) => {
    let latestResult = resp.pop();
    if (
      !latestResult ||
      latestResult.status === "rejected" ||
      !latestResult.value.businesses
    ) {
      return;
    }
    const businesses = latestResult.value.businesses;
    let randomIndex = 0;
    while (!businesses[randomIndex] || !randomIndex) {
      randomIndex = Math.floor(Math.random() * businesses.length - 1);
    }
    return businesses[randomIndex];
  });
  const resp = await fetch(
    `https://api.yelp.com/v3/businesses/${randomBusiness.id}`,
    {
      headers: {
        Authorization: `Bearer ${process.env.YELP_API_TOKEN}`,
      },
    }
  ).then((res) => res.json());
  return resp;
}

async function searchBusinesses(businesses: any[] = [], offset = 0) {
  let resp;
  try {
    const params = {
      limit: 50,
      open_now: true,
      categories: "restaurants",
      location: "Pismo Beach",
      offset: offset,
    };
    const paramText = Object.keys(params)
      .map((key) => `${key}=${params[key as keyof typeof params]}`)
      .join("&");
    resp = await fetch(
      `https://api.yelp.com/v3/businesses/search?${paramText}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.YELP_API_TOKEN}`,
        },
      }
    ).then((res) => res.json());
    const total = resp.total;
    if (resp.businesses?.length === 0 || !resp.businesses)
      return { businesses, total };
    resp.businesses.forEach((business: any) => businesses.push(business));
    return { businesses, total };
  } catch (e) {
    console.log(resp);
    return { value: { businesses: [] }, total: 0 };
  }
}
