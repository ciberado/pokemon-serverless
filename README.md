# Pokemon serverless version

Prepare the static assets:

* Create a new S3 bucket
* Activate host mode on it
* Upload all the static assets to it (avatar-capside.png, pokemon-log.svg and the content of the pokemon/*.png folder)
* Set permissions to public read

Now you can download and deploy the project

``` bash
export AWS_PROFILE=<profile_name>
export AWS_REGION=<region>
export TABLE_ARN=<dynamodb_table_arn>
export S3URLPREFIX=<s3 prefix>

npm install -g serverless
git clone https://github.com/ciberado/pokemon-serverless
cd pokemon-serverless
npm install
serverless deploy --region $AWS_REGION
```

