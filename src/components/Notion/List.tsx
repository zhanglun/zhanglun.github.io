import * as React from 'react'
import { NotionRenderer } from 'react-notion-x'
// import { Code } from 'react-notion-x/build/third-party/code'
import { Collection } from 'react-notion-x/build/third-party/collection'
// import { Equation } from 'react-notion-x/build/third-party/equation'
// import { Modal } from 'react-notion-x/build/third-party/modal'
// import { Pdf } from 'react-notion-x/build/third-party/pdf'

export const NotionList =  ({ recordMap, pages }: any) => {
  console.log(pages);
  return (
  <ul>
    {pages.map((page: any) => {
      return <li><a href={`/notion/${page.id}`}>{page.id} -- {page.frontmatter.title}</a></li>
    })}
    {/* <NotionRenderer recordMap={recordMap} fullPage={true} darkMode={false} /> */}
  </ul>
)
}