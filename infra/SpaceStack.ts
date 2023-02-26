
import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { Code, Function as LambdaFunction, Runtime } from 'aws-cdk-lib/aws-lambda';
import { join } from 'path';
import { LambdaIntegration, RestApi } from 'aws-cdk-lib/aws-apigateway';
import { PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { S3 } from 'aws-sdk';

export class SpaceStack extends Stack {
  private api : RestApi = new RestApi(this, 'SpaceApi')


  constructor(scope: Construct, id: string, props: StackProps) {
    super(scope, id, props)

    const helloLambdaNodeJs = new NodejsFunction(this, 'helloLambdaNodeJs', {
      runtime: Runtime.NODEJS_18_X,
      entry: (join(__dirname, '..', 'services', 'node-lambda', 'hello.ts')),
      handler: 'handler'
    })

    const s3ListPolicy = new PolicyStatement();
    s3ListPolicy.addActions('s3:ListAllMyBuckets');
    s3ListPolicy.addResources('*');
    helloLambdaNodeJs.addToRolePolicy(s3ListPolicy);

    // Hello Lambda integration

    const helloLambdaIntegration = new LambdaIntegration(helloLambdaNodeJs);
    const helloLambdaResource = this.api.root.addResource('hello');
    helloLambdaResource.addMethod('GET', helloLambdaIntegration);

  }

}