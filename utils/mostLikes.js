const _ = require("lodash"); 

const mostLikes = (blogs) => {
    const result =  _(blogs).groupBy("author").entries().maxBy((o)=> _.sumBy(_.last(o),"likes"))
    return {author: _.head(result), likes: _(_.last(result)).sumBy("likes")}
}

module.exports = {mostLikes}