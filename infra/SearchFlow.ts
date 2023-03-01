import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda-nodejs';
import * as stepfunctions from "aws-cdk-lib/aws-stepfunctions";
import * as iam from "aws-cdk-lib/aws-iam";
import * as fs from "fs";

import { Function as LambdaFunction, Runtime } from 'aws-cdk-lib/aws-lambda';
import { join } from 'path';
import { LambdaIntegration, RestApi } from 'aws-cdk-lib/aws-apigateway';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { PolicyStatement } from 'aws-cdk-lib/aws-iam';


export class SearchFlowStack extends cdk.Stack {
  private api : RestApi = new RestApi(this, 'SearchFlowApi')
  public static cfnStepFunction: stepfunctions.CfnStateMachine;

  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    //create a roleARN for step function
    const roleARN = new iam.Role(this, 'StepFunctionRole', {
      assumedBy: new iam.ServicePrincipal('states.amazonaws.com'),
      managedPolicies: [
        iam.ManagedPolicy.fromAwsManagedPolicyName('service-role/AWSLambdaBasicExecutionRole'),
        iam.ManagedPolicy.fromAwsManagedPolicyName('service-role/AWSLambdaVPCAccessExecutionRole')
      ]
    });

    const file = fs.readFileSync('./logic/search.simple.json.asl', 'utf8');

    SearchFlowStack.cfnStepFunction = new stepfunctions.CfnStateMachine(this, 'cfnStepFunction', {
      roleArn: roleARN.roleArn,
      definitionString: file.toString(),
    });

    const searchByEmailLambda = new lambda.NodejsFunction(this, 'searchByEmail', {
      runtime: Runtime.NODEJS_18_X,
      entry: (join(__dirname, '..', 'services', 'crud-lambda', 'searchByEmail.ts')),
      handler: 'handler',
    })

    const searchByCityLambda = new lambda.NodejsFunction(this, 'searchByCity', {
      runtime: Runtime.NODEJS_18_X,
      entry: (join(__dirname, '..', 'services', 'crud-lambda', 'searchByCity.ts')),
      handler: 'handler',
    })

    searchByEmailLambda.addToRolePolicy(new PolicyStatement({
      actions: ['lambda:InvokeFunction'],
      resources: [SearchFlowStack.cfnStepFunction.attrArn]
    }));

    searchByCityLambda.addToRolePolicy(new PolicyStatement({
      actions: ['lambda:InvokeFunction'],
      resources: [SearchFlowStack.cfnStepFunction.attrArn]
    }));

    const searchLambda = new lambda.NodejsFunction(this, 'searchLambda', {
      runtime: Runtime.NODEJS_18_X,
      entry: (join(__dirname, '..', 'services', 'crud-lambda', 'search.ts')),
      handler: 'handler',
      environment: {
        STATE_MACHINE_ARN: SearchFlowStack.cfnStepFunction.attrArn
      },
      initialPolicy: [
        new PolicyStatement({
          actions: [
            'states:StartExecution'
          ],
          resources: [SearchFlowStack.cfnStepFunction.attrArn]
        }),
        new PolicyStatement({
          actions: [
            'lambda:InvokeFunction'
          ],
          resources: ["*"]
        })
      ]
    })

    const searchLambdaIntegration = new LambdaIntegration(searchLambda);
    const searchLambdaResource = this.api.root.addResource('search');
    searchLambdaResource.addMethod('GET', searchLambdaIntegration);



    new cdk.CfnOutput(this, 'searchByEmailLambdaArn', {
      value: searchByEmailLambda.functionArn,
      description: 'The ARN of the searchByEmail Lambda function'
    });

    new cdk.CfnOutput(this, 'searchByCityLambdaArn', {
      value: searchByCityLambda.functionArn,
      description: 'The ARN of the searchByCity Lambda function'
    });

  }
}