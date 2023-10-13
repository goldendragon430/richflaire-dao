import algosdk from "algosdk";

export const algodAddress = "https://testnet-algorand.api.purestake.io/ps2";
export const algodToken = "E2QQNNiByE4AGYjWxZcfY1AQrOKSigCu1Mctc8F5";
export const voting_app_id = 426860692;
// export const staking_app_id = 166315955;
export const staking_app_id = 421584801;
export const locker_app_id = 421602644;

const indexerServer = "https://testnet-algorand.api.purestake.io/idx2";
const token = { "X-API-Key": "E2QQNNiByE4AGYjWxZcfY1AQrOKSigCu1Mctc8F5" };
const port = "";
// TRANSFER ACCOUNT FOR STAKE CONTRACT AND LOCKER TAB
export const STAKE_ADDR =
    "4CVOK2Q3USLFO3XRCOTVTDWYA2T4LWXEDOWGD2YMSCYRZWUQSNJ63NQYNY";

export const LOCKER_ADDR =
    "4DACHTOEKKWOUJ7JG25YSIYDQBLFYHPQGVCRSAELJUN7D5OKB3PWR36RPE";

export const indexerClient = new algosdk.Indexer(token, indexerServer, port);
export const LOGO =
    "https://cdn.discordapp.com/attachments/1135608764574204004/1160971591086243851/Bar_Logo-removebg-preview.png?ex=65369a0d&is=6524250d&hm=19849eda6890a33471cef6d3e0f23f56235713608b670593fe0b8291bb39e5b5&";
