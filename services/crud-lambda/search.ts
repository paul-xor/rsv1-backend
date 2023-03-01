import { StepFunctions } from 'aws-sdk';
import { APIGatewayProxyEvent } from 'aws-lambda';
import { SearchFlowStack } from '../../infra/SearchFlow';

export const handler = async (event: APIGatewayProxyEvent): Promise<any> => {
  const { search, criteria } = event.queryStringParameters || {};

  const stepFunctions = new StepFunctions();
  const { cfnStepFunction } = SearchFlowStack;

  // Start the Step Function with the given criteria
  const params = {
    stateMachineArn: cfnStepFunction.attrArn,
    input: JSON.stringify({ searchTerm: search, criteria })
  };

  try {
    const data = await stepFunctions.startExecution(params).promise();
    console.log(`Step Function started with executionArn: ${data.executionArn}`);
    return {
      statusCode: 200,
      body: `Step Function started with executionArn: ${data.executionArn}`
    };
  } catch (error) {
    console.error(`Error starting Step Function: ${error}`);
    return {
      statusCode: 500,
      body: 'Error starting Step Function'
    };
  }
};