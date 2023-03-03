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
        },
        {
          "Variable": "$.criteria",
          "StringEquals": "firstName",
          "Next": "SearchByFirstName"
        },
        {
          "Variable": "$.criteria",
          "StringEquals": "lastName",
          "Next": "SearchByLastName"
        }
      ],
      "Default": "InvalidCriteria"
    },
    "SearchByEmail": {
      "Type": "Task",
      "Resource": "arn:aws:lambda:us-east-1:201682123230:function:SearchFlowStack-searchByEmail96E4F29F-2vbwkJgV1gtj",
      "InputPath": "$.searchTerm",
      "Next": "ReturnResults"
    },
    "SearchByCity": {
      "Type": "Task",
      "Resource": "arn:aws:lambda:us-east-1:201682123230:function:SearchFlowStack-searchByCityDA80C225-2hxaaX3MPD5P",
      "InputPath": "$.searchTerm",
      "Next": "ReturnResults"
    },
    "SearchByFirstName": {
      "Type": "Task",
      "Resource": "arn:aws:lambda:us-east-1:201682123230:function:SearchFlowStack-searchByFirstName1A85549D-6lIik97hdNnG",
      "InputPath": "$.searchTerm",
      "Next": "ReturnResults"
    },
    "SearchByLastName": {
      "Type": "Task",
      "Resource": "arn:aws:lambda:us-east-1:201682123230:function:SearchFlowStack-searchByLastNameD147AFC8-2dTW5KrNB2f4",
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
