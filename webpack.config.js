const path = require("path");

module.exports = {
  entry: path.join(__dirname, "/src/index.ts"),
  output: {
    filename: "app_bundle.js",
    path: __dirname
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)?$/,
        loader: "ts-loader",
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: [".ts", ".js"]
  }
};
