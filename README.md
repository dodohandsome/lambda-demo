# lambda-demo
lambda-demo
#
npm install
#
npm install -g serverless
#
sls config credentials --provider aws --key PUBLIC_KEY --secret SECRET_KEY
#
sls create -t aws-nodejs -n lambda-demo
#
node app.js
#
sls deploy
