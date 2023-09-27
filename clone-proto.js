const clone = require('git-clone');

clone('https://github.com/PaulUno777/proto', 'proto', { shallow: true }, () => {
  console.log('Repository cloned.');
});
