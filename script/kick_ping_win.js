//
// npm install encoding-japanese
//

const { exec, spawn } = require('child_process');
const Encoding = require('encoding-japanese');

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
  sendMessage({ error: err.toString() })
})




// ping.exe -n 10 www.yahoo.co.jp
function execPing() {
  const cmd = 'C:/Windows/System32/PING.EXE';
  //const args = ['-n 10', 'www.yahoo.co.jp']; // NG
  //const args = ['www.yahoo.co.jp']; // OK
  const args = ['-n', '10', 'www.yahoo.co.jp']; // OK
  //const option = { env: { "PYTHONIOENCODING": "cp65001" } };
  //const option = { encoding: "utf8" };
  //const option = { encoding: "Shift_JIS" };

  const ping = spawn(cmd, args);
  //const ping = spawn(cmd, args, option);

  ping.stdout.on('data', (data) => {
    console.error(`stdout: ${data}`);
    //sendMessage({ "data": data.toString() });
    sendMessage({ "data": toString(data) });
  });

  ping.stderr.on('data', (data) => {
    console.error(`stderr: ${data}`);
    sendMessage({ "error": data.toString() });
  });

  ping.on('close', (code) => {
    console.error(`child process exited with code ${code}`);
    process.exit(0);
  });


  const toString = (bytes) => {
    return Encoding.convert(bytes, {
      from: 'SJIS',
      to: 'UNICODE',
      type: 'string',
    });
  };
}

// ----

execPing();

