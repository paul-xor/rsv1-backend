
import { SingleLambdaStack } from './Single-Lambda';
import { App } from "aws-cdk-lib";


const app = new App()

new SingleLambdaStack(app, 'SingleLambdaStack', {
  stackName: 'SingleLambdaStack'
})