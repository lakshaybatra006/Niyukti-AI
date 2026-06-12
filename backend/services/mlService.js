const { spawn } = require("child_process");

function getFraudScore(features) {
  return new Promise((resolve, reject) => {
    const python = spawn("python", [
      "ml/predict.py"
    ]);

    let result = "";

    python.stdout.on("data", (data) => {
      result += data.toString();
    });

    python.stderr.on("data", (data) => {
      console.log("ML ERROR:", data.toString());
    });

    python.on("close", () => {
      try {
        resolve(JSON.parse(result));
      } catch (err) {
        reject(err);
      }
    });

    python.stdin.write(JSON.stringify(features));
    python.stdin.end();
  });
}

module.exports = { getFraudScore };