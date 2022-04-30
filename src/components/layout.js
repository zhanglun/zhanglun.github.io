import * as React from 'react';
import { Header } from './Header';
import { Footer } from './Footer';

function Layout({
  location, children, title, menu, description,
}) {
  const rootPath = `${__PATH_PREFIX__}/`;
  const isRootPath = location.pathname === rootPath;

  return (
    <div className="global-wrapper" data-is-root-path={isRootPath}>
      <Header
        title={title}
        menu={menu}
      />
      <section className="main">{children}</section>
      <Footer />
    </div>
  );
}

export default Layout;
