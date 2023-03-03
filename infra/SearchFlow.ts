import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda-nodejs';
import * as stepfunctions from "aws-cdk-lib/aws-stepfunctions";
import * as iam from "aws-cdk-lib/aws-iam";
import * as fs from "fs";

import { Runtime } from 'aws-cdk-lib/aws-lambda';
import { join } from 'path';
import { LambdaIntegration, RestApi } from 'aws-cdk-lib/aws-apigateway';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { PolicyStatement } from 'aws-cdk-lib/aws-iam';
import * as dotenv from 'dotenv';

dotenv.config();

export class SearchFlowStack extends cdk.Stack {
  private api : RestApi = new RestApi(this, 'SearchFlowApi');
  private cfnStepFunction: stepfunctions.CfnStateMachine;
  private rdsHost: string | undefined = process.env.RDS_HOST;
  private rdsPort: string | undefined = process.env.RDS_PORT;
  private rdsUser: string | undefined = process.env.RDS_USER;
  private rdsPassword: string | undefined = process.env.RDS_PASSWORD;
  private rdsDatabase: string | undefined = process.env.RDS_DATABASE;

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

    this.cfnStepFunction = new stepfunctions.CfnStateMachine(this, 'cfnStepFunction', {
      roleArn: roleARN.roleArn,
      definitionString: file.toString(),
    });

    const searchByEmailLambda = new lambda.NodejsFunction(this, 'searchByEmail', {
      runtime: Runtime.NODEJS_18_X,
      entry: (join(__dirname, '..', 'services', 'crud-lambda', 'searchByEmail.ts')),
      handler: 'handler',
      environment: {
        RDS_HOST: this.rdsHost ?? '',
        RDS_PORT: this.rdsPort ?? '',
        RDS_USER: this.rdsUser ?? '',
        RDS_PASSWORD: this.rdsPassword ?? '',
        RDS_DATABASE: this.rdsDatabase ?? '',
      }
    })

    const searchByCityLambda = new lambda.NodejsFunction(this, 'searchByCity', {
      runtime: Runtime.NODEJS_18_X,
      entry: (join(__dirname, '..', 'services', 'crud-lambda', 'searchByCity.ts')),
      handler: 'handler',
    })

    searchByEmailLambda.addToRolePolicy(new PolicyStatement({
      actions: ['lambda:InvokeFunction'],
      resources: [this.cfnStepFunction.attrArn]
    }));

    searchByCityLambda.addToRolePolicy(new PolicyStatement({
      actions: ['lambda:InvokeFunction'],
      resources: [this.cfnStepFunction.attrArn]
    }));

    const searchResultsFunction = new NodejsFunction(this, 'searchResultsFunction', {
      runtime: Runtime.NODEJS_18_X,
      entry: (join(__dirname, '..', 'services', 'crud-lambda', 'searchResults.ts')),
      handler: 'handler',
      initialPolicy: [
        new PolicyStatement({
          effect: iam.Effect.ALLOW,
          actions: [
            'states:DescribeExecution'
          ],
          resources: ["arn:aws:states:us-east-1:201682123230:execution:*"]
        })
      ]
    })

    const searchLambda = new lambda.NodejsFunction(this, 'searchLambda', {
      runtime: Runtime.NODEJS_18_X,
      entry: (join(__dirname, '..', 'services', 'crud-lambda', 'search.ts')),
      handler: 'handler',
      timeout: cdk.Duration.seconds(5),
      environment: {
        STEPFUNCTION_ARN: this.cfnStepFunction.attrArn,
        SEARCH_RESULT_ARN: searchResultsFunction.functionArn
      },
      initialPolicy: [
        new PolicyStatement({
          actions: [
            'states:StartExecution'
          ],
          resources: [this.cfnStepFunction.attrArn]
        }),
        new PolicyStatement({
          actions: [
            'lambda:InvokeFunction'
          ],
          resources: ["*"]
        }),
        new PolicyStatement({
          effect: iam.Effect.ALLOW,
          actions: [
            'logs:CreateLogGroup',
            'logs:CreateLogStream',
            'logs:DescribeLogGroups',
            'logs:DescribeLogStreams',
            'logs:PutLogEvents',
            'logs:GetLogEvents',
            'logs:FilterLogEvents'
          ],
          resources: ["*"]
        })
      ]
    })

    const searchLambdaIntegration = new LambdaIntegration(searchLambda);
    const searchLambdaResource = this.api.root.addResource('search');
    searchLambdaResource.addMethod('GET', searchLambdaIntegration);

    new cdk.CfnOutput(this, 'searchResultsFunctionArn', {
      value: searchResultsFunction.functionArn,
      description: 'The ARN of the searchResultsFunction Lambda function'
    });

    new cdk.CfnOutput(this, 'searchByEmailLambdaArn', {
      value: searchByEmailLambda.functionArn,
      description: 'The ARN of the searchByEmail Lambda function'
    });

    new cdk.CfnOutput(this, 'searchByCityLambdaArn', {
      value: searchByCityLambda.functionArn,
      description: 'The ARN of the searchByCity Lambda function'
    });

    new cdk.CfnOutput(this, 'cfnStepFunctionArn', {
      value: this.cfnStepFunction.attrArn,
      description: 'The ARN of the cfnStepFunction function'
    });

  }
}