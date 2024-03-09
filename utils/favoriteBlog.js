const favoriteBlog = (blogs) => {
    const maxInd = blogs.reduce((acc,cur,curInd,arr) => {
        return cur.likes>arr[acc].likes ? curInd : acc
    },0)

    const favorite = blogs[maxInd]
    return {title:favorite.title, author: favorite.author, likes:favorite.likes}

}

module.exports = {favoriteBlog}