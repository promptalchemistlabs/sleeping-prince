import React from "react";
import { graphql, Link } from "gatsby";
import Layout from "../components/layout";

export default function Home({ data }) {
  const home = data.markdownRemark.frontmatter;
  return <Layout><section className="hero"><div className="site-shell hero-grid"><div><div className="eyebrow">A business circle for terrarium founders</div><h1>{home.title}</h1><p className="hero-copy">{home.description}</p><Link className="button" to="/services">Explore the circle</Link></div><div className="terrarium" aria-label="A stylised glass terrarium" role="img" /></div></section>
    <section className="section"><div className="site-shell"><div className="section-head"><h2>From first vessel to steady studio.</h2><p>Practical guides, tested workshop formats and a peer circle for people who want their craft to become a resilient small business.</p></div><div className="card-grid"><article className="card"><span className="card-index">01 · LEARN</span><h3>Build the craft</h3><p>Plant selection, substrate systems, aftercare and workshop facilitation.</p></article><article className="card"><span className="card-index">02 · LAUNCH</span><h3>Find your offer</h3><p>Price products, package workshops and explain why your work matters.</p></article><article className="card"><span className="card-index">03 · GROW</span><h3>Run the studio</h3><p>Make bookings, stock and customer care feel calm and repeatable.</p></article></div></div></section></Layout>;
}

export const query = graphql`query HomeContent { markdownRemark(frontmatter: { kind: { eq: "home" } }) { frontmatter { title description } } }`;
