const clone = require('git-clone');

clone(
  'https://github.com/PaulUno777/kamix-protocol-buffer.git',
  'proto',
  () => {
    console.log('Repository cloned.');
  },
);
