// const tailwindcss = require("tailwindcss");
// const IS_DEVELOPMENT = process.env.NODE_ENV === "development";
// const plugins = [tailwindcss];

// if (!IS_DEVELOPMENT) {
//   const purgecss = require("@fullhuman/postcss-purgecss");

//   class TailwindExtractor {
//     static extract(content) {
//       //   return content.match(/[A-z0-9-:\/]+/g) || [];
//       return content.match(/[A-Za-z0-9-_:/]+/g) || [];
//     }
//   }

//   plugins.push(
//     purgecss({
//       content: ["./*.html", "./*.js"],
//       extractors: [
//         {
//           extractor: TailwindExtractor,
//           extensions: ["html"],
//         },
//       ],
//     })
//   );
// }

// module.exports = {
//   plugins: plugins,
// };

const purgecss = require("@fullhuman/postcss-purgecss")({
  // Specify the paths to all of the template files in your project
  content: [
    "./src/**/*.html",
    "./src/**/*.js",
    "./src/**/*.jsx",
    // etc.
  ],

  // Include any special characters you're using in this regular expression
  defaultExtractor: (content) => content.match(/[\w-/:]+(?<!:)/g) || [],
});

module.exports = {
  plugins: [
    require("tailwindcss"),
    require("autoprefixer"),
    ...(process.env.NODE_ENV === "production" ? [purgecss] : []),
  ],
};
