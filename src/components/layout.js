import * as React from 'react';
import { defineCustomElements as deckDeckGoHighlightElement } from '@deckdeckgo/highlight-code/dist/loader';
import { SideMenu } from './SideMenu';

deckDeckGoHighlightElement();

function Layout({
  location, children, title, menu, description,
}) {
  const rootPath = `${__PATH_PREFIX__}/`;
  const isRootPath = location.pathname === rootPath;

  return (
    <div
      className={`global-wrapper ${isRootPath ? 'root' : ''}`}
      data-is-root-path={isRootPath}
    >
      <SideMenu title={title} menu={menu} />
      {children}
    </div>
  );
}

export default Layout;
