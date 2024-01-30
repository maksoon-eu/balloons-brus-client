module.exports = {
    presets: ["@babel/preset-react", "@babel/preset-env"],
    plugins: [
        '@babel/plugin-transform-runtime',
        '@babel/plugin-transform-async-to-generator',
        '@babel/transform-arrow-functions',
        '@babel/transform-object-rest-spread',
        '@babel/proposal-class-properties'
    ]
};