const path = require("path");

exports.createPages = async ({ actions, graphql, reporter }) => {
  const result = await graphql(`
    query ContentPages {
      allMarkdownRemark {
        nodes {
          frontmatter { kind slug }
        }
      }
    }
  `);

  if (result.errors) {
    reporter.panicOnBuild("Unable to create Tembusu Circle content pages", result.errors);
    return;
  }

  result.data.allMarkdownRemark.nodes.forEach(({ frontmatter }) => {
    if (!frontmatter.slug || frontmatter.kind === "home") return;
    const isBlog = frontmatter.kind === "blog-post";
    actions.createPage({
      path: isBlog ? `/blog/${frontmatter.slug}` : `/${frontmatter.slug}`,
      component: path.resolve(isBlog ? "src/templates/blog-post.js" : "src/templates/content-page.js"),
      context: { slug: frontmatter.slug },
    });
  });
};
