/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
};

const env = {
  GOOGLE_MAPS_TOKEN: "AIzaSyBfJaJsQADAcUs7fSCM_YWzxvvJu6x2cT4",
  YELP_API_TOKEN:
    "Te2SVOtlljGjAC05jtXMzTpNSmiWOUXMFvT9pzhSSlH-uDA9vyelK0BlMVGNVfWKeXU1OLtzr4oTkZChMOondveTXjDxUe-mIvTeuMBqfueTva09PVQEd7p33QaNYnYx",
};

module.exports = { nextConfig, env };
