import { SpaceStack} from "./SpaceStack";
import { ReserveStack } from "./ReserveStack";
import { App } from "aws-cdk-lib";


const app = new App()
// new SpaceStack(app, 'Space-finder', {
//   stackName: 'SpaceFinder'
// })

new ReserveStack(app, 'Reserve-Stack', {
  stackName: 'ReserveStack'
})