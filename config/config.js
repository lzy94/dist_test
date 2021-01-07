// https://umijs.org/config/
import os from 'os';
import slash from 'slash2';
import defaultSettings from './defaultSettings';
import webpackPlugin from './plugin.config';

const { pwa, primaryColor } = defaultSettings; // preview.pro.ant.design only do not use in your production ;
// preview.pro.ant.design 专用环境变量，请不要在你的项目中使用它。

const { ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION, TEST, NODE_ENV } = process.env;
const plugins = [
  [
    'umi-plugin-react',
    {
      antd: true,
      dva: {
        hmr: true,
      },
      locale: {
        // default false
        enable: true,
        // default zh-CN
        default: 'zh-CN',
        // default true, when it is true, will use `navigator.language` overwrite default
        baseNavigator: true,
      },
      dynamicImport: {
        loadingComponent: './components/PageLoading/index',
        webpackChunkName: true,
        level: 3,
      },
      pwa: pwa
        ? {
            workboxPluginMode: 'InjectManifest',
            workboxOptions: {
              importWorkboxFrom: 'local',
            },
          }
        : false,
      ...(!TEST && os.platform() === 'darwin'
        ? {
            dll: {
              include: ['dva', 'dva/router', 'dva/saga', 'dva/fetch'],
              exclude: ['@babel/runtime', 'netlify-lambda'],
            },
            hardSource: false,
          }
        : {}),
    },
  ],
  [
    'umi-plugin-pro-block',
    {
      moveMock: false,
      moveService: false,
      modifyRequest: true,
      autoAddMenu: true,
    },
  ],
]; // 针对 preview.pro.ant.design 的 GA 统计代码
// preview.pro.ant.design only do not use in your production ; preview.pro.ant.design 专用环境变量，请不要在你的项目中使用它。

if (ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION === 'site') {
  plugins.push([
    'umi-plugin-ga',
    {
      code: 'UA-72788897-6',
    },
  ]);
}

const uglifyJSOptions =
  NODE_ENV === 'production'
    ? {
        uglifyOptions: {
          // remove console.* except console.error
          compress: {
            drop_console: true,
            pure_funcs: ['console.error'],
          },
        },
      }
    : {};
export default {
  history: 'hash',
  // add for transfer to umi
  plugins,
  define: {
    ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION:
      ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION || '', // preview.pro.ant.design only do not use in your production ; preview.pro.ant.design 专用环境变量，请不要在你的项目中使用它。
  },
  block: {
    defaultGitUrl: 'https://github.com/ant-design/pro-blocks',
  },
  treeShaking: true,
  targets: {
    ie: 11,
  },
  externals: {
    jQuery: 'jQuery',
  },
  devtool: ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION ? 'source-map' : false,
  // 路由配置
  routes: [
    {
      path: '/user',
      component: '../layouts/LoginLayout',
      routes: [
        {
          path: '/user',
          redirect: '/user/login',
        },
        {
          path: '/user/login',
          component: './user/login',
        },
        // ,{
        //   path:'/user/main',
        //   component:'./user/main'
        // }
      ],
    },
    {
      name: 'tons',
      path: '/tons',
      component: './traffic/overview/tons',
    },
    {
      name: 'realTimeMonitor',
      path: '/realTimeMonitor',
      component: './realTimeMonitor',
    },
    {
      name: 'visualization',
      path: '/visualization',
      component: './visualization',
    },
    {
      name: 'maritimeDataV',
      path: '/maritimeDataV',
      component: './maritime/dataV',
    },
    {
      name: 'conserveDataV',
      path: '/conserveDataV',
      component: './conserve/dataV',
    },
    {
      name: 'transportDataV',
      path: '/transportDataV',
      component: './transport/dataV',
    },
    {
      path: '/',
      component: './user/main',
    },
    {
      path: '/build',
      component: '../layouts/BuildLayout',
      Routes: ['src/pages/Authorized'],
      routes: [
        {
          path: '/build',
          redirect: '/build/project/basic',
        },
        {
          name: 'project',
          path: '/build/project',
          routes: [
            {
              name: 'video',
              path: '/build/project/video',
              component: './build/project/video',
            },
            {
              name: 'project',
              path: '/build/project/basic',
              component: './build/project/basic',
            },
            {
              name: 'structural',
              path: '/build/project/structural',
              component: './build/project/structural',
            },
            {
              component: './exception/404',
            },
          ],
        },
        {
          name: 'management',
          path: '/build/management',
          routes: [
            {
              name: 'logs',
              path: '/build/management/logs',
              component: './build/management/logs',
            },
            {
              component: './exception/404',
            },
          ],
        },
        {
          name: 'progress',
          path: '/build/progress',
          routes: [
            {
              name: 'control',
              path: '/build/progress/control',
              component: './build/progress/control',
            },
            {
              component: './exception/404',
            },
          ],
        },
        {
          name: 'safety',
          path: '/build/safety',
          routes: [
            {
              name: 'registra',
              path: '/build/safety/registra',
              component: './build/safety/registra',
            },
            {
              name: 'responsible',
              path: '/build/safety/responsible',
              component: './build/safety/responsible',
            },
            {
              name: 'laboratory',
              path: '/build/safety/laboratory',
              component: './build/safety/laboratory',
            },
            {
              name: 'supervision',
              path: '/build/safety/supervision',
              component: './build/safety/supervision',
            },
            {
              name: 'safety',
              path: '/build/safety/safety',
              component: './build/safety/safety',
            },
            {
              name: 'check',
              path: '/build/safety/check',
              component: './build/safety/check',
            },
            {
              component: './exception/404',
            },
          ],
        },
        {
          name: 'completion',
          path: '/build/completion',
          routes: [
            {
              name: 'acceptance',
              path: '/build/completion/acceptance',
              component: './build/completion/acceptance',
            },
            {
              name: 'identify',
              path: '/build/completion/identify',
              component: './build/completion/identify',
            },
            {
              component: './exception/404',
            },
          ],
        },
        {
          name: 'public',
          path: '/build/public',
          routes: [
            {
              name: 'content',
              path: '/build/public/content',
              component: './build/public/content',
            },
            {
              component: './exception/404',
            },
          ],
        },
        {
          name: 'wage',
          path: '/build/wage',
          routes: [
            {
              name: 'funds',
              path: '/build/wage/funds',
              component: './build/wage/funds',
            },
            {
              name: 'info',
              path: '/build/wage/info',
              component: './build/wage/info',
            },
            {
              component: './exception/404',
            },
          ],
        },
        {
          name: 'info',
          path: '/build/info',
          routes: [
            { name: 'analysis', path: '/build/info/analysis', component: './build/info/analysis' },
            {
              component: './exception/404',
            },
          ],
        },
        {
          name: 'produce',
          path: '/build/produce',
          routes: [
            {
              name: 'analysis',
              path: '/build/produce/analysis',
              component: './build/produce/analysis',
            },
            {
              component: './exception/404',
            },
          ],
        },
        {
          name: 'analysis',
          path: '/build/analysis',
          routes: [
            {
              name: 'raw',
              path: '/build/analysis/raw',
              component: './build/analysis/raw',
            },
            {
              name: 'unit',
              path: '/build/analysis/unit',
              component: './build/analysis/unit',
            },
            {
              name: 'supervise',
              path: '/build/analysis/supervise',
              component: './build/analysis/supervise',
            },
            {
              component: './exception/404',
            },
          ],
        },
        {
          component: './exception/404',
        },
      ],
    },
    {
      path: 'transport',
      component: '../layouts/TransportLayout',
      Routes: ['src/pages/Authorized'],
      routes: [
        {
          path: '/transport',
          redirect: '/transport/adas/system',
        },
        {
          name: 'adas',
          path: '/transport/adas',
          routes: [
            {
              name: 'system',
              path: '/transport/adas/system',
              component: './transport/adas/system',
            },
            {
              component: './exception/404',
            },
          ],
        },
        {
          name: 'danger',
          path: '/transport/danger',
          routes: [
            {
              name: 'administrative',
              path: '/transport/danger/administrative',
              component: './transport/danger/administrative',
            },
            {
              name: 'category',
              path: '/transport/danger/category',
              component: './transport/danger/category',
            },
            {
              name: 'template',
              path: '/transport/danger/template',
              component: './transport/danger/template',
            },
            {
              name: 'plan',
              path: '/transport/danger/plan',
              component: './transport/danger/plan',
            },
            {
              name: 'Periodic',
              path: '/transport/danger/Periodic',
              component: './transport/danger/Periodic',
            },
            {
              component: './exception/404',
            },
          ],
        },
        {
          name: 'command',
          path: '/transport/command',
          routes: [
            {
              name: 'emergency',
              path: '/transport/command/emergency',
              component: './conserve/command/emergency',
            },
            {
              name: 'manpower',
              path: '/transport/command/manpower',
              component: './conserve/command/manpower',
            },
            {
              name: 'planmanagement',
              path: '/transport/command/planmanagement',
              component: './conserve/command/planmanagement',
            },
            {
              name: 'listPlanCategory',
              path: '/transport/command/listPlanCategory',
              component: './conserve/command/listPlanCategory',
            },
            {
              component: './exception/404',
            },
          ],
        },
        {
          name: 'datemain',
          path: '/transport/datemain',
          routes: [
            {
              name: 'freight',
              path: '/transport/datemain/freight',
              component: './traffic/datemain/freight',
            },
            {
              name: 'company',
              path: '/transport/datemain/company',
              component: './traffic/datemain/company',
            },
            {
              name: 'vehicle',
              path: '/transport/datemain/vehicle',
              component: './traffic/datemain/vehicle',
            },
            {
              component: './exception/404',
            },
          ],
        },
        {
          name: 'archives',
          path: '/transport/archives',
          routes: [
            {
              name: 'firm',
              path: '/transport/archives/firm',
              component: './transport/archives/firm',
            },
            {
              name: 'business',
              path: '/transport/archives/business',
              component: './transport/archives/business',
            },
            {
              name: 'personnel',
              path: '/transport/archives/personnel',
              component: './transport/archives/personnel',
            },
            {
              name: 'car',
              path: '/transport/archives/car',
              component: './transport/archives/car',
            },
            {
              name: 'license',
              path: '/transport/archives/license',
              component: './transport/archives/license',
            },
            {
              component: './exception/404',
            },
          ],
        },
        {
          name: 'system',
          path: '/transport/system',
          routes: [
            {
              name: 'user',
              path: '/transport/system/user',
              component: './traffic/system/user',
            },
            {
              name: 'role',
              path: '/transport/system/role',
              component: './traffic/system/role',
            },
            {
              name: 'log',
              path: '/transport/system/logs',
              component: './traffic/system/logs',
            },
            {
              name: 'depart',
              path: '/transport/system/depart',
              component: './transport/system/depart',
            },
            {
              component: './exception/404',
            },
          ],
        },
        {
          component: './exception/404',
        },
      ],
    },
    {
      path: 'maritime',
      component: '../layouts/MALayout',
      Routes: ['src/pages/Authorized'],
      routes: [
        {
          path: '/maritime',
          redirect: '/maritime/system/counts',
        },
        {
          name: 'water',
          path: '/maritime/water',
          routes: [
            {
              name: 'monitor',
              path: '/maritime/water/monitor',
              component: './maritime/water/monitor',
            },
            {
              name: 'waterList',
              path: '/maritime/water/list',
              component: './maritime/water/waterList',
            },
            {
              name: 'video',
              path: '/maritime/water/video',
              component: './conserve/roadproperty/video',
            },
            {
              component: './exception/404',
            },
          ],
        },
        {
          name: 'danger',
          path: '/maritime/danger',
          routes: [
            {
              name: 'checking',
              path: '/maritime/danger/checking',
              component: './maritime/danger/checking',
            },
            {
              name: 'flag',
              path: '/maritime/danger/flag',
              component: './maritime/danger/flag',
            },
            {
              name: 'pump',
              path: '/maritime/danger/pump',
              component: './maritime/danger/pump',
            },
            {
              name: 'ferry',
              path: '/maritime/danger/ferry',
              component: './maritime/danger/ferry',
            },
            {
              name: 'company',
              path: '/maritime/danger/company',
              component: './maritime/danger/company',
            },
            {
              name: 'water',
              path: '/maritime/danger/water',
              component: './maritime/danger/water',
            },
            {
              name: 'reservoir',
              path: '/maritime/danger/reservoir',
              component: './maritime/danger/reservoir',
            },
            {
              component: './exception/404',
            },
            {
              component: './exception/404',
            },
          ],
        },
        {
          name: 'command',
          path: '/maritime/command',
          routes: [
            {
              name: 'emergency',
              path: '/maritime/command/emergency',
              component: './conserve/command/emergency',
            },
            {
              name: 'manpower',
              path: '/maritime/command/manpower',
              component: './conserve/command/manpower',
            },
            {
              name: 'planmanagement',
              path: '/maritime/command/planmanagement',
              component: './conserve/command/planmanagement',
            },
            {
              name: 'listPlanCategory',
              path: '/maritime/command/listPlanCategory',
              component: './conserve/command/listPlanCategory',
            },
            {
              component: './exception/404',
            },
          ],
        },
        {
          name: 'query',
          path: '/maritime/query',
          routes: [
            {
              name: 'port',
              path: '/maritime/query/port',
              component: './maritime/query/port',
            },
            {
              name: 'vessel',
              path: '/maritime/query/vessel',
              component: './maritime/query/vessel',
            },
            {
              name: 'people',
              path: '/maritime/query/people',
              component: './maritime/query/people',
            },
            {
              component: './exception/404',
            },
          ],
        },
        {
          name: 'system',
          path: '/maritime/system',
          routes: [
            {
              name: 'files',
              path: '/maritime/system/files',
              component: './maritime/system/files',
            },
            {
              name: 'point',
              path: '/maritime/system/point',
              component: './maritime/system/point',
            },
            {
              name: 'train',
              path: '/maritime/system/counts',
              component: './maritime/water/counts',
            },
            {
              name: 'train',
              path: '/maritime/system/train',
              component: './maritime/system/train',
            },
            {
              name: 'port',
              path: '/maritime/system/port',
              component: './maritime/system/port',
            },
            {
              name: 'vessel',
              path: '/maritime/system/vessel',
              component: './maritime/system/vessel',
            },
            {
              name: 'people',
              path: '/maritime/system/people',
              component: './maritime/system/people',
            },
            {
              name: 'device',
              path: '/maritime/system/device',
              component: './maritime/system/device',
            },
            {
              name: 'category',
              path: '/maritime/equimen/category',
              component: './maritime/equimen/category',
            },
            {
              name: 'monitor',
              path: '/maritime/system/monitor',
              component: './conserve/command/monitor',
            },
            {
              component: './exception/404',
            },
          ],
        },
        {
          name: 'equimen',
          path: '/maritime/equimen',
          routes: [
            {
              name: 'category',
              path: '/maritime/equimen/category',
              component: './maritime/equimen/category',
            },
            {
              component: './exception/404',
            },
          ],
        },
        {
          name: 'data',
          path: '/maritime/data',
          routes: [
            {
              name: 'user',
              path: '/maritime/data/user',
              component: './traffic/system/user',
            },
            {
              name: 'role',
              path: '/maritime/data/role',
              component: './traffic/system/role',
            },
            {
              name: 'role',
              path: '/maritime/data/logs',
              component: './traffic/system/logs',
            },
            {
              component: './exception/404',
            },
          ],
        },
      ],
    },
    {
      path: '/conserve',
      component: '../layouts/HighwayLayout',
      Routes: ['src/pages/Authorized'],
      routes: [
        {
          path: '/conserve',
          redirect: '/conserve/roadproperty/count',
        },
        {
          name: 'market',
          path: '/conserve/market',
          routes: [
            {
              name: 'market',
              path: '/conserve/market/company',
              component: './conserve/market/company',
            },
            {
              component: './exception/404',
            },
          ],
        },
        {
          name: 'roadproperty',
          path: '/conserve/roadproperty',
          routes: [
            {
              name: 'count',
              path: '/conserve/roadproperty/count',
              component: './conserve/roadproperty/count',
            },
            {
              name: 'video',
              path: '/conserve/roadproperty/video',
              component: './conserve/roadproperty/video',
            },
            {
              name: 'water',
              path: '/conserve/roadproperty/water',
              component: './conserve/roadproperty/water',
            },
            {
              name: 'waterList',
              path: '/conserve/roadproperty/waterList',
              component: './conserve/roadproperty/waterList',
            },
            {
              component: './exception/404',
            },
          ],
        },
        {
          name: 'inspection',
          path: '/conserve/inspection',
          routes: [
            {
              name: 'logs',
              path: '/conserve/inspection/logs',
              component: './conserve/inspection/logs',
            },
            {
              name: 'contingencyPlan',
              path: '/conserve/inspection/contingencyPlan',
              component: './conserve/inspection/contingencyPlan',
            },
            {
              name: 'electronictag',
              path: '/conserve/inspection/electronictag',
              component: './conserve/inspection/electronictag',
            },
            {
              name: 'roadWorkOrdes',
              path: '/conserve/inspection/roadWorkOrdes',
              component: './conserve/inspection/roadWorkOrdes',
            },
            {
              component: './exception/404',
            },
          ],
        },
        {
          name: 'system',
          path: '/conserve/system',
          routes: [
            {
              name: 'from',
              path: '/conserve/system/from',
              component: './conserve/system/from',
            },
            {
              name: 'point',
              path: '/conserve/system/point',
              // component: './maritime/system/point',
              component: './conserve/system/point',
            },
            {
              name: 'roadinfo',
              path: '/conserve/system/roadinfo',
              component: './conserve/system/roadinfo',
            },
            {
              name: 'company',
              path: '/conserve/system/company',
              component: './conserve/system/company',
            },
            {
              name: 'roadproductioncategory',
              path: '/conserve/system/roadproductioncategory',
              component: './conserve/system/roadproductioncategory',
            },
            {
              name: 'roadproduction',
              path: '/conserve/system/roadproduction',
              component: './conserve/system/roadproduction',
            },
            {
              component: './exception/404',
            },
          ],
        },
        {
          name: 'command',
          path: '/conserve/command',
          routes: [
            {
              name: 'listPlanCategory',
              path: '/conserve/command/listPlanCategory',
              component: './conserve/command/listPlanCategory',
            },
            {
              name: 'roadConserveTag',
              path: '/conserve/command/roadConserveTag',
              component: './conserve/command/roadConserveTag',
            },
            {
              name: 'planmanagement',
              path: '/conserve/command/planmanagement',
              component: './conserve/command/planmanagement',
            },
            {
              name: 'manpower',
              path: '/conserve/command/manpower',
              component: './conserve/command/manpower',
            },
            {
              name: 'emergency',
              path: '/conserve/command/emergency',
              component: './conserve/command/emergency',
            },
            {
              name: 'monitor',
              path: '/conserve/command/monitor',
              component: './conserve/command/monitor',
            },
            {
              component: './exception/404',
            },
          ],
        },
        {
          name: 'data',
          path: '/conserve/data',
          routes: [
            {
              name: 'user',
              path: '/conserve/data/user',
              component: './traffic/system/user',
            },
            {
              name: 'role',
              path: '/conserve/data/role',
              component: './traffic/system/role',
            },
            {
              name: 'role',
              path: '/conserve/data/logs',
              component: './traffic/system/logs',
            },
            {
              name: 'message',
              path: '/conserve/data/message',
              component: './conserve/data/message',
            },
            {
              component: './exception/404',
            },
          ],
        },
      ],
    },
    {
      path: '/traffic',
      component: '../layouts/MenuLayout',
      // component: '../layouts/BasicLayout',
      Routes: ['src/pages/Authorized'],
      routes: [
        {
          path: '/traffic',
          redirect: '/traffic/overview/gis',
        },
        {
          name: 'overview',
          icon: '',
          path: '/traffic/overview',
          routes: [
            {
              name: 'gis',
              path: '/traffic/overview/gis',
              component: './traffic/overview/gis',
            },
            {
              name: 'command',
              path: '/traffic/overview/command',
              component: './traffic/overview/command',
            },
            {
              name: 'dynamic',
              path: '/traffic/overview/dynamic',
              component: './traffic/overview/dynamic',
            },
            {
              name: 'static',
              path: '/traffic/overview/static',
              component: './traffic/overview/static',
            },
            {
              name: 'source',
              path: '/traffic/overview/source',
              component: './traffic/overview/source',
            },
            {
              name: 'video',
              path: '/traffic/overview/video',
              // component: './traffic/overview/video',
              component: './traffic/overview/video/indexV3',
            },
            {
              name: 'gps',
              path: '/traffic/overview/gps',
              component: './traffic/overview/gps',
            },
            // {
            //   name: 'tons',
            //   path: '/traffic/overview/tons',
            //   component: './traffic/overview/tons',
            // },
            {
              component: './exception/404',
            },
          ],
        },
        {
          name: 'lawment',
          path: '/traffic/lawment',
          routes: [
            {
              name: 'dynamic',
              path: '/traffic/lawment/dynamic',
              component: './traffic/lawment/dynamic',
            },
            {
              name: 'static',
              path: '/traffic/lawment/static',
              component: './traffic/lawment/static',
            },
            {
              name: 'mobile',
              path: '/traffic/lawment/mobile',
              component: './traffic/lawment/mobile',
            },
            {
              name: 'speed',
              path: '/traffic/lawment/speed',
              component: './traffic/lawment/speed',
            },
            {
              name: 'combine',
              path: '/traffic/lawment/combine',
              component: './traffic/lawment/combine',
            },
            {
              name: 'entry',
              path: '/traffic/lawment/entry',
              component: './traffic/lawment/entry',
            },
            {
              component: './exception/404',
            },
          ],
        },
        {
          name: 'lawenfor',
          path: '/traffic/lawenfor',
          routes: [
            {
              name: 'personnel',
              path: '/traffic/lawenfor/personnel',
              component: './traffic/lawenfor/personnel',
            },
            {
              name: 'device  ',
              path: '/traffic/lawenfor/device',
              component: './traffic/lawenfor/device',
            },
            {
              name: 'train',
              path: '/traffic/lawenfor/train',
              component: './traffic/lawenfor/train',
            },
            {
              name: 'assess',
              path: '/traffic/lawenfor/assess',
              component: './traffic/lawenfor/assess',
            },
            {
              name: 'control',
              path: '/traffic/lawenfor/control',
              component: './traffic/lawenfor/control',
            },
            {
              component: './exception/404',
            },
          ],
        },
        {
          name: 'comquery',
          path: '/traffic/comquery',
          routes: [
            {
              name: 'filepige',
              path: '/traffic/comquery/filepige',
              component: './traffic/comquery/filepige',
            },
            {
              name: 'blacklist',
              path: '/traffic/comquery/blacklist',
              component: './traffic/comquery/blacklist',
            },
            {
              name: 'focus',
              path: '/traffic/comquery/focus',
              component: './traffic/comquery/focus',
            },
            {
              name: 'large',
              path: '/traffic/comquery/large',
              component: './traffic/comquery/large',
            },
            {
              name: 'freight',
              path: '/traffic/comquery/freight',
              component: './traffic/comquery/freight',
            },
            {
              name: 'company',
              path: '/traffic/comquery/company',
              component: './traffic/comquery/company',
            },
            {
              name: 'vehicle',
              path: '/traffic/comquery/vehicle',
              component: './traffic/comquery/vehicle',
            },
            {
              name: 'source',
              path: '/traffic/comquery/source',
              component: './traffic/comquery/source',
            },
            {
              component: './exception/404',
            },
          ],
        },
        {
          name: 'datemain',
          path: '/traffic/datemain',
          routes: [
            {
              name: 'blacklist',
              path: '/traffic/datemain/blacklist',
              component: './traffic/datemain/blacklist',
            },
            {
              name: 'large',
              path: '/traffic/datemain/large',
              component: './traffic/datemain/large',
            },
            {
              name: 'freight',
              path: '/traffic/datemain/freight',
              component: './traffic/datemain/freight',
            },
            {
              name: 'company',
              path: '/traffic/datemain/company',
              component: './traffic/datemain/company',
            },
            {
              name: 'vehicle',
              path: '/traffic/datemain/vehicle',
              component: './traffic/datemain/vehicle',
            },
            {
              name: 'source',
              path: '/traffic/datemain/source',
              component: './traffic/datemain/source',
            },
            {
              name: 'site',
              path: '/traffic/datemain/site',
              component: './traffic/datemain/site',
            },
            {
              name: 'legal',
              path: '/traffic/datemain/legal',
              component: './traffic/datemain/legal',
            },
            {
              name: 'template',
              path: '/traffic/datemain/template',
              component: './traffic/datemain/template',
            },
            {
              name: 'news',
              path: '/traffic/datemain/news',
            },
            {
              name: 'device',
              path: '/traffic/datemain/device',
              component: './traffic/datemain/device',
            },
            {
              name: 'train',
              path: '/traffic/datemain/train',
              component: './traffic/datemain/train',
            },
            {
              component: './exception/404',
            },
          ],
        },
        {
          name: 'system',
          path: '/traffic/system',
          routes: [
            {
              name: 'user',
              path: '/traffic/system/user',
              component: './traffic/system/user',
            },
            {
              name: 'role',
              path: '/traffic/system/role',
              component: './traffic/system/role',
            },
            {
              name: 'org',
              path: '/traffic/system/org',
              component: './traffic/system/org',
            },
            {
              name: 'device',
              path: '/traffic/system/device',
              component: './traffic/system/device',
            },
            {
              name: 'sms',
              path: '/traffic/system/sms',
              component: './traffic/system/sms',
            },
            {
              name: 'logs',
              path: '/traffic/system/logs',
              component: './traffic/system/logs',
            },
            {
              name: 'logsetting',
              path: '/traffic/system/logsetting',
              component: './traffic/system/logsetting',
            },
            {
              name: 'cache',
              path: '/traffic/system/cache',
            },
            {
              name: 'properties',
              path: '/traffic/system/properties',
              component: './traffic/system/properties',
            },
            {
              name: 'dicload',
              path: '/traffic/system/dicload',
              component: './traffic/system/dicload',
            },
            {
              name: 'file',
              path: '/traffic/system/file',
              component: './traffic/system/file',
            },
            {
              name: 'equimentlog',
              path: '/traffic/system/equimentlog',
              component: './traffic/system/equimentlog',
            },
            {
              name: 'equipmentErr',
              path: '/traffic/system/equipmentErr',
              component: './traffic/system/equipmentErr',
            },
            {
              name: 'threshold',
              path: '/traffic/system/threshold',
              component: './traffic/system/threshold',
            },
            {
              name: 'bustrack',
              path: '/traffic/system/bustrack',
              component: './traffic/system/bustrack',
            },
            {
              name: 'qrcode',
              path: '/traffic/system/qrcode',
              component: './traffic/system/qrcode',
            },
            {
              component: './exception/404',
            },
          ],
        },
        {
          name: 'datavideo',
          path: '/traffic/datavideo',
          routes: [
            {
              name: 'overrun',
              path: '/traffic/datavideo/overrun',
              component: './traffic/datavideo/overrun',
            },
            {
              name: 'super',
              path: '/traffic/datavideo/super',
              component: './traffic/datavideo/super',
            },
            {
              name: 'shaft',
              path: '/traffic/datavideo/shaft',
              component: './traffic/datavideo/shaft',
            },
            {
              name: 'overrange',
              path: '/traffic/datavideo/overrange',
              component: './traffic/datavideo/overrange',
            },
            {
              name: 'mobile',
              path: '/traffic/datavideo/mobile',
              component: './traffic/datavideo/mobile',
            },
            {
              name: 'carplace',
              path: '/traffic/datavideo/carplace',
            },
            {
              component: './exception/404',
            },
          ],
        },
        {
          name: 'command',
          path: '/traffic/command',
          routes: [
            {
              name: 'emergency',
              path: '/traffic/command/emergency',
              component: './conserve/command/emergency',
            },
            {
              name: 'manpower',
              path: '/traffic/command/manpower',
              component: './conserve/command/manpower',
            },
            {
              name: 'planmanagement',
              path: '/traffic/command/planmanagement',
              component: './conserve/command/planmanagement',
            },
            {
              name: 'listPlanCategory',
              path: '/traffic/command/listPlanCategory',
              component: './conserve/command/listPlanCategory',
            },
            {
              component: './exception/404',
            },
          ],
        },
        // {
        //   name: '403',
        //   path: '/exception/403',
        //   component: './exception/403',
        // },
        {
          component: './exception/404',
        },
      ],
    },
    {
      name: '403',
      path: '/exception/403',
      component: './exception/403',
    },
    {
      component: './exception/404',
    },
  ],
  // Theme for antd
  // https://ant.design/docs/react/customize-theme-cn
  theme: {
    'primary-color': primaryColor,
  },
  proxy: {
    '/result': {
      target: 'http://192.168.1.116:8088/',
      changeOrigin: true,
      pathRewrite: {
        '^/result': '',
      },
    },
    // 路政 旧版接口 --- start ---
    '/service': {
      target: 'http://192.168.1.116:8086/',
      changeOrigin: true,
      pathRewrite: {
        '^/service': '',
      },
    },
    '/service-v2': {
      target: 'http://192.168.1.116:8090/',
      changeOrigin: true,
      pathRewrite: {
        '^/service-v2': '',
      },
    },
    // 路政 旧版接口 --- end ----

    // 路政 新版接口 --- start ---
    // 修改了旧版部分接口
    '/traffic-v1': {
      target: 'http://192.168.1.129:9000/',
      changeOrigin: true,
      pathRewrite: {
        '^/traffic-v1': '',
      },
    },

    // 路政 新版接口 --- end ---
    '/conserve': {
      target: 'http://192.168.1.116:8092/',
      changeOrigin: true,
      pathRewrite: {
        '^/conserve': '',
      },
    },
    '/maritime': {
      target: 'http://192.168.1.116:8093/',
      changeOrigin: true,
      pathRewrite: {
        '^/maritime': '',
      },
    },
    '/transport': {
      target: 'http://192.168.1.116:8094/',
      changeOrigin: true,
      pathRewrite: {
        '^/transport': '',
      },
    },
    '/build': {
      target: 'http://192.168.1.132:8095/',
      changeOrigin: true,
      pathRewrite: {
        '^/build': '',
      },
    },
    '/carApi': {
      target: 'http://192.168.1.239:5155/',
      changeOrigin: true,
      pathRewrite: {
        '^/carApi': '',
      },
    },
    '/pdf': {
      target: 'http://192.168.1.116/',
      changeOrigin: true,
      pathRewrite: {
        '^/pdf': '',
      },
    },
    '/live': {
      target: 'http://192.168.1.116:10800/',
      changeOrigin: true,
      pathRewrite: {
        '^/live': '',
      },
    },
    '/liveGBS': {
      target: 'http://60.255.137.83:10000/',
      changeOrigin: true,
      pathRewrite: {
        '^/liveGBS': '',
      },
    },
    '/ys7': {
      target: 'https://open.ys7.com/',
      changeOrigin: true,
      pathRewrite: {
        '^/ys7': '',
      },
    },
  },
  ignoreMomentLocale: true,
  lessLoaderOptions: {
    javascriptEnabled: true,
  },
  disableRedirectHoist: true,
  cssLoaderOptions: {
    modules: true,
    getLocalIdent: (context, localIdentName, localName) => {
      if (
        context.resourcePath.includes('node_modules') ||
        context.resourcePath.includes('ant.design.pro.less') ||
        context.resourcePath.includes('global.less')
      ) {
        return localName;
      }

      const match = context.resourcePath.match(/src(.*)/);

      if (match && match[1]) {
        const antdProPath = match[1].replace('.less', '');
        const arr = slash(antdProPath)
          .split('/')
          .map(a => a.replace(/([A-Z])/g, '-$1'))
          .map(a => a.toLowerCase());
        return `antd-pro${arr.join('-')}-${localName}`.replace(/--/g, '-');
      }

      return localName;
    },
  },
  manifest: {
    basePath: '/',
  },
  uglifyJSOptions,
  chainWebpack: webpackPlugin,
};
