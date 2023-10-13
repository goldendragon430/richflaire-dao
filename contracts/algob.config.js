const algosdk = require("algosdk");
const fs = require("fs");
const path = require("path");

const algodAddress = "https://testnet-algorand.api.purestake.io/ps2";
const algodToken = "E2QQNNiByE4AGYjWxZcfY1AQrOKSigCu1Mctc8F5";
const algodClient = new algosdk.Algodv2(
    {
        "X-API-Key": algodToken
    },
    algodAddress,
    ""
);
const approvalProgram = fs.readFileSync(
    path.join(__dirname, "/approval.teal"),
    "utf8"
);
const clearProgram = fs.readFileSync(
    path.join(__dirname, "/clear.teal"),
    "utf8"
);

const senderMnemonic =
    "G2XVAXJPP62LSDLC2PGFDFBKTT2A3JRXAAMPR4NDSEW3GKW6M6HS4HC7CA";
const senderAccount = algosdk.mnemonicToSecretKey(senderMnemonic);

const note = algosdk.encodeObj({}); // Note to attach to the transaction

async function deploySmartContract() {
    const approvalCompileResp = await algodClient
        .compile(Buffer.from(approvalProgram))
        .do();

    const compiledApprovalProgram = new Uint8Array(
        Buffer.from(approvalCompileResp.result, "base64")
    );

    const clearCompileResp = await algodClient
        .compile(Buffer.from(clearProgram))
        .do();

    const compiledClearProgram = new Uint8Array(
        Buffer.from(clearCompileResp.result, "base64")
    );
    try {
        const txnParams = await algodClient.getTransactionParams().do();

        const smartContractTxn = algosdk.makeApplicationCreateTxn(
            senderAccount.addr,
            txnParams,
            0,
            compiledApprovalProgram,
            compiledClearProgram
        );

        const signedTxn = smartContractTxn.signTxn(senderAccount.sk);
        const txId = signedTxn.txID().toString();

        const txResponse = await algodClient.sendRawTransaction(signedTxn).do();
        console.log(`Smart contract deployed. Transaction ID: ${txId}`);
        console.log(`Transaction Response:`, txResponse);
    } catch (error) {
        console.error("Error deploying smart contract:", error);
    }
}

deploySmartContract();
