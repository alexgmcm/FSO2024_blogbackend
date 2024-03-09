const totalLikes = (blogs) => {
    return blogs.reduce((acc, cur) => acc+cur.likes,0)
   }
   
   module.exports = {
    totalLikes
   }