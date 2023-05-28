import React from 'react';
import { useHistory } from 'react-router-dom';

import './index.less';

function Home(): JSX.Element {
  const history = useHistory();
  return (
    <div className='home-wrap'>
      这是首页
      <button id='goToMy' onClick={() => history.push('/my')}>我的页面</button>
    </div>
  );
}

export default Home;
