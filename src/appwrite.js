const PROJECT_ID = import.meta.env.VITE_APPWRITE_PROJECT_ID;
const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const COLLECTION_ID = import.meta.env.VITE_APPWRITE_COLLECTION_ID;
const ENDPOINT = import.meta.env.VITE_APPWRITE_ENDPOINT;
import { Client, Databases, Query, ID } from "appwrite";


const client = new Client()
.setEndpoint('https://cloud.appwrite.io/v1') // Your Appwrite endpoint
.setProject(PROJECT_ID) // Your project ID

const database = new Databases(client);


export const updateSearchMetrics = async (searchTerm,movie) => {
     try{
        const result =await database.listDocuments(DATABASE_ID,COLLECTION_ID,[
            Query.equal("searchTerm",searchTerm),
        ])
        if(result.documents.length > 0){
            const document = result.documents[0];

            await database.updateDocument(DATABASE_ID,COLLECTION_ID,document.$id,{
                count : document.count + 1,
            })
        }else{
            await database.createDocument(DATABASE_ID,COLLECTION_ID,ID.unique(),{
                searchTerm,
                movie_id: movie.id,
                poster_url:`https://image.tmdb.org/t/p/w500${movie.poster_path}`,
            })
        }
     }catch(error){
        console.error("Error updating search metrics:", error);
     }

}

