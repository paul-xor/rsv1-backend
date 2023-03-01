{
  "Comment": "Search ASL",
  "StartAt": "SwitchOnCriteria",
  "States": {
    "SwitchOnCriteria": {
      "Type": "Choice",
      "Choices": [
        {
          "Variable": "$.criteria",
          "StringEquals": "email",
          "Next": "SearchByEmail"
        },
        {
          "Variable": "$.criteria",
          "StringEquals": "city",
          "Next": "SearchByCity"
        }
      ],
      "Default": "InvalidCriteria"
    },
    "SearchByEmail": {
      "Type": "Task",
      "Resource": "arn:aws:lambda:us-east-1:201682123230:function:SearchFlowStack-searchByEmail96E4F29F-SCPMBO6FQwjz",
      "InputPath": "$.searchTerm",
      "Next": "ReturnResults"
    },
    "SearchByCity": {
      "Type": "Task",
      "Resource": "arn:aws:lambda:us-east-1:201682123230:function:SearchFlowStack-searchByCityDA80C225-cZeoup4HI4GL",
      "InputPath": "$.searchTerm",
      "Next": "ReturnResults"
    },
    "ReturnResults": {
      "Type": "Pass",
      "ResultPath": "$.searchResults",
      "End": true
    },
    "InvalidCriteria": {
      "Type": "Fail",
      "Cause": "Invalid criteria provided",
      "Error": "InvalidCriteria"
    }
  }
}
