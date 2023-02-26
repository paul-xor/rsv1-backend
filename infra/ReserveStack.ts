import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as rds from 'aws-cdk-lib/aws-rds';
import * as cdk from 'aws-cdk-lib';

import { Function as LambdaFunction, Runtime } from 'aws-cdk-lib/aws-lambda';
import { join } from 'path';
import { LambdaIntegration, RestApi } from 'aws-cdk-lib/aws-apigateway';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { PolicyStatement } from 'aws-cdk-lib/aws-iam';


export class ReserveStack extends cdk.Stack {
  private api : RestApi = new RestApi(this, 'SpaceApi')

  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const vpc = new ec2.Vpc(this, 'cdk-vpc-rds', {
      cidr: '10.0.0.0/16',
      natGateways: 0,
      maxAzs: 3,
      subnetConfiguration: [
        {
          name: 'public-subnet-1',
          subnetType: ec2.SubnetType.PUBLIC,
          cidrMask: 24,
        },
        {
          name: 'isolated-subnet-1',
          subnetType: ec2.SubnetType.PRIVATE_ISOLATED,
          cidrMask: 28,
        },
      ],
    });

    // create a security group for the EC2 instance
    const ec2InstanceSG = new ec2.SecurityGroup(this, 'ec2-instance-sg', {
      vpc,
    });

    ec2InstanceSG.addIngressRule(
      ec2.Peer.anyIpv4(),
      ec2.Port.tcp(22),
      'allow SSH connections from anywhere',
    );


    // create RDS instance
    const dbInstance = new rds.DatabaseInstance(this, 'db-instance', {
      vpc,
      vpcSubnets: {
        subnetType: ec2.SubnetType.PUBLIC,
      },
      engine: rds.DatabaseInstanceEngine.mysql({
        version: rds.MysqlEngineVersion.VER_8_0_26
      }),
      instanceType: ec2.InstanceType.of(
        ec2.InstanceClass.BURSTABLE3,
        ec2.InstanceSize.MICRO,
      ),
      credentials: rds.Credentials.fromGeneratedSecret('admin'),
      multiAz: false,
      allocatedStorage: 110,
      maxAllocatedStorage: 127,
      allowMajorVersionUpgrade: false,
      autoMinorVersionUpgrade: true,
      backupRetention: cdk.Duration.days(0),
      deleteAutomatedBackups: true,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      deletionProtection: false,
      databaseName: 'reservationsDb',
      publiclyAccessible: false,
    });

    const helloLambdaNodeJs = new NodejsFunction(this, 'helloLambdaNodeJs', {
      vpc,
      runtime: Runtime.NODEJS_18_X,
      entry: (join(__dirname, '..', 'services', 'node-lambda', 'hello.ts')),
      handler: 'handler'
    })

    const readLambda = new NodejsFunction(this, 'readLamdba', {
      vpc,
      runtime: Runtime.NODEJS_18_X,
      entry: (join(__dirname, '..', 'services', 'crud-lambda', 'read.ts')),
      handler: 'handler',
    })


    // Lambda integrations
    const helloLambdaIntegration = new LambdaIntegration(helloLambdaNodeJs);
    const helloLambdaResource = this.api.root.addResource('hello');
    helloLambdaResource.addMethod('GET', helloLambdaIntegration);

    const readLambdaIntegration = new LambdaIntegration(readLambda);
    const readLambdaResource = this.api.root.addResource('readLambda');
    readLambdaResource.addMethod('GET', readLambdaIntegration);

    const s3ListPolicy = new PolicyStatement();
    s3ListPolicy.addActions('s3:ListAllMyBuckets');
    s3ListPolicy.addResources('*');
    helloLambdaNodeJs.addToRolePolicy(s3ListPolicy);

    readLambda.addToRolePolicy(s3ListPolicy);

    const rdsReadPolicy = new PolicyStatement();
    rdsReadPolicy.addActions('rds-db:connect');
    rdsReadPolicy.addResources(dbInstance.secret!.secretArn);

    readLambda.addToRolePolicy(rdsReadPolicy);


    // dbInstance.connections.allowFrom(ec2Instance, ec2.Port.tcp(5432));

    new cdk.CfnOutput(this, 'dbEndpoint', {
      value: dbInstance.instanceEndpoint.hostname,
    });

    new cdk.CfnOutput(this, 'secretName', {
      // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
      value: dbInstance.secret?.secretName!,
    });
  }
}