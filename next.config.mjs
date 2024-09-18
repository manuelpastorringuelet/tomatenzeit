/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Permissions-Policy",
            value: "wake-lock=*",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
