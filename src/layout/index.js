import React, { useState, Suspense, useEffect } from 'react';
import { Layout, Menu, Dropdown, Space } from 'antd';
import routes from '../router';
import { useNavigate, useLocation, Route, Routes } from 'react-router-dom';
import "./layout.scss"
import { LogoIcon, BottomIcon, ZuoShangIcon, YouShangIcon } from './icons';
import algosdk from "algosdk";
import { DownOutlined } from '@ant-design/icons';
import { ProfileIcon, } from "../layout/icons"
import { algodAddress, algodToken } from "../utils/constant";

const { Content } = Layout;
function getItem(label, key, icon) {
    return {
        key,
        icon,
        label,
    };
}

const Layouts = () => {

    const [algosignerOK, setAlgosignerOK] = useState(false);
    const [account, setAccount] = useState(null);
    const [address, setAddress] = useState("");

    function connectAlgosigner() {
        const algorand = window.algorand;
        if (typeof algorand !== 'undefined') {
            console.log('AlgoSigner is installed.');
            algorand.enable()
                .then((d) => {
                    console.log(d);
                    setAddress(d.accounts[0]);
                    console.log("address", address, d.accounts[0])
                    localStorage.setItem("address", d.accounts[0]);
                    const algodServer = algodAddress;
                    const indexerServer = algodAddress;
                    const token = algodToken;
                    const port = '';

                    const algoClient = new algosdk.Algodv2({
                        'Content-Type': 'application/json',
                        'X-API-Key': token
                    }, algodServer, port);


                    console.log("algoClient", algoClient)
                    algoClient
                        .accountInformation(d.accounts[0])
                        .do()
                        .then((response) => {
                            setAccount(response);
                            console.log("account", account, response)
                            localStorage.setItem("balance", response.amount.toString());
                            window.location.reload();
                        })
                        .catch((e) => {
                            console.error(e);
                        });
                })
                .catch((e) => {
                    console.error(e);
                });
        } else {
            console.log('AlgoSigner is NOT installed.');
        };
    }

    // function connectAlgosigner() {
    //     const AlgoSigner = window.AlgoSigner;
    //     AlgoSigner.connect().then((d) => {
    //         AlgoSigner.accounts({
    //             ledger: 'TestNet'
    //         })
    //             .then((accounts) => {
    //                 setAddress(accounts[0].address);
    //                 console.log("address", address)
    //                 const algodServer = 'https://testnet-algorand.api.purestake.io/ps2';
    //                 const indexerServer = 'https://testnet-algorand.api.purestake.io/idx2';
    //                 const token = 'E2QQNNiByE4AGYjWxZcfY1AQrOKSigCu1Mctc8F5';
    //                 const port = '';

    //                 const algoClient = new algosdk.Algodv2({
    //                     'Content-Type': 'application/json',
    //                     'X-API-Key': token
    //                 }, algodServer, port);


    //                 console.log("algoClient", algoClient)
    //                 algoClient
    //                     .accountInformation(address)
    //                     .do()
    //                     .then((response) => {
    //                         setAccount(response);
    //                     })
    //                     .catch((e) => {
    //                         console.error(e);
    //                     });
    //             })
    //             .catch((err) => {
    //                 console.error(err);
    //             });
    //     });
    //     console.log("333333333333", algosignerOK)
    // }

    const disconnectWallet = () => {
        setAlgosignerOK(false);
        setAccount(null);
        setAddress("");
        localStorage.setItem("address", "");
        localStorage.setItem("balance", "");
        console.log("window.algorand", window.algorand)
    };

    const items = [
        // {
        //   label: <><a href="/">View My Profile</a><ProfileIcon /></>,
        //   key: '0',
        // },
        // {
        //   type: 'divider',
        // },
        {
            label: <><a onClick={disconnectWallet} style={{ marginRight: "10px", fontSize: "12px" }}>Disconnect Wallet</a><ProfileIcon /></>,
            key: '0',
        },
    ];


    const navigate = useNavigate()
    const location = useLocation()

    const items2 = routes.filter((item) => !item.hidden).map((item) => {
        return getItem(item.til, item.path, item.icon)
    })

    const onClick = (e) => {
        console.log('click ', e);
        navigate(e.key)
    };
    useEffect(() => {
        if (location.pathname === "/") {
            navigate("/profile")
        }
        async function checkAlgosigner() {
            console.log("window1111111111", window, window.AlgoSigner)
            if (typeof window.AlgoSigner !== 'undefined') {
                setAlgosignerOK(true);
            }
        }

        checkAlgosigner();
    }, [location.pathname, navigate])

    console.log(location.pathname)

    return (
        <Layout className="layout">
            <header>
                <Menu
                    onClick={onClick}
                    theme="dark"
                    mode="horizontal"
                    defaultSelectedKeys={[location.pathname === "/" ? "/profile" : location.pathname]}
                    items={items2} />
                <div className='logo'>
                    <i><LogoIcon /></i>
                    <i><BottomIcon /></i>
                </div>
                <div className='left'>
                    <ZuoShangIcon />
                    <ZuoShangIcon />
                    <ZuoShangIcon />
                </div>
                <div className='right'>
                    <YouShangIcon />
                    <YouShangIcon />
                    <YouShangIcon />
                </div>

                {/* {algosignerOK ? ( */}
                <>
                    {localStorage.getItem("address") ? (
                        <Dropdown
                            menu={{
                                items
                            }}
                            trigger={['click']}
                        >
                            <a onClick={(e) => e.preventDefault()} style={{ display: "flex", marginRight: "60px", marginTop: "15px" }}>
                                <Space>
                                    {localStorage.getItem("address").toString().slice(0, 4) + "..." + localStorage.getItem("address").toString().slice(localStorage.getItem("address").toString().length - 5, localStorage.getItem("address").toString().length - 1)}
                                    <DownOutlined />
                                </Space>
                            </a>
                        </Dropdown>
                        // <div>
                        //     <h2>Account Info</h2>
                        //     <ul>
                        //     <li>Address: {account.address}</li>
                        //     <li>Amount: {account.amount / 1000000} ALGO</li>
                        //     </ul>
                        // </div>
                    ) : (
                        <a onClick={connectAlgosigner}>
                            <div style={{ display: "flex", marginRight: "60px", marginTop: "15px" }}>
                                <span style={{ width: "80px", marginTop: "5px", fontFamily: "industryBook", fontSize: "10px", color: "#8b8b8d", fontWeight: "500", lineHeight: "13px", letterSpacing: "0.01em" }}>Connect Wallet</span>
                                <div width="24px" height="24px">
                                    <div>
                                        <div>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="25" viewBox="0 0 24 25" fill="none" class="injected-svg" data-src="/icons/Connect Wallet.svg">
                                                <path class="svgMainFillColor" fill-rule="evenodd" clip-rule="evenodd" d="M19.5 7.5H2V14H6V15.5H2V19C2 20.3807 3.11929 21.5 4.5 21.5H19.5C20.8807 21.5 22 20.3807 22 19V15.5H18V14L22 14V10C22 8.61929 20.8807 7.5 19.5 7.5ZM12 19.5C14.7614 19.5 17 17.2614 17 14.5C17 11.7386 14.7614 9.5 12 9.5C9.23858 9.5 7 11.7386 7 14.5C7 17.2614 9.23858 19.5 12 19.5Z" fill="#8B8B8D"></path>
                                                <path class="svgMainStrokeColor" fill-rule="evenodd" clip-rule="evenodd" d="M10 14.3L11 15.5L14 13.5" stroke="#E95045" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                                                <path class="svgMainFillColor" fill-rule="evenodd" clip-rule="evenodd" d="M17 5.5C17.5523 5.5 18 5.05228 18 4.5C18 3.94772 17.5523 3.5 17 3.5V5.5ZM2 8.5C2 9.05228 2.44772 9.5 3 9.5C3.55228 9.5 4 9.05228 4 8.5H2ZM5 5.5H17V3.5H5V5.5ZM4 8.5V6.5H2V8.5H4ZM5 3.5C3.34315 3.5 2 4.84315 2 6.5H4C4 5.94772 4.44772 5.5 5 5.5V3.5Z" fill="#8B8B8D"></path>
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </a>
                    )}
                </>
                {/* ) : (

                    <>222222222222222222222</>
                    // <p>Please install and enable AlgoSigner to continue.</p>
                )} */}
            </header>
            <Content>
                <div className="site-layout-content">
                    <Suspense fallback={<div className="lazy"><img src="" alt='' /></div>}>
                        <Routes>
                            {
                                routes.map(item => (
                                    <Route key={item.name} path={item.path} element={<item.element navigate={navigate} />}></Route>
                                ))
                            }
                        </Routes>
                    </Suspense>
                </div>
            </Content>
        </Layout>
    );
};
export default Layouts;