import React, { useState, useEffect } from "react";
import algosdk from "algosdk";
import { Col, Row, Typography, Button, Select, Input, notification } from 'antd';
import { SmileOutlined } from '@ant-design/icons';
import { locker_app_id, algodAddress as algoServer, algodToken as token } from "../../utils/constant";
// import AlgoSigner from '@randlabs/algosigner';
// import AlgoSigner from 'algosigner';

const algodAddress = algoServer;
const algodToken = token;
const client = new algosdk.Algodv2({
  'X-API-Key': algodToken
}, algodAddress, "");

const Locker = () => {
  const [votes, setVotes] = useState([]);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [stakeAmount, setStakeAmount] = useState(0);
  const [rewardAmount, setRewardAmount] = useState(0);
  const [inputedAmount, setInputedAmount] = useState(0);
  const [rewardAddress, setRewardAddress] = useState("");
  const [withdrawAddress, setWithdrawAddress] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [compiledContract, setCompiledContract] = useState(null);
  const [reachedAmount, setReachedAmount] = useState(0);

  const app_id = locker_app_id;
  const candidates = ["candidate_1", "candidate_2", "candidate_3"];

  useEffect(() => {
    async function loadContract() {
      const response = await fetch("../../../../contracts/locker_contract.teal.tok");
      const contract = await response.arrayBuffer();
      console.log("0------", response, contract, new Uint8Array(contract))
      setCompiledContract(new Uint8Array(contract));
    }

    loadContract();
    fetchStakeAmount();
  }, [])

  const reward = async () => {
    const publicKey = localStorage.getItem("address");
    if (publicKey === "") return;

    const params = await client.getTransactionParams().do();

    const args = [new TextEncoder().encode("claim_rewards")];
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
    // Get the base64 encoded signed transaction and convert it to binary
    let binarySignedTxn = window.algorand.encoding.base64ToMsgpack(signedTxns[0]);
    // Send the transaction through the SDK client
    await client.sendRawTransaction(binarySignedTxn).do();

    openNotification("success!", "Reward transaction sent successfully.");

    setTimeout(fetchRewardAmount, 8000);
  };

  const sendReward = async () => {
    const publicKey = localStorage.getItem("address");
    if (publicKey === "") return;

    const params = await client.getTransactionParams().do();

    // const args = [new TextEncoder().encode("stake"), intToUint8Array(inputedAmount)];
    console.log("params, args", params, rewardAmount)
    // const txn = algosdk.makeApplicationNoOpTxn(publicKey, params, app_id, args);
    const txn = new algosdk.Transaction({
      from: publicKey,
      // appIndex: app_id,
      to: rewardAddress,
      appOnComplete: 0, // NoOp
      fee: params.fee,
      firstRound: params.firstRound,
      lastRound: params.lastRound,
      genesisID: params.genesisID,
      genesisHash: params.genesisHash,
      amount: rewardAmount, // Replace with the amount of ALGOs you want to send
    });
    let binaryTxn = txn.toByte();
    let base64Txn = window.algorand.encoding.msgpackToBase64(binaryTxn);

    let signedTxns = await window.algorand.signTxns([
      {
        txn: base64Txn,
      },
    ]);
    // Get the base64 encoded signed transaction and convert it to binary
    let binarySignedTxn = window.algorand.encoding.base64ToMsgpack(signedTxns[0]);
    // Send the transaction through the SDK client
    await client.sendRawTransaction(binarySignedTxn).do();

    openNotification("success!", "Transfer transaction sent successfully.");
  };

  const withdraw = async () => {

    try {

      const publicKey = localStorage.getItem("address");
      if (publicKey === "") return;

      const params = await client.getTransactionParams().do();

      const args = [new TextEncoder().encode("check")];
      console.log("params, args", params, args, withdrawAmount)
      const txn = algosdk.makeApplicationNoOpTxn("G2XVAXJPP62LSDLC2PGFDFBKTT2A3JRXAAMPR4NDSEW3GKW6M6HS4HC7CA", params, app_id, args);
      const mnemonic = "route pair tourist fun warrior ready collect cloud nasty guess universe transfer agree vendor discover whisper fancy champion lunch black shoot canoe glow able feed"; // Replace this with the mnemonic phrase of the voter's account
      const privateKey = algosdk.mnemonicToSecretKey(mnemonic).sk;
      const signedTxn = txn.signTxn(privateKey);
      await client.sendRawTransaction(signedTxn).do();


      const appInfo = await client.getApplicationByID(app_id).do();
      const globalState = appInfo.params['global-state'];
      console.log("22222", appInfo, globalState)
      const reachedKey = btoa("reached");
      const reachedValue = globalState.find(
        (state) => state.key === reachedKey
      );

      setReachedAmount(reachedValue.value.uint);
      console.log(reachedValue, reachedValue.value.uint); // An array of data from the resolved promises
      if (reachedValue.value.uint == 0) {
        openNotification("Alert", "Please wait to withdraw for locking time");
        return;
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }

    try {
      const params = await client.getTransactionParams().do();
      const txn = new algosdk.Transaction({
        from: "G2XVAXJPP62LSDLC2PGFDFBKTT2A3JRXAAMPR4NDSEW3GKW6M6HS4HC7CA",
        // appIndex: app_id,
        to: withdrawAddress,
        appOnComplete: 0, // NoOp
        fee: params.fee,
        firstRound: params.firstRound,
        lastRound: params.lastRound,
        genesisID: params.genesisID,
        genesisHash: params.genesisHash,
        amount: withdrawAmount, // Replace with the amount of ALGOs you want to send
      });
      const mnemonic = "route pair tourist fun warrior ready collect cloud nasty guess universe transfer agree vendor discover whisper fancy champion lunch black shoot canoe glow able feed"; // Replace this with the mnemonic phrase of the voter's account
      const privateKey = algosdk.mnemonicToSecretKey(mnemonic).sk;
      const signedTxn = txn.signTxn(privateKey);
      await client.sendRawTransaction(signedTxn).do();


      const args1 = [new TextEncoder().encode("withdraw")];
      const params1 = await client.getTransactionParams().do();
      // const publicKey = localStorage.getItem("address");
      const txn1 = algosdk.makeApplicationNoOpTxn("G2XVAXJPP62LSDLC2PGFDFBKTT2A3JRXAAMPR4NDSEW3GKW6M6HS4HC7CA", params1, app_id, args1);
      const signedTxn1 = txn1.signTxn(privateKey);
      await client.sendRawTransaction(signedTxn1).do();

      openNotification("success!", "Withdraw transaction sent successfully.");
    } catch (error) {
      // console.error('Error fetching data:', error);
      openNotification("Alert", "Please wait to withdraw for locking time");
    }
  };

  const stake = async () => {
    const publicKey = localStorage.getItem("address");
    if (publicKey === "") return;

    const params = await client.getTransactionParams().do();

    const args = [new TextEncoder().encode("stake"), intToUint8Array(inputedAmount)];
    console.log("params, args", params, args, inputedAmount)
    const txn = algosdk.makeApplicationNoOpTxn(publicKey, params, app_id, args);

    let binaryTxn = txn.toByte();
    let base64Txn = window.algorand.encoding.msgpackToBase64(binaryTxn);

    let signedTxns = await window.algorand.signTxns([
      {
        txn: base64Txn,
      },
    ]);
    // Get the base64 encoded signed transaction and convert it to binary
    let binarySignedTxn = window.algorand.encoding.base64ToMsgpack(signedTxns[0]);
    // Send the transaction through the SDK client
    await client.sendRawTransaction(binarySignedTxn).do();

    const txn1 = new algosdk.Transaction({
      from: publicKey,
      // appIndex: app_id,
      to: "G2XVAXJPP62LSDLC2PGFDFBKTT2A3JRXAAMPR4NDSEW3GKW6M6HS4HC7CA",
      appOnComplete: 0, // NoOp
      fee: params.fee,
      firstRound: params.firstRound,
      lastRound: params.lastRound,
      genesisID: params.genesisID,
      genesisHash: params.genesisHash,
      amount: withdrawAmount, // Replace with the amount of ALGOs you want to send
    });
    let binaryTxn1 = txn1.toByte();
    let base64Txn1 = window.algorand.encoding.msgpackToBase64(binaryTxn1);

    let signedTxns1 = await window.algorand.signTxns([
      {
        txn: base64Txn1,
      },
    ]);
    // Get the base64 encoded signed transaction and convert it to binary
    let binarySignedTxn1 = window.algorand.encoding.base64ToMsgpack(signedTxns1[0]);
    // Send the transaction through the SDK client
    await client.sendRawTransaction(binarySignedTxn1).do();

    openNotification("success!", "Deposit transaction sent successfully.");
  };


  async function fetchStakeAmount1() {
    try {

      const appInfo = await client.getApplicationByID(app_id).do();
      const globalState = appInfo.params['global-state'];
      console.log("22222", appInfo, globalState)
      const stakeAmountKey = btoa("g_staked_amt");
      const stakeAmountValue = globalState.find(
        (state) => state.key === stakeAmountKey
      );

      setStakeAmount(stakeAmountValue.value.uint);
      console.log(stakeAmountValue, stakeAmountValue.value.uint); // An array of data from the resolved promises
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  async function fetchStakeAmount() {

    // // Import your account
    // const privateKey = "your_private_key"; // Replace with your private key
    // const publicKey = algosdk.addressFromPrivateKey(
    //   algosdk.mnemonicToSecretKey(privateKey)
    // );
    const publicKey = localStorage.getItem("address");
    // Create a transaction
    const params = await client.getTransactionParams().do();
    const txn = new algosdk.Transaction({
      from: publicKey,
      to: publicKey,
      fee: params.fee,
      amount: 0,
      firstRound: params.firstRound,
      lastRound: params.lastRound,
      genesisID: params.genesisID,
      genesisHash: params.genesisHash,
      note: new TextEncoder().encode("Deploying locker contract"),
    });

    // Sign the transaction with the contract
    const lsig = new algosdk.LogicSig(compiledContract);
    const stxn = algosdk.signLogicSigTransactionObject(txn, lsig);

    // Send the transaction
    const txid = await client.sendRawTransaction(stxn.blob).do();
    console.log(`Transaction ID: ${txid.txId}`);
  }

  // async function fetchStakeAmount2() {

  //   // Create a transaction
  //   const params = await client.getTransactionParams().do();
  //   const txn = new algosdk.Transaction({
  //     from: contractAddress, // Replace with the contract address
  //     to: publicKey,
  //     fee: params.fee,
  //     amount: 1000000, // Replace with the amount to withdraw
  //     firstRound: params.firstRound,
  //     lastRound: params.lastRound,
  //     genesisID: params.genesisID,
  //     genesisHash: params.genesisHash,
  //   });

  //   // Sign the transaction with the contract
  //   const lsig = new algosdk.LogicSig(compiledContract);
  //   const stxn = algosdk.signLogicSigTransactionObject(txn, lsig);

  //   // Send the transaction
  //   const txid = await client.sendRawTransaction(stxn.blob).do();
  //   console.log(`Transaction ID: ${txid.txId}`);
  // }

  async function fetchRewardAmount() {
    try {

      const appInfo = await client.getApplicationByID(app_id).do();
      const globalState = appInfo.params['global-state'];
      const rewardAmountKey = btoa("g_reward_amt");
      const rewardAmountValue = globalState.find(
        (state) => state.key === rewardAmountKey
      );

      setRewardAmount(rewardAmountValue.value.uint);
      console.log(rewardAmountValue, rewardAmountValue.value.uint); // An array of data from the resolved promises
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  async function fetchVotes() {
    try {
      // Process the responses
      const data = await Promise.all(
        candidates.map(async (candidate) => {
          const appInfo = await client.getApplicationByID(app_id).do();
          const globalState = appInfo.params['global-state'];
          console.log("22222", globalState)
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

  function intToUint8Array(num) {
    // Create an ArrayBuffer with enough bytes to hold the integer
    const buffer = new ArrayBuffer(4);

    // Create a DataView to manipulate the ArrayBuffer
    const view = new DataView(buffer);

    // Set the integer value at the beginning of the ArrayBuffer
    view.setUint32(0, num);

    // Create a Uint8Array from the ArrayBuffer
    const uint8Array = new Uint8Array(buffer);

    return uint8Array;
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
  const openNotification = (msg, desc) => {
    api.open({
      message: msg,
      description:
        desc,
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

  const handleChange = (e) => {
    console.log(`selected ${e.target.value}`);
    setInputedAmount(e.target.value);
  };

  const handleChangeRewardInput = (e) => {
    setRewardAddress(e.target.value);
  };

  const handleChangeWithdrawInput = (e) => {
    setWithdrawAddress(e.target.value);
  };

  const handleChangeWithdrawAmount = (e) => {
    setWithdrawAmount(parseInt(e.target.value, 10));
  };

  return (
    <div>
      <Row>
        <Col span={8}></Col>
        <Col span={8}>
          <Typography.Title level={1} style={{ marginTop: "50px", textAlign: "center" }}>
            Locker DApp
          </Typography.Title>
        </Col>
        <Col span={8}></Col>
      </Row>

      {/* <Row>
        <Col span={8}></Col>
        <Col span={8} style={{ textAlign: "center", marginTop: "30px" }}>
          <Button type="primary" onClick={fetchStakeAmount}>Fetch Staking State</Button>
          <div style={{ marginLeft: "20px", marginTop: "10px" }}>
            Total staking amount: {stakeAmount / 1000000}  Algo({stakeAmount}  microAlgo)
          </div>
        </Col>
        <Col span={8}></Col>
      </Row>

      <Row>
        <Col span={8}></Col>
        <Col span={8} style={{ textAlign: "center", marginTop: "10px" }}>
          <Typography.Title level={2} style={{ marginTop: "30px", textAlign: "center" }}>
            Stake for rewarding
          </Typography.Title>
          <div style={{ height: "50px" }}>
            <Input
              // mode="tags"
              style={{ width: '200px' }}
              placeholder="input your staking amount"
              onChange={handleChange}
            />
            {contextHolder}
            <Button type="primary" style={{ marginLeft: "40px" }} onClick={stake}>Stake</Button>
          </div>

        </Col>
        <Col span={8}></Col>
      </Row>
      <Row>
        <Col span={8}></Col>
        <Col span={8} style={{ textAlign: "center", marginTop: "10px" }}>
          <Typography.Title level={2} style={{ marginTop: "30px", textAlign: "center" }}>
            Claim Reward
          </Typography.Title>
          <div style={{ height: "50px" }}>
            {rewardAmount} Algo is claimed.
            <Button type="primary" style={{ marginLeft: "40px" }} onClick={fetchRewardAmount}>Claim</Button>

          </div>

          <div style={{ height: "50px" }}>
            <Input
              style={{ width: '300px' }}
              placeholder="Please input wallet address for transfering"
              onChange={handleChangeRewardInput}
            />
            {contextHolder}
            <Button type="primary" style={{ marginLeft: "40px" }} onClick={sendReward}>send</Button>
          </div>

        </Col>
        <Col span={8}></Col>
      </Row> */}
      <Row>
        <Col span={8}></Col>
        <Col span={8} style={{ textAlign: "center", marginTop: "10px" }}>
          <Typography.Title level={2} style={{ marginTop: "30px", textAlign: "center" }}>
            Withdraw
          </Typography.Title>
          <div style={{ height: "150px" }}>

            <Input
              style={{ width: '300px' }}
              placeholder="Please input wallet address for transfering"
              onChange={handleChangeWithdrawInput}
            />
            <Input
              style={{ width: '100px', marginLeft: "20px" }}
              placeholder="Amount"
              onChange={handleChangeWithdrawAmount}
            />
            {contextHolder}
            <Button type="primary" style={{ marginLeft: "40px", marginTop: "20px" }} onClick={withdraw}>withdraw</Button>
          </div>

        </Col>
        <Col span={8}></Col>
      </Row>


    </div>
  );
};

export default Locker;