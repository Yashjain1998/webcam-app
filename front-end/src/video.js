import React,{useEffect,useState} from 'react';
import { useReactMediaRecorder } from "react-media-recorder-2";
import axios from 'axios';
import Cookies from 'js-cookie';

const buttonStyle = {
  marginRight: '10px',
  padding: '8px 16px',
  backgroundColor: '#007bff',
  color: 'white',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
};

function Recorder() {
  const[recordings, setRecordings]=useState([]);
  const { status, startRecording, stopRecording, mediaBlobUrl } =
    useReactMediaRecorder({ video: true });

  // This function will be called when the recording is stopped
  async function handleRecordingStopped() {
    if (mediaBlobUrl) {
      // Send the mediaBlobUrl to your backend using an API call or any other method
      const {data}=await axios.get('http://localhost:3001/user',{
        headers: {
          Authorization: `${Cookies.get('token')}`,
        },
      })
      const userdata={name: data.user.name,
        email: data.user.email,
        url: mediaBlobUrl
      }
      
      await axios.post('http://localhost:3001/recordings', userdata,{
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }
  };
  
  handleRecordingStopped();

  const fetchRecordings= async()=>{
    const {data}=await axios.get('http://localhost:3001/recordings',{
      headers: {
        Authorization: `${Cookies.get('token')}`,
      },
    })
    setRecordings(data);
  }
  useEffect(()=>fetchRecordings,[recordings]);
  return (
    <div style={{ textAlign: 'center', margin: '40px auto' }}>
      <button  style={buttonStyle} onClick={startRecording}>
        Start Recording
      </button>
      <button  style={buttonStyle} onClick={stopRecording}>
        <div onClick={handleRecordingStopped}>Stop Recording</div>
        
        
      </button>
      <br />
      <p>{status}</p>

      {
        recordings.map(({url,id})=>{
          return(
          <video key={id} src={url} controls />
          )
        })
      }
      
    </div>
  );
}

export default Recorder;
