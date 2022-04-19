import * as React from "react"

const Layout = ({ location, children, title, menu, description }) => {
  const rootPath = `${__PATH_PREFIX__}/`
  const isRootPath = location.pathname === rootPath

  return (
    <div className="global-wrapper" data-is-root-path={isRootPath}>
      <section>{children}</section>
    </div>
  )
}

export default Layout
