import React from "react";
import { graphql } from "gatsby";
import Layout from "../components/layout";

export default function BlogPost({ data }) { const post = data.markdownRemark; return <Layout><header className="page-hero"><div className="site-shell"><div className="meta">{post.frontmatter.date} · {post.frontmatter.author}</div><h1>{post.frontmatter.title}</h1><p className="hero-copy">{post.frontmatter.description}</p></div></header><article className="content" dangerouslySetInnerHTML={{ __html: post.html }} /></Layout>; }
export const query = graphql`query BlogPost($slug: String!) { markdownRemark(frontmatter: {slug: {eq: $slug}}) { html frontmatter { title description author date(formatString: "D MMMM YYYY") } } }`;
