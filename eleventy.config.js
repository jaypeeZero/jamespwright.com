module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy({ "src/assets": "assets" });
  eleventyConfig.addPassthroughCopy({ "src/.htaccess": ".htaccess" });

  // Every page under src/programming/ in nav order. Ordered by an explicit
  // `order` in each file's front matter so the section nav is stable.
  eleventyConfig.addCollection("programming", (api) =>
    api
      .getFilteredByGlob("src/programming/*.md")
      .filter((p) => p.fileSlug !== "programming")
      .sort((a, b) => (a.data.order ?? 99) - (b.data.order ?? 99))
  );

  return {
    dir: { input: "src", includes: "_includes", data: "_data", output: "_site" },
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
    templateFormats: ["njk", "md", "html"],
  };
};
