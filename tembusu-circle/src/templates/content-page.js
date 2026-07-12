import React from "react";
import { graphql } from "gatsby";
import Layout from "../components/layout";

export default function ContentPage({ data }) { const page = data.markdownRemark; return <Layout><header className="page-hero"><div className="site-shell"><div className="eyebrow">Tembusu Circle</div><h1>{page.frontmatter.title}</h1><p className="hero-copy">{page.frontmatter.description}</p></div></header><article className="content" dangerouslySetInnerHTML={{ __html: page.html }} /></Layout>; }
export const query = graphql`query ContentPage($slug: String!) { markdownRemark(frontmatter: {slug: {eq: $slug}}) { html frontmatter { title description } } }`;
