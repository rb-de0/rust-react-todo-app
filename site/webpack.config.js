const path = require('path')

const src = path.resolve(__dirname, 'src')
const dist = path.resolve(__dirname, 'dist')
const js = path.resolve(__dirname, 'public/js')

const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin')

module.exports = {
  mode: 'development',
  entry: src + '/index.tsx',
  output: {
    path: js,
    filename: 'bundle.js',
  },
  devServer: {
    contentBase: dist,
    host: 'localhost',
    port: 3000,
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
    plugins: [new TsconfigPathsPlugin({})],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: [{ loader: 'ts-loader' }],
      },
      {
        test: /\.css?$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
}
