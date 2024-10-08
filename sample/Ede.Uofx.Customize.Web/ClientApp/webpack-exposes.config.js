const exposes = {
  // 設定要開放外部使用欄位和頁面
  // ***目前僅實作外掛欄位
  web: {
    './HelloWorld': './src/app/web/hello-world/hello-world.module.ts',
    './AdvancedField': './src/app/web/advanced-field/advanced-field.module.ts',
  },
  app: {
    './HelloWorld': './src/app/mobile/hello-world/hello-world.module.ts',
    './AdvancedField': './src/app/mobile/advanced-field/advanced-field.module.ts',
    //'./FieldLeaveInfo': './src/app/mobile/field-leave-info/field-leave-info.module.ts',
    //'./CustomPage': './src/app/mobile/custom-page/custom.module.ts',
  }
};

module.exports = exposes;
