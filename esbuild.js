const alias = require("esbuild-plugin-alias");

const isBuild = process.argv[2] === "build";

require("esbuild").build({
  entryPoints: ["src/index.ts"],
  bundle: true,
  outfile: "dist/main.js",
  plugins: [
    //     alias({
    //       svgo: "svgo/dist/svgo.es.js",
    //     }),
  ],

  minify: isBuild,
  watch: !isBuild,
});
