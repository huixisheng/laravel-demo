import Mock from 'mockjs';
import jsonData from './json';

Mock.mock(/\.json/, 'post', { 'data|1-10': [{}] });
const userInfo = Mock.mock({
  code: 1000,
  data: {
    name: '@cname',
    // avatar: '@image(100x100, #00405d, #FFF, huixisheng)',
    avatar: '@image',
  },
});
Mock.mock(/\/user\/info/, 'post', userInfo);
jsonData.forEach((value) => {
  const reg = new RegExp(value.path);
  const data = Mock.mock(value.data);
  console.log(reg);
  Mock.mock(reg, 'get', data);
  Mock.mock(reg, 'post', data);
});
// console.log(data);

export default Mock;
