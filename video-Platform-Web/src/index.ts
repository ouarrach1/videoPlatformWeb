
import express from "express";
import { Request, Response, NextFunction } from 'express';
import { isVideoNew, setVideo } from "./firestore";
import ffmpeg from "fluent-ffmpeg";
import { convertVideo, deleteProcessedVideo, deleteRawVideo, downloadRawVideo, setupDirectory, uploadProcessedVideo } from "./storage";
import { RequestHandler } from 'express';

setupDirectory();


const app =express();
app.use(express.json());


app.post('/process-video', (req: Request, res: Response, next: NextFunction) => {
    (async () =>      
    {
      try 
      {
        let data;
        try{
            const message = Buffer.from(req.body.message.data, 'base64').toString('utf8');
            data = JSON.parse(message);
            if (!data.name) {
            throw new Error('Invalid message payload received.');
            }
        } catch (error) {
            console.error(error);
            return res.status(400).send('Bad Request: missing filename.');
        }
     
        const inputFileName = data.name;
        const outputFileName = `processed-${inputFileName}`;
        const videoId = inputFileName.split('.')[0];
        if (!isVideoNew(videoId)) {
            return res.status(400).send('Bad Request: video already processing or processed.');
        } else {
            await setVideo(videoId, {
              id: videoId,
              uid: videoId.split('-')[0],
              status: 'processing'
            });
        }

        await downloadRawVideo(inputFileName);

        try {
            await convertVideo(inputFileName, outputFileName);
        }
        catch (error)
        {
            await Promise.all([
                deleteRawVideo(inputFileName),
                deleteProcessedVideo(outputFileName)
            ]);
            return res.status(500).send('Processing failed');
        }

     
        await uploadProcessedVideo(outputFileName); 
        await setVideo(videoId, {
            status: 'processed',
            filename: outputFileName
        });
        
        await Promise.all([
            deleteRawVideo(inputFileName),
            deleteProcessedVideo(outputFileName)
        ]);
        return res.status(200).send('Processing finished successfully');
    
      } catch (err) {
        next(err);     
      }
    })();
  });

app.get("/", (req, res) => {
    res.send("Hello World");
});

const port = process.env.PORT || 3000; //important
app.listen(port, () =>{
    console.log(`youtube clone working at http://localhost:${port}`);
})