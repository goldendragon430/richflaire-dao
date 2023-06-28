import React, { useState, useEffect } from "react";
import algosdk from "algosdk";
import { Col, Row, Typography, Button, Select, notification } from 'antd';
import { SmileOutlined } from '@ant-design/icons';
import { voting_app_id, algodAddress as algoServer, algodToken as token } from "../../utils/constant";

const algodAddress = algoServer;
const algodToken = token;
const client = new algosdk.Algodv2({
  'X-API-Key': algodToken
}, algodAddress, "");

const Voting = () => {
  const [votes, setVotes] = useState([]);
  const [selectedCandidate, setSelectedCandidate] = useState(null);

  const app_id = voting_app_id;
  const candidates = ["candidate_1", "candidate_2", "candidate_3"];

  useEffect(() => {
    fetchVotes();
  }, [])

  async function fetchVotes() {
    try {
      // Process the responses
      const data = await Promise.all(
        candidates.map(async (candidate) => {
          const appInfo = await client.getApplicationByID(app_id).do();
          const globalState = appInfo.params['global-state'];
          const candidateKey = btoa(candidate);
          const candidateValue = globalState.find(
            (state) => state.key === candidateKey
          );
          return candidateValue
        }
        )
      );

      console.log(data); // An array of data from the resolved promises
      setVotes(data.map((state) => state.value.uint));
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  const castVote = async () => {
    if (selectedCandidate === null) return;
    const publicKey = localStorage.getItem("address");
    if (publicKey === "") return;

    const params = await client.getTransactionParams().do();
    const status = await client.status().do();
    const currentRound = status['last-round'];

    // Set the firstValid and lastValid round numbers
    const firstValid = currentRound + 1;
    const lastValid = firstValid + 1000; // Adjust this value to be within the allowed range

    const args = [new TextEncoder().encode(`candidate_${selectedCandidate + 1}`)];
    params.firstRound = firstValid;
    params.lastRound = lastValid;
    console.log("params, args", params, args)
    const txn = algosdk.makeApplicationNoOpTxn(publicKey, params, app_id, args);
    // Get the binary and base64 encode it
    let binaryTxn = txn.toByte();
    let base64Txn = window.algorand.encoding.msgpackToBase64(binaryTxn);

    let signedTxns = await window.algorand.signTxns([
      {
        txn: base64Txn,
      },
    ]);
    // const mnemonic = "route pair tourist fun warrior ready collect cloud nasty guess universe transfer agree vendor discover whisper fancy champion lunch black shoot canoe glow able feed"; // Replace this with the mnemonic phrase of the voter's account
    // const privateKey = algosdk.mnemonicToSecretKey(mnemonic).sk;
    // const signedTxn = txn.signTxn(privateKey);
    // await client.sendRawTransaction(signedTxn).do();
    // Get the base64 encoded signed transaction and convert it to binary
    let binarySignedTxn = window.algorand.encoding.base64ToMsgpack(signedTxns[0]);
    // Send the transaction through the SDK client
    await client.sendRawTransaction(binarySignedTxn).do();

    openNotification();
    setTimeout(fetchVotes, 8000);
  };

  const [api, contextHolder] = notification.useNotification();
  const openNotification = () => {
    api.open({
      message: 'Success',
      description:
        'Your voting action was successed.',
      icon: (
        <SmileOutlined
          style={{
            color: '#108ee9',
          }}
        />
      ),
    });
  };

  const options = [];
  {
    votes.map((_, index) => (
      options.push({
        value: index,
        label: "Candidate" + (index + 1)
      })
    ))
  }

  const handleChange = (value) => {
    console.log(`selected ${value}`);
    setSelectedCandidate(value);
  };

  return (
    <div>
      <Row>
        <Col span={8}></Col>
        <Col span={8}>
          <Typography.Title level={1} style={{ marginTop: "50px", textAlign: "center" }}>
            Voting DApp
          </Typography.Title>
        </Col>
        <Col span={8}></Col>
      </Row>

      <Row>
        <Col span={8}></Col>
        <Col span={8} style={{ textAlign: "center", marginTop: "30px" }}>
          <Button type="primary" onClick={fetchVotes}>Fetch Votes</Button>
          <div style={{ marginLeft: "20px", marginTop: "10px" }}>
            {votes.map((vote, index) => (
              <div key={index} style={{ paddingTop: "5px" }}>
                Candidate {index + 1}: {vote} votes
              </div>
            ))}
          </div>
        </Col>
        <Col span={8}></Col>
      </Row>

      <Row>
        <Col span={8}></Col>
        <Col span={8} style={{ textAlign: "center", marginTop: "10px" }}>
          <Typography.Title level={2} style={{ marginTop: "30px", textAlign: "center" }}>
            Cast your vote
          </Typography.Title>
          <div style={{ height: "150px" }}>
            <Select
              // mode="tags"
              style={{ width: '200px' }}
              placeholder="Select a candidate"
              onChange={handleChange}
              options={options}
            />
            {contextHolder}
            <Button type="primary" style={{ marginLeft: "40px" }} onClick={castVote}>Vote</Button>
          </div>

        </Col>
        <Col span={8}></Col>
      </Row>



    </div>
  );
};

export default Voting;