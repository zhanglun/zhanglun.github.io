const fs = require('fs')
const path = require('path')
const frontMatter = require('front-matter')

const contentPath = path.resolve(__dirname, './content/posts')
const posts = fs.readdirSync('./content/posts')

posts.forEach((post) => {
  const filePath = path.resolve(contentPath, post)
  
  if (!fs.statSync(filePath).isDirectory()) {
    format(filePath)
  }

  // if (!fs.stat(filePath).isDirectory()) {
  // const file = fs.readFileSync()    
  // }
})

function format (filepath) {
  const content = fs.readFileSync(filepath, 'utf-8')
  const meta = frontMatter(content)
  const { attributes } = meta

  // 批量补全front-matter格式
  // if (!attributes.title) {
  //   fs.writeFileSync(filepath, '---\n' + content)
  // }

  // 批量格式化时间
  // if (typeof attributes.date !== 'object') {
  //   const match = content.replace(/^date:\s((\S)*\s(\S)*)/gm, "date: $1:00")
  //   console.log(filepath)
  //   fs.writeFileSync(filepath, match)
  // }

  // 批量补全categoires
  if (typeof attributes.category === 'string') {
    const match = content.replace(/^category:\s(\S*)/gm, "categories: ['$1']")
    console.log(filepath)
    console.log(attributes.category)
    fs.writeFileSync(filepath, match)
  } 
}

console.log(posts)