
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

    const readLambda = new lambda.NodejsFunction(this, 'readLambda', {
      runtime: Runtime.NODEJS_18_X,
      entry: (join(__dirname, '..', 'services', 'crud-lambda', 'read.ts')),
      handler: 'handler',
      bundling: {
        minify: true, // minify code, defaults to false
        sourceMap: true, // include source map, defaults to false
        sourceMapMode: lambda.SourceMapMode.INLINE, // defaults to SourceMapMode.DEFAULT
        sourcesContent: false, // do not include original source into source map, defaults to true
        target: 'es2020', // target environment for the generated JavaScript code
      },
    })

    const updateLambda = new lambda.NodejsFunction(this, 'updateLambda', {
      runtime: Runtime.NODEJS_18_X,
      entry: (join(__dirname, '..', 'services', 'crud-lambda', 'update.ts')),
      handler: 'handler',
      bundling: {
        minify: true, // minify code, defaults to false
        sourceMap: true, // include source map, defaults to false
        sourceMapMode: lambda.SourceMapMode.INLINE, // defaults to SourceMapMode.DEFAULT
        sourcesContent: false, // do not include original source into source map, defaults to true
        target: 'es2020', // target environment for the generated JavaScript code
      },
    })

    const createLambda = new lambda.NodejsFunction(this, 'createLambda', {
      runtime: Runtime.NODEJS_18_X,
      entry: (join(__dirname, '..', 'services', 'crud-lambda', 'create.ts')),
      handler: 'handler',
      bundling: {
        minify: true, // minify code, defaults to false
        sourceMap: true, // include source map, defaults to false
        sourceMapMode: lambda.SourceMapMode.INLINE, // defaults to SourceMapMode.DEFAULT
        sourcesContent: false, // do not include original source into source map, defaults to true
        target: 'es2020', // target environment for the generated JavaScript code
      },
    })

    const deleteLambda = new lambda.NodejsFunction(this, 'deleteLambda', {
      runtime: Runtime.NODEJS_18_X,
      entry: (join(__dirname, '..', 'services', 'crud-lambda', 'delete.ts')),
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

    const readLambdaIntegration = new LambdaIntegration(readLambda);
    const readLambdaResource = this.api.root.addResource('read');
    readLambdaResource.addMethod('GET', readLambdaIntegration);

    const updateLambdaIntegration = new LambdaIntegration(updateLambda);
    const updateLambdaResource = this.api.root.addResource('update');
    updateLambdaResource.addMethod('PUT', updateLambdaIntegration);

    const createLambdaIntegration = new LambdaIntegration(createLambda);
    const createLambdaResource = this.api.root.addResource('new-create');
    createLambdaResource.addMethod('POST', createLambdaIntegration);

    const deleteLambdaIntegration = new LambdaIntegration(deleteLambda);
    const deleteLambdaResource = this.api.root.addResource('delete');
    deleteLambdaResource.addMethod('DELETE', deleteLambdaIntegration);
  }


}