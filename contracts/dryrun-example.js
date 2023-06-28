const algosdk = require('algosdk');
const fs = require('fs');



async function runDryrun() {

    const algodAddress = "https://testnet-algorand.api.purestake.io/ps2";
    const algodToken = "E2QQNNiByE4AGYjWxZcfY1AQrOKSigCu1Mctc8F5";
    const algodClient = await new algosdk.Algodv2({
        'X-API-Key': algodToken
    }, algodAddress, "");

    const tealSource = fs.readFileSync('voting.teal', 'utf8');
    const tealCompiled = await algodClient.compile(tealSource).do();
    const programBytes = new Uint8Array(Buffer.from(tealCompiled.result, 'base64'));

    const sender = "G2XVAXJPP62LSDLC2PGFDFBKTT2A3JRXAAMPR4NDSEW3GKW6M6HS4HC7CA";
    const appIndex = 166111381; // For stateful contracts, use the application index

    const appArgs = [new TextEncoder().encode(btoa("candidate_1"))]; // Add any required arguments for your TEAL program
    // const txn = algosdk.makeApplicationNoOpTxn(sender, appArgs, appIndex);
    console.log("appArgs", appArgs)
    const params = await algodClient.getTransactionParams().do();
    // const txn = algosdk.makeApplicationNoOpTxn(sender, appArgs, appIndex, undefined, undefined, undefined, undefined, genesisHash);
    const txn = algosdk.makeApplicationNoOpTxn(sender, params, appIndex, appArgs);
    const txnAndSign = { txn: txn.toByte(), sig: new Uint8Array(0) };

    const dryrunRequest = {
        sources: [{ source: tealSource, filename: 'voting.teal' }],
        txns: [txnAndSign],
    };
    const dryrunResponse = await algodClient.dryrun(dryrunRequest).do();

    for (const error of dryrunResponse.error) {
        console.error('Dryrun error:', error);
    }

    for (const appCall of dryrunResponse.appCallResults) {
        console.log('Dryrun result:', appCall);
    }
}

runDryrun();