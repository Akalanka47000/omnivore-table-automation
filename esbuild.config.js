require("dotenv").config();

const { buildSync } = require('esbuild')

const isValidId = (str) => {
    try {
        new Function(`var ${str};`)
    } catch (err) {
        return false
    }
    return true
}

const define = {}

Object.keys(process.env).forEach((key) => {
    if (isValidId(key)) {
        define[`process.env.${key}`] = JSON.stringify(process.env[key]);
    }
})

const options = {
    entryPoints: ['src/index.js'],
    outfile: 'dist/index.js',
    bundle: true,
    platform: 'node',
    target: 'node16',
    define: {
        ...define,
        'process.env.NODE_ENV': '"production"',
    },
}

buildSync(options)