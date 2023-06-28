import algosdk
from algosdk.wallet import Wallet
from algosdk import account, encoding, algod, mnemonic
from algosdk.v2client import algod
from algosdk.future import transaction
from algosdk.v2client.models.dryrun_source import DryrunSource
from base64 import b64decode

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

approval_program_bytecode = read_teal_bytecode("staking_contract.teal.tok")
clear_program_bytecode = read_teal_bytecode("staking_contract.teal_clear.tok")

# Create the smart contract
params = algod_client.suggested_params()
txn = transaction.ApplicationCreateTxn(
    my_address,
    params,
    transaction.OnComplete.NoOpOC.real,
    approval_program_bytecode,
    clear_program_bytecode,
    global_schema=transaction.StateSchema(num_uints=2, num_byte_slices=0),
    local_schema=transaction.StateSchema(num_uints=4, num_byte_slices=0)
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
# PTTUJ6RGEFSVWTB267VLS246UOLQXUMIZNLPSVVC6IEJAMBSATYA
# W5WCLTMUPMKC6KJRWQQ6EM2HI6VQK5N4VJXWRVBASNLSNJ5QAU7Q