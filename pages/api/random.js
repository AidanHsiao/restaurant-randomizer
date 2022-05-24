export default async function Handler(req, res) {
  const business = await main();
  res.status(200).json(business);
}

async function main() {
  let { businesses, total } = await searchBusinesses();
  const promiseList = [];
  for (let i = 0; i < Math.floor(total / 50); i++) {
    promiseList.push(searchBusinesses(businesses, (i + 1) * 50));
  }
  const randomBusiness = await Promise.allSettled(promiseList).then((resp) => {
    const businesses = resp.pop().value.businesses;
    const randomIndex = Math.floor(Math.random() * businesses.length - 1);
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

async function searchBusinesses(businesses = [], offset = 0) {
  const params = {
    limit: 50,
    open_now: true,
    categories: "restaurants",
    location: "San Mateo",
    offset: offset,
  };
  const paramText = Object.keys(params)
    .map((key) => `${key}=${params[key]}`)
    .join("&");
  const resp = await fetch(
    `https://api.yelp.com/v3/businesses/search?${paramText}`,
    {
      headers: {
        Authorization: `Bearer ${process.env.YELP_API_TOKEN}`,
      },
    }
  ).then((res) => res.json());
  resp.businesses.forEach((business) => businesses.push(business));
  const total = resp.total;
  return { businesses, total };
}
