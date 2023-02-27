
import { join } from 'path';
import * as cdk from 'aws-cdk-lib';
import { LambdaIntegration, RestApi } from 'aws-cdk-lib/aws-apigateway';
import { Runtime } from 'aws-cdk-lib/aws-lambda';
import * as lambda from 'aws-cdk-lib/aws-lambda-nodejs';


export class SingleLambdaStack extends cdk.Stack {
  private api : RestApi = new RestApi(this, 'SpaceApi')

  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const initCreateTab = new lambda.NodejsFunction(this, 'initCreateTab', {
      runtime: Runtime.NODEJS_18_X,
      entry: (join(__dirname, '..', 'services', 'crud-lambda', 'initCreateTab.ts')),
      handler: 'handler',
      bundling: {
        minify: true, // minify code, defaults to false
        sourceMap: true, // include source map, defaults to false
        sourceMapMode: lambda.SourceMapMode.INLINE, // defaults to SourceMapMode.DEFAULT
        sourcesContent: false, // do not include original source into source map, defaults to true
        target: 'es2020', // target environment for the generated JavaScript code
      },
    })

    // Lambda integrations
    const initCreateTabIntegration = new LambdaIntegration(initCreateTab);
    const initCreateTabResource = this.api.root.addResource('create-table');
    initCreateTabResource.addMethod('GET', initCreateTabIntegration);
  }
}