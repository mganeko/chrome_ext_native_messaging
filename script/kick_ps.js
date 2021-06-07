#!/opt/local/bin/node
// ^ path to node

const { exec } = require('child_process');

process.stdin.on('readable', () => {
  let input = []
  let chunk
  while (chunk = process.stdin.read()) {
    input.push(chunk)
  }
  input = Buffer.concat(input)

  const msgLen = input.readUInt32LE(0)
  const dataLen = msgLen + 4

  if (input.length >= dataLen) {
    const content = input.slice(4, dataLen)
    const json = JSON.parse(content.toString())
    handleMessage(json)
  }
})

function sendMessage(msg) {
  const buffer = Buffer.from(JSON.stringify(msg))

  const header = Buffer.alloc(4)
  header.writeUInt32LE(buffer.length, 0)

  const data = Buffer.concat([header, buffer])
  process.stdout.write(data)
}

function handleMessage(json) {
  console.error("Get STDIN:", json);
}

process.on('uncaughtException', (err) => {
  sendMessage({error: err.toString()})
})


function execPs() {
  const cmd = '/bin/ps';
  exec(cmd, (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error}`);
      sendMessage({"error": error});
      process.exit(1);
    }
    
    // --- stdout --
    //console.error(`stderr: ${stdout}`);
    //sendMessage({"stdout": stdout});

    // -- split stdout --
    const lines = stdout.split("\n");
    console.error('lines count=', lines.length);
    console.error('lines:', lines);

    sendMessage({"lines": lines});

    process.exit(0);
  });
}


// ----

//const data = { "text": "Hello Native"};
//sendMessage(data);
//process.exit(0);

execPs();
