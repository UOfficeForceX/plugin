const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");
const mf = require("@angular-architects/module-federation/webpack");
const path = require("path");
const exposes = require("./webpack-exposes.config");

const sharedMappings = new mf.SharedMappings();
sharedMappings.register(
  path.join(__dirname, './tsconfig.json'),
  [/* mapped paths to share */]);

module.exports = {
  output: {
    uniqueName: "sample",
    publicPath: "auto",
    scriptType: 'text/javascript'
  },
  optimization: {
    runtimeChunk: false
  },
  devServer: {
    allowedHosts: 'all',
    client: {
      webSocketURL: 'ws://localhost:40001/ng-cli-ws',
    }
  },
  resolve: {
    alias: {
      ...sharedMappings.getAliases(),
    }
  },
  plugins: [
    // Web
    new ModuleFederationPlugin({
      name: "plugin",
      filename: "remoteEntry.js",
      exposes: exposes.web,
      shared: {
        "@angular/core": { singleton: true, requiredVersion: '^16.0.0' },
        "@angular/common": { singleton: true, requiredVersion: '^16.0.0' },
        "@angular/common/http": { singleton: true, requiredVersion: '^16.0.0' },
        "@angular/forms": { singleton: true, requiredVersion: '^16.0.0' },
        "@angular/router": { singleton: true, requiredVersion: '^16.0.0' },

        "@ngx-translate/core": { singleton: true, requiredVersion: '^15.0.0' },
        "@ngx-translate/http-loader": { singleton: true, requiredVersion: '^8.0.0' },

        "@syncfusion/ej2-base": { singleton: true, requiredVersion: '^22.0.0' },

        "@uofx/icon": { singleton: true, requiredVersion: '^1.0.0' },
        "@uofx/core": { singleton: true, requiredVersion: '^2.0.0' },
        '@uofx/core/interceptor': { singleton: true, requiredVersion: '^2.0.0' },

        ...sharedMappings.getDescriptors()
      }

    }),
    // App
    new ModuleFederationPlugin({
      // library: { type: "module" },
      name: "pluginApp",
      filename: "remoteEntryApp.js",
      exposes: exposes.app,
      shared: {
        "@angular/core": { singleton: true, requiredVersion: '^16.0.0' },
        "@angular/common": { singleton: true, requiredVersion: '^16.0.0' },
        "@angular/common/http": { singleton: true, requiredVersion: '^16.0.0' },
        "@angular/forms": { singleton: true, requiredVersion: '^16.0.0' },
        "@angular/router": { singleton: true, requiredVersion: '^16.0.0' },

        "@ngx-translate/core": { singleton: true, requiredVersion: '^15.0.0' },
        "@ngx-translate/http-loader": { singleton: true, requiredVersion: '^8.0.0' },

        // "@ionic/angular": { singleton: true, requiredVersion: '^5.8.5' },

        "@uofx/icon": { singleton: true, requiredVersion: '^1.0.0' },
        "@uofx/core": { singleton: true, requiredVersion: '^2.0.0' },
        '@uofx/core/interceptor': { singleton: true, requiredVersion: '^2.0.0' },

        "@uofx/app-native": { singleton: true, strictVersion: false, requiredVersion: '^1.1.3' },

        ...sharedMappings.getDescriptors()
      }

    }),
    sharedMappings.getPlugin()
  ],
};
