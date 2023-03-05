import * as React from 'react'
import { NotionRenderer } from 'react-notion-x'
import { Code } from 'react-notion-x/build/third-party/code'
import * as test from 'react-notion-x/build/third-party/code.js'
import { Collection } from 'react-notion-x/build/third-party/collection'
import { Equation } from 'react-notion-x/build/third-party/equation'
import { Modal } from 'react-notion-x/build/third-party/modal'
import { Pdf } from 'react-notion-x/build/third-party/pdf'


console.log('Code ===>', test);

export const NotionDetail = ({ recordMap }: any) => {
  return <NotionRenderer recordMap={recordMap} fullPage={true} darkMode={false} />
}