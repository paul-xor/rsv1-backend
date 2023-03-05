import { Lambda, StepFunctions } from 'aws-sdk';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { addCorsHeader } from '../../shared/util';

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const { search, criteria } = event.queryStringParameters || {};

  const lambda = new Lambda();
  const stepFunctions = new StepFunctions();

  // Start the Step Function with the given criteria
  const stateMachineArn = process.env.STEPFUNCTION_ARN;
  if (!stateMachineArn) {
    throw new Error('STEPFUNCTION_ARN environment variable is not defined');
  }

  const params = {
    stateMachineArn,
    input: JSON.stringify({ searchTerm: search, criteria })
  };

  const result: APIGatewayProxyResult = {
    statusCode: 200,
    body: ''
  }
  addCorsHeader(result);

  try {
    const startExecutionResult = await stepFunctions.startExecution(params).promise();
    const executionArn = startExecutionResult.executionArn;

    const FunctionName = process.env.SEARCH_RESULT_ARN;

    if (!FunctionName) {
      throw new Error('SEARCH_RESULT_ARN environment variable is not defined');
    }

    const searchResultsParams = {
      FunctionName,
      InvocationType: 'RequestResponse',
      Payload: JSON.stringify({ executionArn })
    };

    const searchResultsResponse = await lambda.invoke(searchResultsParams).promise();
    const searchResultsPayload = searchResultsResponse.Payload?.toString() ?? '';
    const formattedResults = JSON.parse(searchResultsPayload);

    result.body = JSON.stringify(formattedResults)
  } catch (error) {
    console.error(`Error starting Step Function: ${error}`);

    result.statusCode = 400,
    result.body = 'Error starting Step Function'
  }
  return result;
};