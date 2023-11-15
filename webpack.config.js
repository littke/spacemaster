const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  mode: "development",
  entry: "./src/index.js",
  output: {
    filename: "main.js",
    path: path.resolve(__dirname, "dist"),
  },
  devtool: "inline-source-map",
  devServer: {
    static: "./dist",
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: "Development",
      template: "./src/index.html",
    }),
  ],
  module: {
    rules: [
      {
        test: /\.(png|svg|jpg|jpeg|gif|wav)$/i,
        type: "asset/resource",
      },
      {
        test: /CNAME$/,
        type: "asset/resource",
        generator: {
          filename: "CNAME",
        },
      },
    ],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src/"), // map '@' to the absolute path of your 'src' directory
    },
  },
};
