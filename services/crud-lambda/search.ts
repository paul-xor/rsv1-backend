import { Lambda, StepFunctions } from 'aws-sdk';
import { APIGatewayProxyEvent } from 'aws-lambda';
import { SearchFlowStack } from '../../infra/SearchFlow';

export const handler = async (event: APIGatewayProxyEvent): Promise<any> => {
  const { search, criteria } = event.queryStringParameters || {};

  const stepFunctions = new StepFunctions();
  const lambda = new Lambda();
  const { cfnStepFunction, cfnSearchResultsFunction } = SearchFlowStack;

  // Start the Step Function with the given criteria
  const params = {
    stateMachineArn: cfnStepFunction.attrArn,
    input: JSON.stringify({ searchTerm: search, criteria })
  };

  try {
    const startExecutionResult = await stepFunctions.startExecution(params).promise();
    const executionArn = startExecutionResult.executionArn;
    console.log(`Step Function started with executionArn: ${executionArn}`);

    // Wait for the Lambda function to finish processing the search results
    const searchResultsParams = {
      FunctionName: cfnSearchResultsFunction.functionArn,
      InvocationType: 'RequestResponse',
      Payload: JSON.stringify({ executionArn })
    };

    const searchResultsResponse = await lambda.invoke(searchResultsParams).promise();
    const searchResultsPayload = searchResultsResponse.Payload?.toString() ?? '';
    const formattedResults = JSON.parse(searchResultsPayload);

    return {
      statusCode: 200,
      body: JSON.stringify(formattedResults)
    };
  } catch (error) {
    console.error(`Error starting Step Function: ${error}`);
    return {
      statusCode: 500,
      body: 'Error starting Step Function'
    };
  }
};
