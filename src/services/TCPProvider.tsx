import React, { createContext, FC, useCallback, useContext, useState } from "react";
import { useChunkStore } from "../db/chunkStore";
import TcpSocket from 'react-native-tcp-socket';
import DeviceInfo from "react-native-device-info";
import { Alert, Platform } from "react-native";
import RNFS from 'react-native-fs';
import { Buffer } from 'buffer';
import { produce } from 'immer';
import { v4 as uuid } from 'uuid';
import { receiveFileAck, sendChunkAck, receiveChunkAck } from "./TCPUtils";


interface TCPContextType{
    server: any;
    client: any;
    isConnected: boolean;
    connectedDevice: any;
    sentFiles: any;
    receivedFiles: any;
    totalSentBytes: number;
    totalReceivedBytes: number;
    startServer: (port: number) => void;
    connectToServer: (host: string, port: number, deviceName: string) => void;
    sendMessage: (message: string | Buffer) => void;
    sendFileAck: (file: any, type: 'file' | 'image') => void;
    disconnect: () => void;
}


const TCPContext = createContext<TCPContextType | undefined>(undefined);

export const useTCP = (): TCPContextType => {
    const context = useContext(TCPContext);
    if (!context) {
        throw new Error('useTCP must be used within a TCPProvider');
    }
    return context;
}

const options = {
    keystore: require('../../cert/server-keystore.p12')
}

export const TCPProvider: FC <{children:React.ReactNode}> = ({children}) => {
    const [server, setServer] = useState<any>(null);
    const [client, setClient] = useState<any>(null);
    const [isConnected, setIsConnected] = useState(false);
    const [connectedDevice, setConnectedDevice] = useState<any>(null);
    const [serverSocket, setServerSocket] = useState<any>(null);
    const [sentFiles, setSentFiles] = useState<any>([]);
    const [receivedFiles, setReceivedFiles] = useState<any>([]);
    const [totalSentBytes, setTotalSentBytes] = useState(0);
    const [totalReceivedBytes, setTotalReceivedBytes] = useState(0);
    const { currentChunkSet, setCurrentChunkset, setChunkStore } = useChunkStore();


    // Start server
    const startServer = useCallback((port: number)=>{
        if(server){
            console.log('Server already running');
            return;
        }

        const newServer = TcpSocket.createTLSServer(options, (socket) => {
            console.log('Client connected', socket.address());
            setServerSocket(socket);
            socket.setNoDelay(true);
            socket.readableHighWaterMark = 1024 * 1024 * 1;
            socket.writableHighWaterMark = 1024 * 1024 * 1;

            socket.on('data', (data) => {
                const parsedData = JSON.parse(data?.toString());

                if(parsedData?.event === 'connect'){
                    setIsConnected(true);
                    setConnectedDevice(parsedData?.device);
                }

                if(parsedData?.event === 'file_ack'){
                    receiveFileAck(parsedData?.file, socket, setReceivedFiles);
                }

                if(parsedData?.event === 'send_chunk_ack'){
                    sendChunkAck(parsedData?.chunkno, socket, setTotalReceivedBytes, setSentFiles);
                }

                if(parsedData?.event === 'receive_chunk_ack'){
                    receiveChunkAck(parsedData?.chunk, parsedData?.chunkNo, socket, setTotalReceivedBytes, genrateFile);
                }
            });

            socket.on('close', () => {
                console.log('Client disconnected');
                disconnect();
                setReceivedFiles([]);
                setSentFiles([]);
                setCurrentChunkset(null);
                setTotalReceivedBytes(0);
                setChunkStore(null);
                setIsConnected(false);
            })

            socket.on('error', (error) => console.log('Error', error));
        })

        newServer.listen({ port, host: '0.0.0.0' }, ()=>{
            const address = newServer.address();
            console.log(`Server started on ${address?.address}:${address?.port}`);
        })

        newServer.on('error', (error) => console.log('Error', error));
        setServer(newServer);

    },[server])


    // Connect to server
    const connectToServer = useCallback((host: string, port: number, deviceName: string)=>{

        try{
            const newClient = TcpSocket.connectTLS({
                host,
                port,
                cert: true,
                ca: require('../../cert/server-cert.pem'),
            },
                () => {
                    console.log('Connected to server');
                    setIsConnected(true);
                    setConnectedDevice(deviceName);
                    const myDeviceName = DeviceInfo.getDeviceNameSync();
                    newClient.write(JSON.stringify({ event: 'connect', deviceName: myDeviceName }));
                }
        
            )
    
            newClient.setNoDelay(true);
            newClient.readableHighWaterMark = 1024 * 1024 * 1;
            newClient.writableHighWaterMark = 1024 * 1024 * 1;
    
            newClient.on('data', async(data) => {
                const parsedData = JSON.parse(data?.toString());
    
                if(parsedData?.event === 'file_ack'){
                    receiveFileAck(parsedData?.file, newClient, setReceivedFiles);
                }
    
                if(parsedData?.event === 'send_chunk_ack'){
                    sendChunkAck(parsedData?.chunkno, newClient, setTotalReceivedBytes, setSentFiles);
                }
    
                if(parsedData?.event === 'receive_chunk_ack'){
                    receiveChunkAck(parsedData?.chunk, parsedData?.chunkNo, newClient, setTotalReceivedBytes, genrateFile);
                }
            })
    
            newClient.on('close', () => {
                console.log('Disconnected from server');
                disconnect();
                setReceivedFiles([]);
                setSentFiles([]);
                setCurrentChunkset(null);
                setTotalReceivedBytes(0);
                setChunkStore(null);
                setIsConnected(false);
            });
    
            newClient.on('error', (error) => console.log('Error', error));
    
            setClient(newClient);
        }catch(error){
            console.log('Error', error);
        }

    },[client]) 


    // DISCONNECT
    const disconnect = useCallback(() => {
        if(client){
            client.destroy();
        }
        if(server){
            server.close();
        }
        setReceivedFiles([]);
        setSentFiles([]);
        setCurrentChunkset(null);
        setTotalReceivedBytes(0);
        setChunkStore(null);
        setIsConnected(false);
    },[])


    // SEND MESSAGE
    const sendMessage = useCallback((message: string | Buffer) => {
        if(client){
            client.write(JSON.stringify(message));
            console.log('sent from client', message);
        }else if(server){
            serverSocket.write(JSON.stringify(message));
            console.log('sent from server', message);
        }else{
            console.log('No connection');
        }
    },[client, server])


    // SEND FILE ACK
    const sendFileAck = async(file: any, type: 'file' | 'image') => {
        if(currentChunkSet != null){
            Alert.alert("Wait for the current file to finish sending");
            return;
        }

        const normalizedPath = Platform.OS === 'ios' ? file?.uri?.replace('file://', '') : file?.uri;
        const fileData = await RNFS.readFile(normalizedPath, 'base64'); // imporvement needed 
        const buffer = Buffer.from(fileData, 'base64');
        const CHUNK_SIZE = 1024 * 8;
        let totalChunks = 0;
        let offest = 0;
        let chunkArray = [];

        while(offest < buffer.length){
            const chunk = buffer.slice(offest, offest + CHUNK_SIZE);
            totalChunks +=1;
            chunkArray.push(chunk);
            offest += chunk.length;
        }

        const rawData = {
            id: uuid(),
            name: type === 'file' ? file?.name : file?.filename,
            size: type === 'file' ? file?.size : file?.fileSize,
            mimeType: type === 'file' ? 'file' : 'jpg',
            totalChunks,
        }

        setCurrentChunkset({
            id: rawData?.id,
            chunkArray,
            totalChunks,
        })

        setSentFiles((prevData: any) => 
            produce(prevData, (draft: any) => {
                draft.push({
                    ...rawData,
                    uri: file?.uri,
                })
            })
        )

        const socket = client || serverSocket;
        if(!socket) return;

        try{
            console.log('FILE ANKNOWLEDGEMENT DONEDONE');
            socket.write(JSON.stringify({ event: 'file_ack', data: rawData }));
        }catch(error){
            console.log('Error', error);
        }
    }


    // GENERATE FILE
    const genrateFile = async() => {
        const { chunkStore, resetChunkStore } = useChunkStore.getState();
        if(!chunkStore){
            console.log("No chunks or files to process");
            return;
        }

        if(chunkStore?.totalChunks !== chunkStore?.chunkArray.length){
            console.log('Chunks are missing');
            return;
        }

        try{
            const combinedChunks = Buffer.concat(chunkStore.chunkArray);
            const platformPath = Platform.OS === 'ios' ? `${RNFS.DownloadDirectoryPath}` : `${RNFS.DocumentDirectoryPath}`;
            const filePath = `${platformPath}/${chunkStore.name}`;

            await RNFS.writeFile(filePath, combinedChunks?.toString('base64'), 'base64');
            setReceivedFiles((prevFiles: any) => 
                produce(prevFiles, (draftFiles: any) => {
                    const fileIndex = draftFiles.findIndex((f:any) => f.id === chunkStore.id);
                    if(fileIndex !== -1){
                        draftFiles[fileIndex] = {
                            ...draftFiles[fileIndex],
                            uri: filePath,
                            available: true,
                        }
                    }
                })
            )
            console.log('File generated successfully', filePath);
            resetChunkStore();
        }
        catch(error){
            console.log('Error', error);
        }
    }


    return(
        <TCPContext.Provider
            value={{
                server,
                client,
                isConnected,
                connectedDevice,
                sentFiles,
                receivedFiles,
                totalSentBytes,
                totalReceivedBytes,
                startServer,
                connectToServer,
                disconnect,
                sendMessage,
                sendFileAck
            }}
        >

            {children}

        </TCPContext.Provider>
    )
}