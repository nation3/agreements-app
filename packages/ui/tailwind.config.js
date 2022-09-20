/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./**/*.{tsx,jsx}"],
    theme: {
        extend: {
            typography: ({ theme }) => ({
                n3: {
                    css: {
                        '--tw-prose-pre-code': theme('colors.gray[500]'),
                        '--tw-prose-pre-bg': theme('colors.gray[50]')
                    }
                }
            })
        }
    },
    plugins: [
        require("@tailwindcss/typography"),
    ],
}
