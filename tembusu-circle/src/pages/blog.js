import React from "react";
import { graphql, Link } from "gatsby";
import Layout from "../components/layout";

export default function Blog({ data }) {
  return <Layout><header className="page-hero"><div className="site-shell"><div className="eyebrow">Field notes</div><h1>Useful ideas for tiny living businesses.</h1></div></header><section className="content"><div className="post-list">{data.allMarkdownRemark.nodes.map(({ frontmatter }) => <Link className="post-card" to={`/blog/${frontmatter.slug}`} key={frontmatter.slug}><div><h2>{frontmatter.title}</h2><p>{frontmatter.description}</p></div><span className="meta">{frontmatter.date}</span></Link>)}</div></section></Layout>;
}
export const query = graphql`query BlogPosts { allMarkdownRemark(filter: {frontmatter: {kind: {eq: "blog-post"}}}, sort: {frontmatter: {date: DESC}}) { nodes { frontmatter { title slug description date(formatString: "D MMM YYYY") } } } }`;
