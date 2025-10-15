import fs from 'fs'

const html = fs.readFileSync('dist/index.html', 'utf8')
const js = fs.readFileSync('dist/assets/index.js', 'utf8')
const final = html.replace(
    /<script type="module".*<\/script>/,
    `<script>${js}</script>`
)
fs.writeFileSync('dist/playable.html', final)