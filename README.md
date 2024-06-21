
# Slidely AI Express Backend Code

##  Candidate Info
+ Name: Rohan Shah
+ Email: shah_rohan2001@yahoo.com

## About
Hi Slidely team, this repository contains my code for the express backend part of the task 2.

## Technical Description
+ Language: Typescript
+ Database: db.json file
    + Basic Structure:
      ```
      {
  "metadata": {
    "submission_cnt": 0,
    "deleted_cnt": 0
  },
  "data": []
}
      ```
    + "data" cotains list of records in JSON.
    + A record is stored with following fields:
      ```
      {
  "NameProp": "Saina Nehwal",
  "EmailProp": "sn@gmail.com",
  "PhoneNumProp": "7854785478",
  "GithubLinkProp": "https://github.com/RoSh-23",
  "StopwatchSecProp": "18",
  "StopwatchMinProp": "0",
  "StopwatchHrsProp": "0",
  "insertionIdx": 2
}
      ```
      
## How to Run
- Clone this github repository using the https url: https://github.com/RoSh-23/RohanShah_SlidelyAI_Task_Backend_Express_Code.git
- Navigate to the folder where the github repo has been cloned.
- On the command line execute the following command:
    -  npm i
- Then to start the server in Debug mode -- changes are automatically detected run:
    - npm run dev
- Else to run the server without debug mode -- changes not automatically detected run:
    - npm start 

## Points to remember
1. Regarding db.json
    + The current db.json file contains some dummy data.
    + If you want to do a clean start simply empty the file (remove everything).
    + You are NOT required to create the basic structure if you empty the file, it will be created on the first submission.
2. All the code is in: src/index.ts file
3. The server HAS NOT been hosted, runs fine on the localhost, winforms frontend has urls for port 3000.
4. A Curl request of following form runs correctly to enter the data:
```
curl -X POST http://localhost:3000/submit -H "Content-Type: application/json" --data "{\"name\":\"Object\", \"email\":\"s@g.com\", \"phone\":\"7854785478\", \"github_link\":\"https://github.com/\", \"stopwatch_time\":\"00:13:24\"}"
```
