import { produce } from "immer";
import { Alert } from "react-native";
import { Buffer } from "buffer";
import { useChunkStore } from "../db/chunkStore";



// Receive file ack
export const receiveFileAck = async (data: any, socket: any, setReceivedFiles: any) =>{
    const { setChunkStore, chunkStore } = useChunkStore.getState();

    if(chunkStore){
        Alert.alert('There are files which need to be received Wait Bro!');
        return;
    }

    setReceivedFiles((prevData: any) => {
        produce(prevData, (draft: any) => {
            draft.push(data);
        })
    })

    setChunkStore({
        id: data?.id,
        totalChunks: data?.totalChunks,
        name: data?.name,
        size: data?.size,
        mimeType: data?.mimeType,
        chunkArray: [],
    })

    if(!socket){
        console.log('Socket not available');
        return;
    }

    try{
        await new Promise((resolve) => setTimeout(resolve, 10));
        console.log("FILE RECEIVED");
        socket.write(JSON.stringify({ event: 'send_chunk_ack', chunkno: 0 }));
        console.log("REQUESTED FOR CHUNK 0");
    }catch(error){
        console.log('Error', error);
    }
}


// Send chunk ack
export const sendChunkAck = async(chunkIndex:any, socket:any, setTotalSentBytes:any, setSentFiles:any) => {
    const { currentChunkSet, resetChunkStore } = useChunkStore.getState();

    if(!currentChunkSet){
        Alert.alert('There are no files to send');
        return;
    }

    if(!socket){
        console.log('Socket not available');
        return;
    }

    const totalChunks = currentChunkSet?.totalChunks;

    try{
        await new Promise((resolve) => setTimeout(resolve, 10));
        socket.write(
            JSON.stringify({
                event: 'receive_chunk_ack',
                chunk: currentChunkSet?.chunkArray[chunkIndex].toString('base64'),
                chunkNo: chunkIndex,
            })
        )
        setTotalSentBytes((prev: number) => prev + currentChunkSet.chunkArray[chunkIndex]?.length);

        if(chunkIndex + 2 > totalChunks){
            console.log("ALL CHUNKS SENT SUCCESSFULLY");
            setSentFiles((prevFiles: any) =>{
                produce(prevFiles, (draftFiles: any) => {
                    const fileIndex = draftFiles?.findIndex((f: any) => f.id === currentChunkSet.id);
                    if(fileIndex !== -1){
                        draftFiles[fileIndex].available = true;
                    }
                })
            })
            resetChunkStore();
        }

    }catch(error){
        console.log('Error', error);
    }
}


// Receive chunk ack
export const receiveChunkAck = async(
    chunk: any,
    chunkNo: any,
    socket: any,
    setTotalReceivedBytes: any,
    genrateFile: any,
) => {
    const { chunkStore, resetChunkStore, setChunkStore } = useChunkStore.getState();
    if(!chunkStore){
        console.log('Chunk store is empty');
        return;
    }

    try{
        const bufferChunk = Buffer.from(chunk, 'base64');
        const updatedChunkArray = [...(chunkStore?.chunkArray || [])];
        updatedChunkArray[chunkNo] = bufferChunk;
        setChunkStore({
            ...chunkStore,
            chunkArray: updatedChunkArray,
        })
        setTotalReceivedBytes((prev: number) => prev + bufferChunk.length);
    }catch(error){
        console.log('Error', error);
    }

    if(!socket){
        console.log('Socket not available');
        return;
    }

    if(chunkNo + 1 === chunkStore?.totalChunks){
        console.log('ALL CHUNKS RECEIVED');
        genrateFile();
        resetChunkStore();
        return;
    }

    try{
        await new Promise((resolve) => setTimeout(resolve, 10));
        console.log("REQUESTED FOR CHUNK", chunkNo + 1);
        socket.write(JSON.stringify({ event: 'send_chunk_ack', chunkNo: chunkNo + 1 }));
    }catch(error){
        console.log('Error', error);
    }
}