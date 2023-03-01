
import { SingleLambdaStack } from './Single-Lambda';
import { SearchFlowStack } from './SearchFlow';
import { App } from "aws-cdk-lib";


const app = new App()

// new SingleLambdaStack(app, 'SingleLambdaStack', {
//   stackName: 'SingleLambdaStack'
// })

new SearchFlowStack(app, 'SearchFlowStack', {
  stackName: 'SearchFlowStack'
})