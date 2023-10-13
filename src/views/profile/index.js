import React, { useState, useEffect } from "react";
import "./profile.scss";
import { NavLink, useNavigate } from "react-router-dom";
import { QuestionCircleOutlined, StarOutlined } from "@ant-design/icons";
import {
    Col,
    Row,
    Typography,
    Button,
    Select,
    notification,
    Popover
} from "antd";
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

export default function Profile() {
    const model = useSelector((state) => state.flagReducer.model);
    const dispatch = useDispatch();
    const [isMask, setIsMask] = useState(false);
    const [modelShow, setModelShow] = useState(false);
    console.log(model, "666");
    const navigate = useNavigate();

    const modelShows = () => {
        if (model.Privacy_main === "false") {
            return setIsMask(true), setModelShow(true);
        }
    };
    const address = localStorage.getItem("address");
    const text = <span>Title</span>;

    const copyToClipboard = () => {
        const textArea = document.createElement("textarea");

        // Set the value of the temporary textarea with the text you want to copy
        textArea.value = address;

        // Add the textarea node to the DOM
        document.body.appendChild(textArea);

        // Select the text in the textarea
        textArea.select();

        // Copy the selected text to the clipboard
        document.execCommand("copy");

        // Remove the textarea node from the DOM
        document.body.removeChild(textArea);
    };

    return (
        <>
            <div className="sc-e536a6d0-3 dEXRnu">
                <div className="sc-e536a6d0-4 fxvOMD">
                    <div className="sc-1051bef-0 hVmiEH">
                        <div
                            id="profile-page-container"
                            className="sc-294f4555-0 fJzwJO"
                        >
                            <div className="main uxaiq">
                                <div
                                    width="84px"
                                    height="84px"
                                    className="sc-88e560b3-1 bjXdAs"
                                >
                                    <div className="sc-88e560b3-0 jlQvMD">
                                        <div>
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                viewBox="0 0 28 28"
                                                className="injected-svg"
                                                data-src="/icons/avatarDefault.svg"
                                            >
                                                <path
                                                    opacity="0.85"
                                                    d="M14 0C6.26882 0 0 6.26787 0 14C0 21.7321 6.26821 28 14 28C21.7324 28 28 21.7321 28 14C28 6.26787 21.7324 0 14 0ZM14 4.18616C16.5582 4.18616 18.6312 6.25987 18.6312 8.81696C18.6312 11.3747 16.5582 13.4477 14 13.4477C11.443 13.4477 9.37003 11.3747 9.37003 8.81696C9.37003 6.25987 11.443 4.18616 14 4.18616ZM13.9969 24.3396C11.4455 24.3396 9.10867 23.4104 7.30625 21.8723C6.86717 21.4978 6.61381 20.9486 6.61381 20.3724C6.61381 17.779 8.71264 15.7035 11.3065 15.7035H16.6947C19.2892 15.7035 21.38 17.779 21.38 20.3724C21.38 20.9493 21.1279 21.4972 20.6882 21.8717C18.8864 23.4104 16.549 24.3396 13.9969 24.3396Z"
                                                    fill="var(--label-tertiary)"
                                                    className="svgMainFillColor"
                                                ></path>
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="sc-bcb81fde-0 jMYie">
                                <div className="sc-bcb81fde-1 ezFtqg">
                                    <div
                                        color="var(--label-secondary)"
                                        className="sc-c8b5982a-0 fiBgYi"
                                    >
                                        {address
                                            ? address.toString().slice(0, 4) +
                                              "..." +
                                              address
                                                  .toString()
                                                  .slice(
                                                      address.toString()
                                                          .length - 5,
                                                      address.toString()
                                                          .length - 1
                                                  )
                                            : ""}
                                    </div>
                                </div>
                                {/* <Popover placement="bottom" title={text} trigger="click"> */}
                                <div
                                    className="sc-bcb81fde-2 bqLHcy"
                                    onClick={copyToClipboard}
                                >
                                    <div
                                        width="20px"
                                        height="20px"
                                        className="sc-88e560b3-1 fEctAY"
                                    >
                                        <div className="sc-88e560b3-0 jlQvMD">
                                            <div>
                                                <svg
                                                    className="size injected-svg"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    data-src="/icons/Copy.svg"
                                                >
                                                    <path
                                                        className="svgMainStrokeColor"
                                                        d="M18 16V16C19.1046 16 20 15.1046 20 14V6C20 4.89543 19.1046 4 18 4H10C8.89543 4 8 4.89543 8 6V6"
                                                        stroke="black"
                                                        stroke-width="1.25"
                                                        stroke-linecap="round"
                                                        stroke-linejoin="round"
                                                    ></path>
                                                    <rect
                                                        className="svgMainStrokeColor"
                                                        x="4"
                                                        y="8"
                                                        width="12"
                                                        height="12"
                                                        rx="2"
                                                        stroke="black"
                                                        stroke-width="1.25"
                                                    ></rect>
                                                </svg>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {/* </Popover> */}
                            </div>
                            <div className="sc-294f4555-3 fdhVIl">
                                <div className="sc-294f4555-4 ciDvHd">
                                    <div className="sc-294f4555-5 hXCqFi">
                                        <div
                                            color="var(--label-primary)"
                                            className="sc-c8b5982a-0 dwBeJA"
                                        >
                                            Wallet Balance
                                        </div>
                                    </div>
                                    <div className="sc-294f4555-6 dVkLNS">
                                        <div className="sc-c3769624-0 keAWcq">
                                            <div className="sc-c3769624-2 jZOHnA">
                                                <div className="sc-c3769624-4 iOHIfF">
                                                    <div className="sc-c3769624-3 hAbwML">
                                                        <span
                                                            style={{
                                                                boxSizing:
                                                                    "border-box",
                                                                display:
                                                                    "inline-block",
                                                                overflow:
                                                                    "hidden",
                                                                width: "initial",
                                                                height: "initial",
                                                                background:
                                                                    "none",
                                                                opacity: "1",
                                                                border: "0px",
                                                                margin: "0px",
                                                                padding: "0px",
                                                                position:
                                                                    "relative",
                                                                maxWidth: "100%"
                                                            }}
                                                        >
                                                            <span
                                                                style={{
                                                                    boxSizing:
                                                                        "border-box",
                                                                    display:
                                                                        "inline-block",
                                                                    overflow:
                                                                        "hidden",
                                                                    width: "initial",
                                                                    height: "initial",
                                                                    background:
                                                                        "none",
                                                                    opacity:
                                                                        "1",
                                                                    border: "0px",
                                                                    margin: "0px",
                                                                    padding:
                                                                        "0px",
                                                                    position:
                                                                        "relative",
                                                                    maxWidth:
                                                                        "100%"
                                                                }}
                                                            ></span>
                                                            <img
                                                                src="/logo.png"
                                                                decoding="async"
                                                                data-nimg="intrinsic"
                                                                style={{
                                                                    boxSizing:
                                                                        "border-box",
                                                                    display:
                                                                        "inline-block",
                                                                    overflow:
                                                                        "hidden",
                                                                    width: "initial",
                                                                    height: "initial",
                                                                    background:
                                                                        "none",
                                                                    opacity:
                                                                        "1",
                                                                    border: "0px",
                                                                    margin: "0px",
                                                                    padding:
                                                                        "0px",
                                                                    position:
                                                                        "relative",
                                                                    maxWidth:
                                                                        "100%"
                                                                }}
                                                            />
                                                        </span>
                                                    </div>
                                                    <div className="sc-c3769624-5 EGfCJ">
                                                        <div
                                                            color="var(--label-secondary)"
                                                            className="sc-c8b5982a-0 jmBFw"
                                                        >
                                                            Transactional Token
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="sc-c3769624-7 hdeQhI">
                                                    <div
                                                        color="var(--label-secondary)"
                                                        className="sc-c8b5982a-0 ckJRzi"
                                                    >
                                                        {localStorage.getItem(
                                                            "balance"
                                                        ) /
                                                            1000000 +
                                                            " ALGO "}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="sc-c3769624-0 keAWcq">
                                            <div className="sc-c3769624-2 jZOHnA">
                                                <div className="sc-c3769624-4 iOHIfF">
                                                    <div className="sc-c3769624-3 hAbwML">
                                                        <span
                                                            style={{
                                                                boxSizing:
                                                                    "border-box",
                                                                display:
                                                                    "inline-block",
                                                                overflow:
                                                                    "hidden",
                                                                width: "initial",
                                                                height: "initial",
                                                                background:
                                                                    "none",
                                                                opacity: "1",
                                                                border: "0px",
                                                                margin: "0px",
                                                                padding: "0px",
                                                                position:
                                                                    "relative",
                                                                maxWidth: "100%"
                                                            }}
                                                        >
                                                            <span
                                                                style={{
                                                                    boxSizing:
                                                                        "border-box",
                                                                    display:
                                                                        "inline-block",
                                                                    overflow:
                                                                        "hidden",
                                                                    width: "initial",
                                                                    height: "initial",
                                                                    background:
                                                                        "none",
                                                                    opacity:
                                                                        "1",
                                                                    border: "0px",
                                                                    margin: "0px",
                                                                    padding:
                                                                        "0px",
                                                                    position:
                                                                        "relative",
                                                                    maxWidth:
                                                                        "100%"
                                                                }}
                                                            ></span>
                                                            <img
                                                                src="/logo.png"
                                                                decoding="async"
                                                                data-nimg="intrinsic"
                                                                style={{
                                                                    boxSizing:
                                                                        "border-box",
                                                                    display:
                                                                        "inline-block",
                                                                    overflow:
                                                                        "hidden",
                                                                    width: "initial",
                                                                    height: "initial",
                                                                    background:
                                                                        "none",
                                                                    opacity:
                                                                        "1",
                                                                    border: "0px",
                                                                    margin: "0px",
                                                                    padding:
                                                                        "0px",
                                                                    position:
                                                                        "relative",
                                                                    maxWidth:
                                                                        "100%"
                                                                }}
                                                            />
                                                        </span>
                                                    </div>
                                                    <div className="sc-c3769624-5 EGfCJ">
                                                        <div
                                                            color="var(--label-secondary)"
                                                            className="sc-c8b5982a-0 jmBFw"
                                                        >
                                                            Blockchain Token
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="sc-c3769624-7 hdeQhI">
                                                    <div
                                                        color="var(--label-secondary)"
                                                        className="sc-c8b5982a-0 ckJRzi"
                                                    >
                                                        0
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="sc-c3769624-0 keAWcq">
                                            <div className="sc-c3769624-2 jZOHnA">
                                                <div className="sc-c3769624-4 iOHIfF">
                                                    <div className="sc-c3769624-3 hAbwML">
                                                        <span
                                                            style={{
                                                                boxSizing:
                                                                    "border-box",
                                                                display:
                                                                    "inline-block",
                                                                overflow:
                                                                    "hidden",
                                                                width: "initial",
                                                                height: "initial",
                                                                background:
                                                                    "none",
                                                                opacity: "1",
                                                                border: "0px",
                                                                margin: "0px",
                                                                padding: "0px",
                                                                position:
                                                                    "relative",
                                                                maxWidth: "100%"
                                                            }}
                                                        >
                                                            <span
                                                                style={{
                                                                    boxSizing:
                                                                        "border-box",
                                                                    display:
                                                                        "inline-block",
                                                                    overflow:
                                                                        "hidden",
                                                                    width: "initial",
                                                                    height: "initial",
                                                                    background:
                                                                        "none",
                                                                    opacity:
                                                                        "1",
                                                                    border: "0px",
                                                                    margin: "0px",
                                                                    padding:
                                                                        "0px",
                                                                    position:
                                                                        "relative",
                                                                    maxWidth:
                                                                        "100%"
                                                                }}
                                                            ></span>
                                                            <img
                                                                src="/logo.png"
                                                                decoding="async"
                                                                data-nimg="intrinsic"
                                                                style={{
                                                                    boxSizing:
                                                                        "border-box",
                                                                    display:
                                                                        "inline-block",
                                                                    overflow:
                                                                        "hidden",
                                                                    width: "initial",
                                                                    height: "initial",
                                                                    background:
                                                                        "none",
                                                                    opacity:
                                                                        "1",
                                                                    border: "0px",
                                                                    margin: "0px",
                                                                    padding:
                                                                        "0px",
                                                                    position:
                                                                        "relative",
                                                                    maxWidth:
                                                                        "100%"
                                                                }}
                                                            />
                                                        </span>
                                                    </div>
                                                    <div className="sc-c3769624-5 EGfCJ">
                                                        <div
                                                            color="var(--label-secondary)"
                                                            className="sc-c8b5982a-0 jmBFw"
                                                        >
                                                            Governance Token
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="sc-c3769624-7 hdeQhI">
                                                    <div
                                                        color="var(--label-secondary)"
                                                        className="sc-c8b5982a-0 ckJRzi"
                                                    >
                                                        0
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="sc-294f4555-7 hYMFJF">
                                    <div className="sc-28471dcc-0 cdjQvo">
                                        <div className="sc-28471dcc-2 fTWaal">
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
                                                                >
                                                                    <path
                                                                        d="M 41,41 H 1 V 25.9706 C 1,22.788 2.2643,19.7357 4.5147,17.4853 L 17.4853,4.5147 C 19.7357,2.2643 22.788,1 25.9706,1 H 41 Z"
                                                                        fill="var(--border-tertiary)"
                                                                        fill-opacity="1"
                                                                        id="path12-8"
                                                                    ></path>
                                                                    <path
                                                                        d="M 41,41 H 2 V 26.4706 C 2,23.288 3.2643001,20.2357 5.5147,17.9853 L 17.985301,5.5147 C 20.2357,3.2643 23.288001,2 26.4706,2 H 41 Z"
                                                                        fill="var(--canvas-primary)"
                                                                        id="path14-9"
                                                                        style={{
                                                                            trokeWidth:
                                                                                "1px"
                                                                        }}
                                                                    ></path>
                                                                </svg>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </span>
                                                <div
                                                    id="locker-panel-content-undefined"
                                                    className="sc-28471dcc-1 sYUKh"
                                                >
                                                    <div
                                                        color="var(--label-primary)"
                                                        className="sc-c8b5982a-0 hWLIYy"
                                                    >
                                                        Acquire Voting Power,
                                                        Earn Discounts and
                                                        Rewards
                                                    </div>
                                                    <p className="sc-294f4555-8 ReOvj">
                                                        <div
                                                            color="var(--label-secondary)"
                                                            className="sc-c8b5982a-0 jmBFw"
                                                        >
                                                            Locking $BOOZE
                                                            provides you with
                                                            Voting Power, which
                                                            will be used to
                                                            decide the future of
                                                            Bar Therapy,
                                                            discount on the our
                                                            marketplace and earn
                                                            $BOOZE rewards. Your
                                                            engagement and
                                                            dedication will
                                                            provide the bar
                                                            guest and bartenders
                                                            of Bar Therapy
                                                            Metaverse a lifetime
                                                            of prosperity.
                                                        </div>
                                                    </p>
                                                    <div className="sc-294f4555-9 fxwUYt">
                                                        <button className="sc-2e5f3f19-0 dUuleX">
                                                            <div
                                                                color="inherit"
                                                                className="sc-c8b5982a-0 emCUmW"
                                                                onClick={() =>
                                                                    navigate(
                                                                        "/lockers"
                                                                    )
                                                                }
                                                            >
                                                                View Lockers
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
                </div>
            </div>

            {/* <Row>
        <Col span={8}></Col>
        <Col span={8}>
          <Typography.Title level={1} style={{ marginTop: "50px", textAlign: "center" }}>
            My Profile
          </Typography.Title>
        </Col>
        <Col span={8}></Col>
      </Row> */}
            {/* <Row>
        <Col span={8}></Col>
        <Col span={8} style={{ textAlign: "center" }}>
          <Typography.Title level={2} style={{ marginTop: "50px", textAlign: "center" }}>
            My wallet address
          </Typography.Title> */}
            {/* <Typography.Title level={5} style={{textAlign: "center" }}> */}
            {/* {localStorage.getItem("address")} */}
            {/* </Typography.Title> */}
            {/* </Col>
        <Col span={8}></Col>
      </Row> */}
            {/* <Row>
        <Col span={8}></Col>
        <Col span={8} style={{ textAlign: "center" }}>
          <Typography.Title level={2} style={{ marginTop: "50px", textAlign: "center" }}>
            My wallet balance
          </Typography.Title>
          <Typography.Title level={5} style={{ textAlign: "center" }}>
            {localStorage.getItem("balance") / 1000000 + " ALGO (" + localStorage.getItem("balance") + " microAlgos)"}
          </Typography.Title>
        </Col>
        <Col span={8}></Col>
      </Row> */}
        </>

        // <div className='profile'>
        //   <div className={`mask ${isMask ? "isMask" : ""}`}></div>
        //   <div className={`model_show ${modelShow ? "model_is_show" : ""}`}>
        //     <i><ZuoShangIcon /></i>
        //     <b><YouXiaIcon /></b>
        //     <h1>{model.Terms_main === "false" ? "Terms Of Service" : "Privacy Policy"}</h1>
        //     {model.Terms_main === "false" ? <div className='Terms_main'><TermsMain /></div> :
        //       <div className='PrivacyMain'><PrivacyMain /></div>}
        //     <div className='article'>
        //       <div className='aside' onClick={() => (setIsMask(false), setModelShow(false))}>Disagree</div>
        //       {
        //         model.Terms_main === "false" ? <div className='aside' onClick={() => dispatch({ type: SET_MODEL, payload: { Terms_main: "true", Privacy_main: "false" } })}>Agree</div> : <div className='aside' onClick={() => (dispatch({ type: SET_MODEL, payload: { Terms_main: "true", Privacy_main: "true" } }), setIsMask(false), setModelShow(false))}>Agree</div>
        //       }
        //     </div>
        //   </div>
        //   <div className='started'>
        //     <aside>Connect a wallet to get started</aside>
        //     <article>Your wallet is used to lock tokens and vote on proposals</article>
        //   </div>
        //   <main>
        //     <div>
        //       <aside className='Phantom' onClick={modelShows}><i><HeadIcon /></i>
        //         <section>
        //           <figure>Phantom</figure>
        //           <figcaption><i><StarOutlined /></i> Recommended</figcaption>
        //         </section></aside>
        //     </div>
        //     <div>
        //       <aside className='Coinbase' onClick={modelShows}><i><CoinbaseIcon /></i>Coinbase</aside>
        //     </div>
        //     <div>
        //       <aside className='Exodus' onClick={modelShows}><i><ExodusIcon /></i>Exodus</aside>
        //     </div>
        //     <div>
        //       <aside className='Solflare' onClick={modelShows}><i><SolflareIcon /></i>Solflare</aside>
        //     </div>
        //     <div>
        //       <aside className='Torus' onClick={modelShows}><i><TorusIcon /></i>Torus</aside>
        //     </div>
        //     <div>
        //       <aside className='Ledger' onClick={modelShows}><i><LedgerIcon /></i>Ledger</aside>
        //     </div>
        //   </main>
        //   <div className='footer'>
        //     <aside>
        //       <i><QuestionCircleOutlined /></i>
        //       <a href="https://support.staratlas.com/knowledge/what-is-a-crypto-wallet" target="_blank" rel="noreferrer">Learn more about Solana wallets</a>
        //     </aside>
        //     <article>
        //       <span>By connecting your wallet, you agree to the</span>
        //       <span>
        //         <NavLink to="/terms_of_service"> Terms of Service</NavLink> and
        //         <NavLink to="/privacy_policy"> Privacy Policy</NavLink>
        //       </span>
        //     </article>
        //   </div>
        // </div>
    );
}
