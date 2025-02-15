export const proxyList = [
  // 'http://51.159.115.233:3128',
  // 'http://163.172.31.44:80',
  // 'http://51.159.115.233:3128',
  // 'http://163.172.31.44:80',
];

export function getRandomProxy() {
  return proxyList[Math.floor(Math.random() * proxyList.length)];
}