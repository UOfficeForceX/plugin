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
    publicPath: "auto"
  },
  optimization: {
    runtimeChunk: false
  },
  resolve: {
    alias: {
      ...sharedMappings.getAliases(),
    }
  },
  plugins: [
    // Web
    new ModuleFederationPlugin({
      // library: { type: "module" },
      name: "plugin",
      filename: "remoteEntry.js",
      exposes: exposes.web,
      shared: {
        "@angular/core": { singleton: true, requiredVersion: '~12.2.16' },
        "@angular/common": { singleton: true, requiredVersion: '~12.2.16' },
        "@angular/common/http": { singleton: true, requiredVersion: '~12.2.16' },
        "@angular/forms": { singleton: true, requiredVersion: '~12.2.16' },
        "@angular/router": { singleton: true, requiredVersion: '~12.2.16' },

        "@ngx-translate/core": { singleton: true, requiredVersion: '~13.0.0' },
        "@ngx-translate/http-loader": { singleton: true, requiredVersion: '^6.0.0' },

        "@syncfusion/ej2-base": { singleton: true, requiredVersion: '~20.2.36' },

        "@uofx/icon": { singleton: true, requiredVersion: '^1.2.0' },
        "@uofx/core": { singleton: true, requiredVersion: '^1.3.0' },
        '@uofx/core/interceptor': { singleton: true, requiredVersion: 'auto' },

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
        "@angular/core": { singleton: true, requiredVersion: 'auto' },
        "@angular/common": { singleton: true, requiredVersion: 'auto' },
        "@angular/common/http": { singleton: true, requiredVersion: 'auto' },
        "@angular/forms": { singleton: true, requiredVersion: 'auto' },
        "@angular/router": { singleton: true, requiredVersion: 'auto' },

        "@ngx-translate/core": { singleton: true, requiredVersion: 'auto' },
        "@ngx-translate/http-loader": { singleton: true, requiredVersion: 'auto' },

        // "@ionic/angular": { singleton: true, requiredVersion: '^5.8.5' },

        "@uofx/icon": { singleton: true, requiredVersion: '^1.3.0' },
        "@uofx/core": { singleton: true, requiredVersion: '^1.4.0' },
        "@uofx/core/interceptor": { singleton: true, requiredVersion: 'auto' },

        "@uofx/app-native": { singleton: true, strictVersion: false, requiredVersion: 'auto' },

        ...sharedMappings.getDescriptors()
      }

    }),
    sharedMappings.getPlugin()
  ],
};
