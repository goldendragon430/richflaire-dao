import React, { useState, useEffect } from 'react'
import "./proposals.scss"
import { NavLink } from 'react-router-dom'
import { QuestionCircleOutlined, StarOutlined, SmileOutlined } from "@ant-design/icons"
import { Col, Row, Typography, Button, Select, notification, Popover } from 'antd';
import { ZuoShangIcon, YouXiaIcon, HeadIcon, CoinbaseIcon, LedgerIcon, SolflareIcon, TorusIcon, ExodusIcon } from '../../layout/icons'
import { useSelector, useDispatch } from 'react-redux';
import TermsMain from "../../components/terms_main"
import PrivacyMain from '../../components/privacy_main'
import { SET_MODEL } from '../../store/actionTypes'
import { voting_app_id, algodAddress as algoServer, algodToken as token } from "../../utils/constant";
import algosdk from "algosdk";

export default function Profile() {
  const algodAddress = algoServer;
  const algodToken = token;
  const client = new algosdk.Algodv2({
    'X-API-Key': algodToken
  }, algodAddress, "");
  const [votes, setVotes] = useState([]);
  const [selectedCandidate, setSelectedCandidate] = useState(null);

  const app_id = voting_app_id;
  const candidates = ["candidate_1", "candidate_2", "candidate_3"];

  useEffect(() => {
    fetchVotes();
  }, [])

  const model = useSelector(state => state.flagReducer.model)
  const dispatch = useDispatch()
  const [isMask, setIsMask] = useState(false)
  const [modelShow, setModelShow] = useState(false)
  console.log(model, "666")

  const modelShows = () => {
    if (model.Privacy_main === "false") {
      return (setIsMask(true), setModelShow(true))
    }
  }
  const address = localStorage.getItem("address");
  const text = <span>Title</span>;

  const copyToClipboard = () => {
    const textArea = document.createElement('textarea');

    // Set the value of the temporary textarea with the text you want to copy
    textArea.value = address;

    // Add the textarea node to the DOM
    document.body.appendChild(textArea);

    // Select the text in the textarea
    textArea.select();

    // Copy the selected text to the clipboard
    document.execCommand('copy');

    // Remove the textarea node from the DOM
    document.body.removeChild(textArea);
  }

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
    <>
      <div className="sc-e536a6d0-3 dEXRnu">
        <div className="sc-e536a6d0-4 fxvOMD">
          <div className="sc-1051bef-0 hVmiEH">
            <div id="profile-page-container" className="sc-294f4555-0 fJzwJO">
              <div className="sc-294f4555-3 fdhVIl">
                <div className="sc-294f4555-4 ciDvHd">
                  <div className="sc-294f4555-5 hXCqFi">
                    <div color="var(--label-primary)" className="sc-c8b5982a-0 dwBeJA">Voting results of candidates</div>
                  </div>
                  <div className="sc-294f4555-6 dVkLNS">
                    <div className="sc-c3769624-0 keAWcq">
                      <div className="sc-c3769624-2 jZOHnA">
                        <div className="sc-c3769624-4 iOHIfF">
                          <div className="sc-c3769624-3 hAbwML"><span style={{ boxSizing: "border-box", display: "inline-block", overflow: "hidden", width: "initial", height: "initial", background: "none", opacity: "1", border: "0px", margin: "0px", padding: "0px", position: "relative", maxWidth: "100%" }}><span style={{ boxSizing: "border-box", display: "inline-block", overflow: "hidden", width: "initial", height: "initial", background: "none", opacity: "1", border: "0px", margin: "0px", padding: "0px", position: "relative", maxWidth: "100%" }}>
                          </span>
                            <img src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik0xMiAyMy4yNUw5LjYyNSAxOC41SDE0LjM3NUwxMiAyMy4yNVYyMy4yNVoiIGZpbGw9IiM4QjhCOEQiLz4KPHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik0xMiAxMC4yODQxTDcuNzI2NTUgMTkuNDY0OUM3LjU4NTQgMTkuNzU5MSA3LjUxMjEyIDE5Ljk5NzkgNy4yMDE0NiAxOS45OTc5TDQuMzc4NzMgMTkuOTk5MkMzLjk3NDA3IDE5Ljk5OTIgMy43NTEwMyAxOS44OTM4IDMuOTQ3MyAxOS40NjYyTDEwLjg0OTggNC40MzM2NUMxMC45OTA2IDQuMTgzNzEgMTEuMDc4MiA0IDExLjM4OTIgNEgxMi42MTExQzEyLjkyMTggNCAxMy4wMDk0IDQuMTgzNzEgMTMuMTUwNiA0LjQzMzY1TDIwLjA1MjQgMTkuNDY2MkMyMC4yNDkzIDE5Ljg5MzggMjAuMDI1OSAxOS45OTkyIDE5LjYyMTMgMTkuOTk5MkwxNi43OTg1IDE5Ljk5NzlDMTYuNDg3OSAxOS45OTc5IDE2LjQxNDYgMTkuNzU5MSAxNi4yNzM0IDE5LjQ2NDlMMTIgMTAuMjg0MVoiIGZpbGw9IiM1RDVENjAiLz4KPC9zdmc+Cg==" decoding="async" data-nimg="intrinsic" style={{ boxSizing: "border-box", display: "inline-block", overflow: "hidden", width: "initial", height: "initial", background: "none", opacity: "1", border: "0px", margin: "0px", padding: "0px", position: "relative", maxWidth: "100%" }} />
                          </span>
                          </div>
                          <div className="sc-c3769624-5 EGfCJ">
                            <div color="var(--label-secondary)" className="sc-c8b5982a-0 jmBFw">Candidate 1</div>
                          </div>
                        </div>
                        <div className="sc-c3769624-7 hdeQhI">
                          <div color="var(--label-secondary)" className="sc-c8b5982a-0 ckJRzi">
                            {votes[0]} votes
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="sc-c3769624-0 keAWcq">
                      <div className="sc-c3769624-2 jZOHnA">
                        <div className="sc-c3769624-4 iOHIfF">
                          <div className="sc-c3769624-3 hAbwML"><span style={{ boxSizing: "border-box", display: "inline-block", overflow: "hidden", width: "initial", height: "initial", background: "none", opacity: "1", border: "0px", margin: "0px", padding: "0px", position: "relative", maxWidth: "100%" }}>
                            <span style={{ boxSizing: "border-box", display: "inline-block", overflow: "hidden", width: "initial", height: "initial", background: "none", opacity: "1", border: "0px", margin: "0px", padding: "0px", position: "relative", maxWidth: "100%" }}>
                            </span>
                            <img src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjUiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNSAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik03LjA4MzE3IDE1Ljk3ODZDNy4xMzM5IDE1LjkyMjkgNy4xOTU3MSAxNS44Nzg1IDcuMjY0NjQgMTUuODQ4MUM3LjMzMzkxIDE1LjgxNjUgNy40MDg5OSAxNS43OTk2IDcuNDg1MTIgMTUuNzk4NkgyMC4wNTA1QzIwLjEwNCAxNS43OTg4IDIwLjE1NjIgMTUuODE1IDIwLjIwMDUgMTUuODQ1MUMyMC4yNDQzIDE1Ljg3NTIgMjAuMjc5MSAxNS45MTY3IDIwLjMwMSAxNS45NjUxQzIwLjMyMSAxNi4wMTI0IDIwLjMyNzMgMTYuMDY0NCAyMC4zMTkgMTYuMTE1MUMyMC4zMTA1IDE2LjE2NzYgMjAuMjg3MSAxNi4yMTY1IDIwLjI1MTUgMTYuMjU2MUwxNy41ODYzIDE5LjIxODJDMTcuNTM1MSAxOS4yNzM1IDE3LjQ3MzIgMTkuMzE3OSAxNy40MDQ0IDE5LjM0ODlDMTcuMzM1NiAxOS4zNzk4IDE3LjI2MTMgMTkuMzk2NSAxNy4xODU5IDE5LjM5ODJINC42MTE0OEM0LjU1NzkzIDE5LjM5ODIgNC41MDU2MiAxOS4zODIgNC40NjE1IDE5LjM1MTdDNC40MTczNCAxOS4zMjIyIDQuMzgyNTYgMTkuMjgwNyA0LjM2MTI5IDE5LjIzMkM0LjM0MDAyIDE5LjE4MzQgNC4zMzMxNiAxOS4xMjk2IDQuMzQxNTIgMTkuMDc3MkM0LjM1MDQ3IDE5LjAyNDUgNC4zNzQ0MiAxOC45NzU2IDQuNDEwNTEgMTguOTM2Mkw3LjA4MzE3IDE1Ljk3ODZaTTIwLjI2MiAxMy41MjY0QzIwLjI5NzMgMTMuNTY2MSAyMC4zMjA3IDEzLjYxNSAyMC4zMjk1IDEzLjY2NzRDMjAuMzM4NiAxMy43MTk3IDIwLjMzMjIgMTMuNzczNSAyMC4zMTExIDEzLjgyMjNDMjAuMjkwMSAxMy44NzEgMjAuMjU1MyAxMy45MTI2IDIwLjIxMSAxMy45NDE5QzIwLjE2NjcgMTMuOTcyIDIwLjExNDUgMTMuOTg4MSAyMC4wNjEgMTMuOTg4M0w3LjQ4NTEyIDEzLjk5ODhDNy40MDk3MSAxMy45OTcyIDcuMzM1NCAxMy45ODA1IDcuMjY2NiAxMy45NDk1QzcuMTk3ODEgMTMuOTE4NiA3LjEzNTk0IDEzLjg3NDIgNy4wODQ2NyAxMy44MTg5TDQuNDA3NTEgMTAuODcxN0M0LjM3MDQ1IDEwLjgzMjMgNC4zNDU5NSAxMC43ODI3IDQuMzM3MTQgMTAuNzI5M0M0LjMyODMyIDEwLjY3NTkgNC4zMzU1OSAxMC42MjExIDQuMzU4MDIgMTAuNTcxOEM0LjM3ODUzIDEwLjUyMjUgNC40MTM1OSAxMC40ODA2IDQuNDU4NSAxMC40NTE4QzQuNTAyNjIgMTAuNDIxNCA0LjU1NDkzIDEwLjQwNTIgNC42MDg0OCAxMC40MDUzTDE3LjE3ODQgMTAuMzk5M0MxNy4yNTM1IDEwLjQwMDcgMTcuMzI3NSAxMC40MTc2IDE3LjM5NTggMTAuNDQ4OEMxNy40NjQ4IDEwLjQ3OTIgMTcuNTI2NiAxMC41MjM2IDE3LjU3NzMgMTAuNTc5M0wyMC4yNjIgMTMuNTI2NFpNNy4wODMxNyA1LjE3OTk4QzcuMTMzOSA1LjEyNDMgNy4xOTU3MSA1LjA3OTg1IDcuMjY0NjQgNS4wNDk0OUM3LjMzMzkxIDUuMDE3ODggNy40MDg5OSA1LjAwMTAzIDcuNDg1MTIgNUwyMC4wNTk1IDUuMDEwNUMyMC4xMTMxIDUuMDEwNDIgMjAuMTY1NCA1LjAyNjY0IDIwLjIwOTUgNS4wNTY5OUMyMC4yNTQ0IDUuMDg1ODQgMjAuMjg5NSA1LjEyNzY5IDIwLjMxIDUuMTc2OThDMjAuMzI5OSA1LjIyNDMgMjAuMzM2NiA1LjI3NjEyIDIwLjMyOTUgNS4zMjY5NkMyMC4zMjAyIDUuMzc5NTEgMjAuMjk2MyA1LjQyODM4IDIwLjI2MDUgNS40Njc5NEwxNy41ODYzIDguNDE5NTZDMTcuNTM1MSA4LjQ3NDg4IDE3LjQ3MzIgOC41MTkzMiAxNy40MDQ0IDguNTUwMjRDMTcuMzM1NiA4LjU4MTE2IDE3LjI2MTMgOC41OTc5MiAxNy4xODU5IDguNTk5NTRINC42MTE0OEM0LjU1NzkzIDguNTk5NjEgNC41MDU2MiA4LjU4MzQgNC40NjE1IDguNTUzMDRDNC40MTczNCA4LjUyMzU3IDQuMzgyNTYgOC40ODIwNCA0LjM2MTI5IDguNDMzMzlDNC4zNDAwMiA4LjM4NDc0IDQuMzMzMTYgOC4zMzEwMSA0LjM0MTUyIDguMjc4NThDNC4zNTA0NyA4LjIyNTkzIDQuMzc0NDIgOC4xNzY5NyA0LjQxMDUxIDguMTM3Nkw3LjA4MzE3IDUuMTc5OThaIiBmaWxsPSIjNUQ1RDYwIi8+Cjwvc3ZnPgo=" decoding="async" data-nimg="intrinsic" style={{ boxSizing: "border-box", display: "inline-block", overflow: "hidden", width: "initial", height: "initial", background: "none", opacity: "1", border: "0px", margin: "0px", padding: "0px", position: "relative", maxWidth: "100%" }} />
                          </span>
                          </div>
                          <div className="sc-c3769624-5 EGfCJ"><div color="var(--label-secondary)" className="sc-c8b5982a-0 jmBFw">Candidate 2</div>
                          </div>
                        </div>
                        <div className="sc-c3769624-7 hdeQhI"><div color="var(--label-secondary)" className="sc-c8b5982a-0 ckJRzi">{votes[1]} votes</div>
                        </div>
                      </div>
                    </div>
                    <div className="sc-c3769624-0 keAWcq">
                      <div className="sc-c3769624-2 jZOHnA">
                        <div className="sc-c3769624-4 iOHIfF">
                          <div className="sc-c3769624-3 hAbwML">
                            <span style={{ boxSizing: "border-box", display: "inline-block", overflow: "hidden", width: "initial", height: "initial", background: "none", opacity: "1", border: "0px", margin: "0px", padding: "0px", position: "relative", maxWidth: "100%" }}><span style={{ boxSizing: "border-box", display: "inline-block", overflow: "hidden", width: "initial", height: "initial", background: "none", opacity: "1", border: "0px", margin: "0px", padding: "0px", position: "relative", maxWidth: "100%" }}>
                            </span>
                              <img src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik0xMiAyMy4yNUw5LjYyNSAxOC41SDE0LjM3NUwxMiAyMy4yNVYyMy4yNVoiIGZpbGw9IiM4QjhCOEQiLz4KPHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik0xMiAxMC4yODQxTDcuNzI2NTUgMTkuNDY0OUM3LjU4NTQgMTkuNzU5MSA3LjUxMjEyIDE5Ljk5NzkgNy4yMDE0NiAxOS45OTc5TDQuMzc4NzMgMTkuOTk5MkMzLjk3NDA3IDE5Ljk5OTIgMy43NTEwMyAxOS44OTM4IDMuOTQ3MyAxOS40NjYyTDEwLjg0OTggNC40MzM2NUMxMC45OTA2IDQuMTgzNzEgMTEuMDc4MiA0IDExLjM4OTIgNEgxMi42MTExQzEyLjkyMTggNCAxMy4wMDk0IDQuMTgzNzEgMTMuMTUwNiA0LjQzMzY1TDIwLjA1MjQgMTkuNDY2MkMyMC4yNDkzIDE5Ljg5MzggMjAuMDI1OSAxOS45OTkyIDE5LjYyMTMgMTkuOTk5MkwxNi43OTg1IDE5Ljk5NzlDMTYuNDg3OSAxOS45OTc5IDE2LjQxNDYgMTkuNzU5MSAxNi4yNzM0IDE5LjQ2NDlMMTIgMTAuMjg0MVoiIGZpbGw9IiM1RDVENjAiLz4KPC9zdmc+Cg==" decoding="async" data-nimg="intrinsic" style={{ boxSizing: "border-box", display: "inline-block", overflow: "hidden", width: "initial", height: "initial", background: "none", opacity: "1", border: "0px", margin: "0px", padding: "0px", position: "relative", maxWidth: "100%" }} />
                            </span>
                          </div>
                          <div className="sc-c3769624-5 EGfCJ">
                            <div color="var(--label-secondary)" className="sc-c8b5982a-0 jmBFw">Candidate 3</div>
                          </div>
                        </div>
                        <div className="sc-c3769624-7 hdeQhI">
                          <div color="var(--label-secondary)" className="sc-c8b5982a-0 ckJRzi">{votes[2]} votes</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="sc-294f4555-7 hYMFJF">
                  <div className="sc-28471dcc-0 cdjQvo">
                    <div className="sc-28471dcc-2 fTWaal">
                      <div className="sc-28471dcc-3 jxBTox">
                        <span direction="bottomRight" className="sc-5c5f561e-0 ixTxmb">
                          <div width="41px" height="41px" className="sc-88e560b3-1 fbjKHw">
                            <div className="sc-88e560b3-0 jlQvMD"><div>
                              <svg width="40" height="40" viewBox="0 0 40 40" fill="none" version="1.1" id="svg16" className="injected-svg" >
                                <path d="M 41,41 H 1 V 25.9706 C 1,22.788 2.2643,19.7357 4.5147,17.4853 L 17.4853,4.5147 C 19.7357,2.2643 22.788,1 25.9706,1 H 41 Z" fill="var(--border-tertiary)" fill-opacity="1" id="path12-8"></path>
                                <path d="M 41,41 H 2 V 26.4706 C 2,23.288 3.2643001,20.2357 5.5147,17.9853 L 17.985301,5.5147 C 20.2357,3.2643 23.288001,2 26.4706,2 H 41 Z" fill="var(--canvas-primary)" id="path14-9" style={{ trokeWidth: "1px" }}></path>
                              </svg>
                            </div>
                            </div>
                          </div>
                        </span>
                        <div id="locker-panel-content-undefined" className="sc-28471dcc-1 sYUKh">
                          <div color="var(--label-primary)" className="sc-c8b5982a-0 hWLIYy">Cast your vote</div>
                          <div style={{ height: "100px" }}>
                            <Select
                              // mode="tags"
                              dropdownStyle={{ backgroundColor: 'lightgray' }}
                              style={{ width: '200px', marginRight: "30px",  marginTop: "30px"}}
                              placeholder="Select a candidate"
                              onChange={handleChange}
                              options={options}
                            />
                            {contextHolder}
                            <button className="sc-2e5f3f19-0 dUuleX" onClick={castVote}>
                              <div color="inherit" className="sc-c8b5982a-0 emCUmW">Vote</div>
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
        </div>

      </div>

    </>
  )
}
