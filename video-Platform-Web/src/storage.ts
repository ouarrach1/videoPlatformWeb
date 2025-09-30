import { Storage } from "@google-cloud/storage";
import fs from 'fs'  ;
import ffmpeg from "fluent-ffmpeg";

const storage = new Storage();
const rawVideoBucketName = "ibo-yt-raw-videos";
const processedVideoBucketName = "ibo-yt-processed-videos";

const localRawVideoPath = "./raw-videos";
const localProcessedVideoPath = "./processed-videos";

export function setupDirectory()
{
    ensureDirectoryExist(localRawVideoPath);
    ensureDirectoryExist(localProcessedVideoPath);

}


export function convertVideo(rawVideoName: string, processedVideoName: string) 
{
    return new Promise<void>((resolve, reject) => {
        ffmpeg(`${localRawVideoPath}/${rawVideoName}`)
        .outputOptions("-vf", "scale= -1:360")
        .on("end", ()=> {
            console.log("Video processing complete.")
            resolve();
        })
        .on("error", (err) => {
            console.log(`Error: ${err.message}`);
            reject(err);
        })
        .save(`${localProcessedVideoPath}/${processedVideoName}`);
    });


}

export async function downloadRawVideo(fileName: string) {
        await storage.bucket(rawVideoBucketName)
        .file(fileName)
        .download({ destination: `${localRawVideoPath}/${fileName}`}); 

        console.log(
            `gs://${rawVideoBucketName}/${fileName} downloaded to ${localRawVideoPath}/${fileName}.`
        )
}

//{}
export async function uploadProcessedVideo(fileName: string) {

    const bucket = storage.bucket(processedVideoBucketName);

    await storage.bucket(processedVideoBucketName)
    .upload(`${localProcessedVideoPath}/${fileName}`, { destination: fileName});

    console.log(
       `${localProcessedVideoPath}/${fileName} uploaded to gs://${processedVideoBucketName}/${fileName}.`
    );
}


export function deleteRawVideo(fileName: string) {
    return deleteFile(`${localRawVideoPath}/${fileName}`);
}
  
export function deleteProcessedVideo(fileName: string) {
    return deleteFile(`${localProcessedVideoPath}/${fileName}`);
}


function deleteFile(filePath: string): Promise<void>
{
    return new Promise<void>((resolve, reject) => {
        if(fs.existsSync(filePath)) {
            fs.unlink(filePath, (err) =>{
                if (err)
                {
                    console.log(`failed to delete the file at this path ${filePath}`, err);
                    reject(err);
                }
                else
                {
                    console.log(`file deleted at ${filePath} `)
                    resolve(); 
                }

            })
        }
        else
        {
            console.log(`file does not exist ${filePath}, skipping the delete`);
            resolve();
        }
    });
}

function ensureDirectoryExist(dirPath: string)
{

    if(!fs.existsSync(dirPath))
    {
        fs.mkdirSync(dirPath, { recursive: true });
        console.log(`Directory created at ${dirPath}`);
    } 
}