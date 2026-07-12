module.exports = {
  siteMetadata: {
    title: "Tembusu Circle",
    description: "Practical support for people building thoughtful terrarium businesses.",
    siteUrl: "https://tembusu-circle.example",
  },
  plugins: [
    {
      resolve: "gatsby-source-filesystem",
      options: { name: "content", path: `${__dirname}/content` },
    },
    "gatsby-transformer-remark",
  ],
};
