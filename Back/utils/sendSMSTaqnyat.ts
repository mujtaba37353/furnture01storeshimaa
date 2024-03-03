import axios from "axios";


export const sendSMSTaqnyat = async (text: {
  recipient: number;
  message: string;
}) => {
  console.log("message :::: ", text.message);
  
  const data = {
    recipients: [text.recipient],
    body: `${text.message}`,    
    sender: "dh.trd-AD",
    deleteId: 3242424,
  };
  
  const headers = {
    Authorization: `Bearer ${process.env.TAQNYAT_API_KEY}`,
    "Content-Type": "application/json",
  };
  

  await axios.post(
    "https://api.taqnyat.sa/v1/messages",
    data,
    { headers }
  );
};
