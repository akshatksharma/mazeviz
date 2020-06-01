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

// const purgecss = require("@fullhuman/postcss-purgecss")({
//   // Specify the paths to all of the template files in your project
//   content: [
//     "./src/**/*.html",
//     "./src/**/*.js",
//     "./src/**/*.jsx",
//     // etc.
//   ],

//   // Include any special characters you're using in this regular expression
//   defaultExtractor: (content) => content.match(/[\w-/:]+(?<!:)/g) || [],
// });

// module.exports = {
//   plugins: [
//     require("tailwindcss"),
//     require("autoprefixer"),
//     ...(process.env.NODE_ENV === "production" ? [purgecss] : []),
//   ],
// };

const purgecss = require("@fullhuman/postcss-purgecss")({
  // Specify the paths to all of the template files in your project
  content: [
    "./src/**/*.html",
    "./src/**/*.js",
    // etc.
  ],

  // This is the function used to extract class names from your templates
  defaultExtractor: (content) => {
    // Capture as liberally as possible, including things like `h-(screen-1.5)`
    const broadMatches = content.match(/[^<>"'`\s]*[^<>"'`\s:]/g) || [];

    // Capture classes within other delimiters like .block(class="w-1/2") in Pug
    const innerMatches = content.match(/[^<>"'`\s.()]*[^<>"'`\s.():]/g) || [];

    return broadMatches.concat(innerMatches);
  },
});

module.exports = {
  plugins: [
    require("tailwindcss"),
    require("autoprefixer"),
    ...(process.env.NODE_ENV === "production" ? [purgecss] : []),
  ],
};
