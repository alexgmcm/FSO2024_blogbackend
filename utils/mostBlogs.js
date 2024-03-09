const _ = require("lodash"); 
let mostBlogs = (blogs) => {
const result =  _(blogs).countBy("author").entries().maxBy(_.last)
return {author: _.head(result), blogs: _.last(result)}
}

module.exports = {mostBlogs}