import './scripts/index';
import './styles/index.scss';

/**
 * @desc dev-server 에서 pug 변경에 대한 HMR 지원
 */
const watchPugs = async () => {
  const { default: pageNames } = await import('@/../page.config');

  pageNames.forEach((pageName) => {
    import(`@pages/${pageName}/${pageName}.pug`);
  });
};

/**
 * @desc 
 * koa.js (server) 에서 번들 결과물들의 변경을 감지하여 신호를 보내주면, 해당 신호를 감지하여 페이지 리로드. 
  koa server로 정적이라 할 수 있는 번들 결과물들을 제공하면서도, hmr 과 유사한 효과를 낼 수 있게 해줌.
 */
const onReloadSSE = () => {
  // const source = new EventSource(`http://localhost:${SERVER_PORT}/sse`);
  const source = new EventSource(`http://localhost:8001/sse`);
  source.onmessage = () => window.location.reload();
};

if (process.env.NODE_ENV !== 'production') {
  watchPugs();
  onReloadSSE();
}
