import "./globals.css";

export const metadata = {
  metadataBase: new URL("https://project-b.example"),
  title: {
    default: "Project B Web",
    template: "%s | Project B"
  },
  description: "Curated fashion storefront with editorial storytelling and seasonal picks.",
  alternates: {
    canonical: "/"
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "Project B",
    title: "Project B Web",
    description: "Curated fashion storefront with editorial storytelling and seasonal picks."
  },
  twitter: {
    card: "summary_large_image",
    title: "Project B Web",
    description: "Curated fashion storefront with editorial storytelling and seasonal picks."
  }
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <a className="skip-link" href="#content">
          Skip to content
        </a>

        <header className="site-header">
          <div className="shell gnb">
            <a className="brand-link" href="/">
              Project B
            </a>

            <button
              type="button"
              className="gnb-toggle"
              aria-label="Open menu"
              aria-controls="primary-nav"
              aria-expanded="false"
            >
              Menu
            </button>

            <nav id="primary-nav" className="primary-nav" aria-label="Global">
              <a href="/">Home</a>
              <a href="/shop">Shop</a>
              <a href="/editorial">Editorial</a>
              <a href="/about">About</a>
            </nav>

            <nav className="utility-nav" aria-label="Utility">
              <a href="/search">Search</a>
              <a href="/login">Login</a>
              <a href="/cart">Cart</a>
              <a href="/mypage">MyPage</a>
            </nav>
          </div>

          <nav className="mobile-nav-skeleton shell" aria-label="Mobile navigation">
            <a href="/">Home</a>
            <a href="/shop">Shop</a>
            <a href="/search">Search</a>
            <a href="/login">Login</a>
            <a href="/cart">Cart</a>
            <a href="/mypage">MyPage</a>
          </nav>
        </header>

        <main id="content" className="page-main">
          {children}
        </main>

        <footer className="site-footer">
          <div className="shell footer-inner">
            <p>Project B</p>
            <p>Support: support@projectb.example</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
