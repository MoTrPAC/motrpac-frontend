const purgecss = require('@fullhuman/postcss-purgecss')

console.log("NODE_ENV", process.env.NODE_ENV)
module.exports = {
  plugins: process.env.NODE_ENV === "production" ? [purgecss({
    content: ['build/index.html', 'build/assets/*.js', "build/assets/*.css"],
  })] : []
}
