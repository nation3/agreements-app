const { i18n } = require('./next-i18next.config');
/** @type {import('next').NextConfig} */
module.exports = {
	reactStrictMode: true,
	images: {
		domains: ["https://picsum.photos/"],
	},
    i18n
};
