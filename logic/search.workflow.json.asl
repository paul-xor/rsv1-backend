{
  "Comment": "workflow for search reservations",
  "StartAt": "SearchProcess",
  "States": {
    "SearchProcess": {
      "Comment": "SearchProcess",
      "Type": "Pass",
      "Next": "SwitchOnCreteria"
    },
    "SwitchOnCreteria": {
      "Comment": "search based on criterials: firstName, lastName, email, city",
      "Type": "Choice",
      "Choices": [
        {
          "Variable": "$.creteria",
          "StringEquals": "firstName",
          "Next": "SearchByFirstName"
        },
        {
          "Variable": "$.creteria",
          "StringEquals": "lastName",
          "Next": "SearchByLastName"
        },
        {
          "Variable": "$.creteria",
          "StringEquals": "email",
          "Next": "SearchByEmail"
        },
        {
          "Variable": "$.creteria",
          "StringEquals": "lastName",
          "Next": "SearchByCity"
        }
      ]
    },
    "SearchByFirstName": {
      "Type": "Task",
      "Resource": "arn:aws:states:::lambda:invoke.waitForTaskToken",
      "End": true
    },
    "SearchByLastName": {
      "Type": "Task",
      "Resource": "arn:aws:states:::lambda:invoke.waitForTaskToken",
      "End": true
    },
    "SearchByEmail": {
      "Type": "Task",
      "Resource": "arn:aws:states:::lambda:invoke.waitForTaskToken",
      "End": true
    },
    "SearchByCity": {
      "Type": "Task",
      "Resource": "arn:aws:states:::lambda:invoke.waitForTaskToken",
      "End": true
    }
  }
}