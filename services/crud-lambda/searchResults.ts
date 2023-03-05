import { StepFunctions } from 'aws-sdk';
import { APIGatewayProxyResult } from 'aws-lambda';
import { ISearchResult } from '../types/lambdaTypes'


export const handler = async (event: any): Promise<APIGatewayProxyResult> => {
  const executionArn = event!.executionArn;
  const stepFunctions = new StepFunctions();

  try {
    let executionResult = await stepFunctions.describeExecution({ executionArn }).promise();
    let executionStatus = executionResult.status;

    while (executionStatus === 'RUNNING') {
      console.log('Execution is still running. Waiting for 1.5 seconds before checking again...');
      await new Promise(resolve => setTimeout(resolve, 1500));
      executionResult = await stepFunctions.describeExecution({ executionArn }).promise();
      executionStatus = executionResult.status;
    }

    if (executionStatus === 'SUCCEEDED') {
      const { body } = JSON.parse(executionResult.output || '{}');
      const searchResults = JSON.parse(body)
      console.info('### searchResults ###: ', searchResults)

      const formattedResults = searchResults.map((result: ISearchResult) => {
        const tagStr = result.tags;
        const tags = tagStr ? tagStr.split(', ') : [];
        const extraStr = result.extras;
        const extras = extraStr ? extraStr.split(', ') : [];
        return {
          id: result.id,
          arrival_date: result.arrival_date,
          departure_date: result.departure_date,
          room_size: result.room_size,
          room_quantity: result.room_quantity,
          first_name: result.first_name,
          last_name: result.last_name,
          email: result.email,
          phone: result.phone,
          street_name: result.street_name,
          street_number: result.street_number,
          zip_code: result.zip_code,
          state: result.state,
          city: result.city,
          extras,
          payment: result.payment,
          note: result.note,
          tags,
          reminder: result.reminder,
          newsletter: result.newsletter,
          confirm: result.confirm
        }
      })

      return {
        statusCode: 200,
        body: formattedResults
      }
    } else {
      console.error(`State machine execution failed with status: ${executionStatus}`);
      return {
        statusCode: 500,
        body: 'State machine execution failed'
      }
    }
  } catch (error) {
    console.error(`Error retrieving state machine execution result: ${error}`);
    return {
      statusCode: 400,
      body: 'Error retrieving state machine execution result'
    }
  }
};