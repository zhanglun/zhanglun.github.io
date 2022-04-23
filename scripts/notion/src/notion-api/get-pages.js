const { errorMessage } = require("../error-message")
const { getBlocks } = require("./get-blocks")

exports.getPages = async (notionClient, databaseId) => {
    let hasMore = true
    let startCursor = ""
    const pages = []

    while (hasMore) {
        try {
            const result = await notionClient.databases.query({
                database_id: databaseId,
            })
            startCursor = result.next_cursor
            hasMore = result.has_more

            for (let page of result.results) {
                pages.push(page)
            }

        } catch (e) {
            console.error(e.message)
        }
    }

    return pages
}
