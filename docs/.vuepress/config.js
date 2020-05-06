module.exports = {
  title: 'Dxjs',
  description: '基于 react 和 redux-saga，面向 AOP 的状态管理工具。',
  cache: false,

  themeConfig: {
    logo: 'https://hudson-bucket.oss-cn-shenzhen.aliyuncs.com/localhomeqy/huhulogo/Logo2.png',
    displayAllHeaders: true,
    nav: [
      { text: '首页', link: '/' },
      { text: '指南', link: '/guide/' },
      { text: 'API', link: '/api' },
      { text: '讨论', link: 'https://github.com/taixw2/dxjs/issues' },
      { text: 'github', link: 'https://github.com/taixw2/dxjs' },
    ],

    sidebar: {
      '/guide/': ['', 'use'],
    },
  },
};
