const clone = require('git-clone');

clone(
  'https://github.com/PaulUno777/proto.git',
  'proto',
  { shallow: false },
  () => {
    console.log('Repository cloned.');
  },
);
