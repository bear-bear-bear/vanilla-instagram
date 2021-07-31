import '@scripts/common/common';
import '@styles/common/common.scss';

// dev-server 에서 pug 변경에 대한 HMR 지원
if (process.env.NODE_ENV !== 'production') {
  import('@pages/test.pug');
  import('@pages/index.pug');
}
