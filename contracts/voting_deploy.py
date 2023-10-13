from algosdk import account, mnemonic, transaction
from algosdk.v2client import algod
from algosdk.wallet import Wallet

# Set your API endpoint and your API key, as well as your private key/mnemonic    
algod_address = "https://testnet-algorand.api.purestake.io/ps2"
algod_token = "E2QQNNiByE4AGYjWxZcfY1AQrOKSigCu1Mctc8F5"
headers = {
    "X-API-Key": algod_token,
}   
# Create an algod client instance
algod_client = algod.AlgodClient(algod_token, algod_address, headers)
print("Versions:", algod_client.versions())
# Add your private key/mnemonic here
private_key = mnemonic.to_private_key("route pair tourist fun warrior ready collect cloud nasty guess universe transfer agree vendor discover whisper fancy champion lunch black shoot canoe glow able feed")

# Get account address, verify balance
my_address = account.address_from_private_key(private_key)
# my_address = "G2XVAXJPP62LSDLC2PGFDFBKTT2A3JRXAAMPR4NDSEW3GKW6M6HS4HC7CA"
print("My address:", my_address)

account_info = algod_client.account_info(my_address)
print("My Algo balance: {} microAlgos".format(account_info.get('amount')))

# Replace with the output addresses from the TEAL compilation

def read_teal_bytecode(file_path):
    with open(file_path, "rb") as f:
        return f.read()

approval_program_bytecode = read_teal_bytecode("voting.teal")
clear_program_bytecode = read_teal_bytecode("clear.teal")

# Create the smart contract
params = algod_client.suggested_params()
txn = transaction.ApplicationCreateTxn(
    my_address,
    params,
    transaction.OnComplete.NoOpOC.real,
    approval_program_bytecode,
    clear_program_bytecode,
    global_schema=transaction.StateSchema(num_uints=5, num_byte_slices=0),
    local_schema=None
)

# Sign and send the transaction
signed_txn = txn.sign(private_key)
tx_id = signed_txn.transaction.get_txid()
algod_client.send_transactions([signed_txn])

# Wait for the transaction to be confirmed
# algod_client.wait_for_confirmation(tx_id)

# Get the created application ID
transaction_response = algod_client.pending_transaction_info(tx_id)
print(tx_id)
# app_id = transaction_response["application-index"]
# print(f"Application ID: {app_id}")
# XTAFIYTTJZOAR5GRWKBS7SHGXI4NM7FCSERQLLHCSAMAH534VNIQ
# MDVJ5RDG3G5ISPX7ZGKNTCAMUX7Z2M46UJ7O7735RE2DYSWVSYGA
# KJUNNGSVJQIVPHWZ44XEDWNW23HF4GIRTMFM34AGWVDHVGFFWGXQ
# BNQTJ234RLCDGNKSELEQXHW52HAQXRANHTFQLQIB5PO24P4E7VFQ