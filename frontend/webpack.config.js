const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require("html-webpack-plugin");
const htmlWebpackPlugin = new HtmlWebpackPlugin({
    template: path.join(__dirname, "build/index.html"),
    filename: "index.html"
});  
  
module.exports = () => {
    console.log('xxx ', __dirname)
    return {
        entry: path.join(__dirname, "./build/bundle.js"),
        output: {
            path: path.join(__dirname, "build"),
            filename: "bundle.js",
            publicPath: '/'
        },
        module: {
            rules: [
                {
                    test: /\.(js|jsx)$/,
                    use: "babel-loader",
                    exclude: /node_modules/
                },
                {
                    test: /\.css$/,
                    use: ["style-loader", "css-loader"]
                },
                            {
                    test: /\.(gif|png|jpe?g|svg)$/i,
                    use: [
                        {
                            loader: 'file-loader',
                            options: {
                                  name: '[name].[ext]',
                                  outputPath: 'images/'
                            }
                        }
                    ]
                },
                {
                    test: /\.(woff(2)?|ttf|eot|otf)(\?v=\d+\.\d+\.\d+)?$/,                
                    use: [{
                        loader: 'file-loader',
                        options: {
                            name: '[name].[ext]',
                            outputPath: 'fonts/'
                        }
                    }]
                },
                {
                    test: /\.js$/,
                    exclude: /node_modules/,
                    loader: 'babel-loader',
                    query: {
                        plugins:[ 'transform-object-rest-spread' ]
                    }
                }
            ]
        },
        plugins: [
            htmlWebpackPlugin,
        ],
        resolve: {
            extensions: [".js", ".jsx"]
        },
        devServer: {
            port: 3333,
            publicPath: '/',
            historyApiFallback: true
        }
    };
    
}