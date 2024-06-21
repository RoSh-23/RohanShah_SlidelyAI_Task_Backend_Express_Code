import express, { Request, Response } from 'express';
import fs from 'fs';

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.get('/ping', (req: Request, res: Response) => {
    res.send('True');
});

app.post('/submit', (req: Request, res: Response) => {
    // get the request body
    const postInptData = req.body;
    fs.readFile('././db.json', 'utf8', (err, fileData) => { // reading the json file
        if (err)
        {
            console.error(err);
            res.sendStatus(500); // internal server error
        }
        else // process the file
        {
            let dbFileBasicStructPresentFlag = true; 
            try
            {
                if (fileData.length == 0) // file is empty
                {
                    // create the basic structure
                    const dbFileBasicStruct = {
                        "metadata": {
                            "submission_cnt": 0,
                            "deleted_cnt": 0
                        },
                        "data": []
                    }
                    const dbFileBasicStructJson = JSON.stringify(dbFileBasicStruct);
                    fs.writeFile("././db.json", dbFileBasicStructJson, (err) => {
                        if (err)
                        {
                            console.error(err);
                            dbFileBasicStructPresentFlag = false;
                            res.sendStatus(500); // internal server error
                        }
                    });
                }
                if (dbFileBasicStructPresentFlag == true)
                {
                    fs.readFile('././db.json', 'utf8', (err, dataFromFile) => {
                        if (err)
                        {
                            console.error(err);
                            res.sendStatus(500); // internal server error
                        }
                        else
                        {
                            let dbFileJson;
                            try
                            {
                                dbFileJson = JSON.parse(dataFromFile);

                                // add new data
                                dbFileJson["metadata"]["submission_cnt"] += 1;
                                postInptData.insertionIdx = dbFileJson["metadata"]["submission_cnt"];      // assign insertion order index
                                dbFileJson["data"].push(postInptData);
                                
                                // serialize
                                const dataToWrite = JSON.stringify(dbFileJson);
                                fs.writeFile("././db.json", dataToWrite, (err) => {
                                    if (err)
                                    {
                                        console.error(err);
                                        res.sendStatus(500); // internal server error
                                    }
                                    else
                                    {
                                        res.sendStatus(200);
                                    }
                                });
                            }
                            catch (e)
                            {
                                console.error(e);
                                res.sendStatus(500); // internal server error
                            }
                        }
                    });
                }
            }
            catch (e)
            {
                console.error(e);
                res.sendStatus(500); // internal server error
            }
        }       
    });
});

app.get('/read', (req: Request, res: Response) => {
    const index = req.query.index;
    if (isNaN(Number(index)) == true)
    {
        return res.status(400).send("The requested index sent as query parameter is not a number.");     
    }
    fs.readFile('././db.json', 'utf8', (err, fileData) => { // reading the json file
        if (err)
        {
            console.error(err);
            res.sendStatus(500); // internal server error
        }
        else // process the file
        { 
            try
            {
                if (fileData.length == 0) // file is empty
                {
                    res.sendStatus(404); // no record present
                }
                else
                {
                    let dbFileJson;
                    try
                    {
                        dbFileJson = JSON.parse(fileData);
                        const submissionCnt = Number(dbFileJson["metadata"]["submission_cnt"])
                        const deletedCnt = Number(dbFileJson["metadata"]["deleted_cnt"])
                        const indexNumb = Number(index)
                        if (submissionCnt - deletedCnt == 0)
                        {
                            return res.sendStatus(404); // no records present
                        } 
                        if (indexNumb < 0 || indexNumb >= submissionCnt - deletedCnt || Number.isInteger(indexNumb) == false)
                        {
                            res.status(400).send("The requested index sent as query parameter is not a valid number."); 
                        }
                        else
                        { 
                            const recordToSend = dbFileJson["data"][indexNumb];
                            return res.status(200).send(recordToSend);
                        }
                    }
                    catch (e)
                    {
                        console.error(e);
                        res.sendStatus(500); // internal server error
                    }
                }
            }
            catch (e)
            {
                console.error(e);
                res.sendStatus(500); // internal server error
            }
        }       
    });
});

app.get('/readMetadata', (req: Request, res: Response) => {
    fs.readFile('././db.json', 'utf8', (err, fileData) => { // reading the json file
        if (err)
        {
            console.error(err);
            res.sendStatus(500); // internal server error
        }
        else // process the file
        { 
            try
            {
                if (fileData.length == 0) // file is empty
                {
                    res.sendStatus(404); // no data present
                }
                else
                {
                    let dbFileJson;
                    try
                    {
                        dbFileJson = JSON.parse(fileData);
                        const recordToSend = dbFileJson["metadata"];
                        return res.status(200).send(recordToSend);
                    }
                    catch (e)
                    {
                        console.error(e);
                        res.sendStatus(500); // internal server error
                    }
                }
            }
            catch (e)
            {
                console.error(e);
                res.sendStatus(500); // internal server error
            }
        }       
    });
});

app.delete('/submission', (req: Request, res: Response) => {
    const index = req.query.index;
    if (isNaN(Number(index)) == true)
    {
        return res.status(400).send("The requested index sent as query parameter is not a number.");     
    }
    fs.readFile('././db.json', 'utf8', (err, fileData) => { // reading the json file
        if (err)
        {
            console.error(err);
            res.sendStatus(500); // internal server error
        }
        else // process the file
        { 
            try
            {
                if (fileData.length == 0) // file is empty
                {
                    res.sendStatus(404); // no record present
                }
                else
                {
                    let dbFileJson;
                    try
                    {
                        dbFileJson = JSON.parse(fileData);
                        const submissionCnt = Number(dbFileJson["metadata"]["submission_cnt"])
                        let deletedCnt = Number(dbFileJson["metadata"]["deleted_cnt"])
                        const indexNumb = Number(index) 
                        if (indexNumb < 0 || indexNumb >= submissionCnt - deletedCnt || Number.isInteger(indexNumb) == false)
                        {
                            res.status(400).send("The requested index sent as query parameter is not a valid number."); 
                        }
                        else
                        { 
                            deletedCnt += 1;
                            dbFileJson["metadata"]["deleted_cnt"] = deletedCnt;
                            dbFileJson["data"].splice(indexNumb, 1);
                            // write the data after deletion back to file
                            const dataToWrite = JSON.stringify(dbFileJson); // serialize
                            fs.writeFile("././db.json", dataToWrite, (err) => {
                                if (err)
                                {
                                    console.error(err);
                                    res.sendStatus(500); // internal server error
                                }
                                else
                                {
                                    res.sendStatus(200);
                                }
                            });
                            return res.status(200);
                        }
                    }
                    catch (e)
                    {
                        console.error(e);
                        res.sendStatus(500); // internal server error
                    }
                }
            }
            catch (e)
            {
                console.error(e);
                res.sendStatus(500); // internal server error
            }
        }       
    });
});

app.put('/submission', (req: Request, res: Response) => {
    const index = req.query.index;
    // get the request body
    const postInptData = req.body;
    if (isNaN(Number(index)) == true)
    {
        return res.status(400).send("The requested index sent as query parameter is not a number.");     
    }
    fs.readFile('././db.json', 'utf8', (err, fileData) => { // reading the json file
        if (err)
        {
            console.error(err);
            res.sendStatus(500); // internal server error
        }
        else // process the file
        { 
            try
            {
                if (fileData.length == 0) // file is empty
                {
                    res.sendStatus(404); // no record present
                }
                else
                {
                    let dbFileJson;
                    try
                    {
                        dbFileJson = JSON.parse(fileData);
                        const submissionCnt = Number(dbFileJson["metadata"]["submission_cnt"]);
                        let deletionCnt = Number(dbFileJson["metadata"]["deleted_cnt"]);
                        const indexNumb = Number(index);
                        if (indexNumb < 0 || indexNumb >= submissionCnt - deletionCnt || Number.isInteger(indexNumb) == false)
                        {
                            res.status(400).send("The requested index sent as query parameter is not a valid number."); 
                        }
                        else
                        { 
                            console.log(typeof(dbFileJson["data"][indexNumb]));
                            dbFileJson["data"][indexNumb].NameProp = postInptData["NameProp"];
                            dbFileJson["data"][indexNumb].EmailProp = postInptData["EmailProp"];
                            dbFileJson["data"][indexNumb].PhoneNumProp = postInptData["PhoneNumProp"];
                            dbFileJson["data"][indexNumb].GitHubLinkProp = postInptData["GithubLinkProp"];
                            // serialize
                            const dataToWrite = JSON.stringify(dbFileJson);
                            fs.writeFile("././db.json", dataToWrite, (err) => {
                                if (err)
                                {
                                    console.error(err);
                                    res.sendStatus(500); // internal server error
                                }
                                else
                                {
                                    return res.sendStatus(200);
                                }
                            });
                        }
                    }
                    catch (e)
                    {
                        console.error(e);
                        res.sendStatus(500); // internal server error
                    }
                }
            }
            catch (e)
            {
                console.error(e);
                res.sendStatus(500); // internal server error
            }
        }       
    });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});