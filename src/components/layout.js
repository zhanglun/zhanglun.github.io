import * as React from "react"
import { Header } from "./Header"
import { Banner } from "./Banner"
import { Footer } from './Footer';

const Layout = ({ location, children, title, menu, description }) => {
  const rootPath = `${__PATH_PREFIX__}/`
  const isRootPath = location.pathname === rootPath
  
  return (
    <div className="global-wrapper heti" data-is-root-path={isRootPath}>
      <Header
        title={title}
        menu={menu}
      />
      <Banner description={description} />
      <section className="main">{children}</section>
      <Footer />
    </div>
  )
}

export default Layout
