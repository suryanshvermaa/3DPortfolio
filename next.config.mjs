/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'avatars.githubusercontent.com',
			},
			{
				protocol: 'https',
				hostname: 'github-readme-stats.vercel.app',
			},
			{
				protocol: 'https',
				hostname: 'github-readme-streak-stats.herokuapp.com',
			},
			{
				protocol: 'https',
				hostname: 'github-readme-activity-graph.vercel.app',
			},
			{
				protocol: 'https',
				hostname: 'leetcard.jacoblin.cool',
			},
			{
				protocol: 'https',
				hostname: 'github-profile-summary-cards.vercel.app',
			},
		],
	},
};

export default nextConfig;
