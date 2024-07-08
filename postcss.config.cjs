const purgecss = require('@fullhuman/postcss-purgecss')

module.exports = {
  plugins: [
    purgecss({
      content: ['build/index.html', 'build/assets/*.js', "build/assets/*.css"],
    })
  ]
}
