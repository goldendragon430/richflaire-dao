import React, { useState, useEffect } from "react";
import algosdk from "algosdk";
import {
    Col,
    Row,
    Typography,
    Button,
    Select,
    notification,
    Progress
} from "antd";
import { SmileOutlined } from "@ant-design/icons";
import {
    voting_app_id,
    algodAddress as algoServer,
    algodToken as token,
    indexerClient
} from "../../utils/constant";
import { useSelector } from "react-redux";
import { closePeraWalletSignTxnToast } from "@perawallet/connect";

const algodAddress = algoServer;
const algodToken = token;
const client = new algosdk.Algodv2(
    {
        "X-API-Key": algodToken
    },
    algodAddress,
    ""
);

const Voting = () => {
    const { peraWallet } = useSelector((state) => state.walletReducer);
    const [votes, setVotes] = useState([]);
    const [selectedCandidate, setSelectedCandidate] = useState(null);
    const [loading, setLoading] = useState(false);

    const app_id = voting_app_id;
    const candidates = ["candidate_1", "candidate_2", "candidate_3"];

    useEffect(() => {
        fetchVotes();
    }, []);

    async function fetchVotes() {
        try {
            // Process the responses
            setLoading(true);
            const data = await Promise.all(
                candidates.map(async (candidate) => {
                    const appInfo = await client
                        .getApplicationByID(app_id)
                        .do();
                    const globalState = appInfo.params["global-state"];
                    const candidateKey = btoa(candidate);
                    const candidateValue = globalState.find(
                        (state) => state.key === candidateKey
                    );
                    return candidateValue;
                })
            );

            console.log(data); // An array of data from the resolved promises
            setVotes(data.map((state) => state.value.uint));
            setLoading(false);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    }

    const castVote = async () => {
        if (selectedCandidate === null) return;
        const publicKey = localStorage.getItem("address");
        if (publicKey === "") return;
        try {
            const r = await indexerClient
                .lookupAccountAppLocalStates(publicKey)
                .do();
            var opted_app_id;
            if (r["apps-local-states"]) {
                for (var i = 0; i < r["apps-local-states"].length; i++) {
                    if (r["apps-local-states"][i]["id"] == app_id)
                        opted_app_id = r["apps-local-states"][i]["id"];
                }
            }
            // Create the opt-in transaction
            const params1 = await client.getTransactionParams().do();
            if (r["total-apps-opted-in"] == 0 || opted_app_id != app_id) {
                // not opt in
                const txn0 = algosdk.makeApplicationOptInTxn(
                    publicKey,
                    params1,
                    app_id
                );
                try {
                    let singleTxnGroups = [{ txn: txn0, signers: [publicKey] }];
                    let signedTxns = await peraWallet.signTransaction([
                        singleTxnGroups
                    ]);
                    const { txId } = await client
                        .sendRawTransaction(signedTxns)
                        .do();
                    console.log(signedTxns, txId);
                } catch (error) {
                    console.log("Couldn't sign", error);
                    api.open({
                        message: "Error",
                        description:
                            "Your voting action failed. " + error.message
                    });
                    closePeraWalletSignTxnToast();
                    throw new Error("");
                }
            }

            const params = await client.getTransactionParams().do();
            const status = await client.status().do();
            const currentRound = status["last-round"];

            // Set the firstValid and lastValid round numbers
            const firstValid = currentRound + 1;
            const lastValid = firstValid + 1000; // Adjust this value to be within the allowed range

            const args = [
                new TextEncoder().encode(`candidate_${selectedCandidate + 1}`)
            ];
            params.firstRound = firstValid;
            params.lastRound = lastValid;
            const txn = algosdk.makeApplicationNoOpTxn(
                publicKey,
                params,
                app_id,
                args
            );
            try {
                let singleTxnGroups = [{ txn: txn, signers: [publicKey] }];
                let signedTxns = await peraWallet.signTransaction([
                    singleTxnGroups
                ]);
                const { txId } = await client
                    .sendRawTransaction(signedTxns)
                    .do();
                setTimeout(() => {
                    openNotification();
                    closePeraWalletSignTxnToast();
                    fetchVotes();
                }, 4000);
            } catch (error) {
                console.log("Couldn't sign 1", error);
                api.open({
                    message: "Error",
                    description: "Your voting action failed. " + error.message
                });
                closePeraWalletSignTxnToast();
                throw new Error("");
            }
        } catch (error) {
            api.open({
                message: "Error",
                description: "Your voting action failed. " + error.message
            });
        }
    };

    const [api, contextHolder] = notification.useNotification();
    const openNotification = () => {
        api.open({
            message: "Success",
            description: "Your voting action was successed.",
            icon: (
                <SmileOutlined
                    style={{
                        color: "#108ee9"
                    }}
                />
            )
        });
    };

    const options = [];
    {
        votes.map((_, index) =>
            options.push({
                value: index,
                label: "Candidate" + (index + 1)
            })
        );
    }

    const handleChange = (value) => {
        console.log(`selected ${value}`);
        setSelectedCandidate(value);
    };

    return (
        <div className="">
            <Row>
                <Col span={8}></Col>
                <Col span={8}>
                    <Typography.Title
                        level={1}
                        style={{
                            marginTop: "50px",
                            textAlign: "center",
                            color: "var(--label-primary)"
                        }}
                    >
                        Voting DApp
                    </Typography.Title>
                </Col>
                <Col span={8}></Col>
            </Row>

            <Row>
                <Col span={8}></Col>
                <Col
                    span={8}
                    style={{ textAlign: "center", marginTop: "30px" }}
                >
                    {/* <Button type="primary" onClick={fetchVotes}>
                        Fetch Votes
                    </Button> */}
                    <div style={{ color: "var(--label-primary)" }}>
                        {loading ? (
                            <p>Loading Votes...</p>
                        ) : (
                            <div
                                style={{
                                    marginLeft: "20px",
                                    marginTop: "10px"
                                }}
                            >
                                {votes.map((vote, index) => (
                                    <div
                                        key={index}
                                        style={{ paddingTop: "5px" }}
                                    >
                                        Candidate {index + 1}: {vote} votes
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </Col>
                <Col span={8}></Col>
            </Row>

            <Row>
                <Col span={8}></Col>
                <Col
                    span={8}
                    style={{ textAlign: "center", marginTop: "10px" }}
                >
                    <Typography.Title
                        level={2}
                        style={{
                            marginTop: "30px",
                            textAlign: "center",
                            color: "var(--label-primary)"
                        }}
                    >
                        Cast your vote
                    </Typography.Title>
                    <div style={{ height: "150px" }}>
                        <Select
                            // mode="tags"
                            style={{ width: "200px" }}
                            placeholder="Select a candidate"
                            onChange={handleChange}
                            options={options}
                        />
                        {contextHolder}
                        <Button
                            type="primary"
                            style={{ marginLeft: "40px" }}
                            onClick={castVote}
                        >
                            Vote
                        </Button>
                    </div>
                </Col>
                <Col span={8}></Col>
            </Row>
        </div>
    );
};

export default Voting;
