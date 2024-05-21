import { defineConfig } from '@umijs/max';
import routes from './src/configs/routes';

export default defineConfig({
  antd: {},
  access: {},
  model: {},
  initialState: {},
  theme: { '@primary-color': '#FF86D6' },
  request: {},
  layout: {},
  // @ts-ignore
  mock: false,
  routes,
  npmClient: 'yarn',
  headScripts: [
    'https://sdk.51.la/js-sdk-pro.min.js',
    'LA.init({id: "JpEcG63oU3OvArZf",ck: "JpEcG63oU3OvArZf"})',
  ],
});
