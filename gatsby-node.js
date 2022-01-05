const path = require(`path`)
const { createFilePath } = require(`gatsby-source-filesystem`)
const { start } = require("repl")
const POSTSTATUS = {
  PUBLISH: "publish",
  WORKING: "working",
}

exports.createPages = async ({ graphql, actions, reporter }) => {
  const { createPage } = actions

  // Define a template for blog post
  const blogPost = path.resolve(`./src/templates/blog-post.js`)
  const blogList = path.resolve("./src/templates/blog-list.js")

  // Get all markdown blog posts sorted by date
  const result = await graphql(
    `
      {
        postsRemark: allMarkdownRemark(
          sort: { fields: [frontmatter___date], order: DESC }
          filter: {frontmatter: {status: {eq: "${POSTSTATUS.PUBLISH}"}}}
        ) {
          nodes {
            id
            fields {
              slug
            }
          }
        }
        categoryGroup: allMarkdownRemark (
          filter: {frontmatter: {status: {eq: "${POSTSTATUS.PUBLISH}"}}}
        ) {
          group(field: frontmatter___categories) {
            fieldValue
            totalCount
          }
        }
      }
    `
  )

  if (result.errors) {
    reporter.panicOnBuild(
      `There was an error loading your blog posts`,
      result.errors
    )
    return
  }

  const posts = result.data.postsRemark.nodes

  // Create blog posts pages
  // But only if there's at least one markdown file found at "content/blog" (defined in gatsby-config.js)
  // `context` is available in the template as a prop and as a variable in GraphQL

  if (posts.length > 0) {
    posts.forEach((post, index) => {
      const previousPostId = index === 0 ? null : posts[index - 1].id
      const nextPostId = index === posts.length - 1 ? null : posts[index + 1].id

      createPage({
        path: post.fields.slug,
        component: blogPost,
        context: {
          id: post.id,
          previousPostId,
          nextPostId,
        },
      })
    })
  }

  // create blog list pages
  const postsPerPage = 5
  const numPages = Math.ceil(posts.length / postsPerPage)

  Array.from({ length: numPages }).forEach((_, i) => {
    createPage({
      path: i === 0 ? `/` : `/page/${i + 1}`,
      component: blogList,
      context: {
        limit: postsPerPage,
        skip: i * postsPerPage,
        numPages,
        currentPage: i + 1,
      },
    })
  })

  // 创建分类页面
  const categoryTemplate = path.resolve("./src/templates/categories.js")
  const categories = result.data.categoryGroup.group

  categories.forEach(category => {
    createPage({
      path: `/categories/${category.fieldValue}`,
      component: categoryTemplate,
      context: {
        category: category.fieldValue,
        count: category.totalCount,
      },
    })
  })
}

exports.onCreateNode = ({ node, actions, getNode }) => {
  const { createNodeField } = actions

  if (node.internal.type === `MarkdownRemark`) {
    let value = ""

    try {
      value = `/blogs${createFilePath({
        node,
        getNode,
      })}`
    } catch (err) {
      value = value || `/blogs/${node.frontmatter.title}`
    }

    createNodeField({
      name: `slug`,
      node,
      value: value.trim(),
    })

    if (node.frontmatter.date) {
      const rawDate = node.frontmatter.date.start || node.frontmatter.date;
      const date = new Date(rawDate)

      const year = date.getFullYear()
      const month = date.getMonth() + 1
      const yearMonth = `${year}-${month}`
      const day = date.getDate()

      createNodeField({ node, name: "year", value: year })
      createNodeField({ node, name: "month", value: month })
      createNodeField({ node, name: "year-month", value: yearMonth })
      createNodeField({ node, name: "day", value: day })
    }
  }
}

exports.createSchemaCustomization = ({ actions, schema }) => {
  const { createTypes } = actions

  // Explicitly define the siteMetadata {} object
  // This way those will always be defined even if removed from gatsby-config.js

  // Also explicitly define the Markdown frontmatter
  // This way the "MarkdownRemark" queries will return `null` even when no
  // blog posts are stored inside "content/blog" instead of returning an error
  createTypes(`
    type SiteSiteMetadata {
      author: Author
      siteUrl: String
      social: Social
    }

    type Author {
      name: String
      summary: String
    }

    type Social {
      twitter: String
    }
  `)

  const typeDefs = [
    "type MarkdownRemark implements Node { frontmatter: Frontmatter, fields: Fields }",
    schema.buildObjectType({
      name: "Fields",
      fields: {
        slug: {
          type: "String!",
        },
      },
    }),
    schema.buildObjectType({
      name: "Frontmatter",
      fields: {
        title: {
          type: "String!",
        },
        description: {
          type: "String",
        },
        date: {
          type: "Date",
          extensions: {
            dateformat: {},
          },
          resolve(source) {
            const { date } = source

            if (date && date.start) {
              return date.start
            }

            return date
          },
        },
        tags: {
          type: "[String]",
          resolve(source) {
            const { tags = [] } = source

            if (Array.isArray(tags)) {
              return (tags || []).map(item => item.name || item)
            }

            if (tags instanceof Object) {
              return [tags.name]
            }

            return [tags]
          },
        },
        categories: {
          type: "[String]",
          resolve(source) {
            const { categories = [] } = source

            if (Array.isArray(categories)) {
              return (categories || []).map(item => item.name || item)
            }

            if (categories instanceof Object) {
              return [categories.name]
            }

            return [categories]
          },
        },
        status: {
          type: "String",
          resolve(source) {
            if (source.status && source.status.name) {
              return source.status.name
            }

            if (source.draft) {
              return POSTSTATUS.WORKING
            }

            return POSTSTATUS.PUBLISH
          },
        },
      },
    }),
  ]

  createTypes(typeDefs)
}
