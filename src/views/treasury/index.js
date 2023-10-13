import React, { useState, useEffect } from "react";
import "./treasury.scss";
import { NavLink } from "react-router-dom";
import {
    QuestionCircleOutlined,
    StarOutlined,
    SmileOutlined
} from "@ant-design/icons";
import {
    ZuoShangIcon,
    YouXiaIcon,
    HeadIcon,
    CoinbaseIcon,
    LedgerIcon,
    SolflareIcon,
    TorusIcon,
    ExodusIcon
} from "../../layout/icons";
import { useSelector, useDispatch } from "react-redux";
import TermsMain from "../../components/terms_main";
import PrivacyMain from "../../components/privacy_main";
import { SET_MODEL } from "../../store/actionTypes";
import {
    Tabs,
    Radio,
    Col,
    Row,
    Typography,
    Button,
    Select,
    Input,
    notification
} from "antd";
import {
    locker_app_id,
    algodAddress as algoServer,
    algodToken as token,
    indexerClient,
    LOCKER_ADDR
} from "../../utils/constant";
import algosdk from "algosdk";
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

export default function Treasury() {
    const { peraWallet } = useSelector((state) => state.walletReducer);
    const model = useSelector((state) => state.flagReducer.model);
    const dispatch = useDispatch();
    const [isMask, setIsMask] = useState(false);
    const [modelShow, setModelShow] = useState(false);

    const [gStakedAmt, setGStakedAmt] = useState(0);
    const [gRewardAmt, setGRewardAmt] = useState(0);
    const [lStakedAmt, setLStakedAmt] = useState(0);
    const [lRewardAmt, setLRewardAmt] = useState(0);
    const [lClaimAmt, setLClaimAmt] = useState(0);
    const [lStakeTime, setLStakeTime] = useState(0);

    const [inputTime, setInputTime] = useState(
        Math.floor(Date.now() / 1000) + 14 * 24 * 60 * 60
    );
    const [rewardAddress, setRewardAddress] = useState("");
    const [withdrawAddress, setWithdrawAddress] = useState("");
    const [withdrawAmount, setWithdrawAmount] = useState("");
    const [accountAddress, setAccountAddress] = useState(
        localStorage.getItem("address")
    );
    const [unclaimdReward, setUnclaimdReward] = useState(0);
    const [inputClaim, setInputClaim] = useState(0);
    const [inputWithdraw, setInputWithdraw] = useState(0);

    const app_id = locker_app_id;
    const AlgoSigner = window.AlgoSigner;
    const balance = localStorage.getItem("balance");
    const [value, setValue] = useState(1);
    const [inputAmount, setInputAmount] = useState(0);
    let unclaim = 0;

    const onChangeRadio = (e) => {
        const value = e.target.value;
        var unixTimeInSeconds = Math.floor(Date.now() / 1000);
        if (value === 1) {
            unixTimeInSeconds += 14 * 24 * 60 * 60;
        } else if (value === 2) {
            unixTimeInSeconds += 30 * 24 * 60 * 60;
        } else if (value === 3) {
            unixTimeInSeconds += 90 * 24 * 60 * 60;
        } else if (value === 4) {
            unixTimeInSeconds += 180 * 24 * 60 * 60;
        } else if (value === 5) {
            unixTimeInSeconds += 270 * 24 * 60 * 60;
        } else if (value === 6) {
            unixTimeInSeconds += 365 * 24 * 60 * 60;
        } else if (value === 7) {
            unixTimeInSeconds += 365 * 2 * 24 * 60 * 60;
        } else if (value === 8) {
            unixTimeInSeconds += 365 * 3 * 24 * 60 * 60;
        } else if (value === 9) {
            unixTimeInSeconds += 365 * 4 * 24 * 60 * 60;
        } else {
            unixTimeInSeconds += 365 * 5 * 24 * 60 * 60;
        }
        console.log("radio checked", e.target.value, unixTimeInSeconds);
        setValue(e.target.value);
        setInputTime(unixTimeInSeconds);
    };
    const onChangeInput = (e) => {
        console.log("input value", e.target.value);
        setInputAmount(e.target.value);
    };
    const onChangeClaim = (e) => {
        console.log("input value", e.target.value);
        setInputClaim(e.target.value);
    };
    const onChangeWithdraw = (e) => {
        console.log("input value", e.target.value);
        setInputWithdraw(e.target.value);
    };
    const selectMax = (e) => {
        console.log("balance", balance / 1000000);
        setInputAmount(balance / 1000000);
    };
    useEffect(() => {
        setAccountAddress(localStorage.getItem("address"));
    }, [accountAddress]);

    useEffect(() => {
        fetchStates();
        const intervalId = setInterval(() => {
            fetchStates();
        }, 3000);

        return () => {
            clearInterval(intervalId);
        };
    }, []);

    const [api, contextHolder] = notification.useNotification();
    const openNotification = (msg, desc) => {
        api.open({
            message: msg,
            description: desc,
            icon: (
                <SmileOutlined
                    style={{
                        color: "#108ee9"
                    }}
                />
            )
        });
    };

    async function fetchStates() {
        try {
            const r = await indexerClient
                .lookupAccountAppLocalStates(accountAddress)
                .do();

            if (r["apps-local-states"]) {
                for (var i = 0; i < r["apps-local-states"].length; i++) {
                    const opted_app_id = r["apps-local-states"][i]["id"];
                    // console.log("opted_app_id", opted_app_id);
                    if (opted_app_id == app_id) {
                        const localState =
                            r["apps-local-states"][i]["key-value"];

                        const l_stakeAmountKey = btoa("l_staked_amt");
                        const l_stakeAmountValue = localState.find(
                            (state) => state.key === l_stakeAmountKey
                        );
                        const l_stakeTimeKey = btoa("l_stake_time");
                        const l_stakeTimeValue = localState.find(
                            (state) => state.key === l_stakeTimeKey
                        );
                        const l_claimAmountKey = btoa("l_claim_amt");
                        const l_claimAmountValue = localState.find(
                            (state) => state.key === l_claimAmountKey
                        );
                        const l_rewardAmountKey = btoa("l_reward_amt");
                        const l_rewardAmountValue = localState.find(
                            (state) => state.key === l_rewardAmountKey
                        );
                        if (l_stakeAmountValue)
                            setLStakedAmt(l_stakeAmountValue.value.uint);
                        if (l_rewardAmountValue)
                            setLRewardAmt(l_rewardAmountValue.value.uint);
                        if (l_claimAmountValue)
                            setLClaimAmt(l_claimAmountValue.value.uint);
                        if (l_stakeTimeValue)
                            setLStakeTime(l_stakeTimeValue.value.uint);

                        const amt = Math.floor(
                            l_rewardAmountValue.value.uint -
                                calcReward(
                                    l_stakeAmountValue.value.uint,
                                    l_stakeTimeValue.value.uint -
                                        Math.floor(Date.now() / 1000)
                                ) -
                                l_claimAmountValue.value.uint
                        );
                        if (amt > 0) setUnclaimdReward(amt);
                    }
                }
            }
            const appInfo = await client.getApplicationByID(app_id).do();
            const globalState = appInfo.params["global-state"];
            const stakeAmountKey = btoa("g_staked_amt");
            const stakeAmountValue = globalState.find(
                (state) => state.key === stakeAmountKey
            );
            const rewardAmountKey = btoa("g_reward_amt");
            const rewardAmountValue = globalState.find(
                (state) => state.key === rewardAmountKey
            );
            setGStakedAmt(stakeAmountValue.value.uint);
            setGRewardAmt(rewardAmountValue.value.uint);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    }

    const stake = async () => {
        const r = await indexerClient
            .lookupAccountAppLocalStates(accountAddress)
            .do();
        var opted_app_id;
        if (r["apps-local-states"]) {
            for (var i = 0; i < r["apps-local-states"].length; i++) {
                if (r["apps-local-states"][i]["id"] == app_id)
                    opted_app_id = r["apps-local-states"][i]["id"];
            }
        }
        // Create the opt-in transaction
        const params = await client.getTransactionParams().do();
        try {
            if (r["total-apps-opted-in"] == 0 || opted_app_id != app_id) {
                // not opt in
                const txn0 = algosdk.makeApplicationOptInTxn(
                    accountAddress,
                    params,
                    app_id
                );
                try {
                    let singleTxnGroups = [
                        { txn: txn0, signers: [accountAddress] }
                    ];
                    let signedTxns = await peraWallet.signTransaction([
                        singleTxnGroups
                    ]);
                    const { txId } = await client
                        .sendRawTransaction(signedTxns)
                        .do();
                    console.log(signedTxns, txId);
                } catch (error) {
                    console.log("Couldn't sign 1", error);
                    openNotification("Error!", "Error occured " + error);
                    closePeraWalletSignTxnToast();
                    throw new Error("");
                }
            }

            if (balance >= inputAmount * 1000000) {
                const args = [
                    new TextEncoder().encode("stake"),
                    intToUint8Array(inputAmount * 1000000),
                    intToUint8Array(inputTime)
                ];
                console.log(
                    "params, args",
                    params,
                    args,
                    inputAmount * 1000000,
                    inputTime
                );
                const txn = algosdk.makeApplicationNoOpTxn(
                    accountAddress,
                    params,
                    app_id,
                    args
                );

                const txn1 = new algosdk.Transaction({
                    from: accountAddress,
                    to: LOCKER_ADDR,
                    appOnComplete: 0, // NoOp
                    fee: params.fee,
                    firstRound: params.firstRound,
                    lastRound: params.lastRound,
                    genesisID: params.genesisID,
                    genesisHash: params.genesisHash,
                    amount: inputAmount * 1000000 // Replace with the amount of ALGOs you want to send
                });

                const args3 = [
                    new TextEncoder().encode("rewards"),
                    intToUint8Array(
                        calcReward(
                            lStakedAmt + inputAmount * 1000000,
                            inputTime - Math.floor(Date.now() / 1000)
                        )
                    )
                ];
                console.log(
                    "params, args",
                    params,
                    args3,
                    calcReward(
                        lStakedAmt,
                        lStakeTime - Math.floor(Date.now() / 1000)
                    ),
                    lStakedAmt + inputAmount * 1000000,
                    inputTime,
                    Math.floor(Date.now() / 1000)
                );
                const txn3 = algosdk.makeApplicationNoOpTxn(
                    accountAddress,
                    params,
                    app_id,
                    args3
                );

                try {
                    const groupId = algosdk.assignGroupID([txn1, txn, txn3]);
                    let singleTxnGroups = [
                        { txn: txn1, signers: [accountAddress] },
                        { txn: txn, signers: [accountAddress] },
                        { txn: txn3, signers: [accountAddress] }
                    ];
                    let signedTxns = await peraWallet.signTransaction([
                        singleTxnGroups
                    ]);
                    const { txId } = await client
                        .sendRawTransaction(signedTxns)
                        .do();
                    console.log(signedTxns, txId);
                    setTimeout(() => {
                        openNotification(
                            "success!",
                            "Staking transaction sent successfully."
                        );
                        closePeraWalletSignTxnToast();
                    }, 5000);
                } catch (error) {
                    console.log("Couldn't sign 4", error);
                    openNotification("Error!", "Error occured " + error);
                    closePeraWalletSignTxnToast();
                    throw new Error("");
                }
            }
        } catch (err) {
            console.log(err);
        }
    };

    const claim = async () => {
        const r = await indexerClient
            .lookupAccountAppLocalStates(accountAddress)
            .do();
        var opted_app_id;
        if (r["apps-local-states"]) {
            for (var i = 0; i < r["apps-local-states"].length; i++) {
                if (r["apps-local-states"][i]["id"] == app_id)
                    opted_app_id = r["apps-local-states"][i]["id"];
            }
        }
        // Create the opt-in transaction
        const params = await client.getTransactionParams().do();
        try {
            if (r["total-apps-opted-in"] == 0 || opted_app_id != app_id) {
                // not opt in
                const txn0 = algosdk.makeApplicationOptInTxn(
                    accountAddress,
                    params,
                    app_id
                );

                try {
                    let singleTxnGroups = [
                        { txn: txn0, signers: [accountAddress] }
                    ];
                    let signedTxns = await peraWallet.signTransaction([
                        singleTxnGroups
                    ]);
                    const { txId } = await client
                        .sendRawTransaction(signedTxns)
                        .do();
                    console.log(signedTxns, txId);
                } catch (error) {
                    console.log("Couldn't sign 1", error);
                    openNotification("Error!", "Error occured " + error);
                    closePeraWalletSignTxnToast();
                    throw new Error("");
                }
            }

            if (unclaimdReward >= inputClaim * 1000000) {
                const args = [
                    new TextEncoder().encode("claim_rewards"),
                    intToUint8Array(inputClaim * 1000000)
                ];
                const txn = algosdk.makeApplicationNoOpTxn(
                    accountAddress,
                    params,
                    app_id,
                    args,
                    [LOCKER_ADDR]
                );

                try {
                    let singleTxnGroups = [
                        { txn: txn, signers: [accountAddress] }
                    ];
                    let signedTxns = await peraWallet.signTransaction([
                        singleTxnGroups
                    ]);
                    const { txId } = await client
                        .sendRawTransaction(signedTxns)
                        .do();
                    console.log(signedTxns, txId);
                    setTimeout(() => {
                        openNotification(
                            "success!",
                            "Claim transaction sent successfully."
                        );
                        closePeraWalletSignTxnToast();
                    }, 5000);
                } catch (error) {
                    console.log("Couldn't sign 2", error);
                    openNotification("Error!", "Error occured " + error);
                    closePeraWalletSignTxnToast();
                }
            } else {
                openNotification(
                    "Error!",
                    "Please claim amount less than " +
                        unclaimdReward / 1000000 +
                        " algos."
                );
            }
        } catch (err) {
            console.log(err);
        }
    };

    const withdraw = async () => {
        const r = await indexerClient
            .lookupAccountAppLocalStates(accountAddress)
            .do();
        var opted_app_id;
        if (r["apps-local-states"]) {
            for (var i = 0; i < r["apps-local-states"].length; i++) {
                if (r["apps-local-states"][i]["id"] == app_id)
                    opted_app_id = r["apps-local-states"][i]["id"];
            }
        }
        // Create the opt-in transaction
        const params = await client.getTransactionParams().do();
        try {
            if (r["total-apps-opted-in"] == 0 || opted_app_id != app_id) {
                // not opt in
                const txn0 = algosdk.makeApplicationOptInTxn(
                    accountAddress,
                    params,
                    app_id
                );

                try {
                    let singleTxnGroups = [
                        { txn: txn0, signers: [accountAddress] }
                    ];

                    let signedTxns = await peraWallet.signTransaction([
                        singleTxnGroups
                    ]);
                    const { txId } = await client
                        .sendRawTransaction(signedTxns)
                        .do();
                    console.log(signedTxns, txId);
                } catch (error) {
                    console.log("Couldn't sign 1", error);
                    openNotification("Error!", "Error occured " + error);
                    closePeraWalletSignTxnToast();
                    throw new Error("");
                }
            }

            if (lStakedAmt >= inputWithdraw * 1000000) {
                const args = [
                    new TextEncoder().encode("withdraw"),
                    intToUint8Array(inputWithdraw * 1000000)
                ];
                const txn = algosdk.makeApplicationNoOpTxn(
                    accountAddress,
                    params,
                    app_id,
                    args,
                    [LOCKER_ADDR]
                );

                try {
                    let singleTxnGroups = [
                        { txn: txn, signers: [accountAddress] }
                    ];
                    let signedTxns = await peraWallet.signTransaction([
                        singleTxnGroups
                    ]);
                    const { txId } = await client
                        .sendRawTransaction(signedTxns)
                        .do();
                    console.log(signedTxns, txId);
                    setTimeout(() => {
                        openNotification(
                            "success!",
                            "Withdraw transaction sent successfully."
                        );
                        closePeraWalletSignTxnToast();
                        fetchStates();
                    }, 4000);
                } catch (error) {
                    console.log("Couldn't sign 2", error);
                    openNotification("Error!", "Error occured " + error);
                    closePeraWalletSignTxnToast();
                }
            }
        } catch (err) {
            console.log(err);
        }
    };

    function calcReward(amount, time) {
        return (amount * time) / 1000000;
    }

    function unixTimeToTime(unixTimestamp) {
        const date = new Date(unixTimestamp * 1000); // convert Unix timestamp to JavaScript date object
        const year = date.getFullYear();
        const month = ("0" + (date.getMonth() + 1)).slice(-2); // add leading zero if necessary
        const day = ("0" + date.getDate()).slice(-2); // add leading zero if necessary
        const formattedDate = `${year}-${month}-${day}`; // combine year, month, and day into string

        // console.log(formattedDate); // output: "2022-04-02"
        return formattedDate;
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

    const onChange = (key) => {
        console.log(key);
    };
    const items = [
        {
            key: "1",
            label: `DAY`,
            children: calcReward(lStakedAmt, 24 * 60 * 60) / 1000000 + " ALGO"
        },
        {
            key: "2",
            label: `WEEK`,
            children:
                calcReward(lStakedAmt, 7 * 24 * 60 * 60) / 1000000 + " ALGO"
        },
        {
            key: "3",
            label: `MONTH`,
            children:
                calcReward(lStakedAmt, 30 * 24 * 60 * 60) / 1000000 + " ALGO"
        },
        {
            key: "4",
            label: `YEAR`,
            children:
                calcReward(lStakedAmt, 365 * 24 * 60 * 60) / 1000000 + " ALGO"
        }
    ];

    return (
        <div className="sc-e536a6d0-3 dEXRnu">
            <div className="sc-e536a6d0-4 fxvOMD">
                <div className="sc-2699632c-1 cExXYW">
                    <div className="sc-2699632c-0 jpZhaQ">
                        <div className="sc-39481472-0 icZWTk">
                            <div className="sc-28471dcc-0 cdjQvo">
                                <div className="sc-28471dcc-2 fTWaal">
                                    <div className="sc-28471dcc-4 cQxybo">
                                        <h2 className="sc-28471dcc-7 bHtenF">
                                            <div
                                                color="var(--label-primary)"
                                                className="sc-c8b5982a-0 cfWVOq"
                                            >
                                                DAO Ecosystem Information
                                            </div>
                                        </h2>
                                    </div>
                                    <div className="sc-28471dcc-3 jxBTox">
                                        <span
                                            direction="bottomRight"
                                            className="sc-5c5f561e-0 ixTxmb"
                                        >
                                            <div
                                                width="41px"
                                                height="41px"
                                                className="sc-88e560b3-1 fbjKHw"
                                            >
                                                <div className="sc-88e560b3-0 jlQvMD">
                                                    <div>
                                                        <svg
                                                            width="40"
                                                            height="40"
                                                            viewBox="0 0 40 40"
                                                            fill="none"
                                                            version="1.1"
                                                            id="svg16"
                                                            className="injected-svg"
                                                            data-src="/icons/Corner Bevel Right.svg"
                                                        >
                                                            <path
                                                                d="M 41,41 H 1 V 25.9706 C 1,22.788 2.2643,19.7357 4.5147,17.4853 L 17.4853,4.5147 C 19.7357,2.2643 22.788,1 25.9706,1 H 41 Z"
                                                                fill="var(--border-tertiary)"
                                                                fill-opacity="1"
                                                                id="path12-2"
                                                            ></path>
                                                            <path
                                                                d="M 41,41 H 2 V 26.4706 C 2,23.288 3.2643001,20.2357 5.5147,17.9853 L 17.985301,5.5147 C 20.2357,3.2643 23.288001,2 26.4706,2 H 41 Z"
                                                                fill="var(--canvas-primary)"
                                                                id="path14-3"
                                                                style={{
                                                                    strokeWidth:
                                                                        "1"
                                                                }}
                                                            ></path>
                                                        </svg>
                                                    </div>
                                                </div>
                                            </div>
                                        </span>
                                        <div
                                            id="locker-panel-content-DAO-Ecosystem-Information"
                                            className="sc-28471dcc-1 sYUKh"
                                        >
                                            <div className="sc-5e2206e2-0 eIWiAr">
                                                <div className="sc-ca13ee72-0 laFUnd">
                                                    <div className="sc-ca13ee72-1 cJZNBd">
                                                        Total Circulating Supply
                                                    </div>
                                                    <div className="sc-ca13ee72-2 drosxF">
                                                        <div className="sc-ca13ee72-3 gseZfi">
                                                            <div className="sc-ca13ee72-4 jYYusq">
                                                                0
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="sc-ca13ee72-0 laFUnd">
                                                    <div className="sc-ca13ee72-0 laFUnd">
                                                        <div className="sc-ca13ee72-1 cJZNBd">
                                                            Total Payed Reward
                                                        </div>
                                                        <div className="sc-ca13ee72-2 drosxF">
                                                            <div className="sc-ca13ee72-3 gseZfi">
                                                                <div className="sc-ca13ee72-4 jYYusq">
                                                                    {gRewardAmt /
                                                                        1000000}{" "}
                                                                    ALGO
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="sc-ca13ee72-0 laFUnd">
                                                    {/* <div className="sc-ca13ee72-1 cJZNBd">Next Daily Rewards Drop</div>
                          <div className="sc-ca13ee72-2 drosxF">
                            <div className="sc-ca13ee72-3 gseZfi">
                              <div className="sc-ca13ee72-4 jYYusq">50,945 POLIS</div>
                            </div>
                          </div> */}
                                                </div>
                                                <div className="sc-ca13ee72-0 laFUnd">
                                                    <div className="sc-ca13ee72-1 cJZNBd">
                                                        Total Staked Tokens
                                                    </div>
                                                    <div className="sc-ca13ee72-2 drosxF">
                                                        <div className="sc-ca13ee72-3 gseZfi">
                                                            <div className="sc-ca13ee72-4 jYYusq">
                                                                {gStakedAmt /
                                                                    1000000}{" "}
                                                                ALGO
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="sc-bfdd400e-0 iRoShu">
                            <div className="sc-28471dcc-0 cdjQvo">
                                <div className="sc-28471dcc-2 fTWaal">
                                    <div className="sc-28471dcc-4 cQxybo">
                                        <h2 className="sc-28471dcc-7 bHtenF">
                                            <div
                                                color="var(--label-primary)"
                                                className="sc-c8b5982a-0 cfWVOq"
                                            >
                                                My Staking Overview
                                            </div>
                                        </h2>
                                    </div>
                                    <div className="sc-28471dcc-3 jxBTox">
                                        <span
                                            direction="bottomRight"
                                            className="sc-5c5f561e-0 ixTxmb"
                                        >
                                            <div
                                                width="41px"
                                                height="41px"
                                                className="sc-88e560b3-1 fbjKHw"
                                            >
                                                <div className="sc-88e560b3-0 jlQvMD">
                                                    <div>
                                                        <svg
                                                            width="40"
                                                            height="40"
                                                            viewBox="0 0 40 40"
                                                            fill="none"
                                                            version="1.1"
                                                            id="svg16"
                                                            className="injected-svg"
                                                            data-src="/icons/Corner Bevel Right.svg"
                                                        >
                                                            <path
                                                                d="M 41,41 H 1 V 25.9706 C 1,22.788 2.2643,19.7357 4.5147,17.4853 L 17.4853,4.5147 C 19.7357,2.2643 22.788,1 25.9706,1 H 41 Z"
                                                                fill="var(--border-tertiary)"
                                                                fill-opacity="1"
                                                                id="path12-4"
                                                            ></path>
                                                            <path
                                                                d="M 41,41 H 2 V 26.4706 C 2,23.288 3.2643001,20.2357 5.5147,17.9853 L 17.985301,5.5147 C 20.2357,3.2643 23.288001,2 26.4706,2 H 41 Z"
                                                                fill="var(--canvas-primary)"
                                                                id="path14-5"
                                                                style={{
                                                                    strokeWidth:
                                                                        "1"
                                                                }}
                                                            ></path>
                                                        </svg>
                                                    </div>
                                                </div>
                                            </div>
                                        </span>
                                        <div
                                            id="locker-panel-content-My-Locker-Overview"
                                            className="sc-28471dcc-1 sYUKh"
                                        >
                                            <div className="sc-bfdd400e-3 bMLbET">
                                                <div className="sc-5e2206e2-1 CbwXX">
                                                    <div className="sc-ca13ee72-0 laFUnd">
                                                        <div className="sc-ca13ee72-1 cJZNBd">
                                                            Wallet Balance
                                                        </div>
                                                        <div className="sc-ca13ee72-2 drosxF">
                                                            <div className="sc-ca13ee72-3 gseZfi">
                                                                {/* <div color="var(--red-primary)" className="sc-ca13ee72-4 hpKZpr">0 POLIS</div> */}
                                                                <div className="sc-ca13ee72-4 jYYusq">
                                                                    {balance /
                                                                        1000000}{" "}
                                                                    ALGO{" "}
                                                                </div>
                                                            </div>
                                                        </div>
                                                        {/* <div className="sc-bfdd400e-10 dYSaao">
                              <div className="sc-43ba502d-0 dnaFpc">
                                <div className="sc-43ba502d-2 fkqsBW">
                                  <div className="sc-43ba502d-1 jREbVk">
                                    <div width="20px" height="20px" className="sc-88e560b3-1 kvmwsI">
                                      <div className="sc-88e560b3-0 jlQvMD">
                                        <div>
                                          <svg className="size injected-svg" viewBox="0 0 24 24" fill="none" data-src="/icons/Exclamation Triangle Fill.svg" >
                                            <path className="svgMainFillColor" fill-rule="evenodd" clip-rule="evenodd" d="M10.6873 3.87566C11.258 2.84303 12.7424 2.84304 13.313 3.87566L21.2703 18.2745C21.8227 19.2742 21.0996 20.5 19.9574 20.5H4.04292C2.90067 20.5 2.17757 19.2742 2.73006 18.2745L10.6873 3.87566ZM13.25 17.75C13.25 18.4404 12.6904 19 12 19C11.3097 19 10.75 18.4404 10.75 17.75C10.75 17.0596 11.3097 16.5 12 16.5C12.6904 16.5 13.25 17.0596 13.25 17.75ZM12 7.5C11.1882 7.5 10.5458 8.1867 10.5998 8.99668L10.9335 14.0022C10.9709 14.5637 11.4373 15 12 15C12.5627 15 13.0291 14.5637 13.0665 14.0022L13.4002 8.99668C13.4542 8.1867 12.8118 7.5 12 7.5Z" fill="#9747FF"></path>
                                          </svg>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="sc-43ba502d-3 kBmHdJ">
                                    <div className="sc-43ba502d-4 emNXrj">
                                      <div color="inherit" className="sc-c8b5982a-0 dETKBg">Add POLIS to your wallet in order to lock tokens</div>
                                    </div>
                                    <a target="_blank" rel="noopener noreferrer" href="https://support.staratlas.com/where-can-i-buy">
                                      <button color="var(--red-primary)" order="right" className="sc-2054542b-0 gkMwoC">
                                        <div width="20px" height="20px" className="sc-88e560b3-1 kUMUTg">
                                          <div className="sc-88e560b3-0 jlQvMD">
                                            <div>
                                              <svg className="size injected-svg" viewBox="0 0 24 24" fill="none" data-src="/icons/Arrow Diagnol Up.svg" >
                                                <path className="svgMainStrokeColor" d="M15.9999 14V8H10" stroke="#9747FF" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round"></path>
                                                <path className="svgMainStrokeColor" d="M15 9L8 16" stroke="#9747FF" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round"></path>
                                              </svg>
                                            </div>
                                          </div>
                                        </div>
                                        <div className="sc-ba2cad39-5 krGVMN">Learn more about purchasing tokens</div>
                                      </button>
                                    </a>
                                  </div>
                                </div>
                              </div>
                            </div> */}
                                                    </div>
                                                </div>
                                                <div className="sc-5e2206e2-1 gVSlNk">
                                                    <div className="sc-ca13ee72-0 laFUnd">
                                                        <div className="sc-ca13ee72-1 cJZNBd">
                                                            Staked Tokens
                                                        </div>
                                                        <div className="sc-ca13ee72-2 drosxF">
                                                            <div className="sc-ca13ee72-3 gseZfi">
                                                                <div className="sc-ca13ee72-4 jYYusq">
                                                                    {lStakedAmt /
                                                                        1000000}{" "}
                                                                    ALGO
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="sc-5e2206e2-1 gWUcpu">
                                                    <div className="sc-ca13ee72-0 laFUnd">
                                                        <div className="sc-ca13ee72-1 cJZNBd">
                                                            Staking Expiration
                                                        </div>
                                                        <div className="sc-ca13ee72-2 drosxF">
                                                            <div className="sc-ca13ee72-3 gseZfi">
                                                                <div
                                                                    width="14px"
                                                                    height="14px"
                                                                    className="sc-88e560b3-1 jiPdAY"
                                                                >
                                                                    <div className="sc-88e560b3-0 jlQvMD">
                                                                        <div>
                                                                            <svg
                                                                                className="size injected-svg"
                                                                                viewBox="0 0 24 24"
                                                                                fill="none"
                                                                                data-src="/icons/Clock.svg"
                                                                            >
                                                                                <path
                                                                                    className="svgMainFillColor"
                                                                                    fill-rule="evenodd"
                                                                                    clip-rule="evenodd"
                                                                                    d="M12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21ZM13.125 6.5C13.125 6.15482 12.8452 5.875 12.5 5.875C12.1548 5.875 11.875 6.15482 11.875 6.5V11.875H7.5C7.15482 11.875 6.875 12.1548 6.875 12.5C6.875 12.8452 7.15482 13.125 7.5 13.125H12.5C12.8452 13.125 13.125 12.8452 13.125 12.5V6.5Z"
                                                                                    fill="#9747FF"
                                                                                ></path>
                                                                            </svg>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className="sc-ca13ee72-4 jYYusq">
                                                                    {unixTimeToTime(
                                                                        lStakeTime
                                                                    ) ==
                                                                    "1970-01-01"
                                                                        ? "---"
                                                                        : unixTimeToTime(
                                                                              lStakeTime
                                                                          )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="sc-28471dcc-0 cdjQvo">
                                <div className="sc-28471dcc-2 fTWaal">
                                    <div className="sc-28471dcc-4 cQxybo">
                                        <h2 className="sc-28471dcc-7 bHtenF">
                                            <div
                                                color="var(--label-primary)"
                                                className="sc-c8b5982a-0 cfWVOq"
                                            >
                                                My Rewards and Staking Control
                                            </div>
                                        </h2>
                                    </div>
                                    <div className="sc-28471dcc-3 jxBTox">
                                        <span
                                            direction="bottomRight"
                                            className="sc-5c5f561e-0 ixTxmb"
                                        >
                                            <div
                                                width="41px"
                                                height="41px"
                                                className="sc-88e560b3-1 fbjKHw"
                                            >
                                                <div className="sc-88e560b3-0 jlQvMD">
                                                    <div>
                                                        <svg
                                                            width="40"
                                                            height="40"
                                                            viewBox="0 0 40 40"
                                                            fill="none"
                                                            version="1.1"
                                                            id="svg16"
                                                            className="injected-svg"
                                                            data-src="/icons/Corner Bevel Right.svg"
                                                        >
                                                            <path
                                                                d="M 41,41 H 1 V 25.9706 C 1,22.788 2.2643,19.7357 4.5147,17.4853 L 17.4853,4.5147 C 19.7357,2.2643 22.788,1 25.9706,1 H 41 Z"
                                                                fill="var(--border-tertiary)"
                                                                fill-opacity="1"
                                                                id="path12-6"
                                                            ></path>
                                                            <path
                                                                d="M 41,41 H 2 V 26.4706 C 2,23.288 3.2643001,20.2357 5.5147,17.9853 L 17.985301,5.5147 C 20.2357,3.2643 23.288001,2 26.4706,2 H 41 Z"
                                                                fill="var(--canvas-primary)"
                                                                id="path14-7"
                                                                style={{
                                                                    strokeWidth:
                                                                        "1"
                                                                }}
                                                            ></path>
                                                        </svg>
                                                    </div>
                                                </div>
                                            </div>
                                        </span>
                                        <div
                                            id="locker-panel-content-My-Rewards-and-Locker-Control"
                                            className="sc-28471dcc-1 sYUKh"
                                        >
                                            <div className="sc-bfdd400e-3 bMLbET">
                                                <div className="sc-5e2206e2-1 CbwXX">
                                                    <div className="sc-2c1ef44a-0 iZakdx">
                                                        <div className="sc-d6529863-1 gVbwji">
                                                            Rewards Over Time
                                                        </div>
                                                        <Tabs
                                                            defaultActiveKey="1"
                                                            items={items}
                                                            className="my-tabs"
                                                            onChange={onChange}
                                                        />
                                                        {/* <div className="sc-88bf6b13-0 kzuGLh">
                              <div className="sc-88bf6b13-1 iumicM">
                                <div className="sc-88bf6b13-2 beLbtM">day</div>
                                <div className="sc-88bf6b13-3 gIULzD"></div>
                              </div>
                              <div className="sc-88bf6b13-1 iumicM">
                                <div className="sc-88bf6b13-2 fiBTQE">week</div>
                              </div>
                              <div className="sc-88bf6b13-1 iumicM">
                                <div className="sc-88bf6b13-2 fiBTQE">month</div>
                              </div>
                              <div className="sc-88bf6b13-1 iumicM">
                                <div className="sc-88bf6b13-2 fiBTQE">year</div>
                              </div>
                            </div> */}
                                                        {/* <div className="sc-5735cacd-0 dsFoYy">
                              <div width="34px" height="34px" className="sc-88e560b3-1 jMizhU">
                                <div className="sc-88e560b3-0 jlQvMD"><div>
                                  <svg width="35" height="36" viewBox="0 0 35 36" fill="none" className="injected-svg" data-src="/icons/Star Burst.svg" >
                                    <g opacity="0.6">
                                      <path fill-rule="evenodd" clip-rule="evenodd" d="M17.5 28.25L15.125 23.5H19.875L17.5 28.25Z" fill="var(--universal-brand)"></path>
                                      <path fill-rule="evenodd" clip-rule="evenodd" d="M17.5 15.2841L13.2266 24.4649C13.0854 24.7591 13.0121 24.9979 12.7015 24.9979L9.87873 24.9992C9.47407 24.9992 9.25103 24.8938 9.4473 24.4662L16.3498 9.43365C16.4906 9.18371 16.5782 9 16.8892 9H18.1111C18.4218 9 18.5094 9.18371 18.6506 9.43365L25.5524 24.4662C25.7493 24.8938 25.5259 24.9992 25.1213 24.9992L22.2985 24.9979C21.9879 24.9979 21.9146 24.7591 21.7734 24.4649L17.5 15.2841Z" fill="var(--label-primary)"></path>
                                      <circle opacity="0.8" cx="17.5" cy="18" r="17" stroke="var(--action-primary)" stroke-linecap="round" stroke-dasharray="0.05 8"></circle>
                                    </g>
                                  </svg>
                                </div>
                                </div>
                              </div>
                              <div className="sc-5735cacd-1 hYspNU">Lock POLIS and Start Earning Rewards.</div>
                            </div> */}
                                                        {/* <div className="recharts-responsive-container" style={{ width: "100%", height: "100%", maxHeight: "155px" }} width="381" height="155">
                              <div className="recharts-wrapper" style={{ position: "relative", cursor: "default", width: "0px", height: "155px" }}>
                                <svg className="recharts-surface" width="381" height="155" viewBox="0 0 381 155" version="1.1">
                                  <title></title>
                                  <desc></desc>
                                  <defs><clipPath id="recharts1-clip"><rect x="5" y="5" height="115" width="371"></rect></clipPath></defs>
                                  <g className="recharts-layer recharts-cartesian-axis recharts-xAxis xAxis">
                                    <line stroke="transparent" orientation="bottom" width="371" height="30" type="category" x="5" y="120" className="recharts-cartesian-axis-line" fill="none" x1="5" y1="120" x2="376" y2="120"></line>
                                    <g className="recharts-cartesian-axis-ticks"></g></g><g className="recharts-layer recharts-bar">
                                    <g className="recharts-layer recharts-bar-rectangles"><g className="recharts-layer">
                                      <g className="recharts-layer recharts-bar-rectangle">
                                        <path fill="var(--label-quaternary)" width="42" height="2" x="10.3" y="118" radius="0" className="recharts-rectangle" d="M 10.3,118 h 42 v 2 h -42 Z">
                                        </path>
                                      </g>
                                      <g className="recharts-layer recharts-bar-rectangle">
                                        <path fill="var(--label-quaternary)" width="42" height="2" x="63.3" y="118" radius="0" className="recharts-rectangle" d="M 63.3,118 h 42 v 2 h -42 Z"></path>
                                      </g>
                                      <g className="recharts-layer recharts-bar-rectangle">
                                        <path fill="var(--label-quaternary)" width="42" height="2" x="116.3" y="118" radius="0" className="recharts-rectangle" d="M 116.3,118 h 42 v 2 h -42 Z"></path>
                                      </g>
                                      <g className="recharts-layer recharts-bar-rectangle">
                                        <path fill="var(--label-quaternary)" width="42" height="2" x="169.3" y="118" radius="0" className="recharts-rectangle" d="M 169.3,118 h 42 v 2 h -42 Z"></path>
                                      </g>
                                      <g className="recharts-layer recharts-bar-rectangle"><path fill="var(--label-quaternary)" width="42" height="2" x="222.3" y="118" radius="0" className="recharts-rectangle" d="M 222.3,118 h 42 v 2 h -42 Z"></path></g><g className="recharts-layer recharts-bar-rectangle"><path fill="var(--label-quaternary)" width="42" height="2" x="275.3" y="118" radius="0" className="recharts-rectangle" d="M 275.3,118 h 42 v 2 h -42 Z"></path></g><g className="recharts-layer recharts-bar-rectangle"><path fill="var(--label-quaternary)" width="42" height="2" x="328.3" y="118" radius="0" className="recharts-rectangle" d="M 328.3,118 h 42 v 2 h -42 Z"></path></g></g></g></g><g className="recharts-layer recharts-bar"><g className="recharts-layer recharts-bar-rectangles">
                                        <g className="recharts-layer recharts-bar-rectangle"></g>
                                        <g className="recharts-layer recharts-bar-rectangle"></g>
                                        <g className="recharts-layer recharts-bar-rectangle"></g>
                                        <g className="recharts-layer recharts-bar-rectangle"></g>
                                        <g className="recharts-layer recharts-bar-rectangle"></g><g className="recharts-layer recharts-bar-rectangle"></g>
                                        <g className="recharts-layer recharts-bar-rectangle"></g></g><g className="recharts-layer recharts-label-list"></g>
                                  </g>
                                </svg>
                              </div>
                            </div> */}
                                                    </div>
                                                </div>
                                                <div className="sc-5e2206e2-1 gVSlNk">
                                                    <div className="sc-ca13ee72-0 laFUnd">
                                                        <div className="sc-ca13ee72-1 cJZNBd">
                                                            My Unclaimed Rewards
                                                        </div>
                                                        <div className="sc-ca13ee72-2 drosxF">
                                                            <div className="sc-ca13ee72-3 gseZfi">
                                                                <div className="sc-ca13ee72-4 jYYusq">
                                                                    {unclaimdReward /
                                                                        1000000}{" "}
                                                                    ALGO
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="sc-5e2206e2-1 gWUcpu">
                                                    <div className="sc-798f6de-0 hBaOXC">
                                                        <div className="sc-ca13ee72-0 laFUnd">
                                                            <div className="sc-ca13ee72-1 cJZNBd">
                                                                Next Rewards
                                                                Drop
                                                            </div>
                                                            <div className="sc-ca13ee72-2 drosxF">
                                                                <div className="sc-ca13ee72-3 gseZfi">
                                                                    <div className="sc-ca13ee72-4 jYYusq">
                                                                        {unclaimdReward /
                                                                            1000000}{" "}
                                                                        ALGO
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <button
                                                            style={{
                                                                marginTop:
                                                                    "10px"
                                                            }}
                                                            className="sc-2e5f3f19-0 dUuleX"
                                                            onClick={
                                                                fetchStates
                                                            }
                                                        >
                                                            <div
                                                                color="inherit"
                                                                className="sc-c8b5982a-0 emCUmW"
                                                            >
                                                                Fetch
                                                            </div>
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div
                            className="sc-c784ee7d-0 dJbZeW"
                            style={{ marginBottom: "100px" }}
                        >
                            <div className="sc-c784ee7d-1 dVAaJX">
                                <div className="sc-6a58fba4-0 kKzxoy">
                                    <div className="sc-6a58fba4-2 qDwuw">
                                        Staking Period
                                    </div>
                                    <Radio.Group
                                        onChange={onChangeRadio}
                                        value={value}
                                        className="kYXnYu"
                                    >
                                        <div>
                                            <Radio
                                                className="gJLpRO"
                                                style={{ marginLeft: "15px" }}
                                                value={1}
                                            ></Radio>
                                            <div className="sc-fc7288c8-1 bPgJEG">
                                                <div className="sc-fc7288c8-2 gglmni">
                                                    <div
                                                        color="var(--label-secondary)"
                                                        className="sc-c8b5982a-0 jmBFw"
                                                    >
                                                        2 Weeks
                                                    </div>
                                                </div>
                                                <div className="sc-fc7288c8-2 gglmni">
                                                    <div
                                                        color="var(--label-secondary)"
                                                        className="sc-c8b5982a-0 fiBgYi"
                                                    >
                                                        <b>0.08x</b> PVP
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div>
                                            <Radio
                                                className="gJLpRO"
                                                style={{ marginLeft: "15px" }}
                                                value={2}
                                            ></Radio>
                                            <div className="sc-fc7288c8-1 bPgJEG">
                                                <div className="sc-fc7288c8-2 gglmni">
                                                    <div
                                                        color="var(--label-secondary)"
                                                        className="sc-c8b5982a-0 jmBFw"
                                                    >
                                                        1 Month
                                                    </div>
                                                </div>
                                                <div className="sc-fc7288c8-2 gglmni">
                                                    <div
                                                        color="var(--label-secondary)"
                                                        className="sc-c8b5982a-0 fiBgYi"
                                                    >
                                                        <b>0.16x</b> PVP
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div>
                                            <Radio
                                                className="gJLpRO"
                                                style={{ marginLeft: "15px" }}
                                                value={3}
                                            ></Radio>
                                            <div className="sc-fc7288c8-1 bPgJEG">
                                                <div className="sc-fc7288c8-2 gglmni">
                                                    <div
                                                        color="var(--label-secondary)"
                                                        className="sc-c8b5982a-0 jmBFw"
                                                    >
                                                        3 Months
                                                    </div>
                                                </div>
                                                <div className="sc-fc7288c8-2 gglmni">
                                                    <div
                                                        color="var(--label-secondary)"
                                                        className="sc-c8b5982a-0 fiBgYi"
                                                    >
                                                        <b>0.5x</b> PVP
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div>
                                            <Radio
                                                className="gJLpRO"
                                                style={{ marginLeft: "15px" }}
                                                value={4}
                                            ></Radio>
                                            <div className="sc-fc7288c8-1 bPgJEG">
                                                <div className="sc-fc7288c8-2 gglmni">
                                                    <div
                                                        color="var(--label-secondary)"
                                                        className="sc-c8b5982a-0 jmBFw"
                                                    >
                                                        6 Months
                                                    </div>
                                                </div>
                                                <div className="sc-fc7288c8-2 gglmni">
                                                    <div
                                                        color="var(--label-secondary)"
                                                        className="sc-c8b5982a-0 fiBgYi"
                                                    >
                                                        <b>1x</b> PVP
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div>
                                            <Radio
                                                className="gJLpRO"
                                                style={{ marginLeft: "15px" }}
                                                value={5}
                                            ></Radio>
                                            <div className="sc-fc7288c8-1 bPgJEG">
                                                <div className="sc-fc7288c8-2 gglmni">
                                                    <div
                                                        color="var(--label-secondary)"
                                                        className="sc-c8b5982a-0 jmBFw"
                                                    >
                                                        9 Months
                                                    </div>
                                                </div>
                                                <div className="sc-fc7288c8-2 gglmni">
                                                    <div
                                                        color="var(--label-secondary)"
                                                        className="sc-c8b5982a-0 fiBgYi"
                                                    >
                                                        <b>1.5x</b> PVP
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div>
                                            <Radio
                                                className="gJLpRO"
                                                style={{ marginLeft: "15px" }}
                                                value={6}
                                            ></Radio>
                                            <div className="sc-fc7288c8-1 bPgJEG">
                                                <div className="sc-fc7288c8-2 gglmni">
                                                    <div
                                                        color="var(--label-secondary)"
                                                        className="sc-c8b5982a-0 jmBFw"
                                                    >
                                                        1 Year
                                                    </div>
                                                </div>
                                                <div className="sc-fc7288c8-2 gglmni">
                                                    <div
                                                        color="var(--label-secondary)"
                                                        className="sc-c8b5982a-0 fiBgYi"
                                                    >
                                                        <b>2x</b> PVP
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div>
                                            <Radio
                                                className="gJLpRO"
                                                style={{ marginLeft: "15px" }}
                                                value={7}
                                            ></Radio>
                                            <div className="sc-fc7288c8-1 bPgJEG">
                                                <div className="sc-fc7288c8-2 gglmni">
                                                    <div
                                                        color="var(--label-secondary)"
                                                        className="sc-c8b5982a-0 jmBFw"
                                                    >
                                                        2 Years
                                                    </div>
                                                </div>
                                                <div className="sc-fc7288c8-2 gglmni">
                                                    <div
                                                        color="var(--label-secondary)"
                                                        className="sc-c8b5982a-0 fiBgYi"
                                                    >
                                                        <b>4x</b> PVP
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div>
                                            <Radio
                                                className="gJLpRO"
                                                style={{ marginLeft: "15px" }}
                                                value={8}
                                            ></Radio>
                                            <div className="sc-fc7288c8-1 bPgJEG">
                                                <div className="sc-fc7288c8-2 gglmni">
                                                    <div
                                                        color="var(--label-secondary)"
                                                        className="sc-c8b5982a-0 jmBFw"
                                                    >
                                                        3 Years
                                                    </div>
                                                </div>
                                                <div className="sc-fc7288c8-2 gglmni">
                                                    <div
                                                        color="var(--label-secondary)"
                                                        className="sc-c8b5982a-0 fiBgYi"
                                                    >
                                                        <b>6x</b> PVP
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div>
                                            <Radio
                                                className="gJLpRO"
                                                style={{ marginLeft: "15px" }}
                                                value={9}
                                            ></Radio>
                                            <div className="sc-fc7288c8-1 bPgJEG">
                                                <div className="sc-fc7288c8-2 gglmni">
                                                    <div
                                                        color="var(--label-secondary)"
                                                        className="sc-c8b5982a-0 jmBFw"
                                                    >
                                                        4 Years
                                                    </div>
                                                </div>
                                                <div className="sc-fc7288c8-2 gglmni">
                                                    <div
                                                        color="var(--label-secondary)"
                                                        className="sc-c8b5982a-0 fiBgYi"
                                                    >
                                                        <b>8x</b> PVP
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div>
                                            <Radio
                                                className="gJLpRO"
                                                style={{ marginLeft: "15px" }}
                                                value={10}
                                            ></Radio>
                                            <div className="sc-fc7288c8-1 bPgJEG">
                                                <div className="sc-fc7288c8-2 gglmni">
                                                    <div
                                                        color="var(--label-secondary)"
                                                        className="sc-c8b5982a-0 jmBFw"
                                                    >
                                                        5 Years
                                                    </div>
                                                </div>
                                                <div className="sc-fc7288c8-2 gglmni">
                                                    <div
                                                        color="var(--label-secondary)"
                                                        className="sc-c8b5982a-0 fiBgYi"
                                                    >
                                                        <b>10x</b> PVP
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </Radio.Group>
                                    <div className="sc-6a58fba4-3 kGuSDF">
                                        <div
                                            color="var(--label-tertiary)"
                                            className="sc-c8b5982a-0 bfYKdc"
                                        >
                                            Your PVP multiplier starts at the
                                            initial multiplier above and
                                            decreases linearly during the lock
                                            period.
                                        </div>
                                    </div>
                                </div>
                                <div className="sc-471e9298-0 kbYtQr">
                                    <div className="sc-bfdd400e-8 gqxMSB">
                                        Staking Amount
                                    </div>
                                    <div className="sc-471e9298-2 eJlmBQ">
                                        <input
                                            type="number"
                                            data-cy="lock-amount-input"
                                            disabled=""
                                            value={inputAmount}
                                            max="0"
                                            placeholder="0.0000"
                                            className="sc-471e9298-3 jiWqJF"
                                            onChange={onChangeInput}
                                        />
                                        <button
                                            disabled=""
                                            className="sc-471e9298-4 lnzOom"
                                            onClick={selectMax}
                                        >
                                            Max
                                        </button>
                                    </div>
                                    <div className="sc-471e9298-5 iMHKli">
                                        <div className="sc-471e9298-6 gCdzdp">
                                            {contextHolder}
                                            <button
                                                disabled=""
                                                className="sc-2e5f3f19-0 dUuleX"
                                                onClick={stake}
                                            >
                                                <div
                                                    color="inherit"
                                                    className="sc-c8b5982a-0 emCUmW"
                                                >
                                                    Staking Tokens
                                                </div>
                                            </button>
                                        </div>
                                    </div>
                                    <div className="sc-bfdd400e-8 gqxMSB">
                                        Claim Amount
                                    </div>
                                    <div className="sc-471e9298-2 eJlmBQ">
                                        <input
                                            type="number"
                                            data-cy="lock-amount-input"
                                            disabled=""
                                            value={inputClaim}
                                            max="0"
                                            placeholder="0.0000"
                                            className="sc-471e9298-3 jiWqJF"
                                            onChange={onChangeClaim}
                                        />
                                    </div>
                                    <div className="sc-471e9298-5 iMHKli">
                                        <div className="sc-471e9298-6 gCdzdp">
                                            {contextHolder}
                                            <button
                                                disabled=""
                                                className="sc-2e5f3f19-0 dUuleX"
                                                onClick={claim}
                                            >
                                                <div
                                                    color="inherit"
                                                    className="sc-c8b5982a-0 emCUmW"
                                                >
                                                    Claim Rewards
                                                </div>
                                            </button>
                                        </div>
                                    </div>
                                    <div className="sc-bfdd400e-8 gqxMSB">
                                        Withdraw Amount
                                    </div>
                                    <div className="sc-471e9298-2 eJlmBQ">
                                        <input
                                            type="number"
                                            data-cy="lock-amount-input"
                                            disabled=""
                                            value={inputWithdraw}
                                            max="0"
                                            placeholder="0.0000"
                                            className="sc-471e9298-3 jiWqJF"
                                            onChange={onChangeWithdraw}
                                        />
                                    </div>
                                    <div className="sc-471e9298-5 iMHKli">
                                        <div className="sc-471e9298-6 gCdzdp">
                                            {contextHolder}
                                            <button
                                                className="sc-2e5f3f19-0 dUuleX"
                                                onClick={withdraw}
                                            >
                                                <div
                                                    color="inherit"
                                                    className="sc-c8b5982a-0 emCUmW"
                                                >
                                                    Withdraw
                                                </div>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
