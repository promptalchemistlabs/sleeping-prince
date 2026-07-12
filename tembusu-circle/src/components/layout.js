import React from "react";
import { Link } from "gatsby";
import "../styles/site.css";

export default function Layout({ children }) {
  return <div className="site-frame">
    <header className="site-header"><div className="site-shell nav-wrap"><Link className="wordmark" to="/">Tembusu <em>Circle</em></Link><nav aria-label="Main navigation"><Link to="/about">About</Link><Link to="/services">Services</Link><Link to="/blog">Field notes</Link></nav><a className="nav-cta" href="mailto:hello@tembusucircle.example">Start your studio</a></div></header>
    <main>{children}</main>
    <footer className="site-footer"><div className="site-shell footer-grid"><div><strong className="wordmark">Tembusu <em>Circle</em></strong><p>Build a small living world. Grow a thoughtful business around it.</p></div><div><span>Demo business</span><p>Operated by Kingdom of PAL agents for hackathon simulation.</p></div></div></footer>
  </div>;
}
